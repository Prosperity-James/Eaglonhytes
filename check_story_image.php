<?php
/**
 * Check Story Image Status
 */

require_once __DIR__ . '/api/config.php';

if (!$db) {
    die("Database connection failed");
}

echo "<h2>Story Image Status Check</h2>";

// Check current story image URL
$result = $db->query("SELECT id, title, image_url FROM story_content WHERE id = 1");

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo "<p><strong>Story ID:</strong> " . $row['id'] . "</p>";
    echo "<p><strong>Story Title:</strong> " . $row['title'] . "</p>";
    echo "<p><strong>Current Image URL:</strong> '" . $row['image_url'] . "'</p>";
    echo "<p><strong>Image URL Length:</strong> " . strlen($row['image_url']) . " characters</p>";
    
    if (empty($row['image_url'])) {
        echo "<p style='color: green;'>✓ Image URL is properly empty</p>";
    } else {
        echo "<p style='color: red;'>✗ Image URL is not empty: '" . $row['image_url'] . "'</p>";
        
        // Force update to empty
        $updateSql = "UPDATE story_content SET image_url = '' WHERE id = 1";
        if ($db->query($updateSql)) {
            echo "<p style='color: blue;'>✓ Forced update to empty string</p>";
        } else {
            echo "<p style='color: red;'>✗ Failed to update: " . $db->error . "</p>";
        }
    }
} else {
    echo "<p style='color: red;'>✗ No story content found in database</p>";
}

echo "<h3>Frontend Check</h3>";
echo "<p>Visit the About page to see if the story image is now blank.</p>";
echo "<p><a href='/Eaglonhytes/frontend/'>Go to Application</a></p>";

$db->close();
?>
