<?php
// This script is for initial database population only
// Run once to populate the lands table with sample data
require_once 'config.php';

// Clear existing data first
$db->query("DELETE FROM lands");
$db->query("ALTER TABLE lands AUTO_INCREMENT = 1");

// Insert dummy data
$lands_data = [
    [
        'id' => 1,
        'title' => 'Prime Residential Land - Gwarinpa',
        'description' => 'Beautiful residential plot in the heart of Gwarinpa with C of O',
        'address' => 'Gwarinpa District',
        'city' => 'Gwarinpa',
        'state' => 'Abuja',
        'zip_code' => '900001',
        'price' => 15000000.00,
        'size' => '600 sqm',
        'land_type' => 'residential',
        'images' => '["data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2U4ZjVlOCIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9IjIiLz4KICAgICAgPHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzJkNWEyZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+CiAgICAgICAgUmVzaWRlbnRpYWwgTGFuZAogICAgICA8L3RleHQ+CiAgICAgIDx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMyZDVhMmQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPgogICAgICAgIDQwMCDDlyAzMDAKICAgICAgPC90ZXh0PgogICAgPC9zdmc+"]',
        'features' => 'C of O Available, Fenced, Good Road Access, Electricity',
        'documents' => '["Certificate of Occupancy", "Survey Plan", "Deed of Assignment"]',
        'status' => 'available',
        'featured' => 1,
        'views_count' => 0,
        'whatsapp_contact' => '+2348123456789',
        'created_by' => 1
    ],
    [
        'id' => 2,
        'title' => 'Commercial Land - Wuse 2',
        'description' => 'Strategic commercial land perfect for office complex or shopping mall',
        'address' => 'Wuse 2 District',
        'city' => 'Wuse 2',
        'state' => 'Abuja',
        'zip_code' => '900002',
        'price' => 45000000.00,
        'size' => '800 sqm',
        'land_type' => 'commercial',
        'images' => '["data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2U4ZjBmZiIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9IjIiLz4KICAgICAgPHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzFhMzY1ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+CiAgICAgICAgQ29tbWVyY2lhbCBMYW5kCiAgICAgIDwvdGV4dD4KICAgICAgPHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzFhMzY1ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+CiAgICAgICAgNDAwIMOXIDMwMAogICAgICA8L3RleHQ+CiAgICA8L3N2Zz4="]',
        'features' => 'Commercial Zone, Corner Piece, High Traffic Area, Utilities Available',
        'documents' => '["Survey Plan", "Building Approval", "Environmental Impact Assessment"]',
        'status' => 'available',
        'featured' => 1,
        'views_count' => 0,
        'whatsapp_contact' => '+2348123456790',
        'created_by' => 1
    ],
    [
        'id' => 3,
        'title' => 'Luxury Estate Plot - Asokoro',
        'description' => 'Exclusive plot in premium Asokoro district with panoramic city views',
        'address' => 'Asokoro District',
        'city' => 'Asokoro',
        'state' => 'Abuja',
        'zip_code' => '900003',
        'price' => 75000000.00,
        'size' => '1000 sqm',
        'land_type' => 'residential',
        'images' => '["data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2U4ZjVlOCIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9IjIiLz4KICAgICAgPHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzJkNWEyZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+CiAgICAgICAgUmVzaWRlbnRpYWwgTGFuZAogICAgICA8L3RleHQ+CiAgICAgIDx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMyZDVhMmQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPgogICAgICAgIDQwMCDDlyAzMDAKICAgICAgPC90ZXh0PgogICAgPC9zdmc+"]',
        'features' => 'Premium Location, Gated Estate, Security, Landscaped',
        'documents' => '["Certificate of Occupancy", "Survey Plan", "Estate Covenant"]',
        'status' => 'available',
        'featured' => 1,
        'views_count' => 0,
        'whatsapp_contact' => '+2348123456791',
        'created_by' => 1
    ],
    [
        'id' => 4,
        'title' => 'Affordable Housing Plot - Lugbe',
        'description' => 'Perfect for first-time home builders in developing Lugbe area',
        'address' => 'Lugbe District',
        'city' => 'Lugbe',
        'state' => 'Abuja',
        'zip_code' => '900004',
        'price' => 8500000.00,
        'size' => '450 sqm',
        'land_type' => 'residential',
        'images' => '["data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2U4ZjVlOCIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9IjIiLz4KICAgICAgPHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzJkNWEyZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+CiAgICAgICAgUmVzaWRlbnRpYWwgTGFuZAogICAgICA8L3RleHQ+CiAgICAgIDx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMyZDVhMmQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPgogICAgICAgIDQwMCDDlyAzMDAKICAgICAgPC90ZXh0PgogICAgPC9zdmc+"]',
        'features' => 'Affordable, Growing Area, Good Investment, Easy Payment Plan',
        'documents' => '["Survey Plan", "Allocation Letter", "Development Permit"]',
        'status' => 'available',
        'featured' => 0,
        'views_count' => 0,
        'whatsapp_contact' => '+2348123456792',
        'created_by' => 1
    ],
    [
        'id' => 5,
        'title' => 'Industrial Land - Idu',
        'description' => 'Large industrial plot suitable for manufacturing or warehousing',
        'address' => 'Idu Industrial Area',
        'city' => 'Idu',
        'state' => 'Abuja',
        'zip_code' => '900005',
        'price' => 25000000.00,
        'size' => '1200 sqm',
        'land_type' => 'industrial',
        'images' => '["data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmZjVlOCIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9IjIiLz4KICAgICAgPHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzc0NDIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+CiAgICAgICAgSW5kdXN0cmlhbCBMYW5kCiAgICAgIDwvdGV4dD4KICAgICAgPHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzc0NDIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+CiAgICAgICAgNDAwIMOXIDMwMAogICAgICA8L3RleHQ+CiAgICA8L3N2Zz4="]',
        'features' => 'Industrial Zone, Large Size, Good for Business, Transport Links',
        'documents' => '["Industrial Layout Approval", "Environmental Clearance", "Survey Plan"]',
        'status' => 'available',
        'featured' => 0,
        'views_count' => 0,
        'whatsapp_contact' => '+2348123456793',
        'created_by' => 1
    ],
    [
        'id' => 6,
        'title' => 'Waterfront Land - Jabi Lake',
        'description' => 'Rare waterfront property with stunning lake views and premium location',
        'address' => 'Jabi Lake Area',
        'city' => 'Jabi',
        'state' => 'Abuja',
        'zip_code' => '900006',
        'price' => 95000000.00,
        'size' => '750 sqm',
        'land_type' => 'residential',
        'images' => '["data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2U4ZjVlOCIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9IjIiLz4KICAgICAgPHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzJkNWEyZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+CiAgICAgICAgUmVzaWRlbnRpYWwgTGFuZAogICAgICA8L3RleHQ+CiAgICAgIDx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMyZDVhMmQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPgogICAgICAgIDQwMCDDlyAzMDAKICAgICAgPC90ZXh0PgogICAgPC9zdmc+"]',
        'features' => 'Waterfront, Lake View, Exclusive, High Appreciation',
        'documents' => '["Certificate of Occupancy", "Waterfront Permit", "Environmental Clearance"]',
        'status' => 'sold',
        'featured' => 1,
        'views_count' => 15,
        'whatsapp_contact' => '+2348123456794',
        'created_by' => 1
    ]
];

