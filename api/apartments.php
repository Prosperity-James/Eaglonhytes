// This file has been removed as it is no longer needed for land and properties only.
<?php
// Prevent any HTML output before JSON
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors to browser
ini_set('log_errors', 1); // Log errors instead
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
            if (isset($_GET['id'])) {
                getApartment($_GET['id']);
            } else {
                getApartments();
            }
            break;
        
        case 'POST':
            createApartment($input);
            break;
        
        case 'PUT':
            if (isset($_GET['id'])) {
                updateApartment($_GET['id'], $input);
            }
            break;
        
        case 'DELETE':
            if (isset($_GET['id'])) {
                deleteApartment($_GET['id']);
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

function getApartments() {
    global $db;
    
    $status = $_GET['status'] ?? 'available';
    $city = $_GET['city'] ?? '';
    $min_price = $_GET['min_price'] ?? 0;
    $max_price = $_GET['max_price'] ?? 999999;
    $bedrooms = $_GET['bedrooms'] ?? '';
    
    $sql = "SELECT * FROM apartments WHERE status = ?";
    $params = [$status];
    $types = "s";
    
    if (!empty($city)) {
        $sql .= " AND city LIKE ?";
        $params[] = "%$city%";
        $types .= "s";
    }
    
    if ($min_price > 0) {
        $sql .= " AND rent_price >= ?";
        $params[] = $min_price;
        $types .= "d";
    }
    
    if ($max_price < 999999) {
        $sql .= " AND rent_price <= ?";
        $params[] = $max_price;
        $types .= "d";
    }
    
    if (!empty($bedrooms)) {
        $sql .= " AND bedrooms = ?";
        $params[] = $bedrooms;
        $types .= "i";
    }
    
    $sql .= " ORDER BY created_at DESC";
    
    $stmt = $db->prepare($sql);
    if ($stmt) {
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
        $apartments = $result->fetch_all(MYSQLI_ASSOC);
        
        foreach ($apartments as &$apartment) {
            $apartment['images'] = json_decode($apartment['images'] ?? '[]', true);
            $apartment['amenities'] = json_decode($apartment['amenities'] ?? '[]', true);
        }
        
        $stmt->close();
        echo json_encode(['success' => true, 'apartments' => $apartments]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch apartments']);
    }
}

function getApartment($id) {
    global $db;
    
    $sql = "SELECT * FROM apartments WHERE id = ?";
    $stmt = $db->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $apartment = $result->fetch_assoc();
        
        if ($apartment) {
            $apartment['images'] = json_decode($apartment['images'] ?? '[]', true);
            $apartment['amenities'] = json_decode($apartment['amenities'] ?? '[]', true);
            echo json_encode(['success' => true, 'apartment' => $apartment]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Apartment not found']);
        }
        
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch apartment']);
    }
}

function createApartment($data) {
    global $db;
    
    // Check if user is admin
    if (!isset($_SESSION['user']) || !$_SESSION['user']['is_admin']) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Admin access required']);
        return;
    }
    
    // Validate input data exists
    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No data provided']);
        return;
    }
    
    // Validate required fields
    $required_fields = ['title', 'address', 'city', 'state', 'bedrooms', 'bathrooms', 'rent_price', 'rental_period'];
    foreach ($required_fields as $field) {
        if (empty($data[$field])) {
            echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
            return;
        }
    }
    
    // Prepare data with proper escaping
    $title = $db->real_escape_string($data['title']);
    $description = $db->real_escape_string($data['description'] ?? '');
    $address = $db->real_escape_string($data['address']);
    $city = $db->real_escape_string($data['city']);
    $state = $db->real_escape_string($data['state']);
    $bedrooms = (int)$data['bedrooms'];
    $bathrooms = (float)$data['bathrooms'];
    $rent_price = (float)$data['rent_price'];
    $rental_period = $db->real_escape_string($data['rental_period']);
    $images = $db->real_escape_string(json_encode($data['images'] ?? []));
    $amenities = $db->real_escape_string(json_encode($data['amenities'] ?? []));
    $available_date = !empty($data['available_date']) ? $db->real_escape_string($data['available_date']) : date('Y-m-d');
    $pet_policy = $db->real_escape_string($data['pet_policy'] ?? '');
    $parking = $db->real_escape_string($data['parking'] ?? '');
    $utilities_included = $db->real_escape_string($data['utilities_included'] ?? '');
    $lease_terms = $db->real_escape_string($data['lease_terms'] ?? '');
    $application_fee = !empty($data['application_fee']) ? (float)$data['application_fee'] : 0.00;
    $status = 'available';
    $created_by = (int)$_SESSION['user']['id'];
    
    $sql = "INSERT INTO apartments (title, description, address, city, state, bedrooms, bathrooms, rent_price, rental_period, images, amenities, available_date, pet_policy, parking, utilities_included, lease_terms, application_fee, status, created_by) 
            VALUES ('$title', '$description', '$address', '$city', '$state', $bedrooms, $bathrooms, $rent_price, '$rental_period', '$images', '$amenities', '$available_date', '$pet_policy', '$parking', '$utilities_included', '$lease_terms', $application_fee, '$status', $created_by)";
    
    if ($db->query($sql)) {
        $apartment_id = $db->insert_id;
        echo json_encode(['success' => true, 'message' => 'Apartment created successfully', 'id' => $apartment_id]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to create apartment: ' . $db->error]);
    }
}

function updateApartment($id, $data) {
    global $db;
    
    // Check if user is admin
    if (!isset($_SESSION['user']) || !$_SESSION['user']['is_admin']) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Admin access required']);
        return;
    }
    
    $sql = "UPDATE apartments SET title = ?, description = ?, address = ?, city = ?, state = ?, bedrooms = ?, bathrooms = ?, rent_price = ?, rental_period = ?, images = ?, amenities = ?, available_date = ?, pet_policy = ?, parking = ? WHERE id = ?";
    
    $stmt = $db->prepare($sql);
    if ($stmt) {
        $images = json_encode($data['images'] ?? []);
        $amenities = json_encode($data['amenities'] ?? []);
        $available_date = !empty($data['available_date']) ? $data['available_date'] : date('Y-m-d');
        
        $title = $data['title'];
        $description = $data['description'] ?? '';
        $address = $data['address'];
        $city = $data['city'];
        $state = $data['state'];
        $bedrooms = (int)$data['bedrooms'];
        $bathrooms = (float)$data['bathrooms'];
        $rent_price = (float)$data['rent_price'];
        $rental_period = $data['rental_period'];
        $pet_policy = $data['pet_policy'] ?? '';
        $parking = $data['parking'] ?? '';
        
        $stmt->bind_param("sssssiddssssssi", 
            $title,           // s - string
            $description,     // s - string  
            $address,         // s - string
            $city,           // s - string
            $state,          // s - string
            $bedrooms,       // i - integer
            $bathrooms,      // d - double/float
            $rent_price,     // d - double/float
            $rental_period,  // s - string
            $images,         // s - string (JSON)
            $amenities,      // s - string (JSON)
            $available_date, // s - string
            $pet_policy,     // s - string
            $parking,        // s - string
            $id              // i - integer
        );
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Apartment updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update apartment: ' . $stmt->error]);
        }
        
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $db->error]);
    }
}

function deleteApartment($id) {
    global $db;
    
    // Check if user is admin
    if (!isset($_SESSION['user']) || !$_SESSION['user']['is_admin']) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Admin access required']);
        return;
    }
    
    $sql = "DELETE FROM apartments WHERE id = ?";
    $stmt = $db->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Apartment deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to delete apartment']);
        }
        
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
}
?>
