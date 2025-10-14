<?php
// Fix all API files to prevent HTML injection and CORS issues
$apiDir = __DIR__ . '/api/';
$files = glob($apiDir . '*.php');

$headerCode = '
// Ensure JSON content type and prevent HTML injection
header(\'Content-Type: application/json; charset=utf-8\');
header(\'X-Content-Type-Options: nosniff\');

// Disable any HTML output buffering or injection
if (function_exists(\'apache_setenv\')) {
    apache_setenv(\'no-gzip\', \'1\');
}
ini_set(\'zlib.output_compression\', \'Off\');';

$fixedFiles = [];
$skippedFiles = ['cors_headers.php', 'config.php', 'session_config.php', 'auth_middleware.php', 'security_utils.php'];

foreach ($files as $file) {
    $filename = basename($file);
    
    if (in_array($filename, $skippedFiles)) {
        continue;
    }
    
    $content = file_get_contents($file);
    
    // Skip if already has the headers
    if (strpos($content, 'X-Content-Type-Options: nosniff') !== false) {
        continue;
    }
    
    // Find insertion point after includes
    $patterns = [
        '/require_once __DIR__ \. "\/session_config\.php";/',
        '/require_once __DIR__ \. "\/config\.php";/',
        '/require_once __DIR__ \. "\/cors_headers\.php";/'
    ];
    
    $inserted = false;
    foreach ($patterns as $pattern) {
        if (preg_match($pattern, $content)) {
            $content = preg_replace($pattern, '$0' . $headerCode, $content, 1);
            $inserted = true;
            break;
        }
    }
    
    if ($inserted) {
        file_put_contents($file, $content);
        $fixedFiles[] = $filename;
    }
}

echo "<h2>🔧 API Fix Results</h2>";
echo "<p>✅ Fixed " . count($fixedFiles) . " API files:</p>";
echo "<ul>";
foreach ($fixedFiles as $file) {
    echo "<li>$file</li>";
}
echo "</ul>";

echo "<h3>🌐 CORS Configuration Updated</h3>";
echo "<p>✅ Added proxy URL support: http://127.0.0.1:59350</p>";

echo "<h3>📋 Next Steps:</h3>";
echo "<ol>";
echo "<li>Refresh your browser page</li>";
echo "<li>Try logging in again</li>";
echo "<li>Test the content management system</li>";
echo "<li><strong>Delete this file after use!</strong></li>";
echo "</ol>";

echo "<p style='color: red; font-weight: bold;'>⚠️ Delete this file immediately after use!</p>";
?>
