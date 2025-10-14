-- Safe SQL Script to Update Lands Table with Foreign Key Constraints
-- This script handles foreign key constraints properly

-- Step 1: Temporarily disable foreign key checks (optional but safer)
SET FOREIGN_KEY_CHECKS = 0;

-- Step 2: Clear existing land inquiries that reference lands (if you want to start fresh)
-- DELETE FROM land_inquiries;

-- Step 3: Clear existing lands data
DELETE FROM lands;

-- Step 4: Reset AUTO_INCREMENT
ALTER TABLE lands AUTO_INCREMENT = 1;

-- Step 5: Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Step 6: Insert dummy properties data
INSERT INTO lands (
    id, 
    title, 
    description, 
    address, 
    city, 
    state, 
    rent_price, 
    rental_period, 
    size, 
    bedrooms, 
    bathrooms, 
    status, 
    amenities, 
    available_date, 
    pet_policy, 
    parking, 
    images,
    created_at,
    updated_at
) VALUES 
(
    1,
    'Prime Residential Land - Gwarinpa',
    'Beautiful residential plot in the heart of Gwarinpa with C of O',
    'Gwarinpa District',
    'Gwarinpa',
    'Abuja',
    15000000.00,
    'total',
    '600 sqm',
    0,
    0,
    'available',
    'C of O Available,Fenced,Good Road Access,Electricity',
    CURDATE(),
    'Allowed',
    'Available',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
    NOW(),
    NOW()
),
(
    2,
    'Commercial Land - Wuse 2',
    'Strategic commercial land perfect for office complex or shopping mall',
    'Wuse 2 District',
    'Wuse 2',
    'Abuja',
    45000000.00,
    'total',
    '800 sqm',
    0,
    0,
    'available',
    'Commercial Zone,Corner Piece,High Traffic Area,Utilities Available',
    CURDATE(),
    'Not Applicable',
    'Available',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    NOW(),
    NOW()
),
(
    3,
    'Luxury Estate Plot - Asokoro',
    'Exclusive plot in premium Asokoro district with panoramic city views',
    'Asokoro District',
    'Asokoro',
    'Abuja',
    75000000.00,
    'total',
    '1000 sqm',
    0,
    0,
    'available',
    'Premium Location,Gated Estate,Security,Landscaped',
    CURDATE(),
    'Allowed',
    'Available',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    NOW(),
    NOW()
),
(
    4,
    'Affordable Housing Plot - Lugbe',
    'Perfect for first-time home builders in developing Lugbe area',
    'Lugbe District',
    'Lugbe',
    'Abuja',
    8500000.00,
    'total',
    '450 sqm',
    0,
    0,
    'available',
    'Affordable,Growing Area,Good Investment,Easy Payment Plan',
    CURDATE(),
    'Allowed',
    'Available',
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop',
    NOW(),
    NOW()
),
(
    5,
    'Industrial Land - Idu',
    'Large industrial plot suitable for manufacturing or warehousing',
    'Idu Industrial Area',
    'Idu',
    'Abuja',
    25000000.00,
    'total',
    '1200 sqm',
    0,
    0,
    'available',
    'Industrial Zone,Large Size,Good for Business,Transport Links',
    CURDATE(),
    'Not Applicable',
    'Available',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop',
    NOW(),
    NOW()
),
(
    6,
    'Waterfront Land - Jabi Lake',
    'Rare waterfront property with stunning lake views and premium location',
    'Jabi Lake Area',
    'Jabi',
    'Abuja',
    95000000.00,
    'total',
    '750 sqm',
    0,
    0,
    'sold',
    'Waterfront,Lake View,Exclusive,High Appreciation',
    CURDATE(),
    'Allowed',
    'Available',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    NOW(),
    NOW()
);

-- Step 7: Verify the data was inserted correctly
SELECT 
    id,
    title,
    city,
    rent_price,
    size,
    status,
    created_at
FROM lands 
ORDER BY id;

-- Step 8: Set AUTO_INCREMENT for future records
ALTER TABLE lands AUTO_INCREMENT = 7;

-- Optional: Show related tables info
SELECT COUNT(*) as land_count FROM lands;
SELECT COUNT(*) as inquiry_count FROM land_inquiries;
