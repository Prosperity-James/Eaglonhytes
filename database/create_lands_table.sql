-- Create Lands Table Script
-- Run this if you need to create the lands table from scratch

CREATE TABLE IF NOT EXISTS `lands` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL,
    `description` text,
    `address` varchar(255) DEFAULT NULL,
    `city` varchar(100) DEFAULT NULL,
    `state` varchar(100) DEFAULT NULL,
    `rent_price` decimal(15,2) DEFAULT NULL,
    `rental_period` varchar(50) DEFAULT 'total',
    `size` varchar(100) DEFAULT NULL,
    `bedrooms` int(11) DEFAULT 0,
    `bathrooms` decimal(3,1) DEFAULT 0,
    `status` enum('available','sold','pending','reserved') DEFAULT 'available',
    `amenities` text,
    `available_date` date DEFAULT NULL,
    `pet_policy` varchar(100) DEFAULT NULL,
    `parking` varchar(100) DEFAULT NULL,
    `images` text,
    `land_type` varchar(100) DEFAULT NULL,
    `square_feet` int(11) DEFAULT NULL,
    `deposit` decimal(15,2) DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_status` (`status`),
    KEY `idx_city` (`city`),
    KEY `idx_price` (`rent_price`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert the dummy data
INSERT INTO `lands` (
    `id`, 
    `title`, 
    `description`, 
    `address`, 
    `city`, 
    `state`, 
    `rent_price`, 
    `rental_period`, 
    `size`, 
    `bedrooms`, 
    `bathrooms`, 
    `status`, 
    `amenities`, 
    `available_date`, 
    `pet_policy`, 
    `parking`, 
    `images`,
    `land_type`,
    `square_feet`
) VALUES 
(1, 'Prime Residential Land - Gwarinpa', 'Beautiful residential plot in the heart of Gwarinpa with C of O', 'Gwarinpa District', 'Gwarinpa', 'Abuja', 15000000.00, 'total', '600 sqm', 0, 0, 'available', 'C of O Available,Fenced,Good Road Access,Electricity', CURDATE(), 'Allowed', 'Available', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop', 'Residential', 6458),
(2, 'Commercial Land - Wuse 2', 'Strategic commercial land perfect for office complex or shopping mall', 'Wuse 2 District', 'Wuse 2', 'Abuja', 45000000.00, 'total', '800 sqm', 0, 0, 'available', 'Commercial Zone,Corner Piece,High Traffic Area,Utilities Available', CURDATE(), 'Not Applicable', 'Available', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop', 'Commercial', 8611),
(3, 'Luxury Estate Plot - Asokoro', 'Exclusive plot in premium Asokoro district with panoramic city views', 'Asokoro District', 'Asokoro', 'Abuja', 75000000.00, 'total', '1000 sqm', 0, 0, 'available', 'Premium Location,Gated Estate,Security,Landscaped', CURDATE(), 'Allowed', 'Available', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop', 'Residential', 10764),
(4, 'Affordable Housing Plot - Lugbe', 'Perfect for first-time home builders in developing Lugbe area', 'Lugbe District', 'Lugbe', 'Abuja', 8500000.00, 'total', '450 sqm', 0, 0, 'available', 'Affordable,Growing Area,Good Investment,Easy Payment Plan', CURDATE(), 'Allowed', 'Available', 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop', 'Residential', 4844),
(5, 'Industrial Land - Idu', 'Large industrial plot suitable for manufacturing or warehousing', 'Idu Industrial Area', 'Idu', 'Abuja', 25000000.00, 'total', '1200 sqm', 0, 0, 'available', 'Industrial Zone,Large Size,Good for Business,Transport Links', CURDATE(), 'Not Applicable', 'Available', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop', 'Industrial', 12917),
(6, 'Waterfront Land - Jabi Lake', 'Rare waterfront property with stunning lake views and premium location', 'Jabi Lake Area', 'Jabi', 'Abuja', 95000000.00, 'total', '750 sqm', 0, 0, 'sold', 'Waterfront,Lake View,Exclusive,High Appreciation', CURDATE(), 'Allowed', 'Available', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop', 'Residential', 8073)
ON DUPLICATE KEY UPDATE
    `title` = VALUES(`title`),
    `description` = VALUES(`description`),
    `address` = VALUES(`address`),
    `city` = VALUES(`city`),
    `state` = VALUES(`state`),
    `rent_price` = VALUES(`rent_price`),
    `rental_period` = VALUES(`rental_period`),
    `size` = VALUES(`size`),
    `status` = VALUES(`status`),
    `amenities` = VALUES(`amenities`),
    `available_date` = VALUES(`available_date`),
    `pet_policy` = VALUES(`pet_policy`),
    `parking` = VALUES(`parking`),
    `images` = VALUES(`images`),
    `land_type` = VALUES(`land_type`),
    `square_feet` = VALUES(`square_feet`),
    `updated_at` = CURRENT_TIMESTAMP;

-- Set AUTO_INCREMENT to start from 7 for new entries
ALTER TABLE `lands` AUTO_INCREMENT = 7;
