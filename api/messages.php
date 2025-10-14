<?php
// MESSAGES API DISABLED - ALL CONVERSATIONS VIA WHATSAPP
// This endpoint has been disabled as requested

require_once __DIR__ . "/config.php";
require_once __DIR__ . "/cors_headers.php";

// Return disabled message
http_response_code(410);
echo json_encode([
    'success' => false,
    'message' => 'Messages disabled. Contact us on WhatsApp.',
    'whatsapp_contact' => 'https://wa.me/YOUR_WHATSAPP_NUMBER'
]);
exit();
?>
                SELECT m.*, u.full_name as username, u.email,
                       (SELECT COUNT(*) FROM messages m2 WHERE m2.user_id = m.user_id AND m2.is_read = 0 AND m2.sender_type = 'admin') as unread_count
                FROM messages m 
                JOIN users u ON m.user_id = u.id
                WHERE m.user_id = ? 
                ORDER BY m.created_at ASC
            ");
            $stmt->bind_param("i", getUserId());
            $stmt->execute();
            $messages = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        }
        
        sendResponse(true, 'Messages retrieved successfully', $messages);
        
    } catch (Exception $e) {
        error_log("Database error in getMessages: " . $e->getMessage());
        sendResponse(false, 'Database error occurred');
    }
}

// Send a new message
function sendMessage() {
    global $db;
    
    if (!isLoggedIn()) {
        sendResponse(false, 'Authentication required');
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['message']) || trim($input['message']) === '') {
        sendResponse(false, 'Message content is required');
    }
    
    $message = trim($input['message']);
    $user_id = getUserId();
    $sender_type = isAdmin() ? 'admin' : 'user';
    
    // If admin is sending to a specific user, use recipient_user_id
    if (isAdmin() && isset($input['recipient_user_id'])) {
        $user_id = $input['recipient_user_id'];
        $sender_type = 'admin'; // Ensure admin messages are marked as admin
    }
    
    try {
        $stmt = $db->prepare("
            INSERT INTO messages (user_id, message, sender_type, is_read, created_at) 
            VALUES (?, ?, ?, 0, NOW())
        ");
        $stmt->bind_param("iss", $user_id, $message, $sender_type);
        $stmt->execute();
        
        $message_id = $db->insert_id;
        
        // Get the created message
        $stmt = $db->prepare("
            SELECT m.*, u.full_name as username, u.email 
            FROM messages m 
            JOIN users u ON m.user_id = u.id 
            WHERE m.id = ?
        ");
        $stmt->bind_param("i", $message_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $newMessage = $result->fetch_assoc();
        
        sendResponse(true, 'Message sent successfully', $newMessage);
        
    } catch (Exception $e) {
        error_log("Database error in sendMessage: " . $e->getMessage());
        sendResponse(false, 'Failed to send message');
    }
}

// Mark messages as read
function markAsRead() {
    global $db;
    
    if (!isLoggedIn()) {
        sendResponse(false, 'Authentication required');
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $user_id = getUserId();
    
    try {
        if (isAdmin() && isset($input['conversation_user_id'])) {
            // Admin marking a conversation as read
            $stmt = $db->prepare("
                UPDATE messages 
                SET is_read = 1 
                WHERE user_id = ? AND sender_type = 'user'
            ");
            $stmt->bind_param("i", $input['conversation_user_id']);
            $stmt->execute();
        } else {
            // User marking admin messages as read
            $stmt = $db->prepare("
                UPDATE messages 
                SET is_read = 1 
                WHERE user_id = ? AND sender_type = 'admin'
            ");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
        }
        
        sendResponse(true, 'Messages marked as read');
        
    } catch (Exception $e) {
        error_log("Database error in markAsRead: " . $e->getMessage());
        sendResponse(false, 'Failed to mark messages as read');
    }
}

// Get conversation between admin and specific user
function getConversation() {
    global $db;
    
    if (!isLoggedIn()) {
        sendResponse(false, 'Authentication required');
    }
    
    $conversation_user_id = $_GET['user_id'] ?? null;
    
    if (isAdmin() && !$conversation_user_id) {
        sendResponse(false, 'User ID required for admin');
    }
    
    $user_id = isAdmin() ? $conversation_user_id : getUserId();
    
    try {
        $stmt = $db->prepare("
            SELECT m.*, u.full_name as username, u.email 
            FROM messages m 
            JOIN users u ON m.user_id = u.id 
            WHERE m.user_id = ? 
            ORDER BY m.created_at ASC
        ");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $messages = $result->fetch_all(MYSQLI_ASSOC);
        
        sendResponse(true, 'Conversation retrieved successfully', $messages);
        
    } catch (Exception $e) {
        error_log("Database error in getConversation: " . $e->getMessage());
        sendResponse(false, 'Database error occurred');
    }
}

// Handle different HTTP methods
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if (isset($_GET['action']) && $_GET['action'] === 'conversation') {
            getConversation();
        } else {
            getMessages();
        }
        break;
        
    case 'POST':
        sendMessage();
        break;
        
    case 'PUT':
        markAsRead();
        break;
        
    default:
        sendResponse(false, 'Method not allowed');
}
?>
