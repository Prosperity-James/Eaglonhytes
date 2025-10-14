<?php
/**
 * Fix Database Indexes - Add only if they don't exist
 */

require_once __DIR__ . '/api/config.php';

if (!$db) {
    die("Database connection failed");
}

echo "<h2>Fixing Database Indexes</h2>";

// Function to check if index exists
function indexExists($db, $table, $indexName) {
    $sql = "SHOW INDEX FROM $table WHERE Key_name = '$indexName'";
    $result = $db->query($sql);
    return $result && $result->num_rows > 0;
}

// Function to create index if it doesn't exist
function createIndexIfNotExists($db, $table, $indexName, $columns) {
    if (!indexExists($db, $table, $indexName)) {
        $sql = "CREATE INDEX $indexName ON $table($columns)";
        if ($db->query($sql)) {
            echo "<p>✓ Created index: $indexName on $table($columns)</p>";
        } else {
            echo "<p>✗ Failed to create index $indexName: " . $db->error . "</p>";
        }
    } else {
        echo "<p>✓ Index $indexName already exists on $table</p>";
    }
}

// Create indexes
createIndexIfNotExists($db, 'story_content', 'idx_story_active', 'is_active');
createIndexIfNotExists($db, 'carousel_images', 'idx_carousel_active', 'is_active');
createIndexIfNotExists($db, 'carousel_images', 'idx_carousel_order', 'display_order, is_active');

echo "<h3>Index Check Complete!</h3>";
echo "<p>All necessary indexes are now in place for optimal performance.</p>";
echo "<p><a href='/Eaglonhytes/frontend/'>Go to Application</a></p>";

$db->close();
?>
