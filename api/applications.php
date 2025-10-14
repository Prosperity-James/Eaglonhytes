// This file has been removed as it is no longer needed for land and properties only.
<?php
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

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getApplication($_GET['id']);
        } else {
            getApplications();
        }
        break;
    
    case 'POST':
        createApplication($input);
        break;
    
    case 'PUT':
        if (isset($_GET['id'])) {
            updateApplication($_GET['id'], $input);
        }
        break;
    
    case 'DELETE':
        if (isset($_GET['id'])) {
            deleteApplication($_GET['id']);
        }
        break;
    
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

function getApplications() {
    global $db;
    
    $status = $_GET['status'] ?? '';
    $apartment_id = $_GET['apartment_id'] ?? '';
    
    $sql = "SELECT a.*, ap.title as apartment_title, u.full_name as applicant_name, u.email as applicant_email 
            FROM applications a 
            JOIN apartments ap ON a.apartment_id = ap.id 
            JOIN users u ON a.user_id = u.id";
    
    $params = [];
    $types = "";
    $conditions = [];
    
    if (!empty($status)) {
        $conditions[] = "a.status = ?";
        $params[] = $status;
        $types .= "s";
    }
    
    if (!empty($apartment_id)) {
        $conditions[] = "a.apartment_id = ?";
        $params[] = $apartment_id;
        $types .= "i";
    }
    
    if (!empty($conditions)) {
        $sql .= " WHERE " . implode(" AND ", $conditions);
    }
    
    $sql .= " ORDER BY a.created_at DESC";
    
    $stmt = $db->prepare($sql);
    if ($stmt) {
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $applications = $result->fetch_all(MYSQLI_ASSOC);
        
        $stmt->close();
        echo json_encode(['success' => true, 'applications' => $applications]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch applications']);
    }
}

function getApplication($id) {
    global $db;
    
    $sql = "SELECT a.*, ap.title as apartment_title, u.full_name as applicant_name, u.email as applicant_email, u.phone 
            FROM applications a 
            JOIN apartments ap ON a.apartment_id = ap.id 
            JOIN users u ON a.user_id = u.id 
            WHERE a.id = ?";
    
    $stmt = $db->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $application = $result->fetch_assoc();
        
        if ($application) {
            echo json_encode(['success' => true, 'application' => $application]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Application not found']);
        }
        
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch application']);
    }
}

function createApplication($data) {
    global $db;
    
    // Check if user is logged in
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        return;
    }
    
    // Check if user already applied for this apartment
    $check_sql = "SELECT id FROM applications WHERE user_id = ? AND apartment_id = ?";
    $check_stmt = $db->prepare($check_sql);
    $check_stmt->bind_param("ii", $_SESSION['user']['id'], $data['apartment_id']);
    $check_stmt->execute();
    $existing = $check_stmt->get_result()->fetch_assoc();
    $check_stmt->close();
    
    if ($existing) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'You have already applied for this apartment']);
        return;
    }
    
    $sql = "INSERT INTO applications (user_id, apartment_id, move_in_date, whatsapp_contact, additional_notes, status) VALUES (?, ?, ?, ?, ?, ?)";
    
    $stmt = $db->prepare($sql);
    if ($stmt) {
        $status = 'pending';
        $user_id = $_SESSION['user']['id'];
        
        $stmt->bind_param("iissss", 
            $user_id,
            $data['apartment_id'],
            $data['move_in_date'],
            $data['whatsapp_contact'],
            $data['additional_notes'],
            $status
        );
        
        if ($stmt->execute()) {
            $application_id = $db->insert_id;
            echo json_encode(['success' => true, 'message' => 'Application submitted successfully', 'id' => $application_id]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to submit application']);
        }
        
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
}

function updateApplication($id, $data) {
    global $db;
    
    // Check if user is admin or the applicant
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        return;
    }
    
    // Get current application details for email notification
    $check_sql = "SELECT a.*, ap.title as apartment_title, ap.address, ap.city, ap.state, 
                         u.full_name as applicant_name, u.email as applicant_email, a.status as current_status
                  FROM applications a 
                  JOIN apartments ap ON a.apartment_id = ap.id 
                  JOIN users u ON a.user_id = u.id 
                  WHERE a.id = ?";
    $check_stmt = $db->prepare($check_sql);
    $check_stmt->bind_param("i", $id);
    $check_stmt->execute();
    $application = $check_stmt->get_result()->fetch_assoc();
    $check_stmt->close();
    
    if (!$application) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Application not found']);
        return;
    }
    
    // Only admin or the applicant can update
    if (!$_SESSION['user']['is_admin'] && $_SESSION['user']['id'] != $application['user_id']) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Access denied']);
        return;
    }
    
    $email_sent = false;
    $email_message = '';
    
    // Admin can update status, applicant can update other fields
    if ($_SESSION['user']['is_admin']) {
        // Check if status is changing to approved or rejected
        $new_status = $data['status'];
        $rejection_reason = $data['rejection_reason'] ?? '';
        
        $sql = "UPDATE applications SET status = ?, admin_notes = ?, rejection_reason = ? WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->bind_param("sssi", $new_status, $data['admin_notes'], $rejection_reason, $id);
        
        if ($stmt->execute()) {
            // Send email notification if status changed to approved or rejected
            if ($application['current_status'] !== $new_status && 
                ($new_status === 'approved' || $new_status === 'rejected')) {
                
                // Update application data with new status for email
                $application['status'] = $new_status;
                $email_sent = sendApplicationNotification($application, $new_status, $rejection_reason);
                
                if ($email_sent) {
                    $email_message = " and email notification sent";
                } else {
                    $email_message = " but email notification failed";
                }
            }
            
            echo json_encode([
                'success' => true, 
                'message' => "Application updated successfully{$email_message}",
                'email_sent' => $email_sent
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update application']);
        }
        
        $stmt->close();
    } else {
        $sql = "UPDATE applications SET move_in_date = ?, whatsapp_contact = ?, additional_notes = ? WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->bind_param("sssi", 
            $data['move_in_date'],
            $data['whatsapp_contact'],
            $data['additional_notes'],
            $id
        );
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Application updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update application']);
        }
        
        $stmt->close();
    }
}

