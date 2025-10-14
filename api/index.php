<?php
require_once __DIR__ . "/config.php";

header("Content-Type: application/json");

// Fetch available apartments using a prepared statement
$sql = "SELECT id, title, description, address, city, state, zip_code, bedrooms, bathrooms, square_feet, rent_price, deposit, images, amenities, available_date FROM apartments WHERE status = ? ORDER BY created_at DESC";
$stmt = $db->prepare($sql);

if ($stmt) {
    $status = 'available';
    $stmt->bind_param("s", $status);
    $stmt->execute();
    $result = $stmt->get_result();
    $lands = $result->fetch_all(MYSQLI_ASSOC);
    foreach ($lands as &$land) {
        $land['images'] = json_decode($land['images'] ?? '[]', true);
    }
    echo json_encode(["success" => true, "lands" => $lands]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to fetch lands"]);
}
?>