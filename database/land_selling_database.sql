-- Land Selling Company Database - Clean Structure
USE eaglonhytes;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Drop all existing tables to start fresh
DROP TABLE IF EXISTS land_comments;
DROP TABLE IF EXISTS land_applications;
DROP TABLE IF EXISTS apartments;
DROP TABLE IF EXISTS apartment_applications;
DROP TABLE IF EXISTS apartment_comments;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS lands;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Users table - Admin users and potential buyers
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    whatsapp_number VARCHAR(20),
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_is_admin (is_admin),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lands table - Properties for sale
CREATE TABLE lands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20),
    price DECIMAL(15,2) NOT NULL,
    size VARCHAR(100), -- e.g., "1000 sqm", "2 acres"
    land_type ENUM('residential', 'commercial', 'agricultural', 'industrial', 'mixed') DEFAULT 'residential',
    images JSON, -- Store multiple image filenames as JSON array
    features TEXT, -- Land features (water access, electricity, road access, etc.)
    documents JSON, -- Legal documents, surveys, etc.
    status ENUM('available', 'sold', 'reserved', 'under_negotiation') DEFAULT 'available',
    featured BOOLEAN DEFAULT FALSE, -- For highlighting premium properties
    views_count INT DEFAULT 0,
    whatsapp_contact VARCHAR(20), -- Company WhatsApp for this property
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_status (status),
    INDEX idx_city (city),
    INDEX idx_state (state),
    INDEX idx_price (price),
    INDEX idx_land_type (land_type),
    INDEX idx_featured (featured),
    INDEX idx_created_by (created_by),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Land inquiries - Track when users show interest (before WhatsApp redirect)
CREATE TABLE land_inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    land_id INT NOT NULL,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_whatsapp VARCHAR(20),
    message TEXT,
    inquiry_type ENUM('general', 'viewing_request', 'price_negotiation', 'purchase_intent') DEFAULT 'general',
    status ENUM('new', 'contacted', 'in_progress', 'closed') DEFAULT 'new',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (land_id) REFERENCES lands(id) ON DELETE CASCADE,
    
    INDEX idx_land_id (land_id),
    INDEX idx_status (status),
    INDEX idx_inquiry_type (inquiry_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Land reviews/comments - Customer feedback
CREATE TABLE land_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    land_id INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE, -- Admin can verify genuine reviews
    is_approved BOOLEAN DEFAULT FALSE, -- Admin approval before showing
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (land_id) REFERENCES lands(id) ON DELETE CASCADE,
    
    INDEX idx_land_id (land_id),
    INDEX idx_rating (rating),
    INDEX idx_is_approved (is_approved),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Company settings - WhatsApp numbers, company info
CREATE TABLE company_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert admin users
INSERT INTO users (full_name, email, password, is_admin, whatsapp_number) VALUES 
('Admin User', 'admin@eaglonhytes.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, '+234-803-1234567'),
('Prosperity James', 'iam111@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, '+234-803-1234568'),
('Prosperity James', 'lisa22@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, '+234-803-1234569');

-- Insert sample lands for sale
INSERT INTO lands (title, description, address, city, state, price, size, land_type, images, features, whatsapp_contact, status, featured, created_by) VALUES 
('Prime City Commercial Plot', 'Spacious land in the heart of Lagos, perfect for commercial development. Close to major roads and business districts.', '101 Main Ave', 'Lagos', 'Lagos State', 15000000.00, '1000 sqm', 'commercial', '["land1.jpg", "land1_2.jpg"]', 'Road access, Electricity available, Water connection ready, Survey plan available', '+234-803-1234567', 'available', TRUE, 1),

('Coastal Residential Land', 'Beautiful coastal land with ocean views, ideal for luxury residential development or private estate.', 'Beach Road', 'Port Harcourt', 'Rivers State', 25000000.00, '2000 sqm', 'residential', '["land2.jpg", "land2_2.jpg", "land2_3.jpg"]', 'Ocean view, Beach access, Electricity, Water, Good road network', '+234-803-1234567', 'available', TRUE, 1),

('Agricultural Farmland', 'Fertile agricultural land suitable for farming and livestock. Located in peaceful rural area with good access roads.', 'Farm Settlement Road', 'Ibadan', 'Oyo State', 8000000.00, '5 acres', 'agricultural', '["land3.jpg"]', 'Fertile soil, Water source nearby, Rural location, Good for crops and livestock', '+234-803-1234568', 'available', FALSE, 1),

('Industrial Plot', 'Large industrial plot suitable for manufacturing, warehousing, or logistics operations.', 'Industrial Estate', 'Kano', 'Kano State', 12000000.00, '3000 sqm', 'industrial', '["land4.jpg", "land4_2.jpg"]', 'Industrial zone, Heavy duty electricity, Good road access, Security', '+234-803-1234569', 'available', FALSE, 1);

-- Insert company settings
INSERT INTO company_settings (setting_key, setting_value, description) VALUES 
('company_name', 'Eaglonhytes Properties', 'Company name'),
('main_whatsapp', '+234-803-1234567', 'Main company WhatsApp number'),
('company_email', 'info@eaglonhytes.com', 'Company contact email'),
('company_address', 'Lagos, Nigeria', 'Company address'),
('whatsapp_message_template', 'Hello! I am interested in the {land_title} located at {land_address} priced at ₦{land_price}. Can we discuss further?', 'Template for WhatsApp messages');

-- Insert sample inquiries
INSERT INTO land_inquiries (land_id, customer_name, customer_email, customer_phone, message, inquiry_type, status) VALUES 
(1, 'John Businessman', 'john@business.com', '+234-801-1111111', 'Interested in this commercial plot for my new business. Can we arrange a viewing?', 'viewing_request', 'new'),
(2, 'Sarah Developer', 'sarah@developer.com', '+234-802-2222222', 'Looking to develop luxury homes. Is the price negotiable?', 'price_negotiation', 'contacted');

-- Show created tables
SHOW TABLES;

-- Show sample data
SELECT 'USERS' as table_name;
SELECT id, full_name, email, is_admin, whatsapp_number FROM users;

SELECT 'LANDS' as table_name;
SELECT id, title, city, state, price, size, land_type, status, featured FROM lands;

SELECT 'INQUIRIES' as table_name;
SELECT id, land_id, customer_name, inquiry_type, status FROM land_inquiries;