function deleteApplication($id) {
    global $db;
    
    // Check if user is admin
    if (!isset($_SESSION['user']) || !$_SESSION['user']['is_admin']) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Admin access required']);
        return;
    }
    
    $sql = "DELETE FROM applications WHERE id = ?";
    $stmt = $db->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Application deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to delete application']);
        }
        
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
}

function sendApplicationNotification($application, $action, $rejection_reason = '') {
    $to = $application['applicant_email'];
    $applicant_name = $application['applicant_name'];
    $apartment_title = $application['apartment_title'];
    $apartment_address = $application['address'] . ', ' . $application['city'] . ', ' . $application['state'];
    
    if ($action === 'approved') {
        $subject = "🎉 Your Apartment Application Has Been Approved - Zinq Bridge Apartments";
        
        $message = "
        <html>
        <head>
            <style>
                body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
                .success-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; margin: 10px 0; }
                .apartment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6366f1; }
                .payment-info { background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🏠 Zinq Bridge Apartments</h1>
                    <h2>Congratulations!</h2>
                </div>
                <div class='content'>
                    <div class='success-badge'>✅ APPLICATION APPROVED</div>
                    
                    <p>Dear {$applicant_name},</p>
                    
                    <p>We are delighted to inform you that your apartment application has been <strong>approved</strong>!</p>
                    
                    <div class='apartment-details'>
                        <h3>📍 Apartment Details:</h3>
                        <p><strong>Property:</strong> {$apartment_title}</p>
                        <p><strong>Address:</strong> {$apartment_address}</p>
                        <p><strong>Application ID:</strong> #{$application['id']}</p>
                    </div>
                    
                    <div class='payment-info'>
                        <h3>💳 Payment Information</h3>
                        <p><strong>Important:</strong> Payment will be done directly at the apartment location. Our leasing team will contact you within 24 hours to schedule your move-in appointment and payment collection.</p>
                    </div>
                    
                    <h3>🎯 Next Steps:</h3>
                    <ul>
                        <li>Our leasing team will contact you within 24 hours</li>
                        <li>Schedule your move-in appointment</li>
                        <li>Prepare required documents and payment</li>
                        <li>Complete the lease signing process</li>
                    </ul>
                    
                    <p>Welcome to the Zinq Bridge Apartments community! We look forward to having you as our valued tenant.</p>
                    
                    <p>If you have any questions, please don't hesitate to contact us at <a href='mailto:leasing@zinqbridge.com'>leasing@zinqbridge.com</a> or call us at +234 (0) 803 123 4567.</p>
                    
                    <div class='footer'>
                        <p>Best regards,<br>
                        <strong>Zinq Bridge Apartments Team</strong><br>
                        4th Floor Tower C, ChurchGate Plaza<br>
                        Constitution Avenue, Abuja, FCT</p>
                    </div>
                </div>
            </div>
        </body>
        </html>";
        
    } else { // rejected
        $subject = "Update on Your Apartment Application - Zinq Bridge Apartments";
        
        $message = "
        <html>
        <head>
            <style>
                body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #ef4444, #f97316); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
                .rejection-badge { background: #ef4444; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; margin: 10px 0; }
                .apartment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
                .reason-box { background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🏠 Zinq Bridge Apartments</h1>
                    <h2>Application Update</h2>
                </div>
                <div class='content'>
                    <div class='rejection-badge'>❌ APPLICATION NOT APPROVED</div>
                    
                    <p>Dear {$applicant_name},</p>
                    
                    <p>Thank you for your interest in Zinq Bridge Apartments. After careful review, we regret to inform you that we are unable to approve your application at this time.</p>
                    
                    <div class='apartment-details'>
                        <h3>📍 Application Details:</h3>
                        <p><strong>Property:</strong> {$apartment_title}</p>
                        <p><strong>Address:</strong> {$apartment_address}</p>
                        <p><strong>Application ID:</strong> #{$application['id']}</p>
                    </div>";
                    
        if (!empty($rejection_reason)) {
            $message .= "
                    <div class='reason-box'>
                        <h3>📋 Reason for Decision:</h3>
                        <p>{$rejection_reason}</p>
                    </div>";
        }
        
        $message .= "
                    <h3>🔄 What's Next:</h3>
                    <ul>
                        <li>You may apply for other available apartments</li>
                        <li>Contact us if you'd like to discuss your application</li>
                        <li>We encourage you to reapply in the future</li>
                    </ul>
                    
                    <p>We appreciate your interest in our community and encourage you to explore other opportunities with us. Please feel free to browse our available apartments and apply for any that meet your needs.</p>
                    
                    <p>If you have any questions about this decision or would like to discuss your application, please contact us at <a href='mailto:leasing@zinqbridge.com'>leasing@zinqbridge.com</a> or call us at +234 (0) 803 123 4567.</p>
                    
                    <div class='footer'>
                        <p>Best regards,<br>
                        <strong>Zinq Bridge Apartments Team</strong><br>
                        4th Floor Tower C, ChurchGate Plaza<br>
                        Constitution Avenue, Abuja, FCT</p>
                    </div>
                </div>
            </div>
        </body>
        </html>";
    }
    
    // Simple email sending using PHP's mail() function with fallback logging
    return sendEmailSMTP($to, $subject, $message, $action);
}

function sendEmailSMTP($to, $subject, $message, $action) {
    // Include PHPMailer setup for real email delivery
    require_once __DIR__ . '/phpmailer_setup.php';
    
    // Try to send real email
    return sendRealEmail($to, $subject, $message, $action);
}
?>
