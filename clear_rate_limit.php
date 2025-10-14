<?php
// Clear rate limiting and get admin credentials
require_once 'api/config.php';
require_once 'api/session_config.php';

session_start();

echo "<h2>🔧 System Reset & Admin Access</h2>";

// Clear all rate limiting
$cleared = 0;
foreach ($_SESSION as $key => $value) {
    if (strpos($key, 'rate_limit_') === 0) {
        unset($_SESSION[$key]);
        $cleared++;
    }
}

echo "<p>✅ Cleared $cleared rate limit entries from session</p>";

// Get/Create admin user
try {
    $stmt = $pdo->query("SELECT id, full_name, email, role FROM users WHERE role IN ('admin', 'super_admin') ORDER BY id LIMIT 1");
    $admin = $stmt->fetch();
    
    if (!$admin) {
        // Create default admin
        $defaultEmail = 'admin@eaglonhytes.com';
        $defaultPassword = 'admin123';
        $hashedPassword = password_hash($defaultPassword, PASSWORD_DEFAULT);
        
        $stmt = $pdo->prepare("INSERT INTO users (full_name, email, password, role, is_admin) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute(['Super Admin', $defaultEmail, $hashedPassword, 'super_admin', 1]);
        
        echo "<p>✅ Created new admin user</p>";
        echo "<div style='background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 10px 0;'>";
        echo "<h3>🔑 Admin Credentials:</h3>";
        echo "<p><strong>Email:</strong> $defaultEmail</p>";
        echo "<p><strong>Password:</strong> $defaultPassword</p>";
        echo "</div>";
    } else {
        // Reset existing admin password
        $newPassword = 'admin123';
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
        $stmt->execute([$hashedPassword, $admin['id']]);
        
        echo "<p>✅ Reset password for existing admin</p>";
        echo "<div style='background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 10px 0;'>";
        echo "<h3>🔑 Admin Credentials:</h3>";
        echo "<p><strong>Email:</strong> {$admin['email']}</p>";
        echo "<p><strong>Password:</strong> $newPassword</p>";
        echo "</div>";
    }
    
    echo "<div style='background: #fff3cd; padding: 15px; border-radius: 5px; margin: 10px 0;'>";
    echo "<h3>📋 Next Steps:</h3>";
    echo "<ol>";
    echo "<li>Go to: <a href='http://localhost:5173' target='_blank'>http://localhost:5173</a></li>";
    echo "<li>Use the credentials above to login</li>";
    echo "<li>Navigate to 'News & Updates' to test content management</li>";
    echo "<li><strong>Delete this file after use!</strong></li>";
    echo "</ol>";
    echo "</div>";
    
} catch (Exception $e) {
    echo "<p>❌ Database Error: " . $e->getMessage() . "</p>";
}

echo "<p style='color: red; font-weight: bold;'>⚠️ IMPORTANT: Delete this file immediately after use for security!</p>";
?>