$sql = "INSERT INTO lands (
    id, title, description, address, city, state, zip_code, price, size, 
    land_type, images, features, documents, status, featured, views_count, 
    whatsapp_contact, created_by, created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

$stmt = $db->prepare($sql);

$success_count = 0;
foreach ($lands_data as $land) {
    $stmt->bind_param(
        "issssssdssssssiiis",
        $land['id'],
        $land['title'],
        $land['description'],
        $land['address'],
        $land['city'],
        $land['state'],
        $land['zip_code'],
        $land['price'],
        $land['size'],
        $land['land_type'],
        $land['images'],
        $land['features'],
        $land['documents'],
        $land['status'],
        $land['featured'],
        $land['views_count'],
        $land['whatsapp_contact'],
        $land['created_by']
    );
    
    if ($stmt->execute()) {
        $success_count++;
    } else {
        echo "Error inserting land {$land['id']}: " . $stmt->error . "\n";
    }
}

$stmt->close();

echo "Successfully inserted $success_count lands into the database.\n";

// Verify the data
$result = $db->query("SELECT id, title, city, price, status FROM lands ORDER BY id");
echo "\nVerification - Lands in database:\n";
while ($row = $result->fetch_assoc()) {
    echo "ID: {$row['id']}, Title: {$row['title']}, City: {$row['city']}, Price: ₦" . number_format($row['price']) . ", Status: {$row['status']}\n";
}

$db->close();
?>
