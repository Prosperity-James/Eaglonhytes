<?php

require_once __DIR__ . "/../api/config.php";

echo "Starting size field cleanup...\n\n";

// Get all lands with size containing "sqm"
$sql = "SELECT id, title, size FROM lands WHERE size LIKE '%sqm%'";
$result = $db->query($sql);

if ($result->num_rows > 0) {
    echo "Found " . $result->num_rows . " lands with 'sqm' in size field:\n";
    echo str_repeat("-", 60) . "\n";
    
    $updated = 0;
    while ($row = $result->fetch_assoc()) {
        $oldSize = $row['size'];
        // Remove " sqm" from the size value
        $newSize = str_replace(' sqm', '', $oldSize);
        $newSize = trim($newSize);
        
        // Update the database
        $updateSql = "UPDATE lands SET size = ? WHERE id = ?";
        $stmt = $db->prepare($updateSql);
        $stmt->bind_param("si", $newSize, $row['id']);
        
        if ($stmt->execute()) {
            echo "✅ Land #{$row['id']} - {$row['title']}\n";
            echo "   Old: '{$oldSize}' → New: '{$newSize}'\n\n";
            $updated++;
        } else {
            echo "❌ Failed to update Land #{$row['id']}\n\n";
        }
        $stmt->close();
    }
    
    echo str_repeat("-", 60) . "\n";
    echo "✅ Updated {$updated} land records\n";
} else {
    echo "✅ No lands found with 'sqm' in size field. All clean!\n";
}

// Verify the results
echo "\n" . str_repeat("=", 60) . "\n";
echo "VERIFICATION - Current size values:\n";
echo str_repeat("=", 60) . "\n";

$verifySql = "SELECT id, title, size FROM lands ORDER BY id";
$verifyResult = $db->query($verifySql);

while ($row = $verifyResult->fetch_assoc()) {
    $sizeDisplay = $row['size'] ? $row['size'] . " sqm" : "Not set";
    echo "Land #{$row['id']}: {$row['title']} - Size: {$sizeDisplay}\n";
}

echo "\n✅ Size field cleanup complete!\n";
echo "Now all sizes are stored as numbers only (e.g., '800')\n";
echo "They will display as '800 sqm' in the frontend.\n";

$db->close();
?>
