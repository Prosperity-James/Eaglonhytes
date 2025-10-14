<?php
/**
 * Enhanced session configuration with environment-based security
 * Automatically adjusts for development vs production
 */

// Load environment config if not already loaded
if (!defined('IS_PRODUCTION')) {
    require_once __DIR__ . '/env_config.php';
}

// Suppress any warnings from session configuration
error_reporting(E_ERROR | E_PARSE);

// Determine if we're using HTTPS
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') 
    || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
    || (!empty($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);

// Session configuration
@ini_set('session.cookie_path', '/');
@ini_set('session.cookie_httponly', '1');
@ini_set('session.use_strict_mode', '1');
@ini_set('session.cookie_lifetime', '0'); // Until browser closes

// Enable session garbage collection
@ini_set('session.gc_probability', '1');
@ini_set('session.gc_divisor', '100');
@ini_set('session.gc_maxlifetime', '1440'); // 24 minutes

// Production vs Development settings
if (IS_PRODUCTION) {
    // Production: Strict security
    @ini_set('session.cookie_domain', ''); // Set your domain in production
    $secure = $isHttps; // Require HTTPS in production
    $sameSite = 'Strict';
} else {
    // Development: Relaxed for localhost
    @ini_set('session.cookie_domain', '');
    $secure = false;
    $sameSite = 'Lax';
}

// Override with environment variable if set
$secure = SESSION_SECURE ?: $secure;
$sameSite = SESSION_SAMESITE ?: $sameSite;

// Set session cookie parameters
@session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '',
    'secure' => $secure,
    'httponly' => true,
    'samesite' => $sameSite
]);
?>
