-- Content Management Table for News/Updates with Media Support
CREATE TABLE IF NOT EXISTS content_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    category ENUM('news', 'new_lands', 'company_updates', 'market_insights') DEFAULT 'news',
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    media_items JSON, -- Array of media objects {type: 'image'|'video', url: '', caption: ''}
    tags VARCHAR(500),
    meta_description VARCHAR(160),
    slug VARCHAR(255) UNIQUE,
    author_id INT,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL,
    
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_featured (featured),
    INDEX idx_published_at (published_at),
    INDEX idx_slug (slug),
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert sample content
INSERT INTO content_posts (title, content, excerpt, category, status, featured, media_items, tags, slug, author_id, published_at) VALUES
('Welcome to Eaglonhytes Properties', 
 'We are excited to announce the launch of our new property management platform. Discover premium lands and apartments with modern amenities and excellent locations.',
 'Announcing the launch of our new property platform with premium locations.',
 'company_updates',
 'published',
 TRUE,
 '[]',
 'announcement,launch,properties',
 'welcome-to-eaglonhytes',
 1,
 NOW()),

('New Premium Lands Available in Victoria Island', 
 'We have just added several premium land plots in the heart of Victoria Island, Lagos. These properties offer excellent investment opportunities with great potential for appreciation.',
 'Premium land plots now available in Victoria Island with excellent ROI potential.',
 'new_lands',
 'published',
 TRUE,
 '[]',
 'victoria island,premium,investment',
 'new-premium-lands-victoria-island',
 1,
 NOW()),

('Market Trends: Real Estate in Lagos 2024', 
 'The Lagos real estate market continues to show strong growth in 2024. Our analysis shows key trends that investors should be aware of when making property decisions.',
 'Key real estate market trends and insights for Lagos property investors in 2024.',
 'market_insights',
 'published',
 FALSE,
 '[]',
 'market trends,lagos,2024,investment',
 'market-trends-lagos-2024',
 1,
 NOW());
