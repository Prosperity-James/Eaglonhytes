<?php
/**
 * Content Management API
 * Handles founder, story content, and carousel images
 */

error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

ob_start();

require_once __DIR__ . "/cors_headers.php";
require_once __DIR__ . "/session_config.php";
session_start();
require_once __DIR__ . "/config.php";
require_once __DIR__ . "/security_utils.php";

ob_clean();
header('Content-Type: application/json');

try {
    // Check if user is logged in and is admin
    if (!isset($_SESSION['user']) || !$_SESSION['user']['is_admin']) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Admin access required']);
        exit;
    }

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Get the action from URL parameter
    $action = $_GET['action'] ?? '';
    
    switch ($action) {
        case 'get_story':
            getStoryContent();
            break;
        case 'update_story':
            updateStoryContent($input);
            break;
        case 'get_carousel':
            getCarouselImages();
            break;
        case 'update_carousel':
            updateCarouselImages($input);
            break;
        case 'add_carousel':
            addCarouselImage($input);
            break;
        case 'delete_carousel':
            deleteCarouselImage($input);
            break;
        default:
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }

} catch (Exception $e) {
    ob_clean();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}


function getStoryContent() {
    global $db;
    
    $sql = "SELECT * FROM story_content WHERE is_active = 1 ORDER BY id DESC LIMIT 1";
    $result = $db->query($sql);
    
    if ($result && $result->num_rows > 0) {
        $story = $result->fetch_assoc();
        echo json_encode(['success' => true, 'data' => $story]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No story content found']);
    }
}

function updateStoryContent($data) {
    global $db;
    
    if (!$data || !isset($data['title']) || !isset($data['content_paragraph_1']) || !isset($data['content_paragraph_2'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Title and content paragraphs are required']);
        return;
    }
    
    // Sanitize inputs
    $title = SecurityUtils::sanitizeString($data['title'], 255);
    $paragraph1 = SecurityUtils::sanitizeString($data['content_paragraph_1'], 2000);
    $paragraph2 = SecurityUtils::sanitizeString($data['content_paragraph_2'], 2000);
    $image_url = isset($data['image_url']) ? SecurityUtils::sanitizeString($data['image_url'], 500) : '';
    
    $sql = "UPDATE story_content SET title = ?, content_paragraph_1 = ?, content_paragraph_2 = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1";
    $stmt = $db->prepare($sql);
    
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $db->error]);
        return;
    }
    
    $stmt->bind_param("ssss", $title, $paragraph1, $paragraph2, $image_url);
    
    if ($stmt->execute()) {
        SecurityUtils::logSecurityEvent('story_content_updated', ['admin_id' => $_SESSION['user']['id']]);
        echo json_encode(['success' => true, 'message' => 'Story content updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update story content']);
    }
    
    $stmt->close();
}

function getCarouselImages() {
    global $db;
    
    $sql = "SELECT * FROM carousel_images WHERE is_active = 1 ORDER BY display_order ASC";
    $result = $db->query($sql);
    
    $images = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $images[] = $row;
        }
    }
    
    echo json_encode(['success' => true, 'data' => $images]);
}

function updateCarouselImages($data) {
    global $db;
    
    if (!$data || !isset($data['images']) || !is_array($data['images'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Images array is required']);
        return;
    }
    
    $db->begin_transaction();
    
    try {
        // Update existing images
        foreach ($data['images'] as $image) {
            if (!isset($image['id']) || !isset($image['title']) || !isset($image['subtitle'])) {
                continue;
            }
            
            $id = SecurityUtils::sanitizeInt($image['id']);
            $title = SecurityUtils::sanitizeString($image['title'], 255);
            $subtitle = SecurityUtils::sanitizeString($image['subtitle'], 255);
            $image_url = SecurityUtils::sanitizeString($image['image_url'] ?? '', 500);
            $button_text = SecurityUtils::sanitizeString($image['button_text'] ?? 'Lands', 100);
            $button_link = SecurityUtils::sanitizeString($image['button_link'] ?? '/lands', 255);
            $display_order = SecurityUtils::sanitizeInt($image['display_order'] ?? 1);
            
            $sql = "UPDATE carousel_images SET title = ?, subtitle = ?, image_url = ?, button_text = ?, button_link = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("sssssii", $title, $subtitle, $image_url, $button_text, $button_link, $display_order, $id);
            $stmt->execute();
            $stmt->close();
        }
        
        $db->commit();
        SecurityUtils::logSecurityEvent('carousel_images_updated', ['admin_id' => $_SESSION['user']['id']]);
        echo json_encode(['success' => true, 'message' => 'Carousel images updated successfully']);
        
    } catch (Exception $e) {
        $db->rollback();
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update carousel images: ' . $e->getMessage()]);
    }
}

function addCarouselImage($data) {
    global $db;
    
    if (!$data || !isset($data['title']) || !isset($data['subtitle']) || !isset($data['image_url'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Title, subtitle, and image URL are required']);
        return;
    }
    
    $title = SecurityUtils::sanitizeString($data['title'], 255);
    $subtitle = SecurityUtils::sanitizeString($data['subtitle'], 255);
    $image_url = SecurityUtils::sanitizeString($data['image_url'], 500);
    $button_text = SecurityUtils::sanitizeString($data['button_text'] ?? 'Lands', 100);
    $button_link = SecurityUtils::sanitizeString($data['button_link'] ?? '/lands', 255);
    $display_order = SecurityUtils::sanitizeInt($data['display_order'] ?? 1);
    
    $sql = "INSERT INTO carousel_images (title, subtitle, image_url, button_text, button_link, display_order) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $db->prepare($sql);
    
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $db->error]);
        return;
    }
    
    $stmt->bind_param("sssssi", $title, $subtitle, $image_url, $button_text, $button_link, $display_order);
    
    if ($stmt->execute()) {
        SecurityUtils::logSecurityEvent('carousel_image_added', ['admin_id' => $_SESSION['user']['id']]);
        echo json_encode(['success' => true, 'message' => 'Carousel image added successfully', 'id' => $db->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to add carousel image']);
    }
    
    $stmt->close();
}

function deleteCarouselImage($data) {
    global $db;
    
    if (!$data || !isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Image ID is required']);
        return;
    }
    
    $id = SecurityUtils::sanitizeInt($data['id']);
    
    $sql = "UPDATE carousel_images SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    $stmt = $db->prepare($sql);
    
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $db->error]);
        return;
    }
    
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        SecurityUtils::logSecurityEvent('carousel_image_deleted', ['admin_id' => $_SESSION['user']['id'], 'image_id' => $id]);
        echo json_encode(['success' => true, 'message' => 'Carousel image deleted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to delete carousel image']);
    }
    
    $stmt->close();
}
?>
