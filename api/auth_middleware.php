<?php
/**
 * Role-Based Authentication Middleware
 * Eaglonhytes Real Estate Application
 */

// Check if user is authenticated
function requireAuth() {
    if (!isset($_SESSION['user']) || !isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Authentication required. Please login.'
        ]);
        exit;
    }
    return $_SESSION['user'];
}

// Check if user has specific role
function requireRole($allowedRoles) {
    $user = requireAuth();
    
    if (!isset($user['role'])) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Access denied. Invalid user role.'
        ]);
        exit;
    }
    
    // Convert single role to array
    if (!is_array($allowedRoles)) {
        $allowedRoles = [$allowedRoles];
    }
    
    if (!in_array($user['role'], $allowedRoles)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Access denied. Insufficient permissions.',
            'required_role' => $allowedRoles,
            'user_role' => $user['role']
        ]);
        exit;
    }
    
    return $user;
}

// Check if user is Super Admin
function requireSuperAdmin() {
    return requireRole('super_admin');
}

// Check if user is Admin or Super Admin
function requireAdmin() {
    return requireRole(['super_admin', 'admin']);
}

// Check if user is regular user
function requireUser() {
    return requireRole('user');
}

// Get user role
function getUserRole() {
    if (!isset($_SESSION['user']) || !isset($_SESSION['user']['role'])) {
        return null;
    }
    return $_SESSION['user']['role'];
}

// Check if user can perform action on resource
function canPerformAction($action, $resourceType, $resourceOwnerId = null) {
    $user = requireAuth();
    $role = $user['role'];
    
    // Super Admin can do everything
    if ($role === 'super_admin') {
        return true;
    }
    
    // Admin permissions
    if ($role === 'admin') {
        switch ($resourceType) {
            case 'land':
                // Admin can edit any land, but can only delete their own
                if ($action === 'delete') {
                    return $resourceOwnerId && $resourceOwnerId == $user['id'];
                }
                return in_array($action, ['create', 'edit', 'view']);
                
            case 'user':
                // Admin can only view/edit regular users, not other admins
                return in_array($action, ['view', 'edit']);
                
            case 'application':
                // Admin can manage all applications
                return in_array($action, ['view', 'approve', 'reject']);
                
            case 'message':
                // Admin can view and reply to messages
                return in_array($action, ['view', 'reply', 'mark_resolved']);
                
            case 'report':
                // Admin cannot view revenue reports
                return false;
                
            case 'settings':
                // Admin cannot access system settings
                return false;
                
            case 'export':
                // Admin cannot export data
                return false;
                
            default:
                return false;
        }
    }
    
    // Regular user permissions
    if ($role === 'user') {
        switch ($resourceType) {
            case 'land':
                return $action === 'view';
                
            case 'application':
                // Users can only view/create their own applications
                return in_array($action, ['view', 'create']) && 
                       ($resourceOwnerId === null || $resourceOwnerId == $user['id']);
                
            case 'profile':
                // Users can only edit their own profile
                return $resourceOwnerId == $user['id'];
                
            default:
                return false;
        }
    }
    
    return false;
}

// Log admin action for audit trail
function logAdminAction($db, $action, $targetType = null, $targetId = null, $details = null) {
    if (!isset($_SESSION['user'])) {
        return;
    }
    
    $user = $_SESSION['user'];
    $role = $user['role'] ?? 'user';
    
    // Only log admin and super_admin actions
    if (!in_array($role, ['super_admin', 'admin'])) {
        return;
    }
    
    $adminId = $user['id'];
    $adminEmail = $user['email'];
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $detailsJson = $details ? json_encode($details) : null;
    
    $stmt = $db->prepare("
        INSERT INTO admin_audit_log 
        (admin_id, admin_email, admin_role, action, target_type, target_id, details, ip_address) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->bind_param(
        "issssiss",
        $adminId,
        $adminEmail,
        $role,
        $action,
        $targetType,
        $targetId,
        $detailsJson,
        $ipAddress
    );
    
    $stmt->execute();
    $stmt->close();
}

// Filter users based on role (admins should not see other admins)
function filterUsersByRole($users, $viewerRole) {
    if ($viewerRole === 'super_admin') {
        // Super admin sees everyone
        return $users;
    }
    
    if ($viewerRole === 'admin') {
        // Admin only sees regular users
        return array_filter($users, function($user) {
            return isset($user['role']) && $user['role'] === 'user';
        });
    }
    
    // Regular users don't see user lists
    return [];
}

// Check if user can be modified by current user
function canModifyUser($targetUserId, $db) {
    $currentUser = requireAuth();
    $currentRole = $currentUser['role'];
    
    // Get target user's role
    $stmt = $db->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->bind_param("i", $targetUserId);
    $stmt->execute();
    $result = $stmt->get_result();
    $targetUser = $result->fetch_assoc();
    $stmt->close();
    
    if (!$targetUser) {
        return false;
    }
    
    $targetRole = $targetUser['role'];
    
    // Super admin can modify anyone except themselves (for safety)
    if ($currentRole === 'super_admin') {
        return $targetUserId != $currentUser['id'];
    }
    
    // Admin can only modify regular users
    if ($currentRole === 'admin') {
        return $targetRole === 'user';
    }
    
    // Regular users can only modify themselves
    return $targetUserId == $currentUser['id'];
}
?>
