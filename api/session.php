<?php
// Suppress any warnings that might break JSON
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Start output buffering to catch any stray output
ob_start();

// CORS must be sent before any output/session
require_once __DIR__ . "/cors_headers.php"; // This handles all CORS headers
require_once __DIR__ . "/session_config.php";
session_start();
require_once __DIR__ . "/config.php";

// Clean any output that might have been generated
ob_clean();

// Ensure JSON content type
header('Content-Type: application/json');

try {
    // Only output JSON if this file is accessed directly
    if (basename($_SERVER['PHP_SELF']) === 'session.php') {
        
        // Check if database connection exists
        if (!$db || defined('DB_CONNECTION_ERROR')) {
            throw new Exception('Database connection failed');
        }

        if (isset($_SESSION['user'])) {
            // Fetch fresh user data from database instead of using session data
            $userId = $_SESSION['user']['id'];
            
            $sql = "SELECT id, full_name, email, phone, is_admin, role, created_at, updated_at FROM users WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("i", $userId);
            
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                $user = $result->fetch_assoc();
                $stmt->close();
                
                if ($user) {
                    // Update session with fresh data
                    $_SESSION['user'] = $user;
                    echo json_encode(["success" => true, "user" => $user]);
                } else {
                    echo json_encode(["success" => false, "message" => "User not found"]);
                }
            } else {
                echo json_encode(["success" => false, "message" => "Database error"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "No active session"]);
        }
    }
} catch (Exception $e) {
    ob_clean();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}

// End output buffering
ob_end_flush();
?>