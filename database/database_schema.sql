-- =====================================================
-- EAGLONHYTES - COMPREHENSIVE DATABASE SCHEMA
-- =====================================================
-- This schema includes all tables, relationships, indexes, and sample data
-- for the complete apartment rental management system.


-- Create database
CREATE DATABASE IF NOT EXISTS eaglonhytes;
USE eaglonhytes;

-- Set character set and collation for proper Unicode support
ALTER DATABASE eaglonhytes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- Users table - Stores tenant and admin user information
CREATE TABLE IF NOT EXISTS users (
    INDEX idx_is_admin (is_admin),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lands table - Stores land and property listings
CREATE TABLE IF NOT EXISTS lands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
DELIMITER ;
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Indexes for performance
    INDEX idx_status (status),
    INDEX idx_city (city),
    INDEX idx_price (price),
    INDEX idx_created_by (created_by),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Land Applications table - Stores purchase/rental applications for lands/properties
CREATE TABLE IF NOT EXISTS land_applications (
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

-- Land Comments table - Stores reviews/ratings for lands/properties
CREATE TABLE IF NOT EXISTS land_comments (
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

-- Insert sample lands
INSERT IGNORE INTO lands (title, description, address, city, state, zip_code, price, size, images, created_by) VALUES 
('Prime City Plot', 'Spacious land in the heart of the city, perfect for commercial or residential development.', '101 Main Ave', 'Lagos', 'LA', '100001', 15000000.00, '1000 sqm', '["land1.jpg"]', 1),
('Coastal Property', 'Beautiful coastal land with ocean views, ideal for resort or private estate.', 'Beach Road', 'Port Harcourt', 'PH', '500001', 25000000.00, '2000 sqm', '["land2.jpg"]', 1);

-- Insert sample land applications
INSERT IGNORE INTO land_applications (user_id, land_id, move_in_date, employment_status, annual_income, whatsapp_contact, additional_notes, status) VALUES 
(2, 1, '2024-04-01', 'Business Owner', 12000000.00, '+234-803-0001', 'Looking to build a shopping complex', 'pending'),
(3, 2, '2024-05-15', 'Entrepreneur', 18000000.00, '+234-803-0002', 'Interested in developing a resort', 'approved');

-- Insert sample land comments/reviews
INSERT IGNORE INTO land_comments (land_id, user_id, rating, comment) VALUES 
(1, 2, 5, 'Excellent location for business. Highly recommended!'),
(2, 3, 4, 'Beautiful view and great investment potential.');

INSERT IGNORE INTO users (full_name, email, password, is_admin) VALUES 
('Admin User', 'admin@zinqbridge.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);

-- Insert sample regular users
INSERT IGNORE INTO users (full_name, email, password, is_admin, phone) VALUES 
('John Doe', 'john.doe@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', FALSE, '+1-555-0101'),
('Jane Smith', 'jane.smith@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', FALSE, '+1-555-0102'),
('Mike Johnson', 'mike.johnson@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', FALSE, '+1-555-0103');


-- Insert system settings

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================


-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure to get apartment statistics
CREATE PROCEDURE GetApartmentStats()
BEGIN
    SELECT 
        COUNT(*) as total_apartments,
        COUNT(CASE WHEN status = 'available' THEN 1 END) as available_apartments,
        COUNT(CASE WHEN status = 'rented' THEN 1 END) as rented_apartments,
        COUNT(CASE WHEN status = 'maintenance' THEN 1 END) as maintenance_apartments,
        AVG(rent_price) as average_rent,
        MIN(rent_price) as min_rent,
        MAX(rent_price) as max_rent
    FROM apartments;
END //

-- Procedure to get user statistics
CREATE PROCEDURE GetUserStats()
BEGIN
    SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_admin = TRUE THEN 1 END) as admin_users,
        COUNT(CASE WHEN is_admin = FALSE THEN 1 END) as regular_users,
        COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_users
    FROM users;
END //

-- Procedure to get application statistics
CREATE PROCEDURE GetApplicationStats()
BEGIN
    SELECT 
        COUNT(*) as total_applications,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_applications,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_applications,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_applications,
        COUNT(CASE WHEN status = 'withdrawn' THEN 1 END) as withdrawn_applications
    FROM applications;
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS
-- =====================================================

DELIMITER //


DELIMITER ;
