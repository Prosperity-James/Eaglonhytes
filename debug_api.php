<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>API Debug Test</h2>";

// Test 1: Basic PHP
echo "<p>✅ PHP is working</p>";

// Test 2: Database connection
try {
    require_once __DIR__ . '/api/config.php';
    echo "<p>✅ Config loaded successfully</p>";
    
    // Check if DB constants are defined
    echo "<p>DB_HOST: " . (defined('DB_HOST') ? DB_HOST : 'NOT DEFINED') . "</p>";
    echo "<p>DB_USER: " . (defined('DB_USER') ? DB_USER : 'NOT DEFINED') . "</p>";
    echo "<p>DB_NAME: " . (defined('DB_NAME') ? DB_NAME : 'NOT DEFINED') . "</p>";
    
    if (isset($db) && $db instanceof mysqli) {
        echo "<p>✅ Database connection object exists</p>";
        
        if ($db->ping()) {
            echo "<p>✅ Database connection is active</p>";
            
            // Test query
            $result = $db->query("SELECT COUNT(*) as count FROM users");
            if ($result) {
                $row = $result->fetch_assoc();
                echo "<p>✅ Database query successful - Found {$row['count']} users</p>";
            } else {
                echo "<p>❌ Database query failed: " . $db->error . "</p>";
            }
        } else {
            echo "<p>❌ Database connection is not active</p>";
        }
    } else {
        echo "<p>❌ Database connection object not found</p>";
        
        if (defined('DB_CONNECTION_ERROR')) {
            echo "<p>❌ DB Connection Error: " . DB_CONNECTION_ERROR . "</p>";
        }
        
        // Try manual connection
        echo "<p>Attempting manual database connection...</p>";
        try {
            $manual_db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
            if ($manual_db->connect_errno) {
                echo "<p>❌ Manual connection failed: " . $manual_db->connect_error . "</p>";
            } else {
                echo "<p>✅ Manual connection successful!</p>";
                $manual_db->close();
            }
        } catch (Exception $e) {
            echo "<p>❌ Manual connection exception: " . $e->getMessage() . "</p>";
        }
    }
} catch (Exception $e) {
    echo "<p>❌ Config error: " . $e->getMessage() . "</p>";
}

// Test 3: Session functionality
try {
    session_start();
    echo "<p>✅ Session started successfully</p>";
} catch (Exception $e) {
    echo "<p>❌ Session error: " . $e->getMessage() . "</p>";
}

echo "<h3>Environment Info:</h3>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>Current directory: " . __DIR__ . "</p>";
echo "<p>Document root: " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
?>
