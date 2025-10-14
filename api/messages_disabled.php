<?php
// MESSAGES API DISABLED
// All conversations are handled via WhatsApp
// This file has been disabled as per user request

require_once __DIR__ . "/config.php";
require_once __DIR__ . "/cors_headers.php";

// Return a message indicating messages are disabled
http_response_code(410); // Gone
echo json_encode([
    'success' => false,
    'message' => 'In-app messaging has been disabled. All communications are now handled via WhatsApp for faster response times.',
    'whatsapp_contact' => '+2347038779189',
    'whatsapp_url' => 'https://wa.me/2347038779189?text=Hello%20Eaglonhytes%20Support',
    'alternative_contact' => [
        'email' => 'support@eaglonhytes.com',
        'phone' => '+2347038779189',
        'business_hours' => 'Monday - Friday, 9:00 AM - 6:00 PM (WAT)'
    ],
    'redirect_info' => [
        'action' => 'redirect_to_whatsapp',
        'auto_redirect' => false,
        'show_contact_modal' => true
    ]
]);
exit();
?>
