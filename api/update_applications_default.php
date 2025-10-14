<?php
// Update land_applications table to ensure default status is 'pending'
require_once 'config.php';

try {
    // Update the status column to have a default value of 'pending'
    $sql = "ALTER TABLE land_applications 
            MODIFY COLUMN status ENUM('pending', 'approved', 'rejected', 'withdrawn') 
            DEFAULT 'pending' NOT NULL";
    
    if ($db->query($sql)) {
        echo "✅ Successfully updated land_applications table default status to 'pending'\n";
    } else {
        echo "❌ Error updating table: " . $db->error . "\n";
    }
    
    // Update any existing applications with NULL or empty status to 'pending'
    $updateSql = "UPDATE land_applications 
                  SET status = 'pending' 
                  WHERE status IS NULL OR status = ''";
    
    if ($db->query($updateSql)) {
        $affectedRows = $db->affected_rows;
        echo "✅ Updated $affectedRows existing applications to 'pending' status\n";
    } else {
        echo "❌ Error updating existing records: " . $db->error . "\n";
    }
    
    // Verify the changes
    $verifySql = "SELECT status, COUNT(*) as count FROM land_applications GROUP BY status";
    $result = $db->query($verifySql);
    
    echo "\n📊 Current status distribution:\n";
    while ($row = $result->fetch_assoc()) {
        echo "- {$row['status']}: {$row['count']} applications\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

$db->close();
?>
