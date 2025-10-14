<?php
// Debug content_posts.php 500 error
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>🔍 Debugging content_posts.php</h2>";

try {
    echo "<h3>Step 1: Testing Database Connection</h3>";
    require_once 'api/config.php';
    echo "✅ Config loaded successfully<br>";
    
    if (isset($pdo)) {
        echo "✅ PDO connection exists<br>";
        
        // Test basic query
        $stmt = $pdo->query("SELECT 1");
        echo "✅ Database query works<br>";
    } else {
        echo "❌ PDO connection not found<br>";
    }
    
    echo "<h3>Step 2: Testing Table Existence</h3>";
    $tableCheck = $pdo->query("SHOW TABLES LIKE 'content_posts'");
    if ($tableCheck->rowCount() > 0) {
        echo "✅ content_posts table exists<br>";
        
        // Show table structure
        $structure = $pdo->query("DESCRIBE content_posts");
        echo "<h4>Table Structure:</h4>";
        echo "<table border='1' style='border-collapse: collapse;'>";
        echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th></tr>";
        while ($row = $structure->fetch()) {
            echo "<tr>";
            echo "<td>{$row['Field']}</td>";
            echo "<td>{$row['Type']}</td>";
            echo "<td>{$row['Null']}</td>";
            echo "<td>{$row['Key']}</td>";
            echo "<td>{$row['Default']}</td>";
            echo "</tr>";
        }
        echo "</table>";
        
        // Count records
        $count = $pdo->query("SELECT COUNT(*) as count FROM content_posts")->fetch();
        echo "<p>Records in table: {$count['count']}</p>";
        
    } else {
        echo "❌ content_posts table does not exist<br>";
        echo "<p><strong>Solution:</strong> Run the setup script first!</p>";
    }
    
    echo "<h3>Step 3: Testing API Includes</h3>";
    
    // Test session config
    if (file_exists('api/session_config.php')) {
        echo "✅ session_config.php exists<br>";
    } else {
        echo "❌ session_config.php missing<br>";
    }
    
    // Test CORS headers
    if (file_exists('api/cors_headers.php')) {
        echo "✅ cors_headers.php exists<br>";
    } else {
        echo "❌ cors_headers.php missing<br>";
    }
    
    echo "<h3>Step 4: Simulating API Call</h3>";
    
    // Simulate the API logic
    $category = '';
    $status = 'published';
    $featured = '';
    $limit = 10;
    $offset = 0;
    
    $sql = "SELECT cp.*, u.full_name as author_name 
            FROM content_posts cp 
            LEFT JOIN users u ON cp.author_id = u.id 
            WHERE 1=1";
    $params = [];
    
    if ($status) {
        $sql .= " AND cp.status = ?";
        $params[] = $status;
    }
    
    $sql .= " ORDER BY cp.created_at DESC LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    
    echo "<p><strong>SQL Query:</strong> $sql</p>";
    echo "<p><strong>Parameters:</strong> " . implode(', ', $params) . "</p>";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<p>✅ Query executed successfully</p>";
    echo "<p>Found " . count($posts) . " posts</p>";
    
    if (!empty($posts)) {
        echo "<h4>Sample Post:</h4>";
        echo "<pre>" . print_r($posts[0], true) . "</pre>";
    }
    
    // Test JSON encoding
    $response = [
        'success' => true,
        'data' => $posts,
        'pagination' => [
            'total' => count($posts),
            'limit' => $limit,
            'offset' => $offset,
            'has_more' => false
        ]
    ];
    
    $json = json_encode($response);
    if ($json === false) {
        echo "❌ JSON encoding failed: " . json_last_error_msg() . "<br>";
    } else {
        echo "✅ JSON encoding successful<br>";
        echo "<p>Response size: " . strlen($json) . " bytes</p>";
    }
    
} catch (Exception $e) {
    echo "<h3>❌ Error Found:</h3>";
    echo "<p style='color: red; background: #ffe6e6; padding: 10px; border-radius: 5px;'>";
    echo "<strong>Error:</strong> " . $e->getMessage() . "<br>";
    echo "<strong>File:</strong> " . $e->getFile() . "<br>";
    echo "<strong>Line:</strong> " . $e->getLine() . "<br>";
    echo "</p>";
    
    echo "<h4>Stack Trace:</h4>";
    echo "<pre style='background: #f5f5f5; padding: 10px; border-radius: 5px;'>";
    echo $e->getTraceAsString();
    echo "</pre>";
}

echo "<h3>📋 Next Steps:</h3>";
echo "<ol>";
echo "<li>If table doesn't exist: Run <a href='clear_rate_limit.php'>clear_rate_limit.php</a> then <a href='setup_content.php'>setup_content.php</a></li>";
echo "<li>If other errors: Check the error details above</li>";
echo "<li>Delete this debug file after use</li>";
echo "</ol>";
?>
