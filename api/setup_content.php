<?php
// Setup content management table
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

ob_start();

try {
    require_once __DIR__ . "/cors_headers.php";
    require_once __DIR__ . "/session_config.php";
    session_start();
    require_once __DIR__ . "/config.php";
    
    ob_clean();
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    
    // Disable any HTML output buffering or injection
    if (function_exists('apache_setenv')) {
        apache_setenv('no-gzip', '1');
    }
    ini_set('zlib.output_compression', 'Off');

    // Check if user is admin
    if (!isset($_SESSION['user']) || ($_SESSION['user']['role'] !== 'admin' && $_SESSION['user']['role'] !== 'super_admin')) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Admin privileges required']);
        exit;
    }

    // Check if table already exists
    $tableCheck = $pdo->query("SHOW TABLES LIKE 'content_posts'");
    if ($tableCheck->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Content management table already exists',
            'already_exists' => true
        ]);
        exit;
    }

    // Create the table
    $sql = "
    CREATE TABLE IF NOT EXISTS content_posts (
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
        INDEX idx_slug (slug),
        
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
    );
    ";

    $pdo->exec($sql);

    // Insert sample content
    $sampleData = [
        [
            'title' => 'Welcome to Eaglonhytes Properties',
            'content' => 'We are excited to announce the launch of our new property management platform. Discover premium lands and apartments with modern amenities and excellent locations.',
            'excerpt' => 'Announcing the launch of our new property platform with premium locations.',
            'category' => 'company_updates',
            'status' => 'published',
            'featured' => 1,
            'tags' => 'announcement,launch,properties',
            'slug' => 'welcome-to-eaglonhytes'
        ],
        [
            'title' => 'New Premium Lands Available in Victoria Island',
            'content' => 'We have just added several premium land plots in the heart of Victoria Island, Lagos. These properties offer excellent investment opportunities with great potential for appreciation.',
            'excerpt' => 'Premium land plots now available in Victoria Island with excellent ROI potential.',
            'category' => 'new_lands',
            'status' => 'published',
            'featured' => 1,
            'tags' => 'victoria island,premium,investment',
            'slug' => 'new-premium-lands-victoria-island'
        ],
        [
            'title' => 'Market Trends: Real Estate in Lagos 2024',
            'content' => 'The Lagos real estate market continues to show strong growth in 2024. Our analysis shows key trends that investors should be aware of when making property decisions.',
            'excerpt' => 'Key real estate market trends and insights for Lagos property investors in 2024.',
            'category' => 'market_insights',
            'status' => 'published',
            'featured' => 0,
            'tags' => 'market trends,lagos,2024,investment',
            'slug' => 'market-trends-lagos-2024'
        ]
    ];

    $insertSql = "INSERT INTO content_posts (title, content, excerpt, category, status, featured, media_items, tags, slug, author_id, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    $stmt = $pdo->prepare($insertSql);

    foreach ($sampleData as $data) {
        $stmt->execute([
            $data['title'],
            $data['content'],
            $data['excerpt'],
            $data['category'],
            $data['status'],
            $data['featured'],
            '[]', // Empty media items
            $data['tags'],
            $data['slug'],
            $_SESSION['user']['id']
        ]);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Content management table created successfully with sample data',
        'sample_posts_created' => count($sampleData)
    ]);

} catch (Exception $e) {
    ob_clean();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Setup failed: ' . $e->getMessage()
    ]);
}

ob_end_flush();
?>
