<?php
// land_applications.php - CRUD for land applications
require_once 'config.php';
require_once 'cors_headers.php';

// Set content type for JSON responses
header('Content-Type: application/json');

// Only require authentication for POST, PUT, DELETE
$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET') {
    require_once 'session.php';
    if (!isset($_SESSION['user'])) {
        echo json_encode(['success' => false, 'message' => 'Authentication required.']);
        exit;
    }
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            // Fetch all land applications
            $sql = "SELECT la.*, u.full_name AS applicant_name, u.email AS applicant_email, l.title AS land_title FROM land_applications la
                    JOIN users u ON la.user_id = u.id
                    JOIN lands l ON la.land_id = l.id
                    ORDER BY la.created_at DESC";
            $result = $db->query($sql);
            $data = [];
            if ($result) {
                while ($row = $result->fetch_assoc()) {
                    $data[] = $row;
                }
            }
            echo json_encode(['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => 'Error fetching applications: ' . $e->getMessage()]);
        }
        break;
    case 'POST':
        try {
            // Create new land application
            $input = json_decode(file_get_contents('php://input'), true);
            // Ensure status is always 'pending' for new applications
            $stmt = $db->prepare("INSERT INTO land_applications (user_id, land_id, move_in_date, employment_status, annual_income, whatsapp_contact, reference_contacts, additional_notes, status, admin_notes, rejection_reason, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', '', '', NOW(), NOW())");
            $stmt->bind_param('iissdsss',
                $input['user_id'],
                $input['land_id'],
                $input['move_in_date'],
                $input['employment_status'],
                $input['annual_income'],
                $input['whatsapp_contact'],
                $input['reference_contacts'],
                $input['additional_notes']
            );
            $success = $stmt->execute();
            $application_id = $db->insert_id;
            
            if ($success) {
                // Get land title for notification
                $landStmt = $db->prepare("SELECT title FROM lands WHERE id = ?");
                $landStmt->bind_param('i', $input['land_id']);
                $landStmt->execute();
                $landResult = $landStmt->get_result();
                $land = $landResult->fetch_assoc();
                $landTitle = $land['title'] ?? 'Unknown Property';
                
                // Get applicant name
                $userStmt = $db->prepare("SELECT full_name FROM users WHERE id = ?");
                $userStmt->bind_param('i', $input['user_id']);
                $userStmt->execute();
                $userResult = $userStmt->get_result();
                $user = $userResult->fetch_assoc();
                $userName = $user['full_name'] ?? 'Unknown User';
                
                // Create notification for all admins
                $adminStmt = $db->prepare("SELECT id FROM users WHERE is_admin = 1");
                $adminStmt->execute();
                $adminResult = $adminStmt->get_result();
                
                while ($admin = $adminResult->fetch_assoc()) {
                    $notifStmt = $db->prepare("
                        INSERT INTO notifications (user_id, title, message, type, redirect_to, created_at) 
                        VALUES (?, ?, ?, 'warning', 'applications', NOW())
                    ");
                    $notifTitle = "New Land Application";
                    $notifMessage = "$userName applied for $landTitle";
                    $notifStmt->bind_param('iss', $admin['id'], $notifTitle, $notifMessage);
                    $notifStmt->execute();
                }
            }
            
            echo json_encode(['success' => $success, 'id' => $application_id]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => 'Error creating application: ' . $e->getMessage()]);
        }
        break;
    case 'PUT':
        try {
            // Update land application (both admin status updates and user edits)
            $input = json_decode(file_get_contents('php://input'), true);
            $id = intval($_GET['id'] ?? 0);
            
            if (empty($id)) {
                throw new Exception('Missing required field: id');
            }
            
            // Check if this is an admin status update or user edit
            if (isset($input['admin_notes']) || isset($input['rejection_reason'])) {
                // Admin status update
                $status = $input['status'] ?? '';
                $rejection_reason = $input['rejection_reason'] ?? '';
                $admin_notes = $input['admin_notes'] ?? '';
                
                if (empty($status)) {
                    throw new Exception('Missing required field: status');
                }
                
                $stmt = $db->prepare("UPDATE land_applications SET status=?, rejection_reason=?, admin_notes=?, updated_at=NOW() WHERE id=?");
                $stmt->bind_param('sssi', $status, $rejection_reason, $admin_notes, $id);
                
                // After updating, send notification to the applicant
                $success = $stmt->execute();
                
                if ($success && ($status === 'approved' || $status === 'rejected')) {
                    // Get application details
                    $appStmt = $db->prepare("
                        SELECT la.user_id, l.title as land_title 
                        FROM land_applications la 
                        JOIN lands l ON la.land_id = l.id 
                        WHERE la.id = ?
                    ");
                    $appStmt->bind_param('i', $id);
                    $appStmt->execute();
                    $appResult = $appStmt->get_result();
                    $appData = $appResult->fetch_assoc();
                    
                    if ($appData) {
                        // Create notification for the user
                        $notifStmt = $db->prepare("
                            INSERT INTO notifications (user_id, title, message, type, redirect_to, created_at) 
                            VALUES (?, ?, ?, ?, '/applications', NOW())
                        ");
                        
                        if ($status === 'approved') {
                            $notifTitle = "Application Approved! 🎉";
                            $notifMessage = "Congratulations! Your application for {$appData['land_title']} has been approved.";
                            $notifType = 'success';
                        } else {
                            $notifTitle = "Application Update";
                            $notifMessage = "Your application for {$appData['land_title']} has been reviewed. Please check your applications page for details.";
                            $notifType = 'error';
                        }
                        
                        $notifStmt->bind_param('isss', $appData['user_id'], $notifTitle, $notifMessage, $notifType);
                        $notifStmt->execute();
                    }
                }
                
                // Don't execute again, already done above
                $stmt = null;
            } else {
                // User application edit
                $move_in_date = $input['move_in_date'] ?? '';
                $employment_status = $input['employment_status'] ?? '';
                $annual_income = floatval($input['annual_income'] ?? 0);
                $whatsapp_contact = $input['whatsapp_contact'] ?? '';
                $reference_contacts = $input['reference_contacts'] ?? '';
                $additional_notes = $input['additional_notes'] ?? '';
                $status = $input['status'] ?? 'pending'; // Reset to pending after user edit
                
                $stmt = $db->prepare("UPDATE land_applications SET move_in_date=?, employment_status=?, annual_income=?, whatsapp_contact=?, reference_contacts=?, additional_notes=?, status=?, updated_at=NOW() WHERE id=?");
                $stmt->bind_param('ssdssssi', $move_in_date, $employment_status, $annual_income, $whatsapp_contact, $reference_contacts, $additional_notes, $status, $id);
                $success = $stmt->execute();
            }
            
            // Only execute if stmt is not null (admin update already executed above)
            if ($stmt !== null) {
                $success = $stmt->execute();
            }
            
            if ($success) {
                echo json_encode(['success' => true, 'message' => 'Application updated successfully']);
            } else {
                throw new Exception('Failed to update application');
            }
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => 'Error updating application: ' . $e->getMessage()]);
        }
        break;
    case 'DELETE':
        try {
            // Delete land application
            $id = intval($_GET['id'] ?? 0);
            $stmt = $db->prepare("DELETE FROM land_applications WHERE id=?");
            $stmt->bind_param('i', $id);
            $success = $stmt->execute();
            echo json_encode(['success' => $success]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => 'Error deleting application: ' . $e->getMessage()]);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
$db->close();
