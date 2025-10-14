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
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Check if file was uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    $error_message = 'No file uploaded';
    if (isset($_FILES['image']['error'])) {
        switch ($_FILES['image']['error']) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $error_message = 'File too large';
                break;
            case UPLOAD_ERR_PARTIAL:
                $error_message = 'File upload incomplete';
                break;
            case UPLOAD_ERR_NO_FILE:
                $error_message = 'No file selected';
                break;
            default:
                $error_message = 'Upload failed';
        }
    }
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $error_message]);
    exit;
}

$file = $_FILES['image'];

// Configuration
$allowed_mime_types = [
    'image/jpeg' => 'jpg',
    'image/jpg' => 'jpg', 
    'image/png' => 'png',
    'image/gif' => 'gif',
    'image/webp' => 'webp'
];
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$max_size = 10 * 1024 * 1024; // 10MB

// Get actual MIME type using finfo (more secure than $_FILES['type'])
if (!function_exists('finfo_open')) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'File type detection not available on server']);
    exit;
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$actual_mime_type = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

// Validate actual MIME type
if (!array_key_exists($actual_mime_type, $allowed_mime_types)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Invalid file type detected. Only JPEG, PNG, GIF, and WebP images are allowed.',
        'detected_type' => $actual_mime_type
    ]);
    exit;
}

// Validate file extension as additional security
$file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($file_extension, $allowed_extensions)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Invalid file extension. Allowed extensions: ' . implode(', ', $allowed_extensions)
    ]);
    exit;
}

// Cross-check MIME type with extension
$expected_extension = $allowed_mime_types[$actual_mime_type];
if ($file_extension !== $expected_extension && !($file_extension === 'jpeg' && $expected_extension === 'jpg')) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'File extension does not match file content. Expected: ' . $expected_extension
    ]);
    exit;
}

// Validate file size
if ($file['size'] > $max_size) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'File too large. Maximum size is 10MB.']);
    exit;
}

// Determine upload directory based on type
$type = $_GET['type'] ?? $_POST['type'] ?? 'general';
$upload_subdir = '';

switch ($type) {
    case 'profile_pictures':
        $upload_subdir = 'profile_pictures/';
        break;
    case 'lands':
    case 'apartments':
        $upload_subdir = 'lands/';
        break;
    case 'content':
        $upload_subdir = 'content/';
        break;
    case 'news':
        $upload_subdir = 'news/';
        break;
    default:
        $upload_subdir = 'general/';
        break;
}

// Create uploads directory if it doesn't exist
$upload_dir = __DIR__ . '/uploads/' . $upload_subdir;
if (!is_dir($upload_dir)) {
    if (!mkdir($upload_dir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to create upload directory']);
        exit;
    }
}

// Generate secure unique filename with randomized subdirectory
$secure_extension = $allowed_mime_types[$actual_mime_type];
$random_subdir = substr(md5(uniqid(rand(), true)), 0, 2) . '/';
$secure_upload_dir = $upload_dir . $random_subdir;

// Create randomized subdirectory if it doesn't exist
if (!is_dir($secure_upload_dir)) {
    if (!mkdir($secure_upload_dir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to create secure upload directory']);
        exit;
    }
}

// Generate cryptographically secure filename
$unique_filename = bin2hex(random_bytes(16)) . '_' . time() . '.' . $secure_extension;
$upload_path = $secure_upload_dir . $unique_filename;

// Move uploaded file with additional security checks
if (move_uploaded_file($file['tmp_name'], $upload_path)) {
    // Set secure file permissions
    chmod($upload_path, 0644);
    
    // Verify the file was actually uploaded and is readable
    if (!is_file($upload_path) || !is_readable($upload_path)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'File upload verification failed']);
        exit;
    }
    
    // Double-check MIME type of uploaded file
    $finfo_check = finfo_open(FILEINFO_MIME_TYPE);
    $uploaded_mime_type = finfo_file($finfo_check, $upload_path);
    finfo_close($finfo_check);
    
    if ($uploaded_mime_type !== $actual_mime_type) {
        // Remove the uploaded file if MIME type changed
        unlink($upload_path);
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'File content validation failed after upload']);
        exit;
    }
    
    // Return the relative path for database storage
    $relative_path = $upload_subdir . $random_subdir . $unique_filename;
    
    // Log successful upload (optional - for security monitoring)
    error_log("Secure image upload: {$relative_path} by user " . ($_SESSION['user']['id'] ?? 'unknown'));
    
    echo json_encode([
        'success' => true, 
        'message' => 'Image uploaded successfully',
        'filename' => $unique_filename,
        'relative_path' => $relative_path,
        'url' => "http://localhost/Eaglonhytes-main/api/uploads/" . $relative_path,
        'file_size' => filesize($upload_path),
        'mime_type' => $uploaded_mime_type
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to save uploaded file. Check server permissions and disk space.',
        'error_code' => 'UPLOAD_MOVE_FAILED'
    ]);
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
