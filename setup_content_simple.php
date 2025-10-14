<?php
// Simple content management setup
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>🛠️ Content Management Setup</h2>";

try {
    require_once 'api/config.php';
    
    echo "<p>✅ Database connected</p>";
    
    // Check if table exists
    $tableCheck = $pdo->query("SHOW TABLES LIKE 'content_posts'");
    
    if ($tableCheck->rowCount() > 0) {
        echo "<p>✅ content_posts table already exists</p>";
    } else {
        echo "<p>🔧 Creating content_posts table...</p>";
        
        // Create table
        $sql = "
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
        )";
        
        $pdo->exec($sql);
        echo "<p>✅ Table created successfully</p>";
        
        // Add sample data
        $samplePosts = [
            [
                'title' => 'Welcome to Eaglonhytes Properties',
                'content' => 'We are excited to announce the launch of our new property management platform. Discover premium lands and apartments with modern amenities and excellent locations.',
                'excerpt' => 'Announcing the launch of our new property platform.',
                'category' => 'company_updates',
                'status' => 'published',
                'featured' => 1,
                'tags' => 'announcement,launch,properties',
                'slug' => 'welcome-to-eaglonhytes'
            ],
            [
                'title' => 'New Premium Lands Available',
                'content' => 'We have just added several premium land plots in prime locations. These properties offer excellent investment opportunities.',
                'excerpt' => 'Premium land plots now available with excellent ROI potential.',
                'category' => 'new_lands',
                'status' => 'published',
                'featured' => 1,
                'tags' => 'premium,investment,lands',
                'slug' => 'new-premium-lands-available'
            ]
        ];
        
        $insertSql = "INSERT INTO content_posts (title, content, excerpt, category, status, featured, media_items, tags, slug, author_id, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        $stmt = $pdo->prepare($insertSql);
        
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
    }
    
    // Test the API endpoint
    echo "<h3>🧪 Testing API Endpoint</h3>";
    
    $testUrl = 'http://localhost/Eaglonhytes-main/api/content_posts.php';
    echo "<p>Testing: <a href='$testUrl' target='_blank'>$testUrl</a></p>";
    
    // Test query
    $posts = $pdo->query("SELECT * FROM content_posts ORDER BY created_at DESC LIMIT 5")->fetchAll();
    echo "<p>✅ Found " . count($posts) . " posts in database</p>";
    
    if (!empty($posts)) {
        echo "<h4>Sample Posts:</h4>";
        echo "<ul>";
        foreach ($posts as $post) {
            echo "<li><strong>{$post['title']}</strong> - {$post['category']} - {$post['status']}</li>";
        }
        echo "</ul>";
    }
    
    echo "<div style='background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;'>";
    echo "<h3>✅ Setup Complete!</h3>";
    echo "<p><strong>Next Steps:</strong></p>";
    echo "<ol>";
    echo "<li>Go back to your admin dashboard</li>";
    echo "<li>Navigate to 'News & Updates' section</li>";
    echo "<li>The content management should now work</li>";
    echo "<li>Delete this setup file</li>";
    echo "</ol>";
    echo "</div>";
    
} catch (Exception $e) {
    echo "<div style='background: #ffe6e6; padding: 15px; border-radius: 5px; margin: 20px 0;'>";
    echo "<h3>❌ Error:</h3>";
    echo "<p><strong>Message:</strong> " . $e->getMessage() . "</p>";
    echo "<p><strong>File:</strong> " . $e->getFile() . "</p>";
    echo "<p><strong>Line:</strong> " . $e->getLine() . "</p>";
    echo "</div>";
}

echo "<p style='color: red; font-weight: bold;'>⚠️ Delete this file after setup is complete!</p>";
?>
