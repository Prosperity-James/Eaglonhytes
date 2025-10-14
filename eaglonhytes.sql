-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 04, 2025 at 11:48 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eaglonhytes`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_audit_log`
--

CREATE TABLE `admin_audit_log` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `admin_email` varchar(255) NOT NULL,
  `admin_role` enum('super_admin','admin') NOT NULL,
  `action` varchar(100) NOT NULL,
  `target_type` varchar(50) DEFAULT NULL,
  `target_id` int(11) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_audit_log`
--

INSERT INTO `admin_audit_log` (`id`, `admin_id`, `admin_email`, `admin_role`, `action`, `target_type`, `target_id`, `details`, `ip_address`, `created_at`) VALUES
(1, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":2}', '::1', '2025-09-30 07:41:36'),
(2, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":1}', '::1', '2025-09-30 07:43:01'),
(3, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":1}', '::1', '2025-09-30 07:45:19'),
(4, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":1}', '::1', '2025-09-30 07:45:29'),
(5, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":1}', '::1', '2025-09-30 07:46:05'),
(6, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":1}', '::1', '2025-09-30 07:47:38'),
(7, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":2}', '::1', '2025-09-30 07:48:02'),
(8, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":3}', '::1', '2025-09-30 10:14:19'),
(9, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":3}', '::1', '2025-09-30 10:59:06'),
(10, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":3}', '::1', '2025-09-30 11:14:12'),
(11, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":3}', '::1', '2025-09-30 11:29:20'),
(12, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":3}', '::1', '2025-09-30 11:49:14'),
(13, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":3}', '::1', '2025-09-30 15:08:28'),
(14, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":3}', '::1', '2025-09-30 15:09:51'),
(15, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":3}', '::1', '2025-09-30 15:11:57'),
(16, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":3}', '::1', '2025-09-30 15:12:27'),
(17, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":3}', '::1', '2025-09-30 15:12:59'),
(18, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":3}', '::1', '2025-09-30 15:19:37'),
(19, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":3}', '::1', '2025-09-30 15:21:54'),
(20, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":3}', '::1', '2025-09-30 15:22:53'),
(21, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":3}', '::1', '2025-09-30 15:23:15'),
(22, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":3}', '::1', '2025-09-30 15:23:30'),
(23, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":3}', '::1', '2025-09-30 15:25:13'),
(24, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":3}', '::1', '2025-09-30 15:27:22'),
(25, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":3}', '::1', '2025-09-30 15:30:07'),
(26, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-09-30 15:31:33'),
(27, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-09-30 15:38:56'),
(28, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-09-30 15:42:35'),
(29, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 08:35:44'),
(30, 1, 'admin@eaglonhytes.com', 'super_admin', 'delete_land', 'land', 1, NULL, '::1', '2025-10-02 08:36:56'),
(31, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 09:06:14'),
(32, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 09:41:25'),
(33, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 09:43:17'),
(34, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 09:43:53'),
(35, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 09:44:14'),
(36, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 09:47:04'),
(37, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 10:13:43'),
(38, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 10:25:55'),
(39, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 13:03:52'),
(40, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 17:23:37'),
(41, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 20:22:50'),
(42, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 20:41:22'),
(43, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 20:44:01'),
(44, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 20:49:52'),
(45, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 21:03:59'),
(46, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 21:07:25'),
(47, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 21:08:43'),
(48, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 21:09:42'),
(49, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 21:10:11'),
(50, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 21:22:42'),
(51, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-02 21:24:00'),
(53, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 09:19:30'),
(54, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 09:27:57'),
(55, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 09:28:49'),
(56, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 09:30:44'),
(57, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 09:37:14'),
(58, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 09:54:20'),
(59, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 10:58:34'),
(60, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 11:59:56'),
(61, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 12:27:36'),
(62, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 12:28:15'),
(63, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 12:31:11'),
(64, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 12:36:36'),
(65, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 12:58:34'),
(66, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 12:58:41'),
(67, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 12:59:02'),
(68, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 12:59:17'),
(69, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 13:00:10'),
(70, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 14:03:17'),
(71, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 14:03:52'),
(72, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 14:05:54'),
(73, 1, 'admin@eaglonhytes.com', 'super_admin', 'delete_land', 'land', 10, NULL, '::1', '2025-10-03 14:06:16'),
(74, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 16:19:23'),
(75, 1, 'admin@eaglonhytes.com', 'super_admin', 'update_land', 'land', 2, '{\"title\":\"Commercial Land - Wuse 2\",\"status\":\"available\"}', '::1', '2025-10-03 16:19:53'),
(76, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 16:25:15'),
(77, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 16:25:48'),
(78, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 16:26:33'),
(79, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 16:27:10'),
(80, 1, 'admin@eaglonhytes.com', 'super_admin', 'update_land', 'land', 2, '{\"title\":\"Commercial Land - Wuse 2\",\"status\":\"available\"}', '::1', '2025-10-03 16:27:39'),
(81, 1, 'admin@eaglonhytes.com', 'super_admin', 'update_land', 'land', 2, '{\"title\":\"Commercial Land - Wuse 2\",\"status\":\"available\"}', '::1', '2025-10-03 16:28:17'),
(82, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 16:29:26'),
(83, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 16:29:51'),
(84, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 16:30:44'),
(85, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 16:30:54'),
(86, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 16:31:27'),
(87, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 16:31:28'),
(88, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 16:43:24'),
(89, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 16:44:52'),
(90, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 16:59:55'),
(91, 1, 'admin@eaglonhytes.com', 'super_admin', 'update_land', 'land', 11, '{\"title\":\"Tester Land 1759509378798\",\"status\":\"available\"}', '::1', '2025-10-03 17:00:33'),
(92, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-03 17:06:40'),
(93, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 14:21:19'),
(94, 1, 'admin@eaglonhytes.com', 'super_admin', 'delete_land', 'land', 12, NULL, '::1', '2025-10-04 14:21:36'),
(95, 1, 'admin@eaglonhytes.com', 'super_admin', 'delete_land', 'land', 11, NULL, '::1', '2025-10-04 14:21:40'),
(96, 1, 'admin@eaglonhytes.com', 'super_admin', 'delete_land', 'land', 2, NULL, '::1', '2025-10-04 14:21:51'),
(97, 1, 'admin@eaglonhytes.com', 'super_admin', 'update_land', 'land', 6, '{\"title\":\"Waterfront Land - Jabi Lake\",\"status\":\"sold\"}', '::1', '2025-10-04 14:22:11'),
(98, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 14:22:30'),
(99, 1, 'admin@eaglonhytes.com', 'super_admin', 'delete_land', 'land', 3, NULL, '::1', '2025-10-04 14:22:38'),
(100, 1, 'admin@eaglonhytes.com', 'super_admin', 'delete_land', 'land', 4, NULL, '::1', '2025-10-04 14:22:42'),
(101, 1, 'admin@eaglonhytes.com', 'super_admin', 'delete_land', 'land', 5, NULL, '::1', '2025-10-04 14:22:46'),
(102, 1, 'admin@eaglonhytes.com', 'super_admin', 'delete_land', 'land', 6, NULL, '::1', '2025-10-04 14:22:50'),
(103, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 14:34:07'),
(104, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 14:52:54'),
(105, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 14:53:00'),
(106, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 14:53:19'),
(107, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 14:54:32'),
(108, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 14:54:33'),
(109, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 14:56:32'),
(110, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 14:58:45'),
(111, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 15:33:01'),
(112, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 15:41:15'),
(113, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 15:46:55'),
(114, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 15:48:34'),
(115, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 20:23:10'),
(116, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 20:48:38'),
(117, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 21:08:38'),
(118, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 21:19:49'),
(119, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 21:22:57'),
(120, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 21:26:05'),
(121, 1, 'admin@eaglonhytes.com', 'super_admin', 'view_users', 'user', NULL, '{\"count\":4}', '::1', '2025-10-04 21:33:10');

-- --------------------------------------------------------

--
-- Table structure for table `backup_carousel_images`
--

CREATE TABLE `backup_carousel_images` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `button_text` varchar(100) DEFAULT 'Lands',
  `button_link` varchar(255) DEFAULT '/lands',
  `display_order` int(11) DEFAULT 1,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `backup_carousel_images`
--

INSERT INTO `backup_carousel_images` (`id`, `title`, `subtitle`, `image_url`, `button_text`, `button_link`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Welcome to Eaglonhytes', 'Images to be updated by Admin', 'http://localhost/Eaglonhytes/api/uploads/content/4b/cad4ba8e520f51eb35bb6d90fa8b8cff_1759494984.png', 'Lands', '/lands', 1, 1, '2025-10-02 20:37:17', '2025-10-03 12:36:25'),
(2, 'Premium Land Properties', 'Secure your investment with us', '/assets/placeholder-carousel-2.jpg', 'Browse Properties', '/lands', 2, 1, '2025-10-02 21:16:26', '2025-10-03 12:36:25'),
(3, 'Building Materials Supply', 'Quality materials for your projects', '/assets/placeholder-carousel-3.jpg', 'Shop Materials', '/contact', 3, 1, '2025-10-02 21:16:26', '2025-10-03 12:36:25'),
(4, 'Trusted by Diaspora', 'Building dreams across continents', '/assets/placeholder-carousel-4.jpg', 'Learn More', '/about', 4, 1, '2025-10-02 21:16:26', '2025-10-03 12:36:25'),
(5, 'Expert Consultation', 'Professional guidance every step', '/assets/placeholder-carousel-5.jpg', 'Contact Us', '/contact', 5, 1, '2025-10-02 21:16:26', '2025-10-03 12:36:25');

-- --------------------------------------------------------

--
-- Table structure for table `backup_story_content`
--

CREATE TABLE `backup_story_content` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT 'Our Journey',
  `content_paragraph_1` text NOT NULL,
  `content_paragraph_2` text NOT NULL,
  `image_url` varchar(500) DEFAULT '/assets/placeholder-story.jpg',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `backup_story_content`
--

INSERT INTO `backup_story_content` (`id`, `title`, `content_paragraph_1`, `content_paragraph_2`, `image_url`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Our Journey', 'At Eaglophytes Global Consults, our journey began with a vision to bridge the gap for Nigerians at home and in the diaspora, ensuring their investments in real estate and construction are secure and transparent. Founded in the heart of Abuja, we recognized the challenges many face—over 50% of funds sent for building projects are often misused due to lack of oversight. This sparked our mission to provide trusted services, from procuring genuine lands to building and furnishing dream homes and supplying quality building materials..', 'Since our inception, we have grown from a small team passionate about real estate integrity to a trusted name in Abuja Building Materials Market, Timber Shed, Kugbo. We have helped hundreds of clients secure lands, build properties, and access premium materials like roofing sheets, doors, paints, and epoxy resins. Our commitment to transparency, quality, and peace of mind drives every project, ensuring your vision becomes reality without compromise. Join us on this journey to build with confidence.', '', 1, '2025-10-02 19:39:20', '2025-10-03 12:27:56');

-- --------------------------------------------------------

--
-- Table structure for table `company_settings`
--

CREATE TABLE `company_settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `company_settings`
--

