<?php
// CORS headers MUST be first - before any other includes
require_once __DIR__ . "/cors_headers.php";

// Prevent any output before JSON
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors in output

require_once __DIR__ . "/config.php";
require_once __DIR__ . "/session_config.php";
session_start();

// Clean any previous output
ob_clean();

// Set JSON header
header('Content-Type: application/json');

try {
    // Get JSON request
    $input = json_decode(file_get_contents("php://input"), true);

    $username = trim($input['username'] ?? '');
    $email    = trim($input['email'] ?? '');
    $password = trim($input['password'] ?? '');
    $errors   = [];

    // Validate input
    if (empty($username)) {
        $errors['username'] = "Full name is required";
    }
    if (empty($email)) {
        $errors['email'] = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = "Invalid email format";
    }
    if (empty($password)) {
        $errors['password'] = "Password is required";
    } elseif (strlen($password) < 6) {
        $errors['password'] = "Password must be at least 6 characters";
    }

    if (!empty($errors)) {
        echo json_encode([
            "success" => false,
            "errors"  => $errors,
            "message" => "Please fix the errors and try again."
        ]);
        exit;
    }

    // Check if email already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode([
            "success" => false,
            "message" => "Email already exists. Please login."
        ]);
        $stmt->close();
        exit;
    }
    $stmt->close();

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Insert new user with role='user' by default
    $stmt = $db->prepare("INSERT INTO users (full_name, email, password, is_admin, role) VALUES (?, ?, ?, 0, 'user')");
    $stmt->bind_param("sss", $username, $email, $hashedPassword);

    if ($stmt->execute()) {
        $user_id = $stmt->insert_id;
        
        $stmt2 = $db->prepare("SELECT id, full_name, email, is_admin, role FROM users WHERE id = ?");
        $stmt2->bind_param("i", $user_id);
        $stmt2->execute();
        $result = $stmt2->get_result();
        $user = $result->fetch_assoc();
        $user['is_admin'] = (bool)$user['is_admin'];
        $stmt2->close();
        
        $_SESSION['user'] = [
            'id' => $user['id'],
            'full_name' => $user['full_name'],
            'email' => $user['email'],
            'is_admin' => $user['is_admin'],
            'role' => $user['role'] ?? 'user'
        ];

        echo json_encode([
            "success" => true,
            "message" => "Registration successful!",
            "user" => $user
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Registration failed. Please try again.",
            "error" => $stmt->error
        ]);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "An error occurred during registration.",
        "error" => $e->getMessage()
    ]);
}
?>
