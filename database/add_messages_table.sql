-- Add messages table for user-admin communication
USE eaglonhytes;

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    sender_type ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_sender_type (sender_type),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample messages for testing
INSERT INTO messages (user_id, message, sender_type, is_read) VALUES 
(1, 'Hello, I am interested in the Prime City Commercial Plot. Can you provide more details?', 'user', FALSE),
(1, 'Thank you for your interest! The Prime City Commercial Plot is located in the heart of Lagos with excellent road access and utilities. Would you like to schedule a viewing?', 'admin', FALSE),
(1, 'Yes, I would like to schedule a viewing. What times are available?', 'user', FALSE);

-- Show the created table
SELECT 'MESSAGES TABLE CREATED' as status;
SELECT * FROM messages;