INSERT INTO `company_settings` (`id`, `setting_key`, `setting_value`, `description`, `updated_at`) VALUES
(1, 'company_name', 'Eaglonhytes Properties', 'Company name', '2025-09-25 10:46:50'),
(2, 'main_whatsapp', '+234-803-1234567', 'Main company WhatsApp number', '2025-09-25 10:46:50'),
(3, 'company_email', 'info@eaglonhytes.com', 'Company contact email', '2025-09-25 10:46:50'),
(4, 'company_address', 'Lagos, Nigeria', 'Company address', '2025-09-25 10:46:50'),
(5, 'whatsapp_message_template', 'Hello! I am interested in the {land_title} located at {land_address} priced at ₦{land_price}. Can we discuss further?', 'Template for WhatsApp messages', '2025-09-25 10:46:50');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(500) NOT NULL,
  `message` text NOT NULL,
  `admin_reply` text DEFAULT NULL,
  `replied_at` timestamp NULL DEFAULT NULL,
  `status` enum('new','read','replied') DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `admin_reply`, `replied_at`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Lilith Bryce', 'admin@lincmart.com', '0809967543', 'land-inquiry', 'i need land', NULL, NULL, 'new', '2025-09-29 14:10:03', '2025-09-29 14:10:03'),
(2, 'Lilith Bryce', 'admin@lincmart.com', '0809967543', 'land-inquiry', 'how do i buy land', NULL, NULL, 'new', '2025-09-29 14:18:14', '2025-09-29 14:18:14'),
(3, 'Lilith Bryce', 'admin@lincmart.com', '0809967543', 'land-inquiry', 'how', NULL, NULL, 'new', '2025-09-29 14:19:17', '2025-09-29 14:19:17'),
(4, 'Joseph Ibrahim', 'kingofsheet@gmail.com', '0809967543', 'building-materials', 'how', 'just do it', '2025-09-30 10:57:23', 'replied', '2025-09-30 10:48:54', '2025-09-30 10:57:23'),
(5, 'Joseph Ibrahim', 'kingofsheet@gmail.com', '0809967543', 'land-inquiry', 'how bro', NULL, NULL, 'new', '2025-09-30 11:13:52', '2025-09-30 11:13:52'),
(6, 'Joseph Ibrahim', 'kingofsheet@gmail.com', '0809967543', 'property-development', 'how', 'yteiy;o;u', '2025-10-02 10:13:58', 'replied', '2025-09-30 11:30:43', '2025-10-02 10:13:58'),
(7, 'Lilith Bryce', 'admin@lincmart.com', '0809967543', 'land-inquiry', 'how', 'wewerfv', '2025-10-02 10:12:52', 'replied', '2025-09-30 15:09:38', '2025-10-02 10:12:52'),
(8, 'Lilith Bryce', 'admin@lincmart.com', '0809967543', 'property-development', 'trirpwciw;e', 'gwuefwloufilwihe9fh9', '2025-10-02 09:54:34', 'replied', '2025-09-30 15:30:00', '2025-10-02 09:54:34');

