<?php
/**
 * Clear Story Image - Set to completely empty
 */

require_once __DIR__ . '/api/config.php';

if (!$db) {
    die("Database connection failed");
}

echo "<h2>🗑️ Clearing Story Image</h2>";

// Force update story image to be completely empty
$sql = "UPDATE story_content SET image_url = '' WHERE id = 1";

if ($db->query($sql)) {
    echo "<p>✅ Story image cleared - now completely empty</p>";
} else {
    echo "<p>❌ Error clearing story image: " . $db->error . "</p>";
}

// Verify the change
$result = $db->query("SELECT id, title, image_url FROM story_content WHERE id = 1");
if ($result) {
    $row = $result->fetch_assoc();
    $imageUrl = $row['image_url'];
    echo "<p><strong>Story ID:</strong> {$row['id']}</p>";
    echo "<p><strong>Story Title:</strong> {$row['title']}</p>";
    echo "<p><strong>Current Image URL:</strong> '" . $imageUrl . "'</p>";
    echo "<p><strong>Length:</strong> " . strlen($imageUrl) . " characters</p>";
    echo "<p><strong>Is Empty:</strong> " . (empty($imageUrl) ? 'YES ✅' : 'NO ❌') . "</p>";
    
    if (empty($imageUrl)) {
        echo "<div style='background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 10px 0;'>";
        echo "<strong>✅ SUCCESS!</strong><br>";
        echo "Story image is now completely empty and will show placeholder until you upload a new image.";
        echo "</div>";
    } else {
        echo "<div style='background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 5px; margin: 10px 0;'>";
        echo "<strong>❌ ISSUE:</strong><br>";
        echo "Story image is still not empty: '$imageUrl'";
        echo "</div>";
    }
}

echo "<h3>📋 What This Does:</h3>";
echo "<ul>";
echo "<li>✅ Sets story image URL to empty string ('')</li>";
echo "<li>✅ About page will show placeholder text instead of image</li>";
echo "<li>✅ Content Management will show empty drop zone</li>";
echo "<li>✅ No broken image links or placeholder images</li>";
echo "</ul>";

echo "<h3>🎯 Next Steps:</h3>";
echo "<p>1. Visit the About page to see the empty placeholder</p>";
echo "<p>2. Use Content Management to upload a new story image</p>";
echo "<p>3. The image will appear immediately after upload</p>";

echo "<p><a href='/Eaglonhytes-main/frontend/' style='background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Go to Application</a></p>";

$db->close();
?>
