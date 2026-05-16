-- ============================================
-- Culinary Compass — MySQL Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS culinary_compass
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE culinary_compass;

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- REGIONS
-- ============================================
CREATE TABLE regions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  slug VARCHAR(150) NOT NULL UNIQUE,
  country VARCHAR(100) DEFAULT 'India',
  lat DECIMAL(10,7) DEFAULT NULL,
  lng DECIMAL(10,7) DEFAULT NULL,
  image_url TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) DEFAULT NULL,
  role ENUM('user','admin') DEFAULT 'user',
  is_verified TINYINT(1) DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  google_id VARCHAR(255) DEFAULT NULL UNIQUE,
  verification_token VARCHAR(255) DEFAULT NULL,
  reset_token VARCHAR(255) DEFAULT NULL,
  reset_token_expiry DATETIME DEFAULT NULL,
  refresh_token TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_google_id (google_id)
) ENGINE=InnoDB;

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  display_name VARCHAR(150) DEFAULT NULL,
  avatar_url TEXT DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  location VARCHAR(255) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  date_of_birth DATE DEFAULT NULL,
  preferences JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- FOODS
-- ============================================
CREATE TABLE foods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  image_url TEXT DEFAULT NULL,
  cuisine VARCHAR(100) DEFAULT NULL,
  category_id INT DEFAULT NULL,
  region_id INT DEFAULT NULL,
  rating_avg DECIMAL(3,2) DEFAULT 0.00,
  rating_count INT DEFAULT 0,
  price_range VARCHAR(50) DEFAULT NULL,
  is_vegetarian TINYINT(1) DEFAULT 0,
  is_featured TINYINT(1) DEFAULT 0,
  tags JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE SET NULL,
  INDEX idx_foods_cuisine (cuisine),
  INDEX idx_foods_featured (is_featured),
  FULLTEXT INDEX ft_foods_name_desc (name, description)
) ENGINE=InnoDB;

-- ============================================
-- RESTAURANTS
-- ============================================
CREATE TABLE restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  address TEXT DEFAULT NULL,
  lat DECIMAL(10,7) DEFAULT NULL,
  lng DECIMAL(10,7) DEFAULT NULL,
  rating DECIMAL(3,2) DEFAULT 0.00,
  price_level INT DEFAULT NULL,
  image_url TEXT DEFAULT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  website VARCHAR(500) DEFAULT NULL,
  place_id VARCHAR(255) DEFAULT NULL,
  cuisine VARCHAR(100) DEFAULT NULL,
  opening_hours JSON DEFAULT NULL,
  is_verified TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_restaurants_location (lat, lng),
  INDEX idx_restaurants_place_id (place_id)
) ENGINE=InnoDB;

-- ============================================
-- HOTELS
-- ============================================
CREATE TABLE hotels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  address TEXT DEFAULT NULL,
  lat DECIMAL(10,7) DEFAULT NULL,
  lng DECIMAL(10,7) DEFAULT NULL,
  rating DECIMAL(3,2) DEFAULT 0.00,
  price_per_night DECIMAL(10,2) DEFAULT NULL,
  image_url TEXT DEFAULT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  website VARCHAR(500) DEFAULT NULL,
  place_id VARCHAR(255) DEFAULT NULL,
  amenities JSON DEFAULT NULL,
  star_rating INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_hotels_location (lat, lng)
) ENGINE=InnoDB;

-- ============================================
-- TOURIST PLACES
-- ============================================
CREATE TABLE tourist_places (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  address TEXT DEFAULT NULL,
  lat DECIMAL(10,7) DEFAULT NULL,
  lng DECIMAL(10,7) DEFAULT NULL,
  image_url TEXT DEFAULT NULL,
  category VARCHAR(100) DEFAULT NULL,
  rating DECIMAL(3,2) DEFAULT 0.00,
  entry_fee DECIMAL(10,2) DEFAULT NULL,
  opening_hours JSON DEFAULT NULL,
  place_id VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tourist_location (lat, lng)
) ENGINE=InnoDB;

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  entity_type ENUM('food','restaurant','hotel','tourist_place','hidden_gem') NOT NULL,
  entity_id INT NOT NULL,
  content TEXT DEFAULT NULL,
  rating DECIMAL(2,1) NOT NULL,
  image_url TEXT DEFAULT NULL,
  is_approved TINYINT(1) DEFAULT 1,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_reviews_entity (entity_type, entity_id),
  INDEX idx_reviews_user (user_id)
) ENGINE=InnoDB;

-- ============================================
-- ITINERARIES
-- ============================================
CREATE TABLE itineraries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  destination VARCHAR(255) DEFAULT NULL,
  days INT DEFAULT 1,
  budget DECIMAL(12,2) DEFAULT NULL,
  content JSON NOT NULL,
  ai_generated TINYINT(1) DEFAULT 0,
  is_public TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_itineraries_user (user_id)
) ENGINE=InnoDB;

-- ============================================
-- FAVORITES
-- ============================================
CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  entity_type ENUM('food','restaurant','hotel','tourist_place','hidden_gem') NOT NULL,
  entity_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_favorites (user_id, entity_type, entity_id),
  INDEX idx_favorites_user (user_id)
) ENGINE=InnoDB;

-- ============================================
-- UPLOADED IMAGES
-- ============================================
CREATE TABLE uploaded_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  url TEXT NOT NULL,
  public_id VARCHAR(255) DEFAULT NULL,
  entity_type VARCHAR(50) DEFAULT NULL,
  entity_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- HIDDEN GEMS
-- ============================================
CREATE TABLE hidden_gems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  lat DECIMAL(10,7) DEFAULT NULL,
  lng DECIMAL(10,7) DEFAULT NULL,
  address TEXT DEFAULT NULL,
  image_url TEXT DEFAULT NULL,
  category VARCHAR(100) DEFAULT NULL,
  rating DECIMAL(3,2) DEFAULT 0.00,
  is_approved TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_gems_location (lat, lng)
) ENGINE=InnoDB;

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT DEFAULT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_read TINYINT(1) DEFAULT 0,
  link VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notifications_user (user_id, is_read)
) ENGINE=InnoDB;

-- ============================================
-- REPORTS
-- ============================================
CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reporter_id INT NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT NOT NULL,
  reason TEXT NOT NULL,
  status ENUM('pending','reviewed','resolved','dismissed') DEFAULT 'pending',
  admin_notes TEXT DEFAULT NULL,
  resolved_by INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- ADMIN LOGS
-- ============================================
CREATE TABLE admin_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(50) DEFAULT NULL,
  entity_id INT DEFAULT NULL,
  details JSON DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_admin_logs_admin (admin_id)
) ENGINE=InnoDB;
