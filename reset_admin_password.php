<?php
// Reset admin password - Run this once then delete the file
require_once 'api/config.php';

try {
    // Set new password here
    $newPassword = 'admin123'; // Change this to your desired password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
    // Update admin user password
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE role IN ('admin', 'super_admin') LIMIT 1");
    $stmt->execute([$hashedPassword]);
    
    if ($stmt->rowCount() > 0) {
        echo "✅ Admin password reset successfully!\n";
        echo "📧 Email: Check your database for the admin email\n";
        echo "🔑 Password: " . $newPassword . "\n";
        echo "⚠️  Please delete this file after use for security!\n";
    } else {
        echo "❌ No admin user found in database\n";
    }
    
    // Show admin users
    echo "\n📋 Current admin users:\n";
    $stmt = $pdo->query("SELECT id, full_name, email, role FROM users WHERE role IN ('admin', 'super_admin')");
    while ($user = $stmt->fetch()) {
        echo "- ID: {$user['id']}, Name: {$user['full_name']}, Email: {$user['email']}, Role: {$user['role']}\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
