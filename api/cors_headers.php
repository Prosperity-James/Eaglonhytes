<?php
/**
 * Centralized CORS headers configuration with environment-based origins
 * Include this file at the top of all API endpoints
 */

// Prevent any output before headers
ob_start();

// Suppress warnings that might break JSON
error_reporting(E_ERROR | E_PARSE);

// Try to load environment config, but don't fail if it doesn't exist
$isProduction = false;
if (file_exists(__DIR__ . '/.env')) {
    // Load environment config if .env exists
    if (!defined('IS_PRODUCTION')) {
        require_once __DIR__ . '/env_config.php';
        $isProduction = IS_PRODUCTION;
    }
}

// Get the origin from request
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Define allowed origins based on environment
if ($isProduction) {
    // Production: Only allow your production domain
    $allowed_origins = [
        defined('FRONTEND_URL') ? FRONTEND_URL : 'https://yourdomain.com',
        // Add additional production domains if needed
    ];
} else {
    // Development: Allow localhost ports and proxy URLs
    $allowed_origins = [
        'http://localhost:5173',
        'http://localhost:5174', 
        'http://localhost:5175',
        'http://localhost:3000',
        'http://localhost',
        'http://127.0.0.1:59350',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174'
    ];
}

// Check if origin is allowed
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Fallback to primary frontend URL
    $fallback = $isProduction ? 'https://yourdomain.com' : 'http://localhost:5173';
    header("Access-Control-Allow-Origin: $fallback");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 3600");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>