-- --------------------------------------------------------

--
-- Table structure for table `content_posts`
--

CREATE TABLE `content_posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `excerpt` text DEFAULT NULL,
  `category` enum('news','new_lands','company_updates','market_insights') DEFAULT 'news',
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `featured` tinyint(1) DEFAULT 0,
  `media_items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`media_items`)),
  `tags` varchar(500) DEFAULT NULL,
  `meta_description` varchar(160) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `views` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `published_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `content_posts`
--

INSERT INTO `content_posts` (`id`, `title`, `content`, `excerpt`, `category`, `status`, `featured`, `media_items`, `tags`, `meta_description`, `slug`, `author_id`, `views`, `created_at`, `updated_at`, `published_at`) VALUES
(1, 'Welcome to Eaglonhytes Properties', 'We are excited to announce the launch of our new property management platform. Discover premium lands and apartments with modern amenities and excellent locations.', 'Announcing the launch of our new property platform with premium locations.', 'company_updates', 'published', 1, '[]', 'announcement,launch,properties', NULL, 'welcome-to-eaglonhytes', 1, 0, '2025-10-04 14:54:15', '2025-10-04 14:54:15', '2025-10-04 14:54:15'),
(2, 'New Premium Lands Available in Victoria Island', 'We have just added several premium land plots in the heart of Victoria Island, Lagos. These properties offer excellent investment opportunities with great potential for appreciation.', 'Premium land plots now available in Victoria Island with excellent ROI potential.', 'new_lands', 'published', 1, '[]', 'victoria island,premium,investment', NULL, 'new-premium-lands-victoria-island', 1, 0, '2025-10-04 14:54:15', '2025-10-04 14:54:15', '2025-10-04 14:54:15'),
(3, 'Market Trends: Real Estate in Lagos 2024', 'The Lagos real estate market continues to show strong growth in 2024. Our analysis shows key trends that investors should be aware of when making property decisions.', 'Key real estate market trends and insights for Lagos property investors in 2024.', 'market_insights', 'published', 0, '[]', 'market trends,lagos,2024,investment', NULL, 'market-trends-lagos-2024', 1, 0, '2025-10-04 14:54:15', '2025-10-04 14:54:15', '2025-10-04 14:54:15');

-- --------------------------------------------------------

--
-- Table structure for table `founder`
--

CREATE TABLE `founder` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT 'To be updated by Admin',
  `role` varchar(255) NOT NULL DEFAULT 'Founder & CEO',
  `bio` text NOT NULL DEFAULT 'Visionary leader dedicated to transforming real estate investment for Nigerians at home and in the diaspora.',
  `image_url` varchar(500) DEFAULT '/assets/placeholder-founder.jpg',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `founder`
--

INSERT INTO `founder` (`id`, `name`, `role`, `bio`, `image_url`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'To be updated by Admin', 'Founder & CEO', 'Visionary leader dedicated to transforming real estate investment for Nigerians at home and in the diaspora.', '/assets/placeholder-founder.jpg', 1, '2025-10-02 19:39:19', '2025-10-02 19:39:19');

-- --------------------------------------------------------

--
-- Table structure for table `lands`
--

CREATE TABLE `lands` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `size` varchar(100) DEFAULT NULL,
  `land_type` enum('residential','commercial','agricultural','industrial','mixed') DEFAULT 'residential',
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `features` text DEFAULT NULL,
  `documents` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`documents`)),
  `status` enum('available','sold','reserved','under_negotiation') DEFAULT 'available',
  `featured` tinyint(1) DEFAULT 0,
  `views_count` int(11) DEFAULT 0,
  `whatsapp_contact` varchar(20) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lands`
