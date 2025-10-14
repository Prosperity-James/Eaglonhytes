<?php
// Comprehensive diagnostic for login issues
require_once __DIR__ . "/config.php";

echo "<h2>🔍 Eaglonhytes Login Diagnostic</h2>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .warning{color:orange;}</style>";

// 1. Database Connection
echo "<h3>1. Database Connection</h3>";
if ($db->connect_errno) {
    echo "<p class='error'>❌ Database connection failed: " . $db->connect_error . "</p>";
} else {
    echo "<p class='success'>✅ Database connected successfully</p>";
}

// 2. Check tables exist
echo "<h3>2. Database Tables</h3>";
$tables = ['users', 'lands', 'messages'];
foreach ($tables as $table) {
    $result = $db->query("SHOW TABLES LIKE '$table'");
    if ($result && $result->num_rows > 0) {
        echo "<p class='success'>✅ Table '$table' exists</p>";
        
        // Count records
        $count_result = $db->query("SELECT COUNT(*) as count FROM $table");
        if ($count_result) {
            $count = $count_result->fetch_assoc()['count'];
            echo "<p>&nbsp;&nbsp;&nbsp;📊 Records: $count</p>";
        }
    } else {
        echo "<p class='error'>❌ Table '$table' missing</p>";
    }
}

// 3. Check admin users
echo "<h3>3. Admin Users</h3>";
$users_result = $db->query("SELECT id, full_name, email, is_admin FROM users WHERE is_admin = 1");
if ($users_result && $users_result->num_rows > 0) {
    echo "<p class='success'>✅ Found " . $users_result->num_rows . " admin users:</p>";
    echo "<ul>";
    while ($user = $users_result->fetch_assoc()) {
        echo "<li>ID: {$user['id']}, Name: {$user['full_name']}, Email: {$user['email']}</li>";
    }
    echo "</ul>";
} else {
    echo "<p class='error'>❌ No admin users found!</p>";
}

// 4. Test password for main admin
echo "<h3>4. Password Test</h3>";
$admin_email = 'admin@eaglonhytes.com';
$test_password = 'password';

$stmt = $db->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $admin_email);
$stmt->execute();
$result = $stmt->get_result();
$admin_user = $result->fetch_assoc();

if ($admin_user) {
    echo "<p class='success'>✅ Admin user found: {$admin_user['full_name']}</p>";
    if (password_verify($test_password, $admin_user['password'])) {
        echo "<p class='success'>✅ Password verification successful!</p>";
    } else {
        echo "<p class='error'>❌ Password verification failed!</p>";
        echo "<p class='warning'>🔧 Fixing password...</p>";
        
        // Fix the password
        $new_hash = password_hash($test_password, PASSWORD_DEFAULT);
        $update_stmt = $db->prepare("UPDATE users SET password = ? WHERE email = ?");
        $update_stmt->bind_param("ss", $new_hash, $admin_email);
        if ($update_stmt->execute()) {
            echo "<p class='success'>✅ Password fixed! Try logging in again.</p>";
        } else {
            echo "<p class='error'>❌ Failed to fix password</p>";
        }
    }
} else {
    echo "<p class='error'>❌ Admin user not found!</p>";
}

// 5. Check CORS configuration
echo "<h3>5. CORS Configuration</h3>";
if (defined('FRONTEND_URL')) {
    echo "<p class='success'>✅ FRONTEND_URL: " . FRONTEND_URL . "</p>";
} else {
    echo "<p class='error'>❌ FRONTEND_URL not defined</p>";
}

// 6. Session test
echo "<h3>6. Session Test</h3>";
session_start();
if (session_status() === PHP_SESSION_ACTIVE) {
    echo "<p class='success'>✅ Sessions working</p>";
    echo "<p>Session ID: " . session_id() . "</p>";
} else {
    echo "<p class='error'>❌ Session issues</p>";
}

// 7. API Endpoints
echo "<h3>7. API Endpoints</h3>";
$endpoints = [
    'login.php' => 'Login API',
    'session.php' => 'Session API', 
    'register.php' => 'Registration API',
    'messages.php' => 'Messages API',
    'lands.php' => 'Lands API'
];

foreach ($endpoints as $file => $name) {
    if (file_exists(__DIR__ . "/$file")) {
        echo "<p class='success'>✅ $name exists</p>";
        echo "<p>&nbsp;&nbsp;&nbsp;🔗 <a href='http://localhost/Eaglonhytes/api/$file' target='_blank'>Test $name</a></p>";
    } else {
        echo "<p class='error'>❌ $name missing</p>";
    }
}

// 8. Quick login test
echo "<h3>8. Quick Login Test</h3>";
echo "<form method='POST' style='background:#f5f5f5;padding:15px;border-radius:5px;'>
    <input type='email' name='test_email' value='admin@eaglonhytes.com' placeholder='Email' style='margin:5px;padding:8px;'>
    <input type='password' name='test_password' value='password' placeholder='Password' style='margin:5px;padding:8px;'>
    <button type='submit' name='test_login' style='margin:5px;padding:8px;background:#007cba;color:white;border:none;border-radius:3px;'>Test Login</button>
</form>";

if (isset($_POST['test_login'])) {
    $email = $_POST['test_email'];
    $password = $_POST['test_password'];
    
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if ($user && password_verify($password, $user['password'])) {
        echo "<p class='success'>✅ Login test successful!</p>";
        $_SESSION['user'] = [
            'id' => $user['id'],
            'email' => $user['email'],
            'full_name' => $user['full_name'],
            'is_admin' => (bool)$user['is_admin']
        ];
        echo "<p class='success'>✅ Session created successfully!</p>";
    } else {
        echo "<p class='error'>❌ Login test failed!</p>";
    }
}

echo "<hr><p><strong>Next Steps:</strong></p>";
echo "<ol>";
echo "<li>If everything shows ✅, try logging in to your React app</li>";
echo "<li>If you see ❌ errors, those need to be fixed first</li>";
echo "<li>Check your browser console for JavaScript errors</li>";
echo "<li>Make sure your React dev server is running on the correct port</li>";
echo "</ol>";
?>
