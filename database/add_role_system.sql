-- ============================================
-- Role-Based Access Control Migration
-- Eaglonhytes Real Estate Application
-- ============================================

USE eaglonhytes;

-- Step 1: Add role column to users table
ALTER TABLE users 
ADD COLUMN role ENUM('super_admin', 'admin', 'user') DEFAULT 'user' 
AFTER is_admin;

-- Step 2: Update existing admin users based on email
-- Set super admin (YOU)
UPDATE users 
SET role = 'super_admin' 
WHERE email = 'admin@eaglonhytes.com';

-- Set any other existing admins to regular admin role
UPDATE users 
SET role = 'admin' 
WHERE is_admin = 1 AND role != 'super_admin';

-- Step 3: Add created_by column to lands table (track who created each land)
ALTER TABLE lands 
ADD COLUMN created_by INT DEFAULT NULL 
AFTER featured;

-- Add foreign key constraint
ALTER TABLE lands 
ADD CONSTRAINT fk_lands_created_by 
FOREIGN KEY (created_by) REFERENCES users(id) 
ON DELETE SET NULL;

-- Step 4: Add index for better query performance
ALTER TABLE users ADD INDEX idx_role (role);

-- Step 5: Create audit log table for tracking admin actions
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    admin_email VARCHAR(255) NOT NULL,
    admin_role ENUM('super_admin', 'admin') NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id INT,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_admin_id (admin_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 6: Verify the changes
SELECT 
    'Users with roles' as info,
    role,
    COUNT(*) as count
FROM users
GROUP BY role;

SELECT 
    'Super Admin Account' as info,
    id,
    full_name,
    email,
    role
FROM users
WHERE role = 'super_admin';

-- ============================================
-- Migration Complete!
-- ============================================
-- Next steps:
-- 1. Run this migration: mysql -u root eaglonhytes < add_role_system.sql
-- 2. Verify super admin account exists
-- 3. Update backend APIs with role checks
-- 4. Deploy new dashboards
-- ============================================
