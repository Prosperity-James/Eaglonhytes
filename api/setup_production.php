<?php
/**
 * Production Setup Script
 * Run this once after deploying to production to configure the application
 * 
 * SECURITY: Delete this file after running!
 */

// Prevent running in production accidentally
if (file_exists(__DIR__ . '/.env')) {
    $env = parse_ini_file(__DIR__ . '/.env');
    if (isset($env['APP_ENV']) && $env['APP_ENV'] === 'production') {
        die('⚠️ This script should not be run in production. Delete this file for security.');
    }
}

require_once __DIR__ . '/config.php';

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Eaglonhytes Production Setup</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .success { color: #28a745; }
        .error { color: #dc3545; }
        .warning { color: #ffc107; }
        .info { color: #17a2b8; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
        .section { margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>🚀 Eaglonhytes Production Setup</h1>
    
    <?php
    $errors = [];
    $warnings = [];
    $success = [];
    
    // Check 1: Environment File
    echo "<div class='section'>";
    echo "<h2>1. Environment Configuration</h2>";
    if (file_exists(__DIR__ . '/.env')) {
        echo "<p class='success'>✅ .env file exists</p>";
        $success[] = "Environment file found";
    } else {
        echo "<p class='error'>❌ .env file missing</p>";
        echo "<p>Create <code>api/.env</code> file from <code>api/.env.example</code></p>";
        $errors[] = "Missing .env file";
    }
    echo "</div>";
    
    // Check 2: Database Connection
    echo "<div class='section'>";
    echo "<h2>2. Database Connection</h2>";
    if ($db->connect_errno) {
        echo "<p class='error'>❌ Database connection failed: " . $db->connect_error . "</p>";
        $errors[] = "Database connection failed";
    } else {
        echo "<p class='success'>✅ Database connected successfully</p>";
        echo "<p class='info'>Database: " . DB_NAME . "</p>";
        $success[] = "Database connection working";
    }
    echo "</div>";
    
    // Check 3: Required Tables
    echo "<div class='section'>";
    echo "<h2>3. Database Tables</h2>";
    $required_tables = ['users', 'lands', 'land_applications', 'contact_messages', 'notifications'];
    $missing_tables = [];
    
    foreach ($required_tables as $table) {
        $result = $db->query("SHOW TABLES LIKE '$table'");
        if ($result && $result->num_rows > 0) {
            echo "<p class='success'>✅ Table '$table' exists</p>";
        } else {
            echo "<p class='error'>❌ Table '$table' missing</p>";
            $missing_tables[] = $table;
        }
    }
    
    if (empty($missing_tables)) {
        $success[] = "All required tables exist";
    } else {
        echo "<p class='warning'>⚠️ Run database migrations to create missing tables</p>";
        $warnings[] = "Some tables are missing";
    }
    echo "</div>";
    
    // Check 4: Upload Directories
    echo "<div class='section'>";
    echo "<h2>4. Upload Directories</h2>";
    $upload_dirs = [
        'uploads' => __DIR__ . '/uploads',
        'uploads/lands' => __DIR__ . '/uploads/lands',
        'uploads/profile_pictures' => __DIR__ . '/uploads/profile_pictures'
    ];
    
    foreach ($upload_dirs as $name => $path) {
        if (is_dir($path)) {
            if (is_writable($path)) {
                echo "<p class='success'>✅ Directory '$name' exists and is writable</p>";
            } else {
                echo "<p class='warning'>⚠️ Directory '$name' exists but is not writable</p>";
                echo "<p>Run: <code>chmod 755 $path</code></p>";
                $warnings[] = "Directory $name not writable";
            }
        } else {
            echo "<p class='error'>❌ Directory '$name' missing</p>";
            if (mkdir($path, 0755, true)) {
                echo "<p class='success'>✅ Created directory '$name'</p>";
                $success[] = "Created directory $name";
            } else {
                echo "<p class='error'>❌ Failed to create directory '$name'</p>";
                $errors[] = "Could not create directory $name";
            }
        }
    }
    echo "</div>";
    
    // Check 5: Admin User
    echo "<div class='section'>";
    echo "<h2>5. Admin User</h2>";
    $admin_check = $db->query("SELECT COUNT(*) as count FROM users WHERE is_admin = 1");
    if ($admin_check) {
        $row = $admin_check->fetch_assoc();
        if ($row['count'] > 0) {
            echo "<p class='success'>✅ Admin user(s) exist: " . $row['count'] . "</p>";
            $success[] = "Admin users configured";
        } else {
            echo "<p class='error'>❌ No admin users found</p>";
            echo "<p>Create an admin user manually or run the database seed script</p>";
            $errors[] = "No admin users";
        }
    }
    echo "</div>";
    
    // Check 6: PHP Configuration
    echo "<div class='section'>";
    echo "<h2>6. PHP Configuration</h2>";
    
    $php_checks = [
        'mysqli' => extension_loaded('mysqli'),
        'json' => extension_loaded('json'),
        'fileinfo' => extension_loaded('fileinfo'),
        'session' => extension_loaded('session')
    ];
    
    foreach ($php_checks as $ext => $loaded) {
        if ($loaded) {
            echo "<p class='success'>✅ PHP extension '$ext' loaded</p>";
        } else {
            echo "<p class='error'>❌ PHP extension '$ext' not loaded</p>";
            $errors[] = "Missing PHP extension: $ext";
        }
    }
    
    // Check upload limits
    $upload_max = ini_get('upload_max_filesize');
    $post_max = ini_get('post_max_size');
    echo "<p class='info'>📊 Upload max filesize: $upload_max</p>";
    echo "<p class='info'>📊 Post max size: $post_max</p>";
    
    if (IS_PRODUCTION) {
        $display_errors = ini_get('display_errors');
        if ($display_errors == '0' || $display_errors == 'Off') {
            echo "<p class='success'>✅ display_errors is OFF (good for production)</p>";
        } else {
            echo "<p class='warning'>⚠️ display_errors is ON (should be OFF in production)</p>";
            $warnings[] = "display_errors should be OFF in production";
        }
    }
    echo "</div>";
    
    // Check 7: Security
    echo "<div class='section'>";
    echo "<h2>7. Security Checks</h2>";
    
    // Check HTTPS
    $is_https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') 
        || (!empty($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);
    
    if ($is_https) {
        echo "<p class='success'>✅ HTTPS is enabled</p>";
    } else {
        if (IS_PRODUCTION) {
            echo "<p class='error'>❌ HTTPS is not enabled (required for production)</p>";
            $errors[] = "HTTPS not enabled in production";
        } else {
            echo "<p class='info'>ℹ️ HTTPS not enabled (OK for development)</p>";
        }
    }
    
    // Check session security
    if (SESSION_SECURE && !$is_https) {
        echo "<p class='warning'>⚠️ SESSION_SECURE is true but HTTPS is not enabled</p>";
        $warnings[] = "Session security mismatch";
    }
    
    echo "</div>";
    
    // Summary
    echo "<div class='section'>";
    echo "<h2>📊 Summary</h2>";
    echo "<p><strong class='success'>✅ Successes: " . count($success) . "</strong></p>";
    echo "<p><strong class='warning'>⚠️ Warnings: " . count($warnings) . "</strong></p>";
    echo "<p><strong class='error'>❌ Errors: " . count($errors) . "</strong></p>";
    
    if (empty($errors)) {
        echo "<h3 class='success'>🎉 Setup Complete!</h3>";
        echo "<p>Your application is ready for production.</p>";
        echo "<p class='error'><strong>IMPORTANT: Delete this file (setup_production.php) for security!</strong></p>";
    } else {
        echo "<h3 class='error'>⚠️ Setup Incomplete</h3>";
        echo "<p>Please fix the errors above before deploying to production.</p>";
    }
    echo "</div>";
    
    // Next Steps
    echo "<div class='section'>";
    echo "<h2>📝 Next Steps</h2>";
    echo "<ol>";
    echo "<li>Fix any errors or warnings listed above</li>";
    echo "<li>Test all functionality (login, register, land listings, etc.)</li>";
    echo "<li>Change default admin password</li>";
    echo "<li>Set up regular database backups</li>";
    echo "<li>Configure monitoring and logging</li>";
    echo "<li><strong>Delete this setup_production.php file</strong></li>";
    echo "</ol>";
    echo "</div>";
    ?>
    
    <div class="section">
        <h2>📚 Documentation</h2>
        <p>For detailed deployment instructions, see <code>DEPLOYMENT_GUIDE.md</code></p>
    </div>
</body>
</html>
