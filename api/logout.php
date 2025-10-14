<?php
require_once __DIR__ . "/config.php";
require_once __DIR__ . "/cors_headers.php"; // This handles all CORS headers
session_start();

session_unset();
session_destroy();

echo json_encode(["success" => true, "message" => "Logged out successfully"]);
?>