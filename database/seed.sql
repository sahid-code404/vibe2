-- ============================================
-- Culinary Compass — Seed Data
-- ============================================

USE culinary_compass;

-- Categories
INSERT INTO categories (name, slug, icon) VALUES
('Street Food', 'street-food', 'utensils'),
('Fine Dining', 'fine-dining', 'wine'),
('Cafe & Bakery', 'cafe-bakery', 'coffee'),
('Seafood', 'seafood', 'fish'),
('Vegetarian', 'vegetarian', 'leaf'),
('Traditional', 'traditional', 'landmark'),
('Desserts', 'desserts', 'cake'),
('Fast Food', 'fast-food', 'zap'),
('Beverages', 'beverages', 'cup-soda'),
('Regional Specialty', 'regional-specialty', 'map-pin');

-- Regions
INSERT INTO regions (name, slug, country, lat, lng, image_url) VALUES
('Kolkata', 'kolkata', 'India', 22.5726, 88.3639, 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800'),
('Mumbai', 'mumbai', 'India', 19.0760, 72.8777, 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800'),
('Delhi', 'delhi', 'India', 28.7041, 77.1025, 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800'),
('Jaipur', 'jaipur', 'India', 26.9124, 75.7873, 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800'),
('Goa', 'goa', 'India', 15.2993, 74.1240, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800'),
('Chennai', 'chennai', 'India', 13.0827, 80.2707, 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800'),
('Lucknow', 'lucknow', 'India', 26.8467, 80.9462, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'),
('Hyderabad', 'hyderabad', 'India', 17.3850, 78.4867, 'https://images.unsplash.com/photo-1572638783616-77b43e8e7867?w=800'),
('Varanasi', 'varanasi', 'India', 25.3176, 82.9739, 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800'),
('Amritsar', 'amritsar', 'India', 31.6340, 74.8723, 'https://images.unsplash.com/photo-1518792528501-352f829886dc?w=800');

-- Foods
INSERT INTO foods (name, description, image_url, cuisine, category_id, region_id, rating_avg, rating_count, price_range, is_vegetarian, is_featured, tags) VALUES
('Kolkata Biryani', 'The iconic Kolkata-style biryani with fragrant rice, tender meat, potato, and egg. A legacy of the Nawabs.', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', 'Bengali', 6, 1, 4.70, 234, '₹150-300', 0, 1, '["biryani","rice","kolkata","nawabi"]'),
('Puchka', 'Kolkata street food staple — crispy shells filled with spiced mashed potato, tamarind water, and a burst of flavors.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800', 'Bengali', 1, 1, 4.80, 567, '₹20-50', 1, 1, '["street-food","pani-puri","kolkata"]'),
('Vada Pav', 'Mumbai iconic street food — spiced potato fritter in a bun with chutneys. The city humble burger.', 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=800', 'Maharashtrian', 1, 2, 4.60, 890, '₹15-40', 1, 1, '["street-food","mumbai","snack"]'),
('Butter Chicken', 'Creamy, rich tomato-based curry with tender chicken pieces. Delhi signature dish loved worldwide.', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800', 'North Indian', 6, 3, 4.75, 1200, '₹250-500', 0, 1, '["curry","delhi","chicken","butter"]'),
('Dal Baati Churma', 'Rajasthan most famous dish — baked wheat balls with lentil curry and sweet churma.', 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800', 'Rajasthani', 6, 4, 4.50, 345, '₹200-400', 1, 1, '["rajasthani","traditional","jaipur"]'),
('Goan Fish Curry', 'A tangy coconut-based fish curry with Goan spices. Best enjoyed with steamed rice by the beach.', 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800', 'Goan', 4, 5, 4.65, 278, '₹200-450', 0, 1, '["seafood","goa","curry","fish"]'),
('Masala Dosa', 'Crispy rice crepe filled with spiced potato filling, served with sambar and chutneys. South Indian classic.', 'https://images.unsplash.com/photo-1668236543090-82bbe26ab1f4?w=800', 'South Indian', 6, 6, 4.70, 934, '₹80-200', 1, 1, '["south-indian","breakfast","dosa"]'),
('Lucknowi Kebab', 'Melt-in-mouth galawati kebabs from Lucknow. A Nawabi delicacy with 160 spices.', 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800', 'Awadhi', 6, 7, 4.80, 456, '₹200-500', 0, 1, '["kebab","lucknow","nawabi","awadhi"]'),
('Hyderabadi Biryani', 'The legendary dum biryani of Hyderabad — slow-cooked with saffron, spices, and layers of flavor.', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', 'Hyderabadi', 6, 8, 4.85, 2100, '₹200-400', 0, 1, '["biryani","hyderabad","dum","rice"]'),
('Banarasi Paan', 'The legendary betel leaf preparation from Varanasi — sweet, refreshing, and culturally iconic.', 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=800', 'North Indian', 7, 9, 4.40, 180, '₹30-100', 1, 0, '["paan","varanasi","dessert","traditional"]'),
('Amritsari Kulcha', 'Stuffed bread baked in tandoor, served with chole and lassi. Amritsar pride dish.', 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800', 'Punjabi', 6, 10, 4.65, 567, '₹100-200', 1, 1, '["punjabi","bread","amritsar","kulcha"]'),
('Rasgulla', 'Soft spongy cheese balls soaked in sugar syrup. Bengal sweetest gift to the world.', 'https://images.unsplash.com/photo-1666190050431-e9af9c890b67?w=800', 'Bengali', 7, 1, 4.55, 345, '₹50-150', 1, 0, '["sweet","dessert","kolkata","bengali"]');

-- Admin user (password: admin123)
INSERT INTO users (email, password_hash, role, is_verified, is_active) VALUES
('admin@culinarycompass.com', '$2b$12$LQv3c1yqBo9SkvXS7QTJPe7Fz3Y3z5Y5z5Y5z5Y5z5Y5z5Y5z5Y5z', 'admin', 1, 1);

INSERT INTO profiles (user_id, display_name, bio, location) VALUES
(1, 'Admin', 'Culinary Compass Administrator', 'India');
