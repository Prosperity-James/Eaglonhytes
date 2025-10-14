<?php
/**
 * Database Setup Script
 * Run this to create content management tables
 */

require_once __DIR__ . '/api/config.php';

if (!$db) {
    die("Database connection failed: " . (defined('DB_CONNECTION_ERROR') ? DB_CONNECTION_ERROR : 'Unknown error'));
}

echo "Setting up content management tables...\n\n";

// Read and execute SQL file
$sqlFile = __DIR__ . '/database/add_content_management_tables.sql';
$sql = file_get_contents($sqlFile);

// Split SQL into individual statements
$statements = array_filter(array_map('trim', explode(';', $sql)));

$success = 0;
$errors = 0;

foreach ($statements as $statement) {
    if (empty($statement) || strpos($statement, '--') === 0) {
        continue;
    }
    
    echo "Executing: " . substr($statement, 0, 50) . "...\n";
    
    if ($db->query($statement)) {
        echo "✓ Success\n";
        $success++;
    } else {
        echo "✗ Error: " . $db->error . "\n";
        $errors++;
    }
    echo "\n";
}

echo "Setup complete!\n";
echo "Successful statements: $success\n";
echo "Errors: $errors\n";

// Test the tables
echo "\nTesting tables...\n";

$tables = ['founder', 'story_content', 'carousel_images'];
foreach ($tables as $table) {
    $result = $db->query("SELECT COUNT(*) as count FROM $table");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "✓ Table '$table': {$row['count']} records\n";
    } else {
        echo "✗ Table '$table': Error - " . $db->error . "\n";
    }
}

$db->close();
?>
