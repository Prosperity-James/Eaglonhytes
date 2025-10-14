<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Database Connection Test</h2>";

// Database credentials
$host = '127.0.0.1';
$user = 'root';
$pass = '';

echo "<p>Testing connection to MySQL server...</p>";

try {
    // Connect without specifying database first
    $conn = new mysqli($host, $user, $pass);
    
    if ($conn->connect_errno) {
        echo "<p>❌ Failed to connect to MySQL: " . $conn->connect_error . "</p>";
        exit;
    }
    
    echo "<p>✅ Connected to MySQL server successfully!</p>";
    
    // Check if eaglonhytes database exists
    $result = $conn->query("SHOW DATABASES LIKE 'eaglonhytes'");
    
    if ($result && $result->num_rows > 0) {
        echo "<p>✅ Database 'eaglonhytes' exists</p>";
        
        // Try to connect to the specific database
        $conn->select_db('eaglonhytes');
        echo "<p>✅ Connected to 'eaglonhytes' database</p>";
        
        // Check for required tables
        $tables = ['users', 'lands', 'story_content', 'carousel_images'];
        echo "<p><strong>Checking tables:</strong></p>";
        
        foreach ($tables as $table) {
            $result = $conn->query("SHOW TABLES LIKE '$table'");
            if ($result && $result->num_rows > 0) {
                echo "<p>✅ Table '$table' exists</p>";
            } else {
                echo "<p>❌ Table '$table' missing</p>";
            }
        }
        
    } else {
        echo "<p>❌ Database 'eaglonhytes' does not exist!</p>";
        echo "<p><strong>Available databases:</strong></p>";
        
        $result = $conn->query("SHOW DATABASES");
        while ($row = $result->fetch_assoc()) {
            echo "<p>- " . $row['Database'] . "</p>";
        }
        
        echo "<p><strong>Solution:</strong> Create the database by running:</p>";
        echo "<p><code>CREATE DATABASE eaglonhytes;</code></p>";
        echo "<p>Or import the database schema from the SQL files.</p>";
    }
    
    $conn->close();
    
} catch (Exception $e) {
    echo "<p>❌ Exception: " . $e->getMessage() . "</p>";
}

echo "<h3>Next Steps:</h3>";
echo "<p>1. If database doesn't exist, create it</p>";
echo "<p>2. Import the schema: <code>mysql -u root -p eaglonhytes < database/land_selling_database.sql</code></p>";
echo "<p>3. Add content management tables: <code>mysql -u root -p eaglonhytes < database/add_content_management_tables.sql</code></p>";
?>
