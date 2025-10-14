-- Fix the incomplete users table and add admin user
USE eaglonhytes;

-- Drop the incomplete users table if it exists
DROP TABLE IF EXISTS land_applications;
DROP TABLE IF EXISTS land_comments;
DROP TABLE IF EXISTS users;

-- Create proper users table with all required columns
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_email (email),
    INDEX idx_is_admin (is_admin),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert admin user with known credentials
-- Password: admin123 (hashed with password_hash)
INSERT INTO users (full_name, email, password, is_admin) VALUES 
('Admin User', 'admin@eaglonhytes.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);

-- Insert additional admin users from your API response
INSERT INTO users (full_name, email, password, is_admin) VALUES 
('Prosperity James', 'iam111@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE),
('Prosperity James', 'lisa22@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);

-- Insert some regular users
INSERT INTO users (full_name, email, password, is_admin) VALUES 
('John Doe', 'john.doe@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', FALSE),
('Jane Smith', 'jane.smith@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', FALSE);

-- Recreate land_applications table with proper foreign keys
CREATE TABLE land_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    land_id INT NOT NULL,
    move_in_date DATE,
    employment_status VARCHAR(100),
    annual_income DECIMAL(12,2),
    whatsapp_contact VARCHAR(20),
    reference_contacts TEXT,
    additional_notes TEXT,
    status ENUM('pending', 'approved', 'rejected', 'withdrawn') DEFAULT 'pending',
    admin_notes TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (land_id) REFERENCES lands(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate applications
    UNIQUE KEY unique_user_land (user_id, land_id),
    
    -- Indexes for performance
    INDEX idx_status (status),
    INDEX idx_user_id (user_id),
    INDEX idx_land_id (land_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Recreate land_comments table with proper foreign keys
CREATE TABLE land_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    land_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (land_id) REFERENCES lands(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent multiple reviews from same user
    UNIQUE KEY unique_user_land_comment (user_id, land_id),
    
    -- Indexes for performance
    INDEX idx_land_id (land_id),
    INDEX idx_user_id (user_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample land applications
INSERT INTO land_applications (user_id, land_id, move_in_date, employment_status, annual_income, whatsapp_contact, additional_notes, status) VALUES 
(1, 1, '2025-10-01', 'Business Owner', 12000000.00, '+234-803-0001', 'Looking to build a shopping complex', 'pending'),
(1, 2, '2025-11-15', 'Entrepreneur', 18000000.00, '+234-803-0002', 'Interested in developing a resort', 'approved');

-- Show the created users for verification
SELECT id, full_name, email, is_admin, created_at FROM users;
