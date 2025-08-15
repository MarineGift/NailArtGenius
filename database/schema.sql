-- ConnieNail Database Schema for Supabase
-- Run this script in your Supabase SQL Editor

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Admin users table with role-based permissions
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'editor' CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
    permissions JSON DEFAULT '[]'::json,
    is_active BOOLEAN DEFAULT true,
    hire_date DATE,
    termination_date DATE,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table (phone as primary identifier)
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    date_of_birth DATE,
    address TEXT,
    notes TEXT,
    preferred_technician VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Categories table
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_no SERIAL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table (updated to reference categories)
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    duration INTEGER, -- in minutes
    price DECIMAL(10,2),
    category_id UUID REFERENCES service_categories(id),
    category VARCHAR(100), -- keeping for backward compatibility
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Details table
CREATE TABLE IF NOT EXISTS service_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    media_link VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table with admin tracking
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    service_id UUID REFERENCES services(id),
    technician_name VARCHAR(100),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration INTEGER, -- in minutes
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    price DECIMAL(10,2),
    notes TEXT,
    -- Admin tracking fields
    created_by_admin_id UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by_admin_id UUID REFERENCES admin_users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Treatment history
CREATE TABLE IF NOT EXISTS treatments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id),
    customer_id UUID REFERENCES customers(id),
    service_name VARCHAR(200),
    treatment_date DATE NOT NULL,
    technician_name VARCHAR(100),
    notes TEXT,
    photos JSON DEFAULT '[]'::json, -- Array of photo URLs
    price DECIMAL(10,2),
    created_by_admin_id UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery images
CREATE TABLE IF NOT EXISTS gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    category VARCHAR(100),
    tags JSON DEFAULT '[]'::json,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_by_admin_id UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News/Blog posts
CREATE TABLE IF NOT EXISTS news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE,
    summary TEXT,
    content TEXT,
    featured_image VARCHAR(500),
    author_name VARCHAR(100),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_by_admin_id UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    image_url VARCHAR(500),
    category VARCHAR(100),
    brand VARCHAR(100),
    is_featured BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    created_by_admin_id UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carousel/Banner images
CREATE TABLE IF NOT EXISTS carousel_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500),
    button_text VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by_admin_id UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer communications log
CREATE TABLE IF NOT EXISTS customer_communications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    communication_type VARCHAR(50) CHECK (communication_type IN ('email', 'sms', 'call', 'note')),
    subject VARCHAR(200),
    content TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_by_admin_id UUID REFERENCES admin_users(id),
    status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(appointment_date);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_treatments_customer ON treatments(customer_id);
