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
    
    // Update all lands to have empty images arrays (only keep actual backend uploads)
    $sql = "UPDATE lands SET images = '[]' WHERE 
            images LIKE '%unsplash%' OR 
            images LIKE '%data:image/svg%' OR 
            images LIKE '%images.unsplash%' OR
            images = '' OR 
            images IS NULL";
    
    $result = $conn->query($sql);
    
    if ($result) {
        $affected_rows = $conn->affected_rows;
        
        // Also clean up any properties that have mixed arrays with external URLs
        $sql_select = "SELECT id, images FROM lands WHERE images != '[]' AND images IS NOT NULL";
        $result_select = $conn->query($sql_select);
        
        $cleaned_properties = 0;
        
        if ($result_select && $result_select->num_rows > 0) {
            while ($row = $result_select->fetch_assoc()) {
                $images = json_decode($row['images'], true);
                if (is_array($images)) {
                    // Filter out external URLs and placeholders, keep only backend uploads
                    $clean_images = array_filter($images, function($img) {
                        if (!is_string($img)) return false;
                        
                        // Keep only backend uploads
                        return (strpos($img, 'uploads/') === 0 || 
                                strpos($img, '/uploads/') === 0 || 
                                strpos($img, 'lands/') === 0 ||
                                strpos($img, 'localhost/Eaglonhytes/api/uploads/') !== false);
                    });
                    
                    // Re-index array to avoid gaps
                    $clean_images = array_values($clean_images);
                    
                    // Update the property with cleaned images
                    $clean_images_json = json_encode($clean_images);
                    $update_sql = "UPDATE lands SET images = ? WHERE id = ?";
                    $stmt = $conn->prepare($update_sql);
                    $stmt->bind_param("si", $clean_images_json, $row['id']);
                    
                    if ($stmt->execute()) {
                        $cleaned_properties++;
                    }
                    $stmt->close();
                }
            }
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Images cleaned successfully',
            'affected_rows' => $affected_rows,
            'cleaned_properties' => $cleaned_properties,
            'details' => 'Removed all external URLs, placeholders, and invalid images. Only backend uploads remain.'
        ]);
        
    } else {
        throw new Exception("Error updating images: " . $conn->error);
    }
    
    // Don't close the connection as it's managed by config.php
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database cleanup failed: ' . $e->getMessage()
    ]);
}
?>
