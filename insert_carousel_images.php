<?php
/**
 * Insert 5 Default Carousel Images
 */

require_once __DIR__ . '/api/config.php';

if (!$db) {
    die("Database connection failed");
}

echo "<h2>Inserting 5 Carousel Images</h2>";

// Delete existing carousel images first
$db->query("DELETE FROM carousel_images");
echo "<p>✓ Cleared existing carousel images</p>";

// Insert 5 new carousel images
$carouselImages = [
    [1, 'Welcome to Eaglonhytes', 'Your trusted real estate partner', '/assets/placeholder-carousel-1.jpg', 'View Lands', '/lands', 1],
    [2, 'Premium Land Properties', 'Secure your investment with us', '/assets/placeholder-carousel-2.jpg', 'Browse Properties', '/lands', 2],
    [3, 'Building Materials Supply', 'Quality materials for your projects', '/assets/placeholder-carousel-3.jpg', 'Shop Materials', '/contact', 3],
    [4, 'Trusted by Diaspora', 'Building dreams across continents', '/assets/placeholder-carousel-4.jpg', 'Learn More', '/about', 4],
    [5, 'Expert Consultation', 'Professional guidance every step', '/assets/placeholder-carousel-5.jpg', 'Contact Us', '/contact', 5]
];

$sql = "INSERT INTO carousel_images (id, title, subtitle, image_url, button_text, button_link, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $db->prepare($sql);

foreach ($carouselImages as $image) {
    $stmt->bind_param("isssssi", $image[0], $image[1], $image[2], $image[3], $image[4], $image[5], $image[6]);
    if ($stmt->execute()) {
        echo "<p>✓ Added: {$image[1]}</p>";
    } else {
        echo "<p>✗ Failed to add: {$image[1]}</p>";
    }
}

$stmt->close();

// Verify the count
$result = $db->query("SELECT COUNT(*) as count FROM carousel_images");
$count = $result->fetch_assoc()['count'];

echo "<h3>Setup Complete!</h3>";
echo "<p><strong>Total carousel images: $count</strong></p>";
echo "<p><a href='/Eaglonhytes/frontend/'>Go to Application</a></p>";

$db->close();
?>
