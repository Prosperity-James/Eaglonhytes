<?php
// Comprehensive Error Tracker for Eaglonhytes
// This script will help identify where errors are coming from

// Enable error reporting and logging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error_log.txt');

// Start output buffering to capture any output
ob_start();

// Custom error handler
function customErrorHandler($errno, $errstr, $errfile, $errline) {
    $error_types = [
        E_ERROR => 'FATAL ERROR',
        E_WARNING => 'WARNING',
        E_PARSE => 'PARSE ERROR',
        E_NOTICE => 'NOTICE',
        E_CORE_ERROR => 'CORE ERROR',
        E_CORE_WARNING => 'CORE WARNING',
        E_COMPILE_ERROR => 'COMPILE ERROR',
        E_COMPILE_WARNING => 'COMPILE WARNING',
        E_USER_ERROR => 'USER ERROR',
        E_USER_WARNING => 'USER WARNING',
        E_USER_NOTICE => 'USER NOTICE',
        E_STRICT => 'STRICT NOTICE',
        E_RECOVERABLE_ERROR => 'RECOVERABLE ERROR',
        E_DEPRECATED => 'DEPRECATED',
        E_USER_DEPRECATED => 'USER DEPRECATED'
    ];
    
    $error_type = $error_types[$errno] ?? 'UNKNOWN ERROR';
    $timestamp = date('Y-m-d H:i:s');
    
    $error_message = "[$timestamp] $error_type: $errstr in $errfile on line $errline\n";
    
    // Log to file
    file_put_contents(__DIR__ . '/error_log.txt', $error_message, FILE_APPEND | LOCK_EX);
    
    // Display in browser
    echo "<div style='background:#ffebee;border:1px solid #f44336;padding:10px;margin:5px;border-radius:5px;'>";
    echo "<strong style='color:#f44336;'>$error_type:</strong> $errstr<br>";
    echo "<small style='color:#666;'>File: $errfile (Line: $errline)</small>";
    echo "</div>";
    
    return true;
}

// Set custom error handler
set_error_handler('customErrorHandler');

// Custom exception handler
function customExceptionHandler($exception) {
    $timestamp = date('Y-m-d H:i:s');
    $error_message = "[$timestamp] UNCAUGHT EXCEPTION: " . $exception->getMessage() . 
                    " in " . $exception->getFile() . " on line " . $exception->getLine() . "\n";
    
    file_put_contents(__DIR__ . '/error_log.txt', $error_message, FILE_APPEND | LOCK_EX);
    
    echo "<div style='background:#ffebee;border:1px solid #f44336;padding:10px;margin:5px;border-radius:5px;'>";
    echo "<strong style='color:#f44336;'>UNCAUGHT EXCEPTION:</strong> " . $exception->getMessage() . "<br>";
    echo "<small style='color:#666;'>File: " . $exception->getFile() . " (Line: " . $exception->getLine() . ")</small>";
    echo "</div>";
}

set_exception_handler('customExceptionHandler');

