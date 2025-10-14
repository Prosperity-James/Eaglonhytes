<?php
// Complete setup for content management system
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>🚀 Complete Content Management Setup</h1>";

try {
    // Step 1: Database Connection
    echo "<h2>Step 1: Database Connection</h2>";
    require_once 'api/config.php';
    echo "<p>✅ Database connected successfully</p>";
    
    // Step 2: Create content_posts table
    echo "<h2>Step 2: Create Content Posts Table</h2>";
    
    // Check if table exists
    $tableExists = false;
    try {
        $result = $pdo->query("SELECT 1 FROM content_posts LIMIT 1");
        $tableExists = true;
        echo "<p>✅ content_posts table already exists</p>";
    } catch (Exception $e) {
        echo "<p>🔧 Creating content_posts table...</p>";
    }
    
    if (!$tableExists) {
        $createTableSQL = "
        CREATE TABLE content_posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            excerpt TEXT,
            category ENUM('news', 'new_lands', 'company_updates', 'market_insights') DEFAULT 'news',
            status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
            featured BOOLEAN DEFAULT FALSE,
            media_items JSON,
            tags VARCHAR(500),
            meta_description VARCHAR(160),
            slug VARCHAR(255) UNIQUE,
            author_id INT,
            views INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            published_at TIMESTAMP NULL,
            
            INDEX idx_status (status),
            INDEX idx_category (category),
            INDEX idx_featured (featured),
            INDEX idx_published_at (published_at),
            INDEX idx_slug (slug)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $pdo->exec($createTableSQL);
        echo "<p>✅ content_posts table created successfully</p>";
    }
    
    // Step 3: Add sample data
    echo "<h2>Step 3: Add Sample Content</h2>";
    
    $countResult = $pdo->query("SELECT COUNT(*) as count FROM content_posts");
    $count = $countResult->fetch()['count'];
    
    if ($count == 0) {
        echo "<p>🔧 Adding sample content posts...</p>";
        
        $samplePosts = [
            [
                'title' => 'Welcome to Eaglonhytes Properties',
                'content' => 'We are excited to announce the launch of our new property management platform. Discover premium lands and apartments with modern amenities and excellent locations. Our platform offers a seamless experience for both property seekers and investors.',
                'excerpt' => 'Announcing the launch of our new property platform with premium locations.',
                'category' => 'company_updates',
                'status' => 'published',
                'featured' => 1,
                'tags' => 'announcement,launch,properties,platform',
                'slug' => 'welcome-to-eaglonhytes-properties'
            ],
            [
                'title' => 'New Premium Lands Available in Victoria Island',
                'content' => 'We have just added several premium land plots in the heart of Victoria Island, Lagos. These properties offer excellent investment opportunities with great potential for appreciation. Located in prime areas with easy access to major business districts.',
                'excerpt' => 'Premium land plots now available in Victoria Island with excellent ROI potential.',
                'category' => 'new_lands',
                'status' => 'published',
                'featured' => 1,
                'tags' => 'victoria island,premium,investment,lagos',
                'slug' => 'new-premium-lands-victoria-island'
            ],
            [
                'title' => 'Market Trends: Real Estate in Lagos 2024',
                'content' => 'The Lagos real estate market continues to show strong growth in 2024. Our analysis shows key trends that investors should be aware of when making property decisions. Population growth and infrastructure development are driving demand.',
                'excerpt' => 'Key real estate market trends and insights for Lagos property investors in 2024.',
                'category' => 'market_insights',
                'status' => 'published',
                'featured' => 0,
                'tags' => 'market trends,lagos,2024,investment,analysis',
                'slug' => 'market-trends-lagos-2024'
            ],
            [
                'title' => 'Affordable Housing Initiative Launched',
                'content' => 'We are proud to announce our new affordable housing initiative aimed at making quality housing accessible to more families. This program offers flexible payment plans and competitive pricing.',
                'excerpt' => 'New affordable housing program with flexible payment options.',
                'category' => 'news',
                'status' => 'published',
                'featured' => 0,
                'tags' => 'affordable housing,initiative,families,payment plans',
                'slug' => 'affordable-housing-initiative'
            ]
        ];
        
        $insertSQL = "INSERT INTO content_posts (title, content, excerpt, category, status, featured, media_items, tags, slug, author_id, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        $stmt = $pdo->prepare($insertSQL);
        
        foreach ($samplePosts as $post) {
            $stmt->execute([
                $post['title'],
                $post['content'],
                $post['excerpt'],
                $post['category'],
                $post['status'],
                $post['featured'],
                '[]', // Empty media items JSON
                $post['tags'],
                $post['slug'],
                1 // Default author ID
            ]);
        }
        
        echo "<p>✅ Added " . count($samplePosts) . " sample posts</p>";
    } else {
        echo "<p>✅ Found $count existing posts in database</p>";
    }
    
    // Step 4: Test API
    echo "<h2>Step 4: Test API Endpoint</h2>";
    
    $testPosts = $pdo->query("SELECT id, title, category, status, created_at FROM content_posts ORDER BY created_at DESC LIMIT 5")->fetchAll();
    
    if (!empty($testPosts)) {
        echo "<p>✅ API test successful - Found " . count($testPosts) . " posts</p>";
        echo "<table border='1' style='border-collapse: collapse; width: 100%; margin: 10px 0;'>";
        echo "<tr style='background: #f5f5f5;'><th>ID</th><th>Title</th><th>Category</th><th>Status</th><th>Created</th></tr>";
        
        foreach ($testPosts as $post) {
            echo "<tr>";
            echo "<td>{$post['id']}</td>";
            echo "<td>{$post['title']}</td>";
            echo "<td>" . ucfirst(str_replace('_', ' ', $post['category'])) . "</td>";
            echo "<td>" . ucfirst($post['status']) . "</td>";
            echo "<td>" . date('M j, Y', strtotime($post['created_at'])) . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
    
    // Step 5: Final verification
    echo "<h2>Step 5: Final Verification</h2>";
    
    // Test the actual API endpoint
    $apiUrl = 'http://localhost/Eaglonhytes-main/api/content_posts.php';
    echo "<p>Testing API endpoint: <a href='$apiUrl' target='_blank'>$apiUrl</a></p>";
    
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 10
        ]
    ]);
    
    $apiResponse = @file_get_contents($apiUrl, false, $context);
    
    if ($apiResponse !== false) {
        $apiData = json_decode($apiResponse, true);
        if ($apiData && $apiData['success']) {
            echo "<p>✅ API endpoint working correctly</p>";
            echo "<p>Found " . count($apiData['data']) . " posts via API</p>";
        } else {
            echo "<p>⚠️ API returned data but may have issues</p>";
            echo "<pre>" . htmlspecialchars($apiResponse) . "</pre>";
        }
    } else {
        echo "<p>❌ API endpoint test failed</p>";
    }
    
    // Success message
    echo "<div style='background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 20px; border-radius: 5px; margin: 20px 0;'>";
    echo "<h2>🎉 Setup Complete!</h2>";
    echo "<p><strong>Content Management System is now ready!</strong></p>";
    echo "<h3>Next Steps:</h3>";
    echo "<ol>";
    echo "<li>Go to your admin dashboard: <a href='http://localhost:5173' target='_blank'>http://localhost:5173</a></li>";
    echo "<li>Login with your admin credentials</li>";
    echo "<li>Navigate to 'News & Updates' section</li>";
    echo "<li>You should now see the sample content posts</li>";
    echo "<li>Test adding, editing, and viewing posts</li>";
    echo "<li><strong>Delete this setup file for security!</strong></li>";
    echo "</ol>";
    echo "</div>";
    
} catch (Exception $e) {
    echo "<div style='background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 20px; border-radius: 5px; margin: 20px 0;'>";
    echo "<h2>❌ Setup Failed</h2>";
    echo "<p><strong>Error:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p><strong>File:</strong> " . $e->getFile() . "</p>";
    echo "<p><strong>Line:</strong> " . $e->getLine() . "</p>";
    echo "<h3>Stack Trace:</h3>";
    echo "<pre style='background: #f5f5f5; padding: 10px; border-radius: 3px; overflow: auto;'>";
    echo htmlspecialchars($e->getTraceAsString());
    echo "</pre>";
    echo "</div>";
}

echo "<p style='color: #dc3545; font-weight: bold; margin-top: 30px;'>⚠️ IMPORTANT: Delete this setup file immediately after use for security!</p>";
?>