--

INSERT INTO `lands` (`id`, `title`, `description`, `address`, `city`, `state`, `zip_code`, `price`, `size`, `land_type`, `images`, `features`, `documents`, `status`, `featured`, `views_count`, `whatsapp_contact`, `created_by`, `created_at`, `updated_at`) VALUES
(13, '2 BEDROOM APARTMENT', 'JUST OUT FOR LEASE IN LEKKI PHASE 1, FULLY FURNISHED SERVICE 2 BEDROOM APARTMENT ON FOURTH FLOOR,WITH SWIMMING POOL AND ELEVATOR, RENT IS PAID ANNUALLY', 'Freedom Way', 'Lekki', 'Lagos State', NULL, 13000000.00, NULL, 'residential', '\"[\\\"lands\\/03\\/46055bb25d50fd231cbf74a854f410b5_1759612660.jpg\\\"]\"', NULL, NULL, 'available', 0, 0, NULL, NULL, '2025-10-04 21:17:40', '2025-10-04 21:17:40');

-- --------------------------------------------------------

--
-- Table structure for table `land_applications`
--

CREATE TABLE `land_applications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `land_id` int(11) NOT NULL,
  `move_in_date` date DEFAULT NULL,
  `employment_status` varchar(100) DEFAULT NULL,
  `annual_income` decimal(15,2) DEFAULT NULL,
  `whatsapp_contact` varchar(20) DEFAULT NULL,
  `reference_contacts` text DEFAULT NULL,
  `additional_notes` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `land_inquiries`
--

CREATE TABLE `land_inquiries` (
  `id` int(11) NOT NULL,
  `land_id` int(11) NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `customer_whatsapp` varchar(20) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `inquiry_type` enum('general','viewing_request','price_negotiation','purchase_intent') DEFAULT 'general',
  `status` enum('new','contacted','in_progress','closed') DEFAULT 'new',
  `admin_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `land_reviews`