?>
<!DOCTYPE html>
<html>
<head>
    <title>🔍 Eaglonhytes Error Tracker</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .success { color: #4caf50; background: #e8f5e8; padding: 10px; border-radius: 5px; margin: 5px 0; }
        .error { color: #f44336; background: #ffebee; padding: 10px; border-radius: 5px; margin: 5px 0; }
        .warning { color: #ff9800; background: #fff3e0; padding: 10px; border-radius: 5px; margin: 5px 0; }
        .info { color: #2196f3; background: #e3f2fd; padding: 10px; border-radius: 5px; margin: 5px 0; }
        .test-section { border: 1px solid #ddd; margin: 15px 0; padding: 15px; border-radius: 8px; }
        .test-button { background: #007cba; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
        .test-button:hover { background: #005a8b; }
        pre { background: #f8f8f8; padding: 10px; border-radius: 5px; overflow-x: auto; }
        .log-viewer { max-height: 300px; overflow-y: auto; background: #f8f8f8; padding: 10px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Eaglonhytes Error Tracker & Diagnostic Tool</h1>
        
        <?php
        // Clear previous errors
        if (isset($_GET['clear_log'])) {
            file_put_contents(__DIR__ . '/error_log.txt', '');
            echo "<div class='success'>✅ Error log cleared!</div>";
        }
        
        echo "<div class='info'>📊 Current Time: " . date('Y-m-d H:i:s') . "</div>";
        ?>
        
        <!-- Test Buttons -->
        <div class="test-section">
            <h3>🧪 Quick Tests</h3>
            <a href="?test=database" class="test-button">Test Database</a>
            <a href="?test=login" class="test-button">Test Login API</a>
            <a href="?test=session" class="test-button">Test Sessions</a>
            <a href="?test=cors" class="test-button">Test CORS</a>
            <a href="?test=all" class="test-button">Run All Tests</a>
            <a href="?clear_log=1" class="test-button" style="background:#f44336;">Clear Error Log</a>
        </div>
        
        <?php
        // Include config and test based on GET parameter
        try {
            require_once __DIR__ . "/config.php";
            
            $test = $_GET['test'] ?? '';
            
            switch ($test) {
                case 'database':
                    testDatabase($db);
                    break;
                case 'login':
                    testLoginAPI($db);
                    break;
                case 'session':
                    testSessions();
                    break;
                case 'cors':
                    testCORS();
                    break;
                case 'all':
                    testDatabase($db);
                    testLoginAPI($db);
                    testSessions();
                    testCORS();
                    break;
            }
            
        } catch (Exception $e) {
            echo "<div class='error'>❌ CRITICAL ERROR: " . $e->getMessage() . "</div>";
            echo "<div class='error'>File: " . $e->getFile() . " (Line: " . $e->getLine() . ")</div>";
        }
        
        // Database Test Function
        function testDatabase($db) {
            echo "<div class='test-section'>";
            echo "<h3>🗄️ Database Test Results</h3>";
            
            if ($db->connect_errno) {
                echo "<div class='error'>❌ Database Connection Failed: " . $db->connect_error . "</div>";
                return;
            }
            
            echo "<div class='success'>✅ Database Connected Successfully</div>";
            
            // Test tables
            $tables = ['users', 'lands', 'messages'];
            foreach ($tables as $table) {
                try {
                    $result = $db->query("SELECT COUNT(*) as count FROM $table");
                    if ($result) {
                        $count = $result->fetch_assoc()['count'];
                        echo "<div class='success'>✅ Table '$table': $count records</div>";
                    } else {
                        echo "<div class='error'>❌ Table '$table': Query failed - " . $db->error . "</div>";
                    }
                } catch (Exception $e) {
                    echo "<div class='error'>❌ Table '$table': " . $e->getMessage() . "</div>";
                }
            }
            echo "</div>";
        }
        
        // Login API Test Function
        function testLoginAPI($db) {
            echo "<div class='test-section'>";
            echo "<h3>🔐 Login API Test Results</h3>";
            
            try {
                // Test admin user
                $stmt = $db->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
                $email = 'admin@eaglonhytes.com';
                $stmt->bind_param("s", $email);
                $stmt->execute();
                $result = $stmt->get_result();
                $user = $result->fetch_assoc();
                
                if ($user) {
                    echo "<div class='success'>✅ Admin user found: " . $user['full_name'] . "</div>";
                    
                    if (password_verify('password', $user['password'])) {
                        echo "<div class='success'>✅ Password verification successful</div>";
                    } else {
                        echo "<div class='error'>❌ Password verification failed</div>";
                    }
                } else {
                    echo "<div class='error'>❌ Admin user not found</div>";
                }
                
                // Test login endpoint
                if (file_exists(__DIR__ . '/login.php')) {
                    echo "<div class='success'>✅ Login API file exists</div>";
                } else {
                    echo "<div class='error'>❌ Login API file missing</div>";
                }
                
            } catch (Exception $e) {
                echo "<div class='error'>❌ Login test error: " . $e->getMessage() . "</div>";
            }
            echo "</div>";
        }
        
        // Session Test Function
        function testSessions() {
            echo "<div class='test-section'>";
            echo "<h3>🍪 Session Test Results</h3>";
            
            try {
                if (session_status() === PHP_SESSION_NONE) {
                    session_start();
                }
                
                if (session_status() === PHP_SESSION_ACTIVE) {
                    echo "<div class='success'>✅ Sessions are working</div>";
                    echo "<div class='info'>📋 Session ID: " . session_id() . "</div>";
                    
                    // Test session write
                    $_SESSION['test'] = 'error_tracker_test';
                    if (isset($_SESSION['test'])) {
                        echo "<div class='success'>✅ Session write/read working</div>";
                        unset($_SESSION['test']);
                    } else {
                        echo "<div class='error'>❌ Session write/read failed</div>";
                    }
                } else {
                    echo "<div class='error'>❌ Sessions not working</div>";
                }
                
            } catch (Exception $e) {
                echo "<div class='error'>❌ Session test error: " . $e->getMessage() . "</div>";
            }
            echo "</div>";
        }
        
        // CORS Test Function
        function testCORS() {
            echo "<div class='test-section'>";
            echo "<h3>🌐 CORS Configuration Test</h3>";
            
            if (defined('FRONTEND_URL')) {
                echo "<div class='success'>✅ FRONTEND_URL defined: " . FRONTEND_URL . "</div>";
            } else {
                echo "<div class='error'>❌ FRONTEND_URL not defined</div>";
            }
            
            // Check if headers are being sent correctly
            $headers = headers_list();
            $cors_found = false;
            foreach ($headers as $header) {
                if (strpos($header, 'Access-Control-Allow-Origin') !== false) {
                    echo "<div class='success'>✅ CORS header found: $header</div>";
                    $cors_found = true;
                }
            }
            
            if (!$cors_found) {
                echo "<div class='warning'>⚠️ No CORS headers detected in this request</div>";
            }
            
            echo "</div>";
        }
        ?>
        
        <!-- Error Log Viewer -->
        <div class="test-section">
            <h3>📋 Recent Error Log</h3>
            <?php
            $error_log_file = __DIR__ . '/error_log.txt';
            if (file_exists($error_log_file)) {
                $log_content = file_get_contents($error_log_file);
                if (!empty($log_content)) {
                    echo "<div class='log-viewer'><pre>" . htmlspecialchars($log_content) . "</pre></div>";
                } else {
                    echo "<div class='success'>✅ No errors logged recently!</div>";
                }
            } else {
                echo "<div class='info'>📝 Error log file will be created when first error occurs</div>";
            }
            ?>
        </div>
        
        <!-- API Endpoints Status -->
        <div class="test-section">
            <h3>🔗 API Endpoints Status</h3>
            <?php
            $endpoints = [
                'login.php' => 'Login API',
                'register.php' => 'Registration API',
                'session.php' => 'Session API',
                'logout.php' => 'Logout API',
                'messages.php' => 'Messages API',
                'lands.php' => 'Lands API'
            ];
            
            foreach ($endpoints as $file => $name) {
                if (file_exists(__DIR__ . "/$file")) {
                    echo "<div class='success'>✅ $name exists</div>";
                } else {
                    echo "<div class='error'>❌ $name missing</div>";
                }
            }
            ?>
        </div>
        
        <!-- System Information -->
        <div class="test-section">
            <h3>💻 System Information</h3>
            <div class='info'>🐘 PHP Version: <?php echo PHP_VERSION; ?></div>
            <div class='info'>🗄️ MySQL Extension: <?php echo extension_loaded('mysqli') ? 'Loaded' : 'Not Loaded'; ?></div>
            <div class='info'>🍪 Session Extension: <?php echo extension_loaded('session') ? 'Loaded' : 'Not Loaded'; ?></div>
            <div class='info'>📁 Current Directory: <?php echo __DIR__; ?></div>
            <div class='info'>🌐 Server: <?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'; ?></div>
        </div>
        
        <div class="info">
            <strong>💡 How to use this tool:</strong><br>
            1. Click the test buttons above to run specific tests<br>
            2. Check the error log section for any PHP errors<br>
            3. Any errors will be highlighted in red with file and line information<br>
            4. Green messages indicate everything is working correctly
        </div>
    </div>
</body>
</html>

<?php
// Flush output buffer
ob_end_flush();
?>
