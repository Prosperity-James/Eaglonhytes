<?php
/**
 * Force Story Image to be Empty
 */

require_once __DIR__ . '/api/config.php';

if (!$db) {
    die("Database connection failed");
}

echo "<h2>Force Empty Story Image</h2>";

// Force update story image to empty string
$sql = "UPDATE story_content SET image_url = '' WHERE id = 1";

if ($db->query($sql)) {
    echo "<p>✓ Story image forcefully set to empty string</p>";
} else {
    echo "<p>✗ Error updating story image: " . $db->error . "</p>";
}

// Verify the change
$result = $db->query("SELECT image_url FROM story_content WHERE id = 1");
if ($result) {
    $row = $result->fetch_assoc();
    $imageUrl = $row['image_url'];
    echo "<p><strong>Current story image URL:</strong> '" . $imageUrl . "'</p>";
    echo "<p><strong>Length:</strong> " . strlen($imageUrl) . " characters</p>";
    echo "<p><strong>Is Empty:</strong> " . (empty($imageUrl) ? 'YES' : 'NO') . "</p>";
    
    if (empty($imageUrl)) {
        echo "<p style='color: green; font-weight: bold;'>✓ SUCCESS: Story image is now properly empty!</p>";
    } else {
        echo "<p style='color: red; font-weight: bold;'>✗ PROBLEM: Story image is still not empty</p>";
    }
}

// Also clear any browser cache by adding a timestamp
echo "<h3>Clear Browser Cache</h3>";
echo "<p>Press Ctrl+F5 or Ctrl+Shift+R to hard refresh your browser and clear cache.</p>";
echo "<p><a href='/Eaglonhytes/frontend/?t=" . time() . "'>Go to Application (Cache Busted)</a></p>";

$db->close();
?>
