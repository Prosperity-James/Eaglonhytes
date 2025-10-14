-- Flexible SQL Script for Different Table Schemas
-- This script handles common column name variations

-- First, check your table structure by running: DESCRIBE lands;
-- Then uncomment the appropriate INSERT statement below based on your table structure

-- Clear existing data
DELETE FROM lands;
ALTER TABLE lands AUTO_INCREMENT = 1;

-- OPTION 1: If your table has 'price' instead of 'rent_price'
INSERT INTO lands (
    id, 
    title, 
    description, 
    address, 
    city, 
    state, 
    price, 
    size, 
    status, 
    created_at,
    updated_at
) VALUES 
(1, 'Prime Residential Land - Gwarinpa', 'Beautiful residential plot in the heart of Gwarinpa with C of O', 'Gwarinpa District', 'Gwarinpa', 'Abuja', 15000000.00, '600 sqm', 'available', NOW(), NOW()),
(2, 'Commercial Land - Wuse 2', 'Strategic commercial land perfect for office complex or shopping mall', 'Wuse 2 District', 'Wuse 2', 'Abuja', 45000000.00, '800 sqm', 'available', NOW(), NOW()),
(3, 'Luxury Estate Plot - Asokoro', 'Exclusive plot in premium Asokoro district with panoramic city views', 'Asokoro District', 'Asokoro', 'Abuja', 75000000.00, '1000 sqm', 'available', NOW(), NOW()),
(4, 'Affordable Housing Plot - Lugbe', 'Perfect for first-time home builders in developing Lugbe area', 'Lugbe District', 'Lugbe', 'Abuja', 8500000.00, '450 sqm', 'available', NOW(), NOW()),
(5, 'Industrial Land - Idu', 'Large industrial plot suitable for manufacturing or warehousing', 'Idu Industrial Area', 'Idu', 'Abuja', 25000000.00, '1200 sqm', 'available', NOW(), NOW()),
(6, 'Waterfront Land - Jabi Lake', 'Rare waterfront property with stunning lake views and premium location', 'Jabi Lake Area', 'Jabi', 'Abuja', 95000000.00, '750 sqm', 'sold', NOW(), NOW());

/*
-- OPTION 2: If your table has minimal columns (uncomment if needed)
INSERT INTO lands (
    title, 
    description, 
    city, 
    price, 
    status
) VALUES 
('Prime Residential Land - Gwarinpa', 'Beautiful residential plot in the heart of Gwarinpa with C of O', 'Gwarinpa', 15000000.00, 'available'),
('Commercial Land - Wuse 2', 'Strategic commercial land perfect for office complex or shopping mall', 'Wuse 2', 45000000.00, 'available'),
('Luxury Estate Plot - Asokoro', 'Exclusive plot in premium Asokoro district with panoramic city views', 'Asokoro', 75000000.00, 'available'),
('Affordable Housing Plot - Lugbe', 'Perfect for first-time home builders in developing Lugbe area', 'Lugbe', 8500000.00, 'available'),
('Industrial Land - Idu', 'Large industrial plot suitable for manufacturing or warehousing', 'Idu', 25000000.00, 'available'),
('Waterfront Land - Jabi Lake', 'Rare waterfront property with stunning lake views and premium location', 'Jabi', 95000000.00, 'sold');
*/

/*
-- OPTION 3: If your table has different column names (uncomment and modify as needed)
INSERT INTO lands (
    land_title, 
    land_description, 
    location, 
    land_price, 
    land_status
) VALUES 
('Prime Residential Land - Gwarinpa', 'Beautiful residential plot in the heart of Gwarinpa with C of O', 'Gwarinpa, Abuja', 15000000.00, 'available'),
('Commercial Land - Wuse 2', 'Strategic commercial land perfect for office complex or shopping mall', 'Wuse 2, Abuja', 45000000.00, 'available'),
('Luxury Estate Plot - Asokoro', 'Exclusive plot in premium Asokoro district with panoramic city views', 'Asokoro, Abuja', 75000000.00, 'available'),
('Affordable Housing Plot - Lugbe', 'Perfect for first-time home builders in developing Lugbe area', 'Lugbe, Abuja', 8500000.00, 'available'),
('Industrial Land - Idu', 'Large industrial plot suitable for manufacturing or warehousing', 'Idu, Abuja', 25000000.00, 'available'),
('Waterfront Land - Jabi Lake', 'Rare waterfront property with stunning lake views and premium location', 'Jabi, Abuja', 95000000.00, 'sold');
*/

-- Verify the data
SELECT * FROM lands ORDER BY id;

-- Set AUTO_INCREMENT for future records
ALTER TABLE lands AUTO_INCREMENT = 7;
