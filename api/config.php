<?php
/**
 * Main Configuration File
 * Uses production-ready environment configuration
 */

// Use production environment configuration
require_once __DIR__ . '/env_production.php';

// All configuration is now handled by env_production.php
// The following variables are available:
// - DB_HOST, DB_USER, DB_PASS, DB_NAME (constants)
// - BASE_URL, FRONTEND_URL, FRONTEND_URL_ALT (constants)
// - $db (mysqli connection object)
// - IS_PRODUCTION (boolean constant)
// - Security constants: MAX_LOGIN_ATTEMPTS, LOGIN_LOCKOUT_TIME
?>
