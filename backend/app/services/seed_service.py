"""Seed service — populates initial data on startup."""
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.category import Category
from app.models.region import Region
from app.models.food import Food
from app.models.user import User
from app.models.profile import Profile
from app.auth.password import hash_password


def seed_initial_data():
    """Seed the database with initial categories, regions, foods, and admin user."""
    db = SessionLocal()
    try:
        # Only seed if empty
        if db.query(Category).count() > 0:
            return

        # Categories
        categories = [
            Category(name="Street Food", slug="street-food", icon="utensils"),
            Category(name="Fine Dining", slug="fine-dining", icon="wine"),
            Category(name="Cafe & Bakery", slug="cafe-bakery", icon="coffee"),
            Category(name="Seafood", slug="seafood", icon="fish"),
            Category(name="Vegetarian", slug="vegetarian", icon="leaf"),
            Category(name="Traditional", slug="traditional", icon="landmark"),
            Category(name="Desserts", slug="desserts", icon="cake"),
            Category(name="Fast Food", slug="fast-food", icon="zap"),
            Category(name="Beverages", slug="beverages", icon="cup-soda"),
            Category(name="Regional Specialty", slug="regional-specialty", icon="map-pin"),
        ]
        db.add_all(categories)
        db.flush()

        # Regions
        regions_data = [
            ("Kolkata", "kolkata", 22.5726, 88.3639, "https://images.unsplash.com/photo-1558431382-27e303142255?w=800"),
            ("Mumbai", "mumbai", 19.0760, 72.8777, "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800"),
            ("Delhi", "delhi", 28.7041, 77.1025, "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800"),
            ("Jaipur", "jaipur", 26.9124, 75.7873, "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800"),
            ("Goa", "goa", 15.2993, 74.1240, "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800"),
            ("Chennai", "chennai", 13.0827, 80.2707, "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"),
            ("Lucknow", "lucknow", 26.8467, 80.9462, "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"),
            ("Hyderabad", "hyderabad", 17.3850, 78.4867, "https://images.unsplash.com/photo-1572638783616-77b43e8e7867?w=800"),
            ("Varanasi", "varanasi", 25.3176, 82.9739, "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800"),
            ("Amritsar", "amritsar", 31.6340, 74.8723, "https://images.unsplash.com/photo-1518792528501-352f829886dc?w=800"),
        ]
        regions = []
        for name, slug, lat, lng, img in regions_data:
            r = Region(name=name, slug=slug, lat=lat, lng=lng, image_url=img)
            regions.append(r)
        db.add_all(regions)
        db.flush()

        # Foods
        cat_map = {c.slug: c.id for c in categories}
        reg_map = {r.slug: r.id for r in regions}

        foods_data = [
            ("Kolkata Biryani", "The iconic Kolkata-style biryani with fragrant rice, tender meat, potato, and egg.", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800", "Bengali", "traditional", "kolkata", 4.70, 234, "₹150-300", False, True),
            ("Puchka", "Kolkata's beloved street food — crispy shells filled with spiced potato and tangy tamarind water.", "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800", "Bengali", "street-food", "kolkata", 4.80, 567, "₹20-50", True, True),
            ("Vada Pav", "Mumbai's iconic street food — spiced potato fritter in a soft bun with fiery chutneys.", "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=800", "Maharashtrian", "street-food", "mumbai", 4.60, 890, "₹15-40", True, True),
            ("Butter Chicken", "Creamy, rich tomato-based curry with tender chicken. Delhi's signature dish.", "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800", "North Indian", "traditional", "delhi", 4.75, 1200, "₹250-500", False, True),
            ("Dal Baati Churma", "Rajasthan's famous dish — baked wheat balls with lentil curry and sweet churma.", "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800", "Rajasthani", "traditional", "jaipur", 4.50, 345, "₹200-400", True, True),
            ("Goan Fish Curry", "A tangy coconut-based fish curry with Goan spices, best with steamed rice.", "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800", "Goan", "seafood", "goa", 4.65, 278, "₹200-450", False, True),
            ("Masala Dosa", "Crispy rice crepe with spiced potato filling, sambar, and chutneys. South Indian classic.", "https://images.unsplash.com/photo-1668236543090-82bbe26ab1f4?w=800", "South Indian", "traditional", "chennai", 4.70, 934, "₹80-200", True, True),
            ("Lucknowi Kebab", "Melt-in-mouth galawati kebabs — a Nawabi delicacy with 160 spices.", "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800", "Awadhi", "traditional", "lucknow", 4.80, 456, "₹200-500", False, True),
            ("Hyderabadi Biryani", "Legendary dum biryani — slow-cooked with saffron, spices, and layers of flavor.", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800", "Hyderabadi", "traditional", "hyderabad", 4.85, 2100, "₹200-400", False, True),
            ("Banarasi Paan", "Iconic betel leaf preparation from Varanasi — sweet, refreshing, culturally significant.", "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=800", "North Indian", "desserts", "varanasi", 4.40, 180, "₹30-100", True, False),
            ("Amritsari Kulcha", "Stuffed bread baked in tandoor with chole and lassi. Amritsar's pride.", "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800", "Punjabi", "traditional", "amritsar", 4.65, 567, "₹100-200", True, True),
            ("Rasgulla", "Soft spongy cheese balls in sugar syrup — Bengal's sweetest gift to the world.", "https://images.unsplash.com/photo-1666190050431-e9af9c890b67?w=800", "Bengali", "desserts", "kolkata", 4.55, 345, "₹50-150", True, False),
        ]

        for name, desc, img, cuisine, cat_slug, reg_slug, rating, count, price, veg, featured in foods_data:
            food = Food(
                name=name, description=desc, image_url=img, cuisine=cuisine,
                category_id=cat_map.get(cat_slug), region_id=reg_map.get(reg_slug),
                rating_avg=rating, rating_count=count, price_range=price,
                is_vegetarian=veg, is_featured=featured,
                tags=[cuisine.lower(), reg_slug],
            )
            db.add(food)

        # Admin user
        if not db.query(User).filter(User.email == "admin@culinarycompass.com").first():
            admin = User(
                email="admin@culinarycompass.com",
                password_hash=hash_password("admin123"),
                role="admin",
                is_verified=True,
                is_active=True,
            )
            db.add(admin)
            db.flush()
            profile = Profile(
                user_id=admin.id,
                display_name="Admin",
                bio="Culinary Compass Administrator",
                location="India",
            )
            db.add(profile)

        db.commit()
        print("✅ Database seeded successfully")
    except Exception as e:
        db.rollback()
        print(f"⚠️ Seed error (may already exist): {e}")
    finally:
        db.close()
