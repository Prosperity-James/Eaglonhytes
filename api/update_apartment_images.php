// This file has been removed as it is no longer needed for land and properties only.
<?php
require_once __DIR__ . "/config.php";

// Update apartments with real uploaded image filenames
$uploaded_images = [
    "apartments/1757098671_68bb32afc064b.jpg",
    "apartments/1757098690_68bb32c2bf3eb.jpg", 
    "apartments/1757098698_68bb32cad32bf.jpg"
];

// Update apartment 1
$sql = "UPDATE apartments SET images = ? WHERE id = 1";
$stmt = $db->prepare($sql);
$images_json = json_encode([$uploaded_images[0]]);
$stmt->bind_param("s", $images_json);
$stmt->execute();
echo "Updated apartment 1 with image: " . $uploaded_images[0] . "\n";

// Update apartment 2
$sql = "UPDATE apartments SET images = ? WHERE id = 2";
$stmt = $db->prepare($sql);
$images_json = json_encode([$uploaded_images[1]]);
$stmt->bind_param("s", $images_json);
$stmt->execute();
echo "Updated apartment 2 with image: " . $uploaded_images[1] . "\n";

// Update apartment 3
$sql = "UPDATE apartments SET images = ? WHERE id = 3";
$stmt = $db->prepare($sql);
$images_json = json_encode([$uploaded_images[2]]);
$stmt->bind_param("s", $images_json);
$stmt->execute();
echo "Updated apartment 3 with image: " . $uploaded_images[2] . "\n";

echo "Database updated successfully!";
?>
