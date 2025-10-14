<?php
require_once 'api/config.php';

try {
    // Read and execute the SQL file
    $sql = file_get_contents('database/create_content_table.sql');
    
    // Execute the SQL
    $pdo->exec($sql);
    
    echo "✅ Content management table created successfully!\n";
    echo "✅ Sample content posts added!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
