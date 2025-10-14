-- SQL Script to Update Lands Table with Dummy Properties Data
-- Run this script in your MySQL database to populate the lands table

-- First, let's clear existing data (handling foreign key constraints)
-- Option 1: Delete existing data (safer than TRUNCATE with foreign keys)
DELETE FROM lands;

-- Option 2: If you want to keep existing data, comment out the DELETE line above
-- and the INSERT will update existing records or add new ones

-- Reset AUTO_INCREMENT to start from 1
ALTER TABLE lands AUTO_INCREMENT = 1;

-- Insert dummy properties data
-- Check your table structure first: DESCRIBE lands;
-- Adjust column names below to match your actual table structure

INSERT INTO lands (
    id, 
    title, 
    description, 
    address, 
    city, 
    state, 
    zip_code,
    price, 
    size, 
    land_type,
    images,
    features,
    documents,
    status,
    featured,
    views_count,
    whatsapp_contact,
    created_by
) VALUES 
(
    1,
    'Prime Residential Land - Gwarinpa',
    'Beautiful residential plot in the heart of Gwarinpa with C of O',
    'Gwarinpa District',
    'Gwarinpa',
    'Abuja',
    '900001',
    15000000.00,
    '600 sqm',
    'residential',
    '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop"]',
    'C of O Available, Fenced, Good Road Access, Electricity',
    '["Certificate of Occupancy", "Survey Plan", "Deed of Assignment"]',
    'available',
    1,
    0,
    '+2348123456789',
    1
),
(
    2,
    'Commercial Land - Wuse 2',
    'Strategic commercial land perfect for office complex or shopping mall',
    'Wuse 2 District',
    'Wuse 2',
    'Abuja',
    '900002',
    45000000.00,
    '800 sqm',
    'commercial',
    '["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop"]',
    'Commercial Zone, Corner Piece, High Traffic Area, Utilities Available',
    '["Survey Plan", "Building Approval", "Environmental Impact Assessment"]',
    'available',
    1,
    0,
    '+2348123456790',
    1
),
(
    3,
    'Luxury Estate Plot - Asokoro',
    'Exclusive plot in premium Asokoro district with panoramic city views',
    'Asokoro District',
    'Asokoro',
    'Abuja',
    '900003',
    75000000.00,
    '1000 sqm',
    'residential',
    '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"]',
    'Premium Location, Gated Estate, Security, Landscaped',
    '["Certificate of Occupancy", "Survey Plan", "Estate Covenant"]',
    'available',
    1,
    0,
    '+2348123456791',
    1
),
(
    4,
    'Affordable Housing Plot - Lugbe',
    'Perfect for first-time home builders in developing Lugbe area',
    'Lugbe District',
    'Lugbe',
    'Abuja',
    '900004',
    8500000.00,
    '450 sqm',
    'residential',
    '["https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop"]',
    'Affordable, Growing Area, Good Investment, Easy Payment Plan',
    '["Survey Plan", "Allocation Letter", "Development Permit"]',
    'available',
    0,
    0,
    '+2348123456792',
    1
),
(
    5,
    'Industrial Land - Idu',
    'Large industrial plot suitable for manufacturing or warehousing',
    'Idu Industrial Area',
    'Idu',
    'Abuja',
    '900005',
    25000000.00,
    '1200 sqm',
    'industrial',
    '["https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop"]',
    'Industrial Zone, Large Size, Good for Business, Transport Links',
    '["Industrial Layout Approval", "Environmental Clearance", "Survey Plan"]',
    'available',
    0,
    0,
    '+2348123456793',
    1
),
(
    6,
    'Waterfront Land - Jabi Lake',
    'Rare waterfront property with stunning lake views and premium location',
    'Jabi Lake Area',
    'Jabi',
    'Abuja',
    '900006',
    95000000.00,
    '750 sqm',
    'residential',
    '["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop"]',
    'Waterfront, Lake View, Exclusive, High Appreciation',
    '["Certificate of Occupancy", "Waterfront Permit", "Environmental Clearance"]',
    'sold',
    1,
    15,
    '+2348123456794',
    1
)
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    description = VALUES(description),
    address = VALUES(address),
    city = VALUES(city),
    state = VALUES(state),
    zip_code = VALUES(zip_code),
    price = VALUES(price),
    size = VALUES(size),
    land_type = VALUES(land_type),
    images = VALUES(images),
    features = VALUES(features),
    documents = VALUES(documents),
    status = VALUES(status),
    featured = VALUES(featured),
    whatsapp_contact = VALUES(whatsapp_contact),
    updated_at = CURRENT_TIMESTAMP;

-- Verify the data was inserted correctly
SELECT 
    id,
    title,
    city,
    price,
    size,
    status,
    created_at
FROM lands 
ORDER BY id;

-- Optional: Update the AUTO_INCREMENT value to continue from ID 7
ALTER TABLE lands AUTO_INCREMENT = 7;

-- Show table structure (optional - for verification)
-- DESCRIBE lands;