--

CREATE TABLE `land_reviews` (
  `id` int(11) NOT NULL,
  `land_id` int(11) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `review` text NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `is_approved` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `sender_type` enum('user','admin') NOT NULL DEFAULT 'user',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `user_id`, `message`, `sender_type`, `is_read`, `created_at`, `updated_at`) VALUES
(1, 1, 'Hello, I am interested in the Prime City Commercial Plot. Can you provide more details?', 'user', 0, '2025-09-25 11:53:39', '2025-09-25 11:53:39'),
(2, 1, 'Thank you for your interest! The Prime City Commercial Plot is located in the heart of Lagos with excellent road access and utilities. Would you like to schedule a viewing?', 'admin', 0, '2025-09-25 11:53:39', '2025-09-25 11:53:39'),
(3, 1, 'Yes, I would like to schedule a viewing. What times are available?', 'user', 0, '2025-09-25 11:53:39', '2025-09-25 11:53:39'),
(4, 1, 'Hello, I am interested in the Prime City Commercial Plot. Can you provide more details?', 'user', 0, '2025-09-26 14:16:53', '2025-09-26 14:16:53'),
(5, 1, 'Thank you for your interest! The Prime City Commercial Plot is located in the heart of Lagos with excellent road access and utilities. Would you like to schedule a viewing?', 'admin', 0, '2025-09-26 14:16:53', '2025-09-26 14:16:53'),
(6, 1, 'Yes, I would like to schedule a viewing. What times are available?', 'user', 0, '2025-09-26 14:16:53', '2025-09-26 14:16:53');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('info','success','warning','error') DEFAULT 'info',
  `redirect_to` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `redirect_to`, `is_read`, `created_at`) VALUES
