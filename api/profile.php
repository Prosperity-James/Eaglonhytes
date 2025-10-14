<?php
// Prevent any HTML output before JSON
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors to browser
ini_set('log_errors', 1); // Log errors instead

// Start output buffering to prevent any unwanted output
ob_start();

try {
    // CORS headers MUST come first
    require_once __DIR__ . "/cors_headers.php";
    
    // Enhanced session configuration for cross-origin
    require_once __DIR__ . "/session_config.php";
    session_start();

    // Include config
    require_once __DIR__ . "/config.php";
    
    // Clean any output that might have been generated
    ob_clean();
    
    // Ensure JSON content type
    header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$user_id = $_SESSION['user']['id'];
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Get user profile
        try {
            $stmt = $db->prepare("SELECT id, full_name, email, phone, is_admin, profile_picture FROM users WHERE id = ?");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            $stmt->close();
            
            if ($user) {
                echo json_encode(['success' => true, 'profile' => $user]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'User not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to fetch profile']);
        }
        break;

    case 'PUT':
        // Update user profile
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
            exit;
        }

        try {
            $full_name = trim($input['full_name'] ?? '');
            $email = trim($input['email'] ?? '');
            $phone = trim($input['phone'] ?? '');
            
            // Validate required fields
            if (empty($full_name)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Full name is required']);
                exit;
            }
            
            if (empty($email)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Email is required']);
                exit;
            }
            
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid email format']);
                exit;
            }
            
            // Check if email already exists for another user
            $stmt = $db->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
            $stmt->bind_param("si", $email, $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->fetch_assoc()) {
                $stmt->close();
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Email already taken by another user']);
                exit;
            }
            
            // Handle profile picture if provided
            $profile_picture = $input['profile_picture'] ?? null;
            
            // Update profile
            if ($profile_picture) {
                $stmt = $db->prepare("UPDATE users SET full_name = ?, email = ?, phone = ?, profile_picture = ? WHERE id = ?");
                $stmt->bind_param("ssssi", $full_name, $email, $phone, $profile_picture, $user_id);
            } else {
                $stmt = $db->prepare("UPDATE users SET full_name = ?, email = ?, phone = ? WHERE id = ?");
                $stmt->bind_param("sssi", $full_name, $email, $phone, $user_id);
            }
            $stmt->execute();
            $stmt->close();
            
            echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update profile']);
        }
        break;

    case 'POST':
        // Handle both profile update and password change
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Check if this is a password change request
        if (isset($input['action']) && $input['action'] === 'change_password') {
            // Password change logic
            if (!isset($input['current_password']) || !isset($input['new_password'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Current and new passwords are required']);
                exit;
            }

        try {
            // Get current user's password
            $stmt = $db->prepare("SELECT password FROM users WHERE id = ?");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            $stmt->close();
            
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
            $stmt = $db->prepare("UPDATE users SET password = ? WHERE id = ?");
            $stmt->bind_param("si", $hashedPassword, $user_id);
            $stmt->execute();
            $stmt->close();
            
            echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update password']);
        }
        } else {
            // Regular profile update (same as PUT)
            try {
                $full_name = trim($input['full_name'] ?? '');
                $email = trim($input['email'] ?? '');
                $phone = trim($input['phone'] ?? '');
                
                // Validate required fields
                if (empty($full_name)) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'Full name is required']);
                    exit;
                }
                
                if (empty($email)) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'Email is required']);
                    exit;
                }
                
                if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
                    exit;
                }
                
                // Check if email already exists for another user
                $stmt = $db->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
                $stmt->bind_param("si", $email, $user_id);
                $stmt->execute();
                $result = $stmt->get_result();
                if ($result->fetch_assoc()) {
                    $stmt->close();
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'Email already taken by another user']);
                    exit;
                }
                $stmt->close();
                
                // Update profile
                $stmt = $db->prepare("UPDATE users SET full_name = ?, email = ?, phone = ? WHERE id = ?");
                $stmt->bind_param("sssi", $full_name, $email, $phone, $user_id);
                $stmt->execute();
                $stmt->close();
                
                // Update session
                $_SESSION['user']['full_name'] = $full_name;
                $_SESSION['user']['email'] = $email;
                
                echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to update profile']);
            }
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

} catch (Exception $e) {
    // Clean any output and return JSON error
    ob_clean();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage(),
        'error_code' => 'EXCEPTION'
    ]);
} catch (Error $e) {
    // Handle fatal errors
    ob_clean();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Fatal error: ' . $e->getMessage(),
        'error_code' => 'FATAL_ERROR'
    ]);
}

// End output buffering
ob_end_flush();
?>