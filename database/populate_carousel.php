<?php
require_once __DIR__ . "/../api/config.php";

echo "Populating carousel images...\n\n";

// Create table if it doesn't exist
$createTableSQL = "
    CREATE TABLE IF NOT EXISTS carousel_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255) NULL,
        image_url VARCHAR(500) NOT NULL,
        link_url VARCHAR(500) NULL,
        display_order INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
";

if ($db->query($createTableSQL)) {
    echo "✓ Carousel images table created/verified\n\n";
} else {
    echo "✗ Error creating table: " . $db->error . "\n";
    exit;
}

// Check if carousel images already exist
$checkSQL = "SELECT COUNT(*) as count FROM carousel_images";
$result = $db->query($checkSQL);
$row = $result->fetch_assoc();

if ($row['count'] > 0) {
    echo "Carousel images already exist ({$row['count']} images found).\n";
    echo "Do you want to clear and repopulate? (y/n): ";
    $handle = fopen("php://stdin", "r");
    $line = fgets($handle);
    if (trim($line) != 'y') {
        echo "Aborted.\n";
        exit;
    }
    $db->query("DELETE FROM carousel_images");
    echo "✓ Cleared existing carousel images\n\n";
}

// Default carousel images
$carouselImages = [
    [
        'title' => 'Modern Building Materials',
        'subtitle' => 'High-quality construction materials for your dream home',
        'image_url' => 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&h=800&fit=crop',
        'link_url' => '/lands',
        'display_order' => 1
    ],
    [
        'title' => 'Secure Neighborhoods',
        'subtitle' => 'Your safety is our priority - Gated communities with 24/7 security',
        'image_url' => 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&h=800&fit=crop',
        'link_url' => '/lands',
        'display_order' => 2
    ],
    [
        'title' => 'Prime Locations',
        'subtitle' => 'Strategic locations in Abuja with excellent infrastructure',
        'image_url' => 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&h=800&fit=crop',
        'link_url' => '/lands',
        'display_order' => 3
    ],
    [
        'title' => 'Flexible Payment Plans',
        'subtitle' => 'Own your dream property with our affordable payment options',
        'image_url' => 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&h=800&fit=crop',
        'link_url' => '/lands',
        'display_order' => 4
    ]
];

$stmt = $db->prepare("INSERT INTO carousel_images (title, subtitle, image_url, link_url, display_order, is_active) VALUES (?, ?, ?, ?, ?, 1)");

$added = 0;
foreach ($carouselImages as $image) {
    $stmt->bind_param('ssssi', 
        $image['title'], 
        $image['subtitle'], 
        $image['image_url'], 
        $image['link_url'], 
        $image['display_order']
    );
    
    if ($stmt->execute()) {
        echo "✓ Added: {$image['title']}\n";
        $added++;
    } else {
        echo "✗ Failed to add: {$image['title']} - " . $stmt->error . "\n";
    }
}

$stmt->close();

echo "\n========================================\n";
echo "Summary:\n";
echo "- Total carousel images added: $added\n";
echo "- All images are set to active\n";
echo "- Images ordered by display_order\n";
echo "========================================\n";
echo "\nCarousel images populated successfully!\n";
echo "You can now manage them through the admin dashboard.\n";
?>