(22, 1, 'Land Property Deleted', 'Property \'Hills\' has been removed from the system.', 'warning', 'lands', 1, '2025-10-04 14:21:36'),
(23, 8, 'Land Property Deleted', 'Property \'Hills\' has been removed from the system.', 'warning', 'lands', 0, '2025-10-04 14:21:36'),
(24, 1, 'Land Property Deleted', 'Property \'Tester Land 1759509378798\' has been removed from the system.', 'warning', 'lands', 1, '2025-10-04 14:21:40'),
(25, 8, 'Land Property Deleted', 'Property \'Tester Land 1759509378798\' has been removed from the system.', 'warning', 'lands', 0, '2025-10-04 14:21:40'),
(26, 1, 'Land Property Deleted', 'Property \'Commercial Land - Wuse 2\' has been removed from the system.', 'warning', 'lands', 1, '2025-10-04 14:21:51'),
(27, 8, 'Land Property Deleted', 'Property \'Commercial Land - Wuse 2\' has been removed from the system.', 'warning', 'lands', 0, '2025-10-04 14:21:51'),
(28, 1, 'Land Property Updated', 'Property \'Waterfront Land - Jabi Lake\' has been updated.', 'info', 'lands', 1, '2025-10-04 14:22:11'),
(29, 8, 'Land Property Updated', 'Property \'Waterfront Land - Jabi Lake\' has been updated.', 'info', 'lands', 0, '2025-10-04 14:22:11'),
(30, 1, 'Land Property Deleted', 'Property \'Luxury Estate Plot - Asokoro\' has been removed from the system.', 'warning', 'lands', 1, '2025-10-04 14:22:38'),
(31, 8, 'Land Property Deleted', 'Property \'Luxury Estate Plot - Asokoro\' has been removed from the system.', 'warning', 'lands', 0, '2025-10-04 14:22:38'),
(32, 1, 'Land Property Deleted', 'Property \'Affordable Housing Plot - Lugbe\' has been removed from the system.', 'warning', 'lands', 1, '2025-10-04 14:22:42'),
(33, 8, 'Land Property Deleted', 'Property \'Affordable Housing Plot - Lugbe\' has been removed from the system.', 'warning', 'lands', 0, '2025-10-04 14:22:42'),
(34, 1, 'Land Property Deleted', 'Property \'Industrial Land - Idu\' has been removed from the system.', 'warning', 'lands', 1, '2025-10-04 14:22:46'),
(35, 8, 'Land Property Deleted', 'Property \'Industrial Land - Idu\' has been removed from the system.', 'warning', 'lands', 0, '2025-10-04 14:22:46'),
(36, 1, 'Land Property Deleted', 'Property \'Waterfront Land - Jabi Lake\' has been removed from the system.', 'warning', 'lands', 1, '2025-10-04 14:22:50'),
(37, 8, 'Land Property Deleted', 'Property \'Waterfront Land - Jabi Lake\' has been removed from the system.', 'warning', 'lands', 0, '2025-10-04 14:22:50'),
(38, 1, 'New Land Property Added', 'Property \'2 BEDROOM APARTMENT\' in Lekki has been added to the system.', 'success', 'lands', 0, '2025-10-04 21:17:40'),
(39, 8, 'New Land Property Added', 'Property \'2 BEDROOM APARTMENT\' in Lekki has been added to the system.', 'success', 'lands', 0, '2025-10-04 21:17:40');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `whatsapp_number` varchar(20) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `is_restricted` tinyint(1) DEFAULT 0,
  `role` enum('super_admin','admin','user') DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT 1,
  `profile_picture` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `phone`, `whatsapp_number`, `is_admin`, `is_restricted`, `role`, `is_active`, `profile_picture`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@eaglonhytes.com', '$2y$10$OX7bETzUN.vOVFF9fdEAGOcqxTmuxR/74y7lloKWsY4Tz/OkFXIqe', NULL, '+234-803-1234567', 1, 0, 'super_admin', 1, NULL, '2025-09-25 10:46:50', '2025-09-30 07:16:25'),
