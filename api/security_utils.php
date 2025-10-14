<?php
/**
 * Security Utilities for Input Validation and Sanitization
 */

class SecurityUtils {
    
    /**
     * Sanitize string input
     */
    public static function sanitizeString($input, $maxLength = 255) {
        if (!is_string($input)) {
            return '';
        }
        
        // Remove null bytes and control characters
        $input = str_replace(chr(0), '', $input);
        $input = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $input);
        
        // Trim whitespace
        $input = trim($input);
        
        // Limit length
        if (strlen($input) > $maxLength) {
            $input = substr($input, 0, $maxLength);
        }
        
        return $input;
    }
    
    /**
     * Validate and sanitize email
     */
    public static function sanitizeEmail($email) {
        $email = self::sanitizeString($email, 320); // RFC 5321 limit
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }
        
        return strtolower($email);
    }
    
    /**
     * Validate password strength
     */
    public static function validatePassword($password) {
        $errors = [];
        
        if (strlen($password) < 6) {
            $errors[] = "Password must be at least 6 characters long";
        }
        
        if (strlen($password) > 128) {
            $errors[] = "Password must be less than 128 characters";
        }
        
        // Check for null bytes
        if (strpos($password, "\0") !== false) {
            $errors[] = "Password contains invalid characters";
        }
        
        return empty($errors) ? true : $errors;
    }
    
    /**
     * Sanitize integer input
     */
    public static function sanitizeInt($input, $min = null, $max = null) {
        $value = filter_var($input, FILTER_VALIDATE_INT);
        
        if ($value === false) {
            return false;
        }
        
        if ($min !== null && $value < $min) {
            return false;
        }
        
        if ($max !== null && $value > $max) {
            return false;
        }
        
        return $value;
    }
    
    /**
     * Generate CSRF token
     */
    public static function generateCSRFToken() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        
        return $_SESSION['csrf_token'];
    }
    
    /**
     * Verify CSRF token
     */
    public static function verifyCSRFToken($token) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!isset($_SESSION['csrf_token'])) {
            return false;
        }
        
        return hash_equals($_SESSION['csrf_token'], $token);
    }
    
    /**
     * Rate limiting check
     */
    public static function checkRateLimit($identifier, $maxAttempts = 5, $timeWindow = 900) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        $key = 'rate_limit_' . md5($identifier);
        $now = time();
        
        if (!isset($_SESSION[$key])) {
            $_SESSION[$key] = ['count' => 1, 'first_attempt' => $now];
            return true;
        }
        
        $data = $_SESSION[$key];
        
        // Reset if time window has passed
        if ($now - $data['first_attempt'] > $timeWindow) {
            $_SESSION[$key] = ['count' => 1, 'first_attempt' => $now];
            return true;
        }
        
        // Check if limit exceeded
        if ($data['count'] >= $maxAttempts) {
            return false;
        }
        
        // Increment counter
        $_SESSION[$key]['count']++;
        return true;
    }
    
    /**
     * Log security event
     */
    public static function logSecurityEvent($event, $details = []) {
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
            'event' => $event,
            'details' => $details
        ];
        
        $logFile = __DIR__ . '/logs/security.log';
        $logLine = json_encode($logEntry) . "\n";
        
        @file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
    }
    
    /**
     * Sanitize filename for uploads
     */
    public static function sanitizeFilename($filename) {
        // Remove path information
        $filename = basename($filename);
        
        // Remove dangerous characters
        $filename = preg_replace('/[^a-zA-Z0-9._-]/', '', $filename);
        
        // Prevent hidden files
        $filename = ltrim($filename, '.');
        
        // Limit length
        if (strlen($filename) > 100) {
            $extension = pathinfo($filename, PATHINFO_EXTENSION);
            $name = substr(pathinfo($filename, PATHINFO_FILENAME), 0, 95 - strlen($extension));
            $filename = $name . '.' . $extension;
        }
        
        return $filename ?: 'file';
    }
}
?>
