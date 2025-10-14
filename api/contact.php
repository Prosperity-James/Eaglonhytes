<?php
// CORS headers MUST come first
require_once __DIR__ . "/cors_headers.php";
require_once __DIR__ . "/config.php";
require_once __DIR__ . "/session_config.php";

// Ensure JSON content type and prevent HTML injection
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Disable any HTML output buffering or injection
if (function_exists('apache_setenv')) {
    apache_setenv('no-gzip', '1');
}
ini_set('zlib.output_compression', 'Off');

// Check database connection
if (!$db || defined('DB_CONNECTION_ERROR')) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Handle different HTTP methods
switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        handleContactMessage();
        break;
    case 'GET':
        getContactMessages();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

function handleContactMessage() {
    global $db;
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Check if this is a reply action
        if (isset($input['action']) && $input['action'] === 'reply') {
            handleReply($input);
            return;
        }
        
        // Validate required fields for new message
        $required_fields = ['name', 'email', 'subject', 'message'];
        foreach ($required_fields as $field) {
            if (empty($input[$field])) {
                throw new Exception("Missing required field: $field");
            }
        }
        
        $name = trim($input['name']);
        $email = trim($input['email']);
        $phone = trim($input['phone'] ?? '');
        $subject = trim($input['subject']);
        $message = trim($input['message']);
        
        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email format');
        }
        
        // Create contact_messages table if it doesn't exist
        $createTableSQL = "
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                subject VARCHAR(500) NOT NULL,
                message TEXT NOT NULL,
                status ENUM('new', 'read', 'replied') DEFAULT 'new',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        ";
        $result = $db->query($createTableSQL);
        if (!$result) {
            throw new Exception('Failed to create contact_messages table: ' . $db->error);
        }
        
        // Insert the contact message
        $stmt = $db->prepare("
            INSERT INTO contact_messages (name, email, phone, subject, message, status, created_at) 
            VALUES (?, ?, ?, ?, ?, 'new', NOW())
        ");
        $stmt->bind_param('sssss', $name, $email, $phone, $subject, $message);
        $success = $stmt->execute();
        
        if ($success) {
            $message_id = $db->insert_id;
            
            // Create notification for all admins
            $adminStmt = $db->prepare("SELECT id FROM users WHERE is_admin = 1");
            $adminStmt->execute();
            $adminResult = $adminStmt->get_result();
            
            while ($admin = $adminResult->fetch_assoc()) {
                // Check if redirect_to column exists, if not add it
                $checkColumn = $db->query("SHOW COLUMNS FROM notifications LIKE 'redirect_to'");
                if ($checkColumn->num_rows === 0) {
                    $db->query("ALTER TABLE notifications ADD COLUMN redirect_to VARCHAR(255) NULL AFTER type");
                }
                
                $notifStmt = $db->prepare("
                    INSERT INTO notifications (user_id, title, message, type, redirect_to, created_at) 
                    VALUES (?, ?, ?, 'info', 'messages', NOW())
                ");
                $notifTitle = "New Contact Message";
                $notifMessage = "New message from $name: $subject";
                $notifStmt->bind_param('iss', $admin['id'], $notifTitle, $notifMessage);
                $notifStmt->execute();
            }
            
            echo json_encode([
                'success' => true, 
                'message' => 'Your message has been sent successfully! We will get back to you soon.',
                'message_id' => $message_id,
                'whatsapp_contact' => '+2347038779189',
                'whatsapp_message' => "Hi! I just sent a contact message through your website. Subject: $subject"
            ]);
        } else {
            throw new Exception('Failed to send message');
        }
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false, 
            'message' => 'Error sending message: ' . $e->getMessage()
        ]);
    }
}

