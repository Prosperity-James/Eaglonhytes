<?php
// Create the missing land_applications table
require_once 'config.php';

$sql = "CREATE TABLE IF NOT EXISTS land_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    land_id INT NOT NULL,
    move_in_date DATE,
    employment_status VARCHAR(100),
    annual_income DECIMAL(15,2),
    whatsapp_contact VARCHAR(20),
    reference_contacts TEXT,
    additional_notes TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_notes TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (land_id) REFERENCES lands(id) ON DELETE CASCADE
)";

if ($db->query($sql) === TRUE) {
    echo "Table 'land_applications' created successfully\n";
    
    // Add some sample applications
    $sampleApplications = [
        [
            'user_id' => 2, // Assuming user ID 2 exists
            'land_id' => 1,
            'move_in_date' => '2024-12-01',
            'employment_status' => 'Full-time Employee',
            'annual_income' => 5000000.00,
            'whatsapp_contact' => '+2348123456789',
            'reference_contacts' => 'John Smith - +2348111222333, Mary Johnson - +2348444555666',
            'additional_notes' => 'I am interested in purchasing this land for residential purposes. I have been saving for this investment.',
            'status' => 'pending'
        ],
        [
            'user_id' => 3, // Assuming user ID 3 exists
            'land_id' => 2,
            'move_in_date' => '2024-11-15',
            'employment_status' => 'Business Owner',
            'annual_income' => 12000000.00,
            'whatsapp_contact' => '+2348987654321',
            'reference_contacts' => 'David Wilson - +2348777888999',
            'additional_notes' => 'Looking to buy this commercial plot for my expanding business operations.',
            'status' => 'approved',
            'admin_notes' => 'Application approved after document verification.'
        ],
        [
            'user_id' => 4, // Assuming user ID 4 exists
            'land_id' => 3,
            'move_in_date' => '2025-01-01',
            'employment_status' => 'Self-employed',
            'annual_income' => 3000000.00,
            'whatsapp_contact' => '+2348555666777',
            'reference_contacts' => 'Sarah Brown - +2348333444555',
            'additional_notes' => 'Interested in this land for future development project.',
            'status' => 'rejected',
            'rejection_reason' => 'Insufficient income documentation provided.',
            'admin_notes' => 'Applicant needs to provide additional income proof.'
        ]
    ];
    
    foreach ($sampleApplications as $app) {
        $stmt = $db->prepare("INSERT INTO land_applications (user_id, land_id, move_in_date, employment_status, annual_income, whatsapp_contact, reference_contacts, additional_notes, status, admin_notes, rejection_reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("iissdssssss", 
            $app['user_id'], 
            $app['land_id'], 
            $app['move_in_date'], 
            $app['employment_status'], 
            $app['annual_income'],
            $app['whatsapp_contact'],
            $app['reference_contacts'],
            $app['additional_notes'],
            $app['status'],
            $app['admin_notes'] ?? null,
            $app['rejection_reason'] ?? null
        );
        $stmt->execute();
        $stmt->close();
    }
    
    echo "Sample applications added successfully\n";
    
} else {
    echo "Error creating table: " . $db->error . "\n";
}

$db->close();
?>
