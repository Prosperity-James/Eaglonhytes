<?php
// CORS headers MUST be first - before any other includes
require_once 'cors_headers.php';
require_once 'config.php';
session_start();

// Database connection
$host = 'localhost';
$dbname = 'zinq_bridge_apartments';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Check if user is logged in and is admin
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

// Verify admin status
$stmt = $pdo->prepare("SELECT is_admin FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !$user['is_admin']) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Get all settings
        try {
            $stmt = $pdo->query("SELECT setting_key, setting_value, setting_type FROM admin_settings");
            $settings = [];
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $value = $row['setting_value'];
                
                // Convert boolean strings to actual booleans
                if ($row['setting_type'] === 'boolean') {
                    $value = $value === 'true';
                } elseif ($row['setting_type'] === 'json') {
                    $value = json_decode($value, true);
                }
                
                $settings[$row['setting_key']] = $value;
            }
            
            echo json_encode(['success' => true, 'settings' => $settings]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to fetch settings']);
        }
        break;

    case 'PUT':
        // Update settings
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
            exit;
        }

        try {
            $pdo->beginTransaction();
            
            foreach ($input as $key => $value) {
                // Determine setting type
                $type = 'string';
                if (is_bool($value)) {
                    $type = 'boolean';
                    $value = $value ? 'true' : 'false';
                } elseif (is_array($value) || is_object($value)) {
                    $type = 'json';
                    $value = json_encode($value);
                }
                
                // Update or insert setting
                $stmt = $pdo->prepare("
                    INSERT INTO admin_settings (setting_key, setting_value, setting_type) 
                    VALUES (?, ?, ?) 
                    ON DUPLICATE KEY UPDATE 
                    setting_value = VALUES(setting_value), 
                    setting_type = VALUES(setting_type),
                    updated_at = CURRENT_TIMESTAMP
                ");
                $stmt->execute([$key, $value, $type]);
            }
            
            $pdo->commit();
            echo json_encode(['success' => true, 'message' => 'Settings updated successfully']);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update settings']);
        }
        break;

    case 'POST':
        // Handle password change
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['current_password']) || !isset($input['new_password'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Current and new passwords are required']);
            exit;
        }

        try {
            // Get current user's password
            $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
            $stmt->execute([$_SESSION['user_id']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$user) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'User not found']);
                exit;
            }
            
            // Verify current password
            if (!password_verify($input['current_password'], $user['password'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
                exit;
            }
            
            // Validate new password
            if (strlen($input['new_password']) < 6) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'New password must be at least 6 characters']);
                exit;
            }
            
            // Update password
            $hashedPassword = password_hash($input['new_password'], PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
            $stmt->execute([$hashedPassword, $_SESSION['user_id']]);
            
            echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update password']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}
?>
