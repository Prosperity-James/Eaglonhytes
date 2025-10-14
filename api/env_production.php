<?php
/**
 * Production Environment Configuration
 * This file should be customized for each deployment environment
 */

// Database Configuration - CHANGE THESE FOR PRODUCTION
define('DB_HOST', $_ENV['DB_HOST'] ?? '127.0.0.1');
define('DB_USER', $_ENV['DB_USER'] ?? 'root');
define('DB_PASS', $_ENV['DB_PASS'] ?? '');
define('DB_NAME', $_ENV['DB_NAME'] ?? 'eaglonhytes');

// Application URLs - CHANGE THESE FOR PRODUCTION
define('BASE_URL', $_ENV['BASE_URL'] ?? 'http://localhost/Eaglonhytes-main/');
define('FRONTEND_URL', $_ENV['FRONTEND_URL'] ?? 'http://localhost:5173');
define('FRONTEND_URL_ALT', $_ENV['FRONTEND_URL_ALT'] ?? 'http://localhost:5174');

// Security Configuration
define('SESSION_SECURE', $_ENV['SESSION_SECURE'] ?? 'false');
define('SESSION_SAMESITE', $_ENV['SESSION_SAMESITE'] ?? 'Lax');
define('ENABLE_HTTPS', $_ENV['ENABLE_HTTPS'] ?? 'false');

// Environment Detection
define('APP_ENV', $_ENV['APP_ENV'] ?? 'development');
define('IS_PRODUCTION', APP_ENV === 'production');

// Security Settings
define('MAX_LOGIN_ATTEMPTS', $_ENV['MAX_LOGIN_ATTEMPTS'] ?? 5);
define('LOGIN_LOCKOUT_TIME', $_ENV['LOGIN_LOCKOUT_TIME'] ?? 900); // 15 minutes

// Error Reporting
if (IS_PRODUCTION) {
    error_reporting(E_ERROR | E_PARSE);
    ini_set('display_errors', '0');
    ini_set('log_errors', '1');
    ini_set('error_log', __DIR__ . '/logs/error.log');
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', '0'); // Still off to prevent JSON breaking
    ini_set('log_errors', '1');
    ini_set('error_log', __DIR__ . '/logs/debug.log');
}

// Create logs directory if it doesn't exist
$logDir = __DIR__ . '/logs';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0755, true);
}

// Database Connection with better error handling
try {
    $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($db->connect_errno) {
        error_log("Database connection failed: " . $db->connect_error);
        if (IS_PRODUCTION) {
            define('DB_CONNECTION_ERROR', 'Database temporarily unavailable');
        } else {
            define('DB_CONNECTION_ERROR', $db->connect_error);
        }
        $db = null;
        $pdo = null;
    } else {
        $db->set_charset('utf8mb4');
        // Set SQL mode for better security
        $db->query("SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO'");
        
        // Also create PDO connection for files that need it
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
    }
} catch (Exception $e) {
    error_log("Database connection exception: " . $e->getMessage());
    define('DB_CONNECTION_ERROR', IS_PRODUCTION ? 'Database temporarily unavailable' : $e->getMessage());
    $db = null;
    $pdo = null;
}
?>
