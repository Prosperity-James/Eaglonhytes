<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>🔍 Complete Story Image Investigation & Removal</h2>";

try {
    require_once __DIR__ . '/api/config.php';
    
    if (!$db) {
        throw new Exception("Database connection failed");
    }
    
    echo "<h3>📊 Current Database Status:</h3>";
    
    // Check current story content
    $result = $db->query("SELECT id, title, image_url, LENGTH(image_url) as url_length FROM story_content WHERE id = 1");
    
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo "<p><strong>Story ID:</strong> {$row['id']}</p>";
        echo "<p><strong>Title:</strong> {$row['title']}</p>";
        echo "<p><strong>Image URL:</strong> '{$row['image_url']}'</p>";
        echo "<p><strong>URL Length:</strong> {$row['url_length']} characters</p>";
        
        if (!empty($row['image_url'])) {
            echo "<div style='background: #f8d7da; padding: 15px; border-radius: 5px; margin: 10px 0;'>";
            echo "<strong>❌ PROBLEM FOUND:</strong> Image URL is not empty!<br>";
            echo "Current value: '{$row['image_url']}'";
            echo "</div>";
            
            // Force clear it
            echo "<h3>🔧 Forcing Clear Operation:</h3>";
            
            $clearSql = "UPDATE story_content SET image_url = '' WHERE id = 1";
            if ($db->query($clearSql)) {
                echo "<p>✅ Force update executed successfully</p>";
                
                // Verify again
                $verifyResult = $db->query("SELECT image_url, LENGTH(image_url) as url_length FROM story_content WHERE id = 1");
                if ($verifyResult) {
                    $verifyRow = $verifyResult->fetch_assoc();
                    echo "<p><strong>After Update:</strong> '{$verifyRow['image_url']}'</p>";
                    echo "<p><strong>New Length:</strong> {$verifyRow['url_length']} characters</p>";
                    
                    if (empty($verifyRow['image_url'])) {
                        echo "<div style='background: #d4edda; padding: 15px; border-radius: 5px; margin: 10px 0;'>";
                        echo "<strong>✅ SUCCESS:</strong> Image URL is now completely empty!";
                        echo "</div>";
                    }
                }
            } else {
                echo "<p>❌ Force update failed: " . $db->error . "</p>";
            }
        } else {
            echo "<div style='background: #d4edda; padding: 15px; border-radius: 5px; margin: 10px 0;'>";
            echo "<strong>✅ GOOD:</strong> Image URL is already empty in database";
            echo "</div>";
        }
    } else {
        echo "<p>❌ No story content found in database</p>";
    }
    
    echo "<h3>🔍 Checking for Cached/Default Images:</h3>";
    
    // Check if there are any placeholder files
    $placeholderFiles = [
        '/assets/placeholder-story.jpg',
        '/assets/story-placeholder.jpg',
        '/assets/default-story.jpg'
    ];
    
    foreach ($placeholderFiles as $file) {
        $fullPath = __DIR__ . '/frontend/public' . $file;
        if (file_exists($fullPath)) {
            echo "<p>⚠️ Found placeholder file: $file</p>";
        } else {
            echo "<p>✅ No placeholder file: $file</p>";
        }
    }
    
    echo "<h3>🚀 Next Steps:</h3>";
    echo "<ol>";
    echo "<li><strong>Clear browser cache:</strong> Press Ctrl+F5 to hard refresh</li>";
    echo "<li><strong>Restart Vite server:</strong> Stop and run 'npm run dev' again</li>";
    echo "<li><strong>Check About page:</strong> Should show placeholder text only</li>";
    echo "<li><strong>Check Content Management:</strong> Should show empty drop zone</li>";
    echo "</ol>";
    
} catch (Exception $e) {
    echo "<p>❌ Error: " . $e->getMessage() . "</p>";
}
?>