CREATE INDEX IF NOT EXISTS idx_treatments_date ON treatments(treatment_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carousel_images_updated_at BEFORE UPDATE ON carousel_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON service_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password is 'admin123' hashed)
INSERT INTO admin_users (email, password_hash, first_name, last_name, role, permissions, is_active) 
VALUES (
    'admin@connienail.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
    'Super',
    'Admin',
    'super_admin',
    '["all"]'::json,
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert service categories
INSERT INTO service_categories (name, description) VALUES
('Manicure', 'Hand nail care services including classic and gel manicures'),
('Pedicure', 'Foot nail care services including classic and gel pedicures'),
('Nail Art', 'Custom artistic nail designs and creative expressions'),
('Extensions', 'Nail extension services including acrylic and gel sets'),
('Luxury Treatments', 'Premium nail care experiences with advanced techniques'),
('Seasonal Specials', 'Limited-time seasonal nail design collections')
ON CONFLICT DO NOTHING;

-- Insert sample services
INSERT INTO services (name, description, duration, price, category) VALUES
('Classic Manicure', 'Basic nail care with polish', 45, 25.00, 'Manicure'),
('Gel Manicure', 'Long-lasting gel polish application', 60, 35.00, 'Manicure'),
('Chrome Glass Nails', 'Ultra-glossy chrome finish with glass effect', 90, 65.00, 'Luxury Treatments'),
('Classic Pedicure', 'Basic foot care with polish', 60, 30.00, 'Pedicure'),
('Gel Pedicure', 'Long-lasting gel polish for toes', 75, 40.00, 'Pedicure'),
('3D Nail Art', 'Custom 3D sculptured nail designs', 120, 85.00, 'Nail Art'),
('Aura Gradient Nails', 'Trending gradient color blending effects', 75, 55.00, 'Nail Art'),
('Acrylic Full Set', 'Complete acrylic nail extensions', 120, 60.00, 'Extensions'),
('Builder Gel Extensions', 'BIAB technique for natural-looking extensions', 105, 70.00, 'Extensions'),
('Coquette Cherry Design', 'Sweet cherry-themed nail art with bows', 90, 50.00, 'Seasonal Specials')
ON CONFLICT DO NOTHING;

-- Insert service details
INSERT INTO service_details (service_id, media_link, description) 
SELECT s.id, 
       'https://images.unsplash.com/photo-1607779097290-33d42b3056e4?ixlib=rb-4.0.3',
       'Professional nail care with attention to detail and luxury finishes'
FROM services s WHERE s.name = 'Chrome Glass Nails'
ON CONFLICT DO NOTHING;

-- Insert carousel images
INSERT INTO carousel_images (title, image_url, description, link_url, sort_order, is_active) VALUES
('Luxury Chrome Glass Nails 2024', 'https://images.unsplash.com/photo-1607779097290-33d42b3056e4?ixlib=rb-4.0.3', 'Experience the latest in luxury nail trends with our signature chrome glass finish', '/services/chrome-glass', 1, true),
('3D Nail Art Masterpieces', 'https://images.unsplash.com/photo-1599206676521-2ccf18bf8b6d?ixlib=rb-4.0.3', 'Transform your nails into wearable art with our custom 3D designs', '/gallery', 2, true),
('Aura Gradient Collection', 'https://images.unsplash.com/photo-1595690006851-2f62c6c9b0a7?ixlib=rb-4.0.3', 'Trending aura effects with stunning gradient color blending', '/services/aura-gradient', 3, true),
('Coquette Cherry Designs', 'https://images.unsplash.com/photo-1583312522530-5b1c7ed32394?ixlib=rb-4.0.3', 'Sweet and feminine cherry-themed nail art perfect for summer 2024', '/gallery/coquette', 4, true),
('Seasonal Luxury Collection', 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3', 'Discover our exclusive seasonal nail designs and luxury treatments', '/services', 5, true)
ON CONFLICT DO NOTHING;

-- Insert gallery images
INSERT INTO gallery (title, description, image_url, category, tags, is_featured, is_published, sort_order) VALUES
('Chrome Glass Manicure', 'Ultra-glossy chrome finish with translucent glass effect', 'https://images.unsplash.com/photo-1607779097290-33d42b3056e4?ixlib=rb-4.0.3', 'Luxury Treatments', '["chrome", "glass", "luxury", "2024"]', true, true, 1),
('3D Floral Sculpture Nails', 'Handcrafted 3D flower designs with pearl accents', 'https://images.unsplash.com/photo-1599206676521-2ccf18bf8b6d?ixlib=rb-4.0.3', 'Nail Art', '["3d", "floral", "sculpture", "pearls"]', true, true, 2),
('Aura Gradient Purple Pink', 'Stunning gradient blend from purple to pink creating aura effect', 'https://images.unsplash.com/photo-1595690006851-2f62c6c9b0a7?ixlib=rb-4.0.3', 'Nail Art', '["aura", "gradient", "purple", "pink"]', true, true, 3),
('Cherry Coquette Design', 'Sweet cherry motifs with bow details and baby pink base', 'https://images.unsplash.com/photo-1583312522530-5b1c7ed32394?ixlib=rb-4.0.3', 'Seasonal Specials', '["cherry", "coquette", "bow", "pink"]', true, true, 4),
('Butter Yellow Summer Nails', 'Trending butter yellow with minimalist line art', 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3', 'Manicure', '["butter yellow", "summer", "minimalist", "2024"]', false, true, 5),
('Abstract Art Manicure', 'Custom abstract patterns in earth tones with gold accents', 'https://images.unsplash.com/photo-1505455184862-554165e5f6ba?ixlib=rb-4.0.3', 'Nail Art', '["abstract", "earth tones", "gold", "custom"]', false, true, 6),
('Tortoiseshell French Tips', 'Modern take on French manicure with tortoiseshell pattern', 'https://images.unsplash.com/photo-1617625672675-b2092c6ea7dc?ixlib=rb-4.0.3', 'Manicure', '["tortoiseshell", "french", "modern", "autumn"]', false, true, 7),
('Luxury Gel Pedicure', 'Professional gel pedicure with spa treatment', 'https://images.unsplash.com/photo-1599944944693-5f60b6dc85ae?ixlib=rb-4.0.3', 'Pedicure', '["gel", "pedicure", "spa", "luxury"]', false, true, 8)
ON CONFLICT DO NOTHING;

-- Insert news articles
INSERT INTO news (title, slug, summary, content, featured_image, author_name, is_published, published_at) VALUES
('Top 2024 Nail Trends: Chrome Glass and Aura Effects Lead the Way', 'top-2024-nail-trends-chrome-glass-aura', 'Discover the hottest nail trends dominating 2024, from ultra-glossy chrome glass finishes to stunning aura gradient effects.', 
'The nail industry in 2024 is being revolutionized by innovative techniques and stunning visual effects. Chrome glass nails have emerged as the luxury treatment of choice, offering an ultra-glossy finish that makes color appear beneath a sheet of glass. This technique represents an evolution from 2023''s glazed donut trend, providing even more sophisticated and mirror-like results.

Aura nails are another major trend, featuring gradient color blending that creates ethereal, energy-field-like effects. These designs typically blend 2-3 complementary colors in a soft, diffused pattern that radiates from the cuticle outward.

Other significant trends include:
- 3D nail art with sculptural elements
- Coquette designs featuring bows and cherry motifs  
- Abstract minimalist patterns
- Butter yellow as the color of the year
- Tortoiseshell patterns making a comeback

At ConnieNail, we specialize in these cutting-edge techniques, using professional-grade products and advanced application methods to ensure long-lasting, salon-quality results.', 
'https://images.unsplash.com/photo-1607779097290-33d42b3056e4?ixlib=rb-4.0.3', 'ConnieNail Team', true, NOW()),

('The Science Behind Chrome Glass Nails: Our Luxury Technique Explained', 'science-chrome-glass-nails-luxury-technique', 'Learn about the advanced techniques and professional products behind our signature chrome glass nail service.', 
'Chrome glass nails represent the pinnacle of nail art technology, combining multiple advanced techniques to achieve an otherworldly finish. This service requires specialized training and professional-grade products that aren''t available for home use.

The process begins with proper nail preparation, including cuticle care and surface smoothing. We then apply a black base coat that serves as the foundation for the chrome effect. Multiple layers of specially formulated gel are applied, each cured under professional LED lights for optimal adhesion and durability.

The signature glass effect is achieved through a combination of high-quality chrome powder and a proprietary top coat system. The result is a mirror-like finish that appears to have depth, creating the illusion that color exists beneath a sheet of glass.

Key benefits of our chrome glass service:
- Ultra-durable finish lasting 3-4 weeks
- Scratch and chip resistant
- Professional application techniques
- Customizable color options
- Luxury spa experience

Our nail technicians undergo specialized training to master this technique, ensuring consistent, professional results every time.', 
'https://images.unsplash.com/photo-1599206676521-2ccf18bf8b6d?ixlib=rb-4.0.3', 'Sarah Kim, Lead Technician', true, NOW() - INTERVAL '3 days'),

('Industry Report: Nail Salon Market Grows to $13.5 Billion in 2024', 'nail-salon-market-growth-report-2024', 'The nail salon industry continues its strong growth trajectory, driven by social media trends and increased focus on self-care.', 
'The nail salon industry has reached a milestone $13.5 billion market size in 2024, with projections showing continued growth to $25.1 billion by 2033. This represents a robust 6.54% compound annual growth rate (CAGR), making it one of the fastest-growing segments in the beauty industry.

Key growth drivers include:
- Rising disposable income and emphasis on self-care
- Social media influence driving nail art trends
- Innovation in nail technology and techniques
- Expansion of franchise and luxury salon concepts
- Integration of health and wellness services

Technology integration is playing a major role in industry evolution:
- AI-powered nail analysis tools
- Virtual try-on technologies using AR
- 3D printing enabling complex designs
- LED lighting systems for energy efficiency
- Digital booking and customer management systems

The industry is also seeing a shift toward sustainability:
- Non-toxic, plant-based formulations
- Biodegradable packaging
- HEMA-free gel systems for allergy-sensitive clients
- Solar-powered facilities
- Recycling programs for nail product containers

At ConnieNail, we''re committed to staying at the forefront of these industry innovations while maintaining our focus on luxury service and customer satisfaction.', 
'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3', 'Industry Analyst', true, NOW() - INTERVAL '1 week'),

('Seasonal Nail Care: Preparing Your Nails for Summer 2024', 'seasonal-nail-care-summer-2024-preparation', 'Expert tips for maintaining healthy, beautiful nails during the summer months with proper care and trending designs.', 
'Summer 2024 brings unique challenges and opportunities for nail care. Higher temperatures, increased sun exposure, and more frequent swimming can affect nail health and polish longevity. Here''s our professional guide to summer nail care.

Nail Health Tips for Summer:
- Increased hydration: Apply cuticle oil daily to combat dryness
- Sun protection: Use UV-blocking top coats to prevent color fading
- Chlorine protection: Apply base coat before swimming
- Regular maintenance: Schedule touch-ups every 2 weeks

Trending Summer Colors and Designs:
- Butter yellow: The standout color of 2024
- Ocean blues and coral pinks
- Fruit-inspired designs (cherries, citrus)
- Minimalist line art on nude bases
- Gradient sunset effects

Summer Nail Care Services at ConnieNail:
- Hydrating paraffin treatments
- UV-protective gel applications
- Waterproof nail art options
- Quick-dry formulations for busy schedules
- Cooling peppermint foot treatments

Our summer collection features vibrant colors and durable formulations designed to withstand heat, humidity, and active lifestyles while maintaining salon-quality appearance.', 
'https://images.unsplash.com/photo-1583312522530-5b1c7ed32394?ixlib=rb-4.0.3', 'Dr. Emily Chen, Nail Health Specialist', true, NOW() - INTERVAL '5 days')
ON CONFLICT DO NOTHING;