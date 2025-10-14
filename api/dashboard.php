<?php
// Error & CORS setup
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . "/config.php";
require_once __DIR__ . "/session.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        getDashboardStats();
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}

function getDashboardStats() {
    global $db;

    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }

    $stats = [
        "total_lands" => 0,
        "total_users" => 0,
        "total_applications" => 0
    ];

    // Lands count
    $res = $db->query("SELECT COUNT(*) as count FROM lands");
    if ($res) {
        $row = $res->fetch_assoc();
        $stats['total_lands'] = (int)$row['count'];
    }

    // Users count
    $res = $db->query("SELECT COUNT(*) as count FROM users");
    if ($res) {
        $row = $res->fetch_assoc();
        $stats['total_users'] = (int)$row['count'];
    }

    // Applications count
    $res = $db->query("SELECT COUNT(*) as count FROM land_applications");
    if ($res) {
        $row = $res->fetch_assoc();
        $stats['total_applications'] = (int)$row['count'];
    }

    echo json_encode(['success' => true, 'dashboard' => $stats]);
}
