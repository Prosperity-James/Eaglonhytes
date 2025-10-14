<?php
require_once 'api/config.php';

try {
    $stmt = $pdo->query('SELECT id, title, images FROM lands LIMIT 5');
    echo "Checking land images in database:\n\n";
    
    while ($row = $stmt->fetch()) {
        echo "Land ID: " . $row['id'] . "\n";
        echo "Title: " . $row['title'] . "\n";
        echo "Images: " . $row['images'] . "\n";
        echo "---\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
