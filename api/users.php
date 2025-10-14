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

// Add is_restricted column if it doesn't exist (BEFORE any auth checks)
$checkColumn = $db->query("SHOW COLUMNS FROM users LIKE 'is_restricted'");
if ($checkColumn->num_rows === 0) {
    $db->query("ALTER TABLE users ADD COLUMN is_restricted TINYINT(1) DEFAULT 0 AFTER is_admin");
}

require_once __DIR__ . "/auth_middleware.php";
session_start();

// Check if user is logged in
$currentUser = requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Check if requesting profile data or user list
        $action = $_GET['action'] ?? 'list';
        
        if ($action === 'profile') {
            // Get current user's profile
            $sql = "SELECT id, full_name, email, phone, is_admin, created_at, updated_at FROM users WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("i", $_SESSION['user']['id']);
            
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                $profile = $result->fetch_assoc();
                $stmt->close();
                
                if ($profile) {
                    echo json_encode(["success" => true, "data" => $profile]);
                } else {
                    http_response_code(404);
                    echo json_encode(["success" => false, "message" => "Profile not found"]);
                }
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Failed to fetch profile"]);
            }
        } else {
            // Only allow admin users to get user list
            requireAdmin();
            
            $userRole = $currentUser['role'];
            $currentUserId = $currentUser['id'];
            
            // Build query based on role
            if ($userRole === 'super_admin') {
                // Super admin sees all users except themselves
                $sql = "SELECT id, full_name, email, phone, is_admin, role, is_restricted, created_at FROM users WHERE id != ? ORDER BY created_at DESC";
            } else {
                // Regular admin only sees regular users (not themselves, not other admins, not super admin)
                $sql = "SELECT id, full_name, email, phone, is_admin, role, is_restricted, created_at FROM users WHERE role = 'user' AND id != ? ORDER BY created_at DESC";
            }
            
            $stmt = $db->prepare($sql);
        
        if ($stmt) {
            // Bind the current user ID to exclude them from results
            $stmt->bind_param("i", $currentUserId);
            $stmt->execute();
            $result = $stmt->get_result();
            $users = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            
            // Log the action
            logAdminAction($db, 'view_users', 'user', null, ['count' => count($users)]);
            
            echo json_encode(["success" => true, "data" => $users]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Failed to fetch users"]);
        }
        }
        break;

    case 'POST':
        // Only allow admin users to add new users
        if (!$_SESSION['user']['is_admin']) {
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "Access Denied. Admin privilege required."]);
            break;
        }
        
        // Add new user
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['full_name']) || !isset($input['email']) || !isset($input['password'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Missing required fields"]);
            break;
        }

        // Check if email already exists
        $checkSql = "SELECT id FROM users WHERE email = ?";
        $checkStmt = $db->prepare($checkSql);
        $checkStmt->bind_param("s", $input['email']);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Email already exists"]);
            $checkStmt->close();
            break;
        }
        $checkStmt->close();

        $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);
        $isAdmin = isset($input['is_admin']) ? (int)$input['is_admin'] : 0;
        
        $sql = "INSERT INTO users (full_name, email, phone, password, is_admin) VALUES (?, ?, ?, ?, ?)";
        $stmt = $db->prepare($sql);
        $stmt->bind_param("ssssi", $input['full_name'], $input['email'], $input['phone'], $hashedPassword, $isAdmin);
        
        if ($stmt->execute()) {
            $userId = $db->insert_id;
            
            // Create notification for the admin who created the user
            $notifStmt = $db->prepare("
                INSERT INTO notifications (user_id, title, message, type, redirect_to, created_at) 
                VALUES (?, ?, ?, 'success', 'users', NOW())
            ");
            $notifTitle = "User Created Successfully";
            $notifMessage = "New user {$input['full_name']} ({$input['email']}) has been added to the system.";
            $adminId = $_SESSION['user']['id'];
            $notifStmt->bind_param('iss', $adminId, $notifTitle, $notifMessage);
            $notifStmt->execute();
            
            echo json_encode(["success" => true, "message" => "User added successfully", "user_id" => $userId]);
        } else {
            http_response_code(500);
            
            // Create failure notification for the admin
            $notifStmt = $db->prepare("
                INSERT INTO notifications (user_id, title, message, type, redirect_to, created_at) 
                VALUES (?, ?, ?, 'error', 'users', NOW())
            ");
            $notifTitle = "Failed to Create User";
            $notifMessage = "Failed to add user {$input['full_name']} ({$input['email']}) to the system.";
            $adminId = $_SESSION['user']['id'];
            $notifStmt->bind_param('iss', $adminId, $notifTitle, $notifMessage);
            $notifStmt->execute();
            
            echo json_encode(["success" => false, "message" => "Failed to add user"]);
        }
        $stmt->close();
        break;

    case 'PUT':
        // Update user
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['id'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "User ID is required"]);
            break;
        }

        // Check if this is a password change request
        if (isset($input['action']) && $input['action'] === 'change_password') {
            // Verify current password
            $checkSql = "SELECT password FROM users WHERE id = ?";
            $checkStmt = $db->prepare($checkSql);
            $checkStmt->bind_param("i", $input['id']);
            $checkStmt->execute();
            $checkResult = $checkStmt->get_result();
            $user = $checkResult->fetch_assoc();
            $checkStmt->close();
            
            if (!$user || !password_verify($input['current_password'], $user['password'])) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Current password is incorrect"]);
                break;
            }
            
            // Update password
            $hashedPassword = password_hash($input['new_password'], PASSWORD_DEFAULT);
            $sql = "UPDATE users SET password = ? WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("si", $hashedPassword, $input['id']);
            
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Password changed successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Failed to change password"]);
            }
            $stmt->close();
            break;
        }

        // Regular profile update - allow users to update their own profile or admins to update any profile
        if ($_SESSION['user']['id'] != $input['id'] && !$_SESSION['user']['is_admin']) {
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "Access denied. You can only update your own profile."]);
            break;
        }

        // Check if email already exists for other users
        if (isset($input['email'])) {
            $checkSql = "SELECT id FROM users WHERE email = ? AND id != ?";
            $checkStmt = $db->prepare($checkSql);
            $checkStmt->bind_param("si", $input['email'], $input['id']);
            $checkStmt->execute();
            $checkResult = $checkStmt->get_result();
            
            if ($checkResult->num_rows > 0) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Email already exists"]);
                $checkStmt->close();
                break;
            }
            $checkStmt->close();
        }

        // Build dynamic update query
        $updateFields = [];
        $types = "";
        $values = [];
        
        if (isset($input['full_name'])) {
            $updateFields[] = "full_name = ?";
            $types .= "s";
            $values[] = $input['full_name'];
        }
        
        if (isset($input['email'])) {
            $updateFields[] = "email = ?";
            $types .= "s";
            $values[] = $input['email'];
        }
        
        if (isset($input['phone'])) {
            $updateFields[] = "phone = ?";
            $types .= "s";
            $values[] = $input['phone'];
        }
        
        // Handle password update if provided
        if (isset($input['password']) && !empty($input['password'])) {
            $updateFields[] = "password = ?";
            $types .= "s";
            $values[] = password_hash($input['password'], PASSWORD_DEFAULT);
        }
        
        // Only allow admins to change admin status
        if (isset($input['is_admin']) && $_SESSION['user']['is_admin']) {
            $updateFields[] = "is_admin = ?";
            $types .= "i";
            $values[] = (int)$input['is_admin'];
        }
        
        if (empty($updateFields)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "No fields to update"]);
            break;
        }
        
        $sql = "UPDATE users SET " . implode(", ", $updateFields) . " WHERE id = ?";
        $types .= "i";
        $values[] = $input['id'];
        
        $stmt = $db->prepare($sql);
        $stmt->bind_param($types, ...$values);
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Failed to update profile"]);
        }
        $stmt->close();
        break;

    case 'DELETE':
        // Check user role
        $currentUser = $_SESSION['user'];
        $userRole = $currentUser['role'] ?? ($currentUser['is_admin'] ? 'admin' : 'user');
        
        // Only allow admin users to delete/restrict users
        if (!$currentUser['is_admin']) {
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "Access Denied. Admin privilege required."]);
            break;
        }
        
        // Get user ID and action
        $userId = $_GET['id'] ?? null;
        $action = $_GET['action'] ?? 'delete'; // 'delete' or 'restrict'
        
        if (!$userId) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "User ID is required"]);
            break;
        }

        // Prevent acting on the current admin user
        if ($userId == $currentUser['id']) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Cannot modify your own account"]);
            break;
        }
        
        // Get target user info
        $checkStmt = $db->prepare("SELECT full_name, email, is_restricted FROM users WHERE id = ?");
        $checkStmt->bind_param("i", $userId);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        $targetUser = $checkResult->fetch_assoc();
        $checkStmt->close();
        
        if (!$targetUser) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "User not found"]);
            break;
        }

        // Normal admins can only restrict users, super admins can delete
        if ($userRole !== 'super_admin' && $action === 'delete') {
            // Force restrict action for normal admins
            $action = 'restrict';
        }
        
        if ($action === 'restrict') {
            // Add is_restricted column if it doesn't exist
            $checkColumn = $db->query("SHOW COLUMNS FROM users LIKE 'is_restricted'");
            if ($checkColumn->num_rows === 0) {
                $db->query("ALTER TABLE users ADD COLUMN is_restricted TINYINT(1) DEFAULT 0 AFTER is_admin");
            }
            
            // Toggle restriction status
            $newStatus = $targetUser['is_restricted'] ? 0 : 1;
            $sql = "UPDATE users SET is_restricted = ? WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("ii", $newStatus, $userId);
            
            if ($stmt->execute()) {
                // Create notification
                $notifStmt = $db->prepare("
                    INSERT INTO notifications (user_id, title, message, type, redirect_to, created_at) 
                    VALUES (?, ?, ?, 'warning', 'users', NOW())
                ");
                $notifTitle = $newStatus ? "User Restricted" : "User Unrestricted";
                $notifMessage = $newStatus 
                    ? "User {$targetUser['full_name']} ({$targetUser['email']}) has been restricted from accessing the system."
                    : "User {$targetUser['full_name']} ({$targetUser['email']}) has been granted access to the system.";
                $adminId = $currentUser['id'];
                $notifStmt->bind_param('iss', $adminId, $notifTitle, $notifMessage);
                $notifStmt->execute();
                
                $message = $newStatus ? "User restricted successfully" : "User unrestricted successfully";
                echo json_encode(["success" => true, "message" => $message, "is_restricted" => $newStatus]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Failed to update user status"]);
            }
            $stmt->close();
        } else {
            // Delete user (super admin only)
            $sql = "DELETE FROM users WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("i", $userId);
            
            if ($stmt->execute()) {
                if ($stmt->affected_rows > 0) {
                    // Create notification
                    $notifStmt = $db->prepare("
                        INSERT INTO notifications (user_id, title, message, type, redirect_to, created_at) 
                        VALUES (?, ?, ?, 'error', 'users', NOW())
                    ");
                    $notifTitle = "User Deleted";
                    $notifMessage = "User {$targetUser['full_name']} ({$targetUser['email']}) has been permanently removed from the system.";
                    $adminId = $currentUser['id'];
                    $notifStmt->bind_param('iss', $adminId, $notifTitle, $notifMessage);
                    $notifStmt->execute();
                    
                    echo json_encode(["success" => true, "message" => "User deleted successfully"]);
                } else {
                    http_response_code(404);
                    echo json_encode(["success" => false, "message" => "User not found"]);
                }
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Failed to delete user"]);
            }
            $stmt->close();
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        break;
}
?>