(5, 'Joseph Ibrahim', 'kingofsheet@gmail.com', '$2y$10$Yai5XQ7j5.SGy2e.bOkyQungXJPySO5lXfITCIlxM8F0eVzBAejVe', NULL, NULL, 0, 0, 'user', 1, NULL, '2025-09-26 15:01:35', '2025-09-26 15:01:35'),
(8, 'Lilith Bryce', 'iam111@gmail.com', '$2y$10$F3eBxjrVtQPv9VeBMXGd0.q/hmDuHUyYD3zWjoyS1UdlJEWuEA5Ly', '0809967543', NULL, 1, 0, 'user', 1, NULL, '2025-09-30 07:48:02', '2025-09-30 07:48:02'),
(9, 'Joseph Ibrahim', 'kingofsheat@gmail.com', '$2y$10$QGFclXrhantvfdjXOC6QVe0UsEYg1wqsNEIxi1s7uUr2gb0pW9tFy', NULL, NULL, 0, 0, 'user', 1, NULL, '2025-09-30 09:33:40', '2025-09-30 09:33:40'),
(10, 'Benimaru Stanly', 'ofsheat@gmail.com', '$2y$10$DBi9me4KiOfUSFf50OnIr.uOaJlXi0UnLHa8OBvxCWHSyA1W2lsPu', '', NULL, 0, 0, 'user', 1, NULL, '2025-09-30 15:31:32', '2025-09-30 15:31:32');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_audit_log`
--
ALTER TABLE `admin_audit_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_admin_id` (`admin_id`),
  ADD KEY `idx_action` (`action`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `backup_carousel_images`
--
ALTER TABLE `backup_carousel_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_carousel_active` (`is_active`),
  ADD KEY `idx_carousel_order` (`display_order`,`is_active`);

--
-- Indexes for table `backup_story_content`
--
ALTER TABLE `backup_story_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_story_active` (`is_active`);

--
-- Indexes for table `company_settings`
--
ALTER TABLE `company_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`),
  ADD KEY `idx_setting_key` (`setting_key`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `content_posts`
--
ALTER TABLE `content_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_featured` (`featured`),
  ADD KEY `idx_published_at` (`published_at`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `founder`
--
ALTER TABLE `founder`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lands`
--
ALTER TABLE `lands`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_city` (`city`),
  ADD KEY `idx_state` (`state`),
  ADD KEY `idx_price` (`price`),
  ADD KEY `idx_land_type` (`land_type`),
  ADD KEY `idx_featured` (`featured`),
  ADD KEY `idx_created_by` (`created_by`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `land_applications`
--
ALTER TABLE `land_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `land_id` (`land_id`);

--
-- Indexes for table `land_inquiries`
--
ALTER TABLE `land_inquiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_land_id` (`land_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_inquiry_type` (`inquiry_type`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `land_reviews`
--
ALTER TABLE `land_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_land_id` (`land_id`),
  ADD KEY `idx_rating` (`rating`),
  ADD KEY `idx_is_approved` (`is_approved`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_sender_type` (`sender_type`),
  ADD KEY `idx_is_read` (`is_read`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_is_admin` (`is_admin`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_audit_log`
--
ALTER TABLE `admin_audit_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `backup_carousel_images`
--
ALTER TABLE `backup_carousel_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `backup_story_content`
--
ALTER TABLE `backup_story_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `company_settings`
--
ALTER TABLE `company_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `content_posts`
--
ALTER TABLE `content_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `founder`
--
ALTER TABLE `founder`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `lands`
--
ALTER TABLE `lands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `land_applications`
--
ALTER TABLE `land_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `land_inquiries`
--
ALTER TABLE `land_inquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `land_reviews`
--
ALTER TABLE `land_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_audit_log`
--
ALTER TABLE `admin_audit_log`
  ADD CONSTRAINT `admin_audit_log_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `content_posts`
--
ALTER TABLE `content_posts`
  ADD CONSTRAINT `content_posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `lands`
--
ALTER TABLE `lands`
  ADD CONSTRAINT `fk_lands_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `lands_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `land_applications`
--
ALTER TABLE `land_applications`
  ADD CONSTRAINT `land_applications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `land_applications_ibfk_2` FOREIGN KEY (`land_id`) REFERENCES `lands` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `land_inquiries`
--
ALTER TABLE `land_inquiries`
  ADD CONSTRAINT `land_inquiries_ibfk_1` FOREIGN KEY (`land_id`) REFERENCES `lands` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `land_reviews`
--
ALTER TABLE `land_reviews`
  ADD CONSTRAINT `land_reviews_ibfk_1` FOREIGN KEY (`land_id`) REFERENCES `lands` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
