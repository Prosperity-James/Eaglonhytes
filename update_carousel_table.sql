-- Update carousel_images table to add missing columns
-- Run this if you get "Unknown column 'button_text'" error

-- Add missing columns to existing carousel_images table
ALTER TABLE `carousel_images` ADD COLUMN `button_text` varchar(100) DEFAULT 'Lands';
ALTER TABLE `carousel_images` ADD COLUMN `button_link` varchar(255) DEFAULT '/lands';

-- Insert default carousel image (only if not exists)
INSERT IGNORE INTO `carousel_images` (`id`, `title`, `subtitle`, `image_url`, `button_text`, `button_link`, `display_order`) VALUES
(1, 'Welcome to Eaglonhytes', 'Images to be updated by Admin', '/assets/placeholder-carousel-1.jpg', 'Lands', '/lands', 1);
