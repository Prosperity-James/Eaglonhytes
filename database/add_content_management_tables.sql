-- Content Management Tables for Eaglonhytes
-- Run this script to add tables for managing story image and carousel images

-- Table for managing story section content
CREATE TABLE IF NOT EXISTS `story_content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT 'Our Journey',
  `content_paragraph_1` text NOT NULL,
  `content_paragraph_2` text NOT NULL,
  `image_url` varchar(500) DEFAULT '',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default story content (only if not exists) - IMAGE IS EMPTY BY DEFAULT
INSERT IGNORE INTO `story_content` (`id`, `title`, `content_paragraph_1`, `content_paragraph_2`, `image_url`) VALUES
(1, 'Our Journey', 
'At Eaglophytes Global Consults, our journey began with a vision to bridge the gap for Nigerians at home and in the diaspora, ensuring their investments in real estate and construction are secure and transparent. Founded in the heart of Abuja, we recognized the challenges many face—over 50% of funds sent for building projects are often misused due to lack of oversight. This sparked our mission to provide trusted services, from procuring genuine lands to building and furnishing dream homes and supplying quality building materials.',
'Since our inception, we have grown from a small team passionate about real estate integrity to a trusted name in Abuja Building Materials Market, Timber Shed, Kugbo. We have helped hundreds of clients secure lands, build properties, and access premium materials like roofing sheets, doors, paints, and epoxy resins. Our commitment to transparency, quality, and peace of mind drives every project, ensuring your vision becomes reality without compromise. Join us on this journey to build with confidence.',
'');

-- Table for managing carousel images
CREATE TABLE IF NOT EXISTS `carousel_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `button_text` varchar(100) DEFAULT 'Lands',
  `button_link` varchar(255) DEFAULT '/lands',
  `display_order` int(11) DEFAULT 1,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default carousel images (only if not exists)
INSERT IGNORE INTO `carousel_images` (`id`, `title`, `subtitle`, `image_url`, `button_text`, `button_link`, `display_order`) VALUES
(1, 'Welcome to Eaglonhytes', 'Your trusted real estate partner', '/assets/placeholder-carousel-1.jpg', 'View Lands', '/lands', 1),
(2, 'Premium Land Properties', 'Secure your investment with us', '/assets/placeholder-carousel-2.jpg', 'Browse Properties', '/lands', 2),
(3, 'Building Materials Supply', 'Quality materials for your projects', '/assets/placeholder-carousel-3.jpg', 'Shop Materials', '/contact', 3),
(4, 'Trusted by Diaspora', 'Building dreams across continents', '/assets/placeholder-carousel-4.jpg', 'Learn More', '/about', 4),
(5, 'Expert Consultation', 'Professional guidance every step', '/assets/placeholder-carousel-5.jpg', 'Contact Us', '/contact', 5);

-- Note: Indexes are created separately via fix_indexes.php to avoid duplicate key errors
