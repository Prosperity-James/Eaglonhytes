<?php
require_once __DIR__ . "/../api/config.php";

echo "Adding is_restricted column to users table...\n\n";

// Check if column already exists
$checkColumn = $db->query("SHOW COLUMNS FROM users LIKE 'is_restricted'");

if ($checkColumn->num_rows > 0) {
    echo "✓ Column 'is_restricted' already exists in users table.\n";
    exit;
}

// Add the column
$sql = "ALTER TABLE users ADD COLUMN is_restricted TINYINT(1) DEFAULT 0 AFTER is_admin";

if ($db->query($sql)) {
    echo "✓ Successfully added 'is_restricted' column to users table.\n";
    echo "  - Type: TINYINT(1)\n";
    echo "  - Default: 0 (not restricted)\n";
    echo "  - Position: After 'is_admin' column\n\n";
    
    // Verify the column was added
    $verify = $db->query("SHOW COLUMNS FROM users LIKE 'is_restricted'");
    if ($verify->num_rows > 0) {
        echo "✓ Verification successful - column exists.\n";
    }
} else {
    echo "✗ Error adding column: " . $db->error . "\n";
    exit(1);
}

echo "\nDone! Users can now be restricted by admins.\n";
?>
