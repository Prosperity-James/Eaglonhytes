<?php
require_once 'api/config.php';

try {
    echo "<h2>Admin Users in Database:</h2>";
    
    $stmt = $pdo->query("SELECT id, full_name, email, role, created_at FROM users WHERE role IN ('admin', 'super_admin')");
    $users = $stmt->fetchAll();
    
    if (empty($users)) {
        echo "<p>❌ No admin users found!</p>";
        
        // Create default admin
        $defaultEmail = 'admin@eaglonhytes.com';
        $defaultPassword = 'admin123';
        $hashedPassword = password_hash($defaultPassword, PASSWORD_DEFAULT);
        
        $stmt = $pdo->prepare("INSERT INTO users (full_name, email, password, role, is_admin) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute(['Super Admin', $defaultEmail, $hashedPassword, 'super_admin', 1]);
        
        echo "<p>✅ Created default admin user:</p>";
        echo "<p><strong>Email:</strong> $defaultEmail</p>";
        echo "<p><strong>Password:</strong> $defaultPassword</p>";
    } else {
        echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Created</th></tr>";
        
        foreach ($users as $user) {
            echo "<tr>";
            echo "<td>{$user['id']}</td>";
            echo "<td>{$user['full_name']}</td>";
            echo "<td>{$user['email']}</td>";
            echo "<td>{$user['role']}</td>";
            echo "<td>{$user['created_at']}</td>";
            echo "</tr>";
        }
        echo "</table>";
        
        echo "<h3>Reset Password for First Admin:</h3>";
        $newPassword = 'admin123';
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE role IN ('admin', 'super_admin') ORDER BY id LIMIT 1");
        $stmt->execute([$hashedPassword]);
        
        echo "<p>✅ Password reset for first admin user!</p>";
        echo "<p><strong>Email:</strong> {$users[0]['email']}</p>";
        echo "<p><strong>New Password:</strong> $newPassword</p>";
    }
    
    echo "<p><strong>⚠️ Delete this file after use!</strong></p>";
    
} catch (Exception $e) {
    echo "<p>❌ Error: " . $e->getMessage() . "</p>";
}
?>
