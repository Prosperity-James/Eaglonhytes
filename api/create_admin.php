<?php
/**
 * Create Admin Account (Super Admin Only)
 * Eaglonhytes Real Estate Application
 */

require_once __DIR__ . "/config.php";
require_once __DIR__ . "/cors_headers.php";
require_once __DIR__ . "/session_config.php";
require_once __DIR__ . "/auth_middleware.php";

session_start();

// Only Super Admin can create admin accounts
$currentUser = requireSuperAdmin();

// Get JSON request
$input = json_decode(file_get_contents("php://input"), true);

$fullName = trim($input['full_name'] ?? '');
$email = trim($input['email'] ?? '');
$password = trim($input['password'] ?? '');
$phone = trim($input['phone'] ?? '');
$errors = [];

// Validate input
if (empty($fullName)) {
    $errors['full_name'] = "Full name is required";
}
if (empty($email)) {
    $errors['email'] = "Email is required";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = "Invalid email format";
}
if (empty($password)) {
    $errors['password'] = "Password is required";
} elseif (strlen($password) < 8) {
    $errors['password'] = "Password must be at least 8 characters";
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "errors" => $errors,
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
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Email already exists. Please use a different email."
    ]);
    $stmt->close();
    exit;
}
$stmt->close();

// Hash password
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Insert new admin user
$stmt = $db->prepare("
    INSERT INTO users (full_name, email, password, phone, is_admin, role) 
    VALUES (?, ?, ?, ?, 1, 'admin')
");
$stmt->bind_param("ssss", $fullName, $email, $hashedPassword, $phone);

if ($stmt->execute()) {
    $newAdminId = $stmt->insert_id;
    
    // Fetch the newly created admin
    $stmt2 = $db->prepare("
        SELECT id, full_name, email, phone, is_admin, role, created_at 
        FROM users 
        WHERE id = ?
    ");
    $stmt2->bind_param("i", $newAdminId);
    $stmt2->execute();
    $result = $stmt2->get_result();
    $newAdmin = $result->fetch_assoc();
    $stmt2->close();
    
    // Log the action
    logAdminAction(
        $db,
        'create_admin',
        'user',
        $newAdminId,
        [
            'admin_email' => $email,
            'admin_name' => $fullName,
            'created_by' => $currentUser['email']
        ]
    );
    
    echo json_encode([
        "success" => true,
        "message" => "Admin account created successfully!",
        "admin" => [
            'id' => $newAdmin['id'],
            'full_name' => $newAdmin['full_name'],
            'email' => $newAdmin['email'],
            'phone' => $newAdmin['phone'],
            'role' => $newAdmin['role'],
            'created_at' => $newAdmin['created_at']
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to create admin account. Please try again.",
        "db_error" => $stmt->error
    ]);
}

$stmt->close();
?>
