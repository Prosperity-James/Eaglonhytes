<?php
/**
 * Fix Story Image - Set to blank until edited
 */

require_once __DIR__ . '/api/config.php';

if (!$db) {
    die("Database connection failed");
}

echo "<h2>Fixing Story Image</h2>";

// Update story image to be empty/blank
$sql = "UPDATE story_content SET image_url = '' WHERE id = 1";

if ($db->query($sql)) {
    echo "<p>✓ Story image set to blank - ready for admin to upload</p>";
} else {
    echo "<p>✗ Error updating story image: " . $db->error . "</p>";
}

// Verify the change
$result = $db->query("SELECT image_url FROM story_content WHERE id = 1");
if ($result) {
    $row = $result->fetch_assoc();
    echo "<p><strong>Current story image URL:</strong> '" . $row['image_url'] . "'</p>";
}

echo "<h3>Story Image Fixed!</h3>";
echo "<p>The story image is now blank and will remain empty until an admin uploads a new image.</p>";
echo "<p><a href='/Eaglonhytes/frontend/'>Go to Application</a></p>";

$db->close();
?>
