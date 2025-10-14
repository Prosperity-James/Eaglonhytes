-- ============================================
-- Role-Based Access Control Migration (SAFE VERSION)
-- Eaglonhytes Real Estate Application
-- Checks for existing columns before adding
-- ============================================

USE eaglonhytes;

-- Step 1: Add role column to users table (only if it doesn't exist)
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'eaglonhytes' 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME = 'role'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE users ADD COLUMN role ENUM(''super_admin'', ''admin'', ''user'') DEFAULT ''user'' AFTER is_admin',
    'SELECT ''Column role already exists'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 2: Update existing admin users based on email
-- Set super admin (YOU)
UPDATE users 
SET role = 'super_admin' 
WHERE email = 'admin@eaglonhytes.com';

-- Set any other existing admins to regular admin role
UPDATE users 
SET role = 'admin' 
WHERE is_admin = 1 AND role != 'super_admin';

-- Set all regular users
UPDATE users 
SET role = 'user' 
WHERE role IS NULL OR role = '';

-- Step 3: Add created_by column to lands table (only if it doesn't exist)
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'eaglonhytes' 
    AND TABLE_NAME = 'lands' 
    AND COLUMN_NAME = 'created_by'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE lands ADD COLUMN created_by INT DEFAULT NULL AFTER featured',
    'SELECT ''Column created_by already exists'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 4: Add foreign key constraint (only if it doesn't exist)
SET @fk_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = 'eaglonhytes' 
    AND TABLE_NAME = 'lands' 
    AND CONSTRAINT_NAME = 'fk_lands_created_by'
);

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE lands ADD CONSTRAINT fk_lands_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL',
    'SELECT ''Foreign key fk_lands_created_by already exists'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 5: Add index for role column (only if it doesn't exist)
SET @idx_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'eaglonhytes' 
    AND TABLE_NAME = 'users' 
    AND INDEX_NAME = 'idx_role'
);

SET @sql = IF(@idx_exists = 0,
    'ALTER TABLE users ADD INDEX idx_role (role)',
    'SELECT ''Index idx_role already exists'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 6: Create audit log table (only if it doesn't exist)
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

-- Step 7: Verify the changes
SELECT 
    '=== Users with roles ===' as info,
    role,
    COUNT(*) as count
FROM users
GROUP BY role;

SELECT 
    '=== Super Admin Account ===' as info,
    id,
    full_name,
    email,
    role,
    is_admin
FROM users
WHERE role = 'super_admin';

SELECT 
    '=== Admin Accounts ===' as info,
    id,
    full_name,
    email,
    role,
    is_admin
FROM users
WHERE role = 'admin';

SELECT 
    '=== Regular Users Count ===' as info,
    COUNT(*) as total_users
FROM users
WHERE role = 'user';

-- ============================================
-- Migration Complete!
-- ============================================
-- All changes applied safely with duplicate checks
-- ============================================
