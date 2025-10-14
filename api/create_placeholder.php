<?php
/**
 * Simple placeholder image generator for land listings
 * Creates basic colored rectangles with text as placeholder images
 */

function createPlaceholderImage($width = 400, $height = 300, $text = 'Land Property', $filename = null) {
    // Create image
    $image = imagecreate($width, $height);
    
    // Define colors
    $bg_color = imagecolorallocate($image, 240, 240, 240); // Light gray background
    $text_color = imagecolorallocate($image, 100, 100, 100); // Dark gray text
    $border_color = imagecolorallocate($image, 200, 200, 200); // Border color
    
    // Fill background
    imagefill($image, 0, 0, $bg_color);
    
    // Add border
    imagerectangle($image, 0, 0, $width-1, $height-1, $border_color);
    
    // Add text
    $font_size = 5;
    $text_width = imagefontwidth($font_size) * strlen($text);
    $text_height = imagefontheight($font_size);
    $x = ($width - $text_width) / 2;
    $y = ($height - $text_height) / 2;
    
    imagestring($image, $font_size, $x, $y, $text, $text_color);
    
    // Add dimensions text
    $dim_text = $width . 'x' . $height;
    $dim_width = imagefontwidth(3) * strlen($dim_text);
    $dim_x = ($width - $dim_width) / 2;
    $dim_y = $y + $text_height + 10;
    imagestring($image, 3, $dim_x, $dim_y, $dim_text, $text_color);
    
    // Save image
    if ($filename) {
        imagepng($image, $filename);
        echo "Created placeholder: $filename\n";
    }
    
    // Clean up
    imagedestroy($image);
    
    return $filename;
}

// Create placeholder images directory
$placeholder_dir = __DIR__ . '/uploads/placeholders/';
if (!file_exists($placeholder_dir)) {
    mkdir($placeholder_dir, 0755, true);
}

// Create different placeholder images
$placeholders = [
    'land-default.png' => 'Land Property',
    'residential-land.png' => 'Residential Land',
    'commercial-land.png' => 'Commercial Land', 
    'industrial-land.png' => 'Industrial Land',
    'agricultural-land.png' => 'Agricultural Land'
];

foreach ($placeholders as $filename => $text) {
    $filepath = $placeholder_dir . $filename;
    createPlaceholderImage(400, 300, $text, $filepath);
}

echo "All placeholder images created successfully!\n";
echo "Placeholder directory: $placeholder_dir\n";
?>
