<?php
require_once __DIR__ . "/config.php";
require_once __DIR__ . "/cors_headers.php";
require_once __DIR__ . "/session_config.php";
session_start();

header('Content-Type: application/json');

echo json_encode([
    'session_id' => session_id(),
    'session_data' => $_SESSION,
    'user_exists' => isset($_SESSION['user']),
    'user_data' => $_SESSION['user'] ?? null,
    'cookies' => $_COOKIE,
    'session_status' => session_status(),
    'session_name' => session_name()
]);
?>