function handleReply($input) {
    global $db;
    
    try {
        session_start();
        
        // Check if admin is logged in
        if (!isset($_SESSION['user']) || !$_SESSION['user']['is_admin']) {
            echo json_encode(['success' => false, 'message' => 'Admin access required']);
            return;
        }
        
        // Validate required fields
        if (empty($input['message_id']) || empty($input['reply'])) {
            echo json_encode(['success' => false, 'message' => 'Message ID and reply are required']);
            return;
        }
        
        $message_id = intval($input['message_id']);
        $reply = trim($input['reply']);
        
        // First, check if admin_reply column exists, if not add it
        $checkColumn = $db->query("SHOW COLUMNS FROM contact_messages LIKE 'admin_reply'");
        if ($checkColumn->num_rows === 0) {
            $db->query("ALTER TABLE contact_messages ADD COLUMN admin_reply TEXT NULL AFTER message");
            $db->query("ALTER TABLE contact_messages ADD COLUMN replied_at TIMESTAMP NULL AFTER admin_reply");
        }
        
        // Update the message with admin reply
        $stmt = $db->prepare("
            UPDATE contact_messages 
            SET admin_reply = ?, 
                status = 'replied',
                replied_at = NOW()
            WHERE id = ?
        ");
        $stmt->bind_param('si', $reply, $message_id);
        $success = $stmt->execute();
        
        if ($success) {
            // Get message details to send notification to user
            $msgStmt = $db->prepare("SELECT email, name, subject FROM contact_messages WHERE id = ?");
            $msgStmt->bind_param('i', $message_id);
            $msgStmt->execute();
            $msgResult = $msgStmt->get_result();
            $msgData = $msgResult->fetch_assoc();
            
            if ($msgData) {
                // Find user by email and send notification
                $userStmt = $db->prepare("SELECT id FROM users WHERE email = ?");
                $userStmt->bind_param('s', $msgData['email']);
                $userStmt->execute();
                $userResult = $userStmt->get_result();
                $userData = $userResult->fetch_assoc();
                
                if ($userData) {
                    // Create notification for the user
                    $notifStmt = $db->prepare("
                        INSERT INTO notifications (user_id, title, message, type, redirect_to, created_at) 
                        VALUES (?, ?, ?, 'info', '/messages', NOW())
                    ");
                    $notifTitle = "Admin Replied to Your Message";
                    $notifMessage = "You have a new reply to your message: {$msgData['subject']}";
                    $notifStmt->bind_param('iss', $userData['id'], $notifTitle, $notifMessage);
                    $notifStmt->execute();
                }
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Reply sent successfully'
            ]);
        } else {
            throw new Exception('Failed to save reply');
        }
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error sending reply: ' . $e->getMessage()
        ]);
    }
}

function getContactMessages() {
    global $db;
    
    try {
        session_start();
        
        // Check if this is a user-specific request
        if (isset($_GET['user_messages']) && $_GET['user_messages'] === 'true') {
            // User wants to see their own messages
            if (!isset($_SESSION['user'])) {
                echo json_encode(['success' => false, 'message' => 'Authentication required']);
                return;
            }
            
            $userEmail = $_SESSION['user']['email'];
            
            $stmt = $db->prepare("
                SELECT * FROM contact_messages 
                WHERE email = ?
                ORDER BY created_at DESC
            ");
            $stmt->bind_param('s', $userEmail);
            $stmt->execute();
            $result = $stmt->get_result();
            $messages = $result->fetch_all(MYSQLI_ASSOC);
            
            echo json_encode([
                'success' => true,
                'messages' => $messages
            ]);
        } else {
            // Admin wants to see all messages
            // For now, allow access to test the functionality
            // TODO: Re-enable admin check after testing
            
            $stmt = $db->prepare("
                SELECT * FROM contact_messages 
                ORDER BY created_at DESC
            ");
            $stmt->execute();
            $result = $stmt->get_result();
            $messages = $result->fetch_all(MYSQLI_ASSOC);
            
            echo json_encode([
                'success' => true,
                'data' => $messages
            ]);
        }
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false, 
            'message' => 'Error fetching messages: ' . $e->getMessage()
        ]);
    }
}
?>
