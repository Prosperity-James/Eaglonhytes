<?php
// Suppress errors that might break JSON
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 0); // Don't display errors to browser
ini_set('log_errors', 1); // Log errors instead

require_once __DIR__ . "/config.php";
require_once __DIR__ . "/cors_headers.php";
require_once __DIR__ . "/auth_middleware.php";

// Helper function to create news posts for land activities
function createLandNewsPost($landData, $type = 'new_land', $oldStatus = null) {
    global $db, $pdo;
    
    try {
        // Check if content_posts table exists
        $tableCheck = $pdo->query("SHOW TABLES LIKE 'content_posts'");
        if ($tableCheck->rowCount() === 0) {
            return; // Skip if content management not set up
        }
        
        $title = '';
        $content = '';
        $excerpt = '';
        $category = 'new_lands';
        
        if ($type === 'new_land') {
            $title = "New Property Available: {$landData['title']}";
            $excerpt = "A new property has been added in {$landData['city']}, {$landData['state']}.";
            $content = "We're excited to announce a new property addition to our portfolio!\n\n";
            $content .= "**Property Details:**\n";
            $content .= "- **Location:** {$landData['address']}, {$landData['city']}, {$landData['state']}\n";
            $content .= "- **Price:** ₦" . number_format($landData['price']) . "\n";
            if (!empty($landData['size']) && $landData['size'] !== 'no_size') {
                $content .= "- **Size:** {$landData['size']} sqm\n";
            }
            $content .= "- **Type:** " . ucfirst(str_replace('_', ' ', $landData['land_type'] ?? 'residential')) . "\n";
            $content .= "- **Status:** " . ucfirst($landData['status']) . "\n\n";
            $content .= "This property offers excellent opportunities for investment or personal use. ";
            $content .= "Contact us today for more information or to schedule a viewing.\n\n";
            $content .= "For inquiries, reach out via WhatsApp: {$landData['whatsapp_contact']}";
            
        } elseif ($type === 'status_change') {
            $category = 'company_updates';
            $statusText = ucfirst($landData['status']);
            $title = "Property Status Update: {$landData['title']} - Now {$statusText}";
            $excerpt = "Status update for property in {$landData['city']}: {$oldStatus} → {$statusText}";
            $content = "**Property Status Update**\n\n";
            $content .= "We have an important update regarding one of our properties:\n\n";
            $content .= "**Property:** {$landData['title']}\n";
            $content .= "**Location:** {$landData['city']}, {$landData['state']}\n";
            $content .= "**Previous Status:** " . ucfirst($oldStatus) . "\n";
            $content .= "**New Status:** {$statusText}\n\n";
            
            if ($landData['status'] === 'available') {
                $content .= "Great news! This property is now available for purchase. ";
                $content .= "Don't miss this opportunity to secure your investment.\n\n";
                $content .= "**Price:** ₦" . number_format($landData['price']) . "\n";
                $content .= "Contact us immediately: {$landData['whatsapp_contact']}";
            } elseif ($landData['status'] === 'sold') {
                $content .= "This property has been successfully sold. ";
                $content .= "Thank you to our valued client for choosing Eaglonhytes Properties!\n\n";
                $content .= "We have many other excellent properties available. Contact us to explore more options.";
            } elseif ($landData['status'] === 'pending') {
                $content .= "This property is currently under negotiation. ";
                $content .= "If you're interested in similar properties, please contact us for alternatives.";
            }
        }
        
        // Generate slug
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', trim($title)));
        $slug = trim($slug, '-');
        
        // Check if slug exists and make it unique
        $slugCheck = $pdo->prepare("SELECT id FROM content_posts WHERE slug = ?");
        $slugCheck->execute([$slug]);
        if ($slugCheck->fetch()) {
            $slug .= '-' . time();
        }
        
        // Prepare media items from land images
        $mediaItems = [];
        if (!empty($landData['images'])) {
            $images = is_string($landData['images']) ? json_decode($landData['images'], true) : $landData['images'];
            if (is_array($images)) {
                foreach ($images as $index => $image) {
                    // Ensure proper URL format for images
                    $imageUrl = $image;
                    if (!empty($image) && !str_starts_with($image, 'http')) {
                        // If it's not a full URL, assume it's a relative path
                        $imageUrl = $image;
                    }
                    
                    $mediaItems[] = [
                        'type' => 'image',
                        'url' => $imageUrl,
                        'caption' => $landData['title'] . " - View " . ($index + 1),
                        'alt' => "Property image of " . $landData['title'] . " in " . $landData['city']
                    ];
                }
            }
        }
        
        // If no images available, add a placeholder or default property image
        if (empty($mediaItems)) {
            $mediaItems[] = [
                'type' => 'image',
                'url' => 'placeholder-property.jpg',
                'caption' => $landData['title'] . " - Property Image",
                'alt' => "Property image for " . $landData['title']
            ];
        }
        
        // Insert news post
        $sql = "INSERT INTO content_posts (title, content, excerpt, category, status, featured, media_items, tags, meta_description, slug, author_id, published_at, created_at) 
                VALUES (?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, 1, NOW(), NOW())";
        
        $tags = "property,land,{$landData['city']},{$landData['state']}," . str_replace('_', '-', $landData['land_type'] ?? 'residential');
        $metaDescription = substr($excerpt, 0, 160);
        $featured = ($type === 'new_land') ? 1 : 0; // Feature new land announcements
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $title,
            $content,
            $excerpt,
            $category,
            $featured,
            json_encode($mediaItems),
            $tags,
            $metaDescription,
            $slug,
            $_SESSION['user']['id'] ?? 1
        ]);
        
        return $pdo->lastInsertId();
        
    } catch (Exception $e) {
        error_log("Failed to create land news post: " . $e->getMessage());
        return false;
    }
}

