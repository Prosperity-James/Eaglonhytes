<?php
/**
 * Environment-based configuration
 * Loads settings from .env file if it exists, otherwise uses defaults
 */

// Load .env file if it exists
function loadEnv($path = __DIR__ . '/.env') {
    if (!file_exists($path)) {
        return false;
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        // Parse KEY=VALUE
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            // Remove quotes if present
            $value = trim($value, '"\'');
            
            // Set as environment variable
            if (!array_key_exists($key, $_ENV)) {
                $_ENV[$key] = $value;
                putenv("$key=$value");
            }
        }
    }
    return true;
}

// Load environment variables
loadEnv();

// Helper function to get environment variable with fallback
function env($key, $default = null) {
    $value = getenv($key);
    if ($value === false) {
        $value = $_ENV[$key] ?? $default;
    }
    return $value;
}

// Database Configuration
define('DB_HOST', env('DB_HOST', '127.0.0.1'));
define('DB_USER', env('DB_USER', 'root'));
define('DB_PASS', env('DB_PASS', ''));
define('DB_NAME', env('DB_NAME', 'eaglonhytes'));

// Application URLs
define('BASE_URL', env('BASE_URL', 'http://localhost/Eaglonhytes/'));
define('FRONTEND_URL', env('FRONTEND_URL', 'http://localhost:5173'));
define('FRONTEND_URL_ALT', env('FRONTEND_URL_ALT', 'http://localhost:5174'));

// Session Security
define('SESSION_SECURE', env('SESSION_SECURE', 'false') === 'true');
define('SESSION_SAMESITE', env('SESSION_SAMESITE', 'Lax'));

// Environment
define('APP_ENV', env('APP_ENV', 'development'));
define('IS_PRODUCTION', APP_ENV === 'production');

// Error Reporting
if (IS_PRODUCTION) {
    error_reporting(E_ERROR | E_PARSE);
    ini_set('display_errors', '0');
    ini_set('log_errors', '1');
    ini_set('error_log', __DIR__ . '/error_log.txt');
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', '0'); // Still off to prevent JSON breaking
    ini_set('log_errors', '1');
}

// Database Connection
// Note: Don't output errors here - let individual API files handle it
$db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($db->connect_errno) {
    // Store error but don't output - headers may not be sent yet
    define('DB_CONNECTION_ERROR', $db->connect_error);
    $db = null; // Set to null so APIs can check if connection failed
} else {
    $db->set_charset('utf8mb4');
}
?>
