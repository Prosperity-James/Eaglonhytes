<?php
// Prevent any HTML output before JSON
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Start output buffering
ob_start();

try {
    // CORS headers MUST come first
    require_once __DIR__ . "/cors_headers.php";
    
    // Enhanced session configuration
    require_once __DIR__ . "/session_config.php";
    session_start();

    // Include config
    require_once __DIR__ . "/config.php";
    
    // Clean any output
    ob_clean();
    
    // Ensure JSON content type and prevent HTML injection
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    
    // Disable any HTML output buffering or injection
    if (function_exists('apache_setenv')) {
        apache_setenv('no-gzip', '1');
    }
    ini_set('zlib.output_compression', 'Off');

    $method = $_SERVER['REQUEST_METHOD'];
    
    // GET - Fetch content posts (public endpoint)
    if ($method === 'GET') {
        try {
            // Check if content_posts table exists
            try {
                $tableCheck = $pdo->query("SHOW TABLES LIKE 'content_posts'");
                if ($tableCheck->rowCount() === 0) {
                    // Table doesn't exist, return empty result
                    echo json_encode([
                        'success' => true,
                        'data' => [],
                        'message' => 'Content management table not yet created. Please run setup.',
                        'setup_required' => true,
                        'pagination' => [
                            'total' => 0,
                            'limit' => 10,
                            'offset' => 0,
                            'has_more' => false
                        ]
                    ]);
                    exit;
                }
            } catch (Exception $tableError) {
                // Table check failed, likely doesn't exist
                echo json_encode([
                    'success' => true,
                    'data' => [],
                    'message' => 'Content management not setup. Table missing.',
                    'setup_required' => true,
                    'error_details' => $tableError->getMessage(),
                    'pagination' => [
                        'total' => 0,
                        'limit' => 10,
                        'offset' => 0,
                        'has_more' => false
                    ]
                ]);
                exit;
            }
            
            $category = $_GET['category'] ?? '';
            $status = $_GET['status'] ?? 'published';
            $featured = $_GET['featured'] ?? '';
            $limit = (int)($_GET['limit'] ?? 10);
            $offset = (int)($_GET['offset'] ?? 0);
            
            $sql = "SELECT cp.*, u.full_name as author_name 
                    FROM content_posts cp 
                    LEFT JOIN users u ON cp.author_id = u.id 
                    WHERE 1=1";
            $params = [];
            
            if ($status) {
                $sql .= " AND cp.status = ?";
                $params[] = $status;
            }
            
            if ($category) {
                $sql .= " AND cp.category = ?";
                $params[] = $category;
            }
            
            if ($featured !== '') {
                $sql .= " AND cp.featured = ?";
                $params[] = $featured ? 1 : 0;
            }
            
            $sql .= " ORDER BY cp.featured DESC, cp.published_at DESC, cp.created_at DESC";
            $sql .= " LIMIT ? OFFSET ?";
            $params[] = $limit;
            $params[] = $offset;
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Parse media_items JSON for each post
            foreach ($posts as &$post) {
                $post['media_items'] = json_decode($post['media_items'] ?? '[]', true) ?: [];
                $post['tags'] = $post['tags'] ? explode(',', $post['tags']) : [];
            }
            
            // Get total count for pagination
            $countSql = "SELECT COUNT(*) FROM content_posts WHERE 1=1";
            $countParams = [];
            
            if ($status) {
                $countSql .= " AND status = ?";
                $countParams[] = $status;
            }
            
            if ($category) {
                $countSql .= " AND category = ?";
                $countParams[] = $category;
            }
            
            if ($featured !== '') {
                $countSql .= " AND featured = ?";
                $countParams[] = $featured ? 1 : 0;
            }
            
            $countStmt = $pdo->prepare($countSql);
            $countStmt->execute($countParams);
            $total = $countStmt->fetchColumn();
            
            echo json_encode([
                'success' => true,
                'data' => $posts,
                'pagination' => [
                    'total' => (int)$total,
                    'limit' => $limit,
                    'offset' => $offset,
                    'has_more' => ($offset + $limit) < $total
                ]
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to fetch posts: ' . $e->getMessage()]);
        }
        exit;
    }

    // Check authentication for write operations
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        exit;
    }

    // Check admin privileges
    if ($_SESSION['user']['role'] !== 'admin' && $_SESSION['user']['role'] !== 'super_admin') {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Admin privileges required']);
        exit;
    }

    // POST - Create new content post
    if ($method === 'POST') {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                throw new Exception('Invalid JSON input');
            }
            
            // Validate required fields
            if (empty($input['title']) || empty($input['content'])) {
                throw new Exception('Title and content are required');
            }
            
            // Generate slug from title if not provided
            $slug = $input['slug'] ?? strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', trim($input['title'])));
            $slug = trim($slug, '-');
            
            // Check if slug exists
            $slugCheck = $pdo->prepare("SELECT id FROM content_posts WHERE slug = ?");
            $slugCheck->execute([$slug]);
            if ($slugCheck->fetch()) {
                $slug .= '-' . time();
            }
            
            // Prepare media items
            $mediaItems = json_encode($input['media_items'] ?? []);
            
            $sql = "INSERT INTO content_posts (title, content, excerpt, category, status, featured, media_items, tags, meta_description, slug, author_id, published_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $publishedAt = ($input['status'] === 'published') ? date('Y-m-d H:i:s') : null;
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $input['title'],
                $input['content'],
                $input['excerpt'] ?? '',
                $input['category'] ?? 'news',
                $input['status'] ?? 'draft',
                $input['featured'] ?? false,
                $mediaItems,
                is_array($input['tags']) ? implode(',', $input['tags']) : ($input['tags'] ?? ''),
                $input['meta_description'] ?? '',
                $slug,
                $_SESSION['user']['id'],
                $publishedAt
            ]);
            
            $postId = $pdo->lastInsertId();
            
            echo json_encode([
                'success' => true,
                'message' => 'Content post created successfully',
                'data' => ['id' => $postId, 'slug' => $slug]
            ]);
            
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        exit;
    }

    // PUT - Update content post
    if ($method === 'PUT') {
        try {
            $postId = $_GET['id'] ?? null;
            if (!$postId) {
                throw new Exception('Post ID is required');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                throw new Exception('Invalid JSON input');
            }
            
            // Check if post exists
            $checkStmt = $pdo->prepare("SELECT id FROM content_posts WHERE id = ?");
            $checkStmt->execute([$postId]);
            if (!$checkStmt->fetch()) {
                throw new Exception('Post not found');
            }
            
            // Prepare media items
            $mediaItems = json_encode($input['media_items'] ?? []);
            
            $sql = "UPDATE content_posts SET 
                    title = ?, content = ?, excerpt = ?, category = ?, status = ?, 
                    featured = ?, media_items = ?, tags = ?, meta_description = ?, 
                    updated_at = CURRENT_TIMESTAMP";
            
            $params = [
                $input['title'],
                $input['content'],
                $input['excerpt'] ?? '',
                $input['category'] ?? 'news',
                $input['status'] ?? 'draft',
                $input['featured'] ?? false,
                $mediaItems,
                is_array($input['tags']) ? implode(',', $input['tags']) : ($input['tags'] ?? ''),
                $input['meta_description'] ?? ''
            ];
            
            // Update published_at if status changed to published
            if ($input['status'] === 'published') {
                $sql .= ", published_at = COALESCE(published_at, CURRENT_TIMESTAMP)";
            }
            
            $sql .= " WHERE id = ?";
            $params[] = $postId;
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            
            echo json_encode([
                'success' => true,
                'message' => 'Content post updated successfully'
            ]);
            
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        exit;
    }

    // DELETE - Delete content post
    if ($method === 'DELETE') {
        try {
            $postId = $_GET['id'] ?? null;
            if (!$postId) {
                throw new Exception('Post ID is required');
            }
            
            $stmt = $pdo->prepare("DELETE FROM content_posts WHERE id = ?");
            $stmt->execute([$postId]);
            
            if ($stmt->rowCount() === 0) {
                throw new Exception('Post not found');
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Content post deleted successfully'
            ]);
            
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        exit;
    }

    // Method not allowed
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);

} catch (Exception $e) {
    ob_clean();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
} catch (Error $e) {
    ob_clean();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Fatal error: ' . $e->getMessage()
    ]);
}

ob_end_flush();
?>
