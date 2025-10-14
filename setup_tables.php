<?php
/**
 * Simple Database Table Setup
 */

require_once __DIR__ . '/api/config.php';

if (!$db) {
    die("Database connection failed");
}

// Content management tables are no longer used - carousel and story are now static assets.
// The SQL that created `story_content` and `carousel_images` has been intentionally disabled.
// If you need to drop these tables from the database, use the provided SQL script:
// database/drop_content_management_tables.sql


echo "<h3>Setup Complete!</h3>";
echo "<p><a href='/Eaglonhytes/frontend/'>Go to Application</a></p>";

$db->close();
?>
