<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// CORS headers MUST come first
require_once __DIR__ . "/cors_headers.php";
require_once __DIR__ . "/config.php";

header('Content-Type: application/json');

try {
    // Check if database connection exists
    if (!$db || defined('DB_CONNECTION_ERROR')) {
        throw new Exception('Database connection failed');
    }
    
    $method = $_SERVER['REQUEST_METHOD'];

    // Create carousel_images table if it doesn't exist
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
    $db->query($createTableSQL);

switch ($method) {
    case 'GET':
        getCarouselImages();
        break;
    case 'POST':
        session_start();
        if (!isset($_SESSION['user']) || !$_SESSION['user']['is_admin']) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Admin access required']);
            exit;
        }
        addCarouselImage();
        break;
    case 'PUT':
        session_start();
        if (!isset($_SESSION['user']) || !$_SESSION['user']['is_admin']) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Admin access required']);
            exit;
        }
        updateCarouselImage();
        break;
    case 'DELETE':
        session_start();
        if (!isset($_SESSION['user']) || !$_SESSION['user']['is_admin']) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Admin access required']);
            exit;
        }
        deleteCarouselImage();
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}

function getCarouselImages() {
    global $db;
    
    try {
        // Get only active images, ordered by display_order
        $sql = "SELECT * FROM carousel_images WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC";
        $result = $db->query($sql);
        
        $images = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $images[] = $row;
            }
        }
        
        echo json_encode(['success' => true, 'data' => $images]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error fetching carousel images: ' . $e->getMessage()]);
    }
}

function addCarouselImage() {
    global $db;
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['title']) || empty($input['image_url'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Title and image URL are required']);
            return;
        }
        
        $title = $input['title'];
        $subtitle = $input['subtitle'] ?? '';
        $image_url = $input['image_url'];
        $link_url = $input['link_url'] ?? '';
        $display_order = $input['display_order'] ?? 0;
        
        $stmt = $db->prepare("INSERT INTO carousel_images (title, subtitle, image_url, link_url, display_order) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param('ssssi', $title, $subtitle, $image_url, $link_url, $display_order);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Carousel image added successfully', 'id' => $db->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to add carousel image']);
        }
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
}

function updateCarouselImage() {
    global $db;
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Image ID is required']);
            return;
        }
        
        $fields = [];
        $types = '';
        $values = [];
        
        if (isset($input['title'])) {
            $fields[] = 'title = ?';
            $types .= 's';
            $values[] = $input['title'];
        }
        if (isset($input['subtitle'])) {
            $fields[] = 'subtitle = ?';
            $types .= 's';
            $values[] = $input['subtitle'];
        }
        if (isset($input['image_url'])) {
            $fields[] = 'image_url = ?';
            $types .= 's';
            $values[] = $input['image_url'];
        }
        if (isset($input['link_url'])) {
            $fields[] = 'link_url = ?';
            $types .= 's';
            $values[] = $input['link_url'];
        }
        if (isset($input['display_order'])) {
            $fields[] = 'display_order = ?';
            $types .= 'i';
            $values[] = $input['display_order'];
        }
        if (isset($input['is_active'])) {
            $fields[] = 'is_active = ?';
            $types .= 'i';
            $values[] = $input['is_active'];
        }
        
        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'No fields to update']);
            return;
        }
        
        $sql = "UPDATE carousel_images SET " . implode(', ', $fields) . " WHERE id = ?";
        $types .= 'i';
        $values[] = $id;
        
        $stmt = $db->prepare($sql);
        $stmt->bind_param($types, ...$values);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Carousel image updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update carousel image']);
        }
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
}

function deleteCarouselImage() {
    global $db;
    
    try {
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Image ID is required']);
            return;
        }
        
        $stmt = $db->prepare("DELETE FROM carousel_images WHERE id = ?");
        $stmt->bind_param('i', $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Carousel image deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to delete carousel image']);
        }
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
}
?>
