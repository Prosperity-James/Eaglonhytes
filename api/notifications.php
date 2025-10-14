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

session_start();

// Handle different HTTP methods
switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        handleNotificationAction();
        break;
    case 'GET':
        getUserNotifications();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

function handleNotificationAction() {
    global $db;
    
    try {
        // Check if user is logged in
        if (!isset($_SESSION['user'])) {
            echo json_encode(['success' => false, 'message' => 'Authentication required']);
            return;
        }
        
        $user_id = $_SESSION['user']['id'];
        $input = json_decode(file_get_contents('php://input'), true);
        $action = $input['action'] ?? '';
        
        switch ($action) {
            case 'mark_read':
                $notification_id = intval($input['notification_id']);
                $stmt = $db->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?");
                $stmt->bind_param('ii', $notification_id, $user_id);
                $stmt->execute();
                echo json_encode(['success' => true, 'message' => 'Notification marked as read']);
                break;
                
            case 'mark_all_read':
                $stmt = $db->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
                $stmt->bind_param('i', $user_id);
                $stmt->execute();
                echo json_encode(['success' => true, 'message' => 'All notifications marked as read']);
                break;
                
            case 'delete':
                $notification_id = intval($input['notification_id']);
                $stmt = $db->prepare("DELETE FROM notifications WHERE id = ? AND user_id = ?");
                $stmt->bind_param('ii', $notification_id, $user_id);
                $stmt->execute();
                echo json_encode(['success' => true, 'message' => 'Notification deleted']);
                break;
                
            default:
                echo json_encode(['success' => false, 'message' => 'Invalid action']);
        }
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ]);
    }
}

function getUserNotifications() {
    global $db;
    
    try {
        // Check if user is logged in
        if (!isset($_SESSION['user'])) {
            echo json_encode(['success' => false, 'message' => 'Authentication required']);
            return;
        }
        
        $user_id = $_SESSION['user']['id'];
        
        // Create notifications table if it doesn't exist
        $createTableSQL = "
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
                redirect_to VARCHAR(255) NULL,
                is_read TINYINT(1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ";
        $db->query($createTableSQL);
        
        // Add redirect_to column if it doesn't exist
        $checkColumn = $db->query("SHOW COLUMNS FROM notifications LIKE 'redirect_to'");
        if ($checkColumn->num_rows === 0) {
            $db->query("ALTER TABLE notifications ADD COLUMN redirect_to VARCHAR(255) NULL AFTER type");
        }
        
        // Delete notifications older than 12 hours
        $db->query("DELETE FROM notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL 12 HOUR)");
        
        // Get user's notifications (only from last 12 hours)
        $stmt = $db->prepare("
            SELECT * FROM notifications 
            WHERE user_id = ? 
            AND created_at >= DATE_SUB(NOW(), INTERVAL 12 HOUR)
            ORDER BY created_at DESC
        ");
        $stmt->bind_param('i', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $notifications = $result->fetch_all(MYSQLI_ASSOC);
        
        echo json_encode([
            'success' => true,
            'notifications' => $notifications,
            'unread_count' => count(array_filter($notifications, fn($n) => $n['is_read'] == 0))
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error fetching notifications: ' . $e->getMessage()
        ]);
    }
}

// Helper function to create a notification (can be called from other API files)
function createNotification($user_id, $title, $message, $type = 'info') {
    global $db;
    
    try {
        $stmt = $db->prepare("
            INSERT INTO notifications (user_id, title, message, type, created_at) 
            VALUES (?, ?, ?, ?, NOW())
        ");
        $stmt->bind_param('isss', $user_id, $title, $message, $type);
        return $stmt->execute();
    } catch (Exception $e) {
        error_log("Failed to create notification: " . $e->getMessage());
        return false;
    }
}
?>