// Ensure JSON content type and prevent HTML injection
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Disable any HTML output buffering or injection
if (function_exists('apache_setenv')) {
    apache_setenv('no-gzip', '1');
}
ini_set('zlib.output_compression', 'Off');
// Start session for authenticated endpoints (POST, PUT, DELETE)
$method = $_SERVER['REQUEST_METHOD'];
if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
    require_once __DIR__ . "/session_config.php";
    session_start();
}

try {
    $input = json_decode(file_get_contents('php://input'), true);

    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                getLand($_GET['id']);
            } else {
                getLands();
            }
            break;
        case 'POST':
            createLand($input);
            break;
        case 'PUT':
            if (isset($_GET['id'])) {
                updateLand($_GET['id'], $input);
            }
            break;
        case 'DELETE':
            if (isset($_GET['id'])) {
                deleteLand($_GET['id']);
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Fatal error: ' . $e->getMessage()]);
}

function getLands() {
    global $db;
    $status = $_GET['status'] ?? '';
    $city = $_GET['city'] ?? '';
    $min_price = $_GET['min_price'] ?? 0;
    $max_price = $_GET['max_price'] ?? 999999;
    
    $sql = "SELECT * FROM lands WHERE 1=1";
    $params = [];
    $types = "";
    
    // Only filter by status if specifically provided
    if (!empty($status)) {
        $sql .= " AND status = ?";
        $params[] = $status;
        $types .= "s";
    }
    if (!empty($city)) {
        $sql .= " AND city LIKE ?";
        $params[] = "%$city%";
        $types .= "s";
    }
    if ($min_price > 0) {
        $sql .= " AND price >= ?";
        $params[] = $min_price;
        $types .= "d";
    }
    if ($max_price < 999999) {
        $sql .= " AND price <= ?";
        $params[] = $max_price;
        $types .= "d";
    }
    $sql .= " ORDER BY created_at DESC";
    $stmt = $db->prepare($sql);
    if ($stmt) {
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $lands = $result->fetch_all(MYSQLI_ASSOC);
        foreach ($lands as &$land) {
            $land['images'] = json_decode($land['images'] ?? '[]', true);
        }
        $stmt->close();
        echo json_encode(['success' => true, 'data' => $lands]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch lands']);
    }
}

function getLand($id) {
    global $db;
    $sql = "SELECT * FROM lands WHERE id = ?";
    $stmt = $db->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $land = $result->fetch_assoc();
        if ($land) {
            $land['images'] = json_decode($land['images'] ?? '[]', true);
            echo json_encode(['success' => true, 'data' => $land]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Land not found']);
        }
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch land']);
    }
}

function createLand($data) {
    global $db;
    
    // Check authentication - support both old and new systems during transition
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        return;
    }
    
    // Check if user is admin (old system) or has super_admin role (new system)
    $isAdmin = isset($_SESSION['user']['is_admin']) && $_SESSION['user']['is_admin'];
    $isSuperAdmin = isset($_SESSION['user']['role']) && $_SESSION['user']['role'] === 'super_admin';
    
    if (!$isAdmin && !$isSuperAdmin) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Super Admin access required']);
        return;
    }
    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No data provided']);
        return;
    }
    $required_fields = ['title', 'address', 'city', 'state', 'price'];
    foreach ($required_fields as $field) {
        if (empty($data[$field])) {
            echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
            return;
        }
    }
    $title = $db->real_escape_string($data['title']);
    $description = $db->real_escape_string($data['description'] ?? '');
    $address = $db->real_escape_string($data['address']);
    $city = $db->real_escape_string($data['city']);
    $state = $db->real_escape_string($data['state']);
    $price = floatval($data['price']);
    $status = $db->real_escape_string($data['status'] ?? 'available');
    $images = json_encode($data['images'] ?? []);
    $sql = "INSERT INTO lands (title, description, address, city, state, price, status, images, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    $stmt = $db->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("sssssdss", $title, $description, $address, $city, $state, $price, $status, $images);
        $success = $stmt->execute();
        $land_id = $db->insert_id;
        $stmt->close();
        
        if ($success) {
            // Create notification for all admins
            $adminStmt = $db->prepare("SELECT id FROM users WHERE is_admin = 1");
            $adminStmt->execute();
            $adminResult = $adminStmt->get_result();
            
            while ($admin = $adminResult->fetch_assoc()) {
                $notifStmt = $db->prepare("
                    INSERT INTO notifications (user_id, title, message, type, redirect_to, created_at) 
                    VALUES (?, ?, ?, 'success', 'lands', NOW())
                ");
                $notifTitle = "New Land Property Added";
                $notifMessage = "Property '$title' in $city has been added to the system.";
                $notifStmt->bind_param('iss', $admin['id'], $notifTitle, $notifMessage);
                $notifStmt->execute();
            }
            
            // Create news post for new land
            $landData = [
                'title' => $title,
                'address' => $address,
                'city' => $city,
                'state' => $state,
                'price' => $price,
                'size' => $data['size'] ?? 'no_size',
                'land_type' => $data['land_type'] ?? 'residential',
                'status' => $status,
                'images' => $images,
                'whatsapp_contact' => $data['whatsapp_contact'] ?? '+2348123456789'
            ];
            createLandNewsPost($landData, 'new_land');
            
            echo json_encode(['success' => true, 'message' => 'Land created successfully', 'id' => $land_id]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to create land']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
    }
}

function updateLand($id, $data) {
    global $db;
    
    // Check authentication - support both old and new systems during transition
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        return;
    }
    
    // Check if user is admin (old system) or has admin/super_admin role (new system)
    $isAdmin = isset($_SESSION['user']['is_admin']) && $_SESSION['user']['is_admin'];
    $hasAdminRole = isset($_SESSION['user']['role']) && in_array($_SESSION['user']['role'], ['admin', 'super_admin']);
    
    if (!$isAdmin && !$hasAdminRole) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Admin access required']);
        return;
    }
    
    // Get current land data to check for status changes
    $currentStmt = $db->prepare("SELECT * FROM lands WHERE id = ?");
    $currentStmt->bind_param("i", $id);
    $currentStmt->execute();
    $currentResult = $currentStmt->get_result();
    $currentLand = $currentResult->fetch_assoc();
    $currentStmt->close();
    
    if (!$currentLand) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Land not found']);
        return;
    }
    
    // Log the update action if audit logging is available
    if (function_exists('logAdminAction')) {
        logAdminAction($db, 'update_land', 'land', $id, [
            'title' => $data['title'] ?? null,
            'status' => $data['status'] ?? null
        ]);
    }
    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No data provided']);
        return;
    }
    $title = $db->real_escape_string($data['title']);
    $description = $db->real_escape_string($data['description'] ?? '');
    $address = $db->real_escape_string($data['address']);
    $city = $db->real_escape_string($data['city']);
    $state = $db->real_escape_string($data['state']);
    $price = floatval($data['price']);
    $size = $db->real_escape_string($data['size'] ?? '');
    $features = $db->real_escape_string($data['features'] ?? '');
    $status = $db->real_escape_string($data['status'] ?? 'available');
    $images = json_encode($data['images'] ?? []);
    
    $sql = "UPDATE lands SET title=?, description=?, address=?, city=?, state=?, price=?, size=?, features=?, status=?, images=? WHERE id=?";
    $stmt = $db->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("sssssdssssi", $title, $description, $address, $city, $state, $price, $size, $features, $status, $images, $id);
        $success = $stmt->execute();
        $stmt->close();
        
        if ($success) {
            // Check if status changed and create news post if needed
            $oldStatus = $currentLand['status'];
            if ($oldStatus !== $status && in_array($status, ['available', 'sold', 'pending'])) {
                $landData = [
                    'title' => $title,
                    'address' => $address,
                    'city' => $city,
                    'state' => $state,
                    'price' => $price,
                    'size' => $size,
                    'land_type' => $data['land_type'] ?? 'residential',
                    'status' => $status,
                    'images' => $images,
                    'whatsapp_contact' => $data['whatsapp_contact'] ?? '+2348123456789'
                ];
                createLandNewsPost($landData, 'status_change', $oldStatus);
            }
            
            // Create notification for all admins
            $adminStmt = $db->prepare("SELECT id FROM users WHERE is_admin = 1");
            $adminStmt->execute();
            $adminResult = $adminStmt->get_result();
            
            while ($admin = $adminResult->fetch_assoc()) {
                $notifStmt = $db->prepare("
                    INSERT INTO notifications (user_id, title, message, type, redirect_to, created_at) 
                    VALUES (?, ?, ?, 'info', 'lands', NOW())
                ");
                $notifTitle = "Land Property Updated";
                $notifMessage = "Property '$title' has been updated.";
                $notifStmt->bind_param('iss', $admin['id'], $notifTitle, $notifMessage);
                $notifStmt->execute();
            }
            
            echo json_encode(['success' => true, 'message' => 'Land updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update land']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
    }
}

function deleteLand($id) {
    global $db;
    
    // Check authentication - support both old and new systems during transition
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        return;
    }
    
    // Check if user is admin (old system) or has super_admin role (new system)
    $isAdmin = isset($_SESSION['user']['is_admin']) && $_SESSION['user']['is_admin'];
    $isSuperAdmin = isset($_SESSION['user']['role']) && $_SESSION['user']['role'] === 'super_admin';
    
    if (!$isAdmin && !$isSuperAdmin) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Super Admin access required']);
        return;
    }
    
    // Log the delete action if audit logging is available
    if (function_exists('logAdminAction')) {
        logAdminAction($db, 'delete_land', 'land', $id, null);
    }
    // Get land title before deleting
    $getLandStmt = $db->prepare("SELECT title FROM lands WHERE id = ?");
    $getLandStmt->bind_param("i", $id);
    $getLandStmt->execute();
    $landResult = $getLandStmt->get_result();
    $landData = $landResult->fetch_assoc();
    $landTitle = $landData['title'] ?? "Property ID: $id";
    $getLandStmt->close();
    
    $sql = "DELETE FROM lands WHERE id = ?";
    $stmt = $db->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("i", $id);
        $success = $stmt->execute();
        $stmt->close();
        
        if ($success) {
            // Create notification for all admins
            $adminStmt = $db->prepare("SELECT id FROM users WHERE is_admin = 1");
            $adminStmt->execute();
            $adminResult = $adminStmt->get_result();
            
            while ($admin = $adminResult->fetch_assoc()) {
                $notifStmt = $db->prepare("
                    INSERT INTO notifications (user_id, title, message, type, redirect_to, created_at) 
                    VALUES (?, ?, ?, 'warning', 'lands', NOW())
                ");
                $notifTitle = "Land Property Deleted";
                $notifMessage = "Property '$landTitle' has been removed from the system.";
                $notifStmt->bind_param('iss', $admin['id'], $notifTitle, $notifMessage);
                $notifStmt->execute();
            }
            
            echo json_encode(['success' => true, 'message' => 'Land deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to delete land']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
    }
}
