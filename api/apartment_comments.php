// This file has been removed as it is no longer needed for land and properties only.
<?php
// Prevent any HTML output before JSON
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . "/config.php";
require_once __DIR__ . "/session.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);

    switch ($method) {
        case 'GET':
            if (isset($_GET['apartment_id'])) {
                getApartmentComments($_GET['apartment_id']);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Apartment ID required']);
            }
            break;
        
        case 'POST':
            createComment($input);
            break;
        
        case 'PUT':
            if (isset($_GET['id'])) {
                updateComment($_GET['id'], $input);
            }
            break;
        
        case 'DELETE':
            if (isset($_GET['id'])) {
                deleteComment($_GET['id']);
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
}

function getApartmentComments($apartment_id) {
    global $db;
    
    $sql = "SELECT ac.*, u.full_name 
            FROM apartment_comments ac 
            JOIN users u ON ac.user_id = u.id 
            WHERE ac.apartment_id = ? 
            ORDER BY ac.created_at DESC";
    
    $stmt = $db->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("i", $apartment_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $comments = $result->fetch_all(MYSQLI_ASSOC);
        
        // Calculate average rating
        $avg_rating = 0;
        if (count($comments) > 0) {
            $total_rating = array_sum(array_column($comments, 'rating'));
            $avg_rating = round($total_rating / count($comments), 1);
        }
        
        $stmt->close();
        echo json_encode([
            'success' => true, 
            'comments' => $comments,
            'average_rating' => $avg_rating,
            'total_comments' => count($comments)
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch comments']);
    }
}

function createComment($data) {
    global $db;
    
    // Check if user is logged in
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        return;
    }
    
    // Validate input data
    if (!$data || !isset($data['apartment_id']) || !isset($data['rating']) || !isset($data['comment'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    
    // Validate rating range
    if ($data['rating'] < 1 || $data['rating'] > 5) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Rating must be between 1 and 5']);
        return;
    }
    
    $user_id = $_SESSION['user']['id'];
    $apartment_id = (int)$data['apartment_id'];
    $rating = (int)$data['rating'];
    $comment = trim($data['comment']);
    
    if (empty($comment)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Comment cannot be empty']);
        return;
    }
    
    // Check if user already commented on this apartment
    $check_sql = "SELECT id FROM apartment_comments WHERE user_id = ? AND apartment_id = ?";
    $check_stmt = $db->prepare($check_sql);
    $check_stmt->bind_param("ii", $user_id, $apartment_id);
    $check_stmt->execute();
    $existing = $check_stmt->get_result()->fetch_assoc();
    $check_stmt->close();
    
    if ($existing) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'You have already commented on this apartment']);
        return;
    }
    
    $sql = "INSERT INTO apartment_comments (apartment_id, user_id, rating, comment) VALUES (?, ?, ?, ?)";
    $stmt = $db->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("iiis", $apartment_id, $user_id, $rating, $comment);
        
        if ($stmt->execute()) {
            $comment_id = $db->insert_id;
            echo json_encode(['success' => true, 'message' => 'Comment added successfully', 'id' => $comment_id]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to add comment']);
        }
        
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
}

function updateComment($id, $data) {
    global $db;
    
    // Check if user is logged in
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        return;
    }
    
    $user_id = $_SESSION['user']['id'];
    $is_admin = $_SESSION['user']['is_admin'];
    
    // Check if comment exists and user owns it (or is admin)
    $check_sql = "SELECT user_id FROM apartment_comments WHERE id = ?";
    $check_stmt = $db->prepare($check_sql);
    $check_stmt->bind_param("i", $id);
    $check_stmt->execute();
    $comment = $check_stmt->get_result()->fetch_assoc();
    $check_stmt->close();
    
    if (!$comment) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Comment not found']);
        return;
    }
    
    if ($comment['user_id'] != $user_id && !$is_admin) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Permission denied']);
        return;
    }
    
    $rating = (int)$data['rating'];
    $comment_text = trim($data['comment']);
    
    if ($rating < 1 || $rating > 5 || empty($comment_text)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid rating or comment']);
        return;
    }
    
    $sql = "UPDATE apartment_comments SET rating = ?, comment = ? WHERE id = ?";
    $stmt = $db->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("isi", $rating, $comment_text, $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Comment updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update comment']);
        }
        
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
}

function deleteComment($id) {
    global $db;
    
    // Check if user is logged in
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        return;
    }
    
    $user_id = $_SESSION['user']['id'];
    $is_admin = $_SESSION['user']['is_admin'];
    
    // Check if comment exists and user owns it (or is admin)
    $check_sql = "SELECT user_id FROM apartment_comments WHERE id = ?";
    $check_stmt = $db->prepare($check_sql);
    $check_stmt->bind_param("i", $id);
    $check_stmt->execute();
    $comment = $check_stmt->get_result()->fetch_assoc();
    $check_stmt->close();
    
    if (!$comment) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Comment not found']);
        return;
    }
    
    if ($comment['user_id'] != $user_id && !$is_admin) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Permission denied']);
        return;
    }
    
    $sql = "DELETE FROM apartment_comments WHERE id = ?";
    $stmt = $db->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Comment deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to delete comment']);
        }
        
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
}
?>
