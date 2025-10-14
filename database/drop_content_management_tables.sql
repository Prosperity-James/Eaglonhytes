-- Backup and drop content management tables (story_content, carousel_images)
-- Usage: mysql -u root -p your_database < drop_content_management_tables.sql

-- Safety: create backups of the existing tables (if they exist) before dropping
SET @now := DATE_FORMAT(NOW(), '%Y%m%d_%H%i%s');

-- Backup story_content
DROP TABLE IF EXISTS `backup_story_content`;
CREATE TABLE `backup_story_content` LIKE `story_content`;
INSERT INTO `backup_story_content` SELECT * FROM `story_content`;

-- Backup carousel_images
DROP TABLE IF EXISTS `backup_carousel_images`;
CREATE TABLE `backup_carousel_images` LIKE `carousel_images`;
INSERT INTO `backup_carousel_images` SELECT * FROM `carousel_images`;

-- Now safely drop the original tables
DROP TABLE IF EXISTS `story_content`;
DROP TABLE IF EXISTS `carousel_images`;

-- Optional: remove any scheduled scripts or triggers that reference these tables (review manually)

-- Notes:
-- 1) This script creates `backup_story_content` and `backup_carousel_images` in the same database. Keep these backups until you're certain you no longer need them.
-- 2) If you prefer a filename-based SQL dump backup instead, run:
--    mysqldump -u root -p your_database story_content carousel_images > cms_backup_$(date +%Y%m%d_%H%M%S).sql
