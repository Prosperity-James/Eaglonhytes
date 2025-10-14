<?php
// Suppress any warnings or notices that might break JSON
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Start output buffering to catch any stray output
ob_start();

// CORS headers MUST be sent before session and any output
require_once __DIR__ . "/cors_headers.php"; // Handles all CORS headers and OPTIONS

// Enhanced session configuration for cross-origin
require_once __DIR__ . "/session_config.php";
session_start();

require_once __DIR__ . "/config.php";
require_once __DIR__ . "/security_utils.php";

// Clean any output that might have been generated
ob_clean();

// Ensure JSON content type and prevent HTML injection
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Disable any HTML output buffering or injection
if (function_exists('apache_setenv')) {
    apache_setenv('no-gzip', '1');
}
ini_set('zlib.output_compression', 'Off');

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);

    if ($method === 'POST') {
        loginUser($input);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
} catch (Exception $e) {
    ob_clean();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}

// End output buffering

function loginUser($data) {
    global $db;

    // Debug: Log the received data
    error_log('Login attempt with data: ' . json_encode($data));

    if (!$data || empty($data['email']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email and password required']);
        return;
    }

    $clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    if (!SecurityUtils::checkRateLimit($clientIP, MAX_LOGIN_ATTEMPTS, LOGIN_LOCKOUT_TIME)) {
        SecurityUtils::logSecurityEvent('login_rate_limit_exceeded', ['ip' => $clientIP]);
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Too many login attempts. Please try again later.'
        ]);
        exit;
    }

    $email = SecurityUtils::sanitizeEmail($data['email']);
    if ($email === false) {
        SecurityUtils::logSecurityEvent('login_invalid_email', ['ip' => $clientIP, 'email' => $data['email']]);
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Please enter a valid email address'
        ]);
        exit;
    }

    $password = $data['password'];
    $passwordValidation = SecurityUtils::validatePassword($password);
    if ($passwordValidation !== true) {
        SecurityUtils::logSecurityEvent('login_invalid_password', ['ip' => $clientIP, 'email' => $email]);
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid password format',
            'errors' => ['password' => $passwordValidation]
        ]);
        exit;
    }

    // Build SQL query based on column existence
    if ($hasRestrictedColumn) {
        $sql = "SELECT id, full_name, email, phone, password, is_admin, role, is_restricted FROM users WHERE email = ? LIMIT 1";
    } else {
        $sql = "SELECT id, full_name, email, phone, password, is_admin, role FROM users WHERE email = ? LIMIT 1";
    }
    $stmt = $db->prepare($sql);
    if (!$stmt) {
        error_log('Database prepare error: ' . $db->error);
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $db->error]);
        return;
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    // Debug: Log user lookup result
    error_log('User lookup result: ' . ($user ? 'Found user' : 'No user found'));
    
    if ($user && password_verify($password, $user['password'])) {
        error_log('Password verification successful');
        
        // Check if user is restricted (only if column exists)
        if ($hasRestrictedColumn && isset($user['is_restricted']) && $user['is_restricted'] == 1) {
            http_response_code(403);
            echo json_encode([
                'success' => false, 
                'message' => 'Your account has been restricted. Please contact the administrator for assistance.'
            ]);
            return;
        }
        
        // Set default role if not exists
        $userRole = $user['role'] ?? 'user';
        
        $_SESSION['user'] = [
            "id" => $user['id'],
            "full_name" => $user['full_name'],
            "email" => $user['email'],
            "phone" => $user['phone'],
            "is_admin" => (bool)$user['is_admin'],
            "role" => $userRole
        ];

        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user' => $_SESSION['user']
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    }
}
