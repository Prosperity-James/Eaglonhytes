<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>🚀 Eaglonhytes Database Setup</h2>";

// Database credentials
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$dbname = 'eaglonhytes';

try {
    // Connect to MySQL server
    $conn = new mysqli($host, $user, $pass);
    
    if ($conn->connect_errno) {
        throw new Exception("Failed to connect to MySQL: " . $conn->connect_error);
    }
    
    echo "<p>✅ Connected to MySQL server</p>";
    
    // Create database if it doesn't exist
    $result = $conn->query("CREATE DATABASE IF NOT EXISTS `$dbname`");
    if ($result) {
        echo "<p>✅ Database '$dbname' created/verified</p>";
    } else {
        throw new Exception("Failed to create database: " . $conn->error);
    }
    
    // Select the database
    $conn->select_db($dbname);
    echo "<p>✅ Selected database '$dbname'</p>";
    
    // Check if main tables exist
    $tables_exist = true;
    $required_tables = ['users', 'lands', 'land_applications'];
    
    foreach ($required_tables as $table) {
        $result = $conn->query("SHOW TABLES LIKE '$table'");
        if (!$result || $result->num_rows == 0) {
            $tables_exist = false;
            break;
        }
    }
    
    if (!$tables_exist) {
        echo "<p>⚠️ Main tables missing. You need to import the database schema.</p>";
        echo "<p><strong>Run these commands in Command Prompt:</strong></p>";
        echo "<pre>";
        echo "cd \"C:\\Users\\HP\\OneDrive\\Desktop\\Xampp\\htdocs\\Eaglonhytes-main\"\n";
        echo "\"C:\\xampp\\mysql\\bin\\mysql.exe\" -u root -p $dbname < database\\land_selling_database.sql\n";
        echo "\"C:\\xampp\\mysql\\bin\\mysql.exe\" -u root -p $dbname < database\\add_content_management_tables.sql\n";
        echo "</pre>";
        echo "<p><strong>Or use phpMyAdmin:</strong></p>";
        echo "<p>1. Go to <a href='http://localhost/phpmyadmin' target='_blank'>phpMyAdmin</a></p>";
        echo "<p>2. Select '$dbname' database</p>";
        echo "<p>3. Click 'Import' tab</p>";
        echo "<p>4. Upload and import 'land_selling_database.sql'</p>";
        echo "<p>5. Upload and import 'add_content_management_tables.sql'</p>";
    } else {
        echo "<p>✅ Main tables exist</p>";
        
        // Check for content management tables
        $cms_tables = ['story_content', 'carousel_images'];
        $cms_exists = true;
        
        foreach ($cms_tables as $table) {
            $result = $conn->query("SHOW TABLES LIKE '$table'");
            if (!$result || $result->num_rows == 0) {
                $cms_exists = false;
                echo "<p>⚠️ Content management table '$table' missing</p>";
            } else {
                echo "<p>✅ Table '$table' exists</p>";
            }
        }
        
        if (!$cms_exists) {
            echo "<p><strong>To add content management:</strong></p>";
            echo "<pre>\"C:\\xampp\\mysql\\bin\\mysql.exe\" -u root -p $dbname < database\\add_content_management_tables.sql</pre>";
        }
        
        // Test a simple query
        $result = $conn->query("SELECT COUNT(*) as count FROM users");
        if ($result) {
            $row = $result->fetch_assoc();
            echo "<p>✅ Database is working - Found {$row['count']} users</p>";
        }
    }
    
    $conn->close();
    
    echo "<h3>🎯 Next Steps:</h3>";
    echo "<p>1. If tables are missing, import the SQL files as shown above</p>";
    echo "<p>2. Restart your Vite dev server: <code>npm run dev</code></p>";
    echo "<p>3. Test the application at <a href='http://localhost:5173'>http://localhost:5173</a></p>";
    
} catch (Exception $e) {
    echo "<p>❌ Error: " . $e->getMessage() . "</p>";
}
?>
