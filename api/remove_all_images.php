<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

try {
    // Use the existing database connection from config.php
    $conn = $db;
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    // Set ALL properties to have completely empty images arrays
    $sql = "UPDATE lands SET images = '[]'";
    
    $result = $conn->query($sql);
    
    if ($result) {
        $affected_rows = $conn->affected_rows;
        
        // Also verify the update by checking current state
        $verify_sql = "SELECT id, title, images FROM lands";
        $verify_result = $conn->query($verify_sql);
        
        $properties_status = [];
        if ($verify_result && $verify_result->num_rows > 0) {
            while ($row = $verify_result->fetch_assoc()) {
                $properties_status[] = [
                    'id' => $row['id'],
                    'title' => $row['title'],
                    'images' => $row['images']
                ];
            }
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'ALL images removed successfully from ALL properties',
            'affected_rows' => $affected_rows,
            'details' => 'Every property now has empty images array []',
            'properties_status' => $properties_status
        ]);
        
    } else {
        throw new Exception("Error updating images: " . $conn->error);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database cleanup failed: ' . $e->getMessage()
    ]);
}
?>
