-- MiniJob.ro Database Schema
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Custom types
CREATE TYPE user_role AS ENUM ('client', 'provider', 'admin');
CREATE TYPE business_type AS ENUM ('pfa', 'srl', 'individual');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed');
CREATE TYPE price_type AS ENUM ('fixed', 'hourly', 'custom');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'platform');

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'client',
  location_city TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- PROVIDERS (prestatori de servicii)
-- ============================================
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_type business_type DEFAULT 'individual',
  business_name TEXT,
  cui TEXT, -- CUI/CIF for PFA/SRL
  categories TEXT[] DEFAULT '{}',
  bio TEXT,
  rating DECIMAL(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  service_radius_km INTEGER DEFAULT 10,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- CATEGORIES (categorii servicii)
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Lucide icon name
  price_type price_type DEFAULT 'fixed',
  price_min INTEGER, -- in RON
  price_max INTEGER,
  duration_min INTEGER, -- in minutes
  duration_max INTEGER,
  instant_booking BOOLEAN DEFAULT TRUE,
  active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial categories
INSERT INTO categories (slug, name, description, icon, price_type, price_min, price_max, duration_min, duration_max, instant_booking, sort_order) VALUES
  ('curatenie', 'Curățenie', 'Curățenie generală, detaliată, după renovare', 'Sparkles', 'hourly', 50, 150, 120, 480, true, 1),
  ('montaj-mobila', 'Montaj Mobilă', 'Montaj mobilier IKEA, Jysk, etc.', 'Hammer', 'fixed', 100, 500, 60, 240, true, 2),
  ('reparatii', 'Reparații', 'Reparații mici în casă', 'Wrench', 'hourly', 80, 200, 30, 180, true, 3),
  ('zugravit', 'Zugrăvit', 'Zugrăvit și vopsit pereți', 'PaintBucket', 'custom', 500, 5000, 480, 2400, false, 4),
  ('instalatii', 'Instalații', 'Instalații sanitare și electrice', 'Zap', 'hourly', 100, 300, 60, 480, false, 5),
  ('gradinărit', 'Grădinărit', 'Întreținere grădină și curte', 'Leaf', 'hourly', 50, 150, 120, 480, true, 6),
  ('mutari', 'Mutări', 'Transport și mutare mobilier', 'Truck', 'custom', 200, 2000, 120, 600, false, 7);

-- ============================================
-- SERVICES (servicii oferite de prestatori)
-- ============================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price_type price_type DEFAULT 'fixed',
  price INTEGER NOT NULL, -- in RON
  duration_minutes INTEGER,
  photos TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOOKINGS (rezervări)
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  status booking_status DEFAULT 'pending',
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  address TEXT NOT NULL,
  address_details TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  price INTEGER NOT NULL,
  platform_fee INTEGER DEFAULT 0, -- 15-20% commission
  payment_method payment_method DEFAULT 'cash',
  notes TEXT,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id, reviewer_id) -- One review per booking per user
);

-- Update provider rating on new review
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
DECLARE
  provider_user_id UUID;
  new_rating DECIMAL;
  review_count INTEGER;
BEGIN
  -- Get the provider's user_id
  SELECT p.id INTO provider_user_id
  FROM providers p
  WHERE p.user_id = NEW.reviewee_id;

  -- Only update if review is for a provider
  IF provider_user_id IS NOT NULL THEN
    SELECT AVG(r.rating)::DECIMAL(2,1), COUNT(*)
    INTO new_rating, review_count
    FROM reviews r
    JOIN providers p ON p.user_id = r.reviewee_id
    WHERE p.id = provider_user_id;

    UPDATE providers
    SET rating = COALESCE(new_rating, 0),
        total_reviews = review_count,
        updated_at = NOW()
    WHERE id = provider_user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- ============================================
-- MESSAGES (chat între client și prestator)
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_providers_user ON providers(user_id);
CREATE INDEX idx_providers_categories ON providers USING GIN(categories);
CREATE INDEX idx_providers_rating ON providers(rating DESC);
CREATE INDEX idx_providers_verified ON providers(verified) WHERE verified = true;
CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX idx_reviews_booking ON reviews(booking_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_messages_booking ON messages(booking_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read any, update own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Providers: public read, owner update
CREATE POLICY "Providers are viewable by everyone" ON providers FOR SELECT USING (active = true);
CREATE POLICY "Users can create own provider profile" ON providers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own provider profile" ON providers FOR UPDATE USING (auth.uid() = user_id);

-- Categories: public read
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (active = true);

-- Services: public read active, owner manage
CREATE POLICY "Active services are viewable" ON services FOR SELECT USING (active = true);
CREATE POLICY "Providers can create services" ON services FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM providers WHERE id = provider_id)
);
CREATE POLICY "Providers can update own services" ON services FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM providers WHERE id = provider_id)
);

-- Bookings: participants only
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (
  auth.uid() = client_id OR 
  auth.uid() IN (SELECT user_id FROM providers WHERE id = provider_id)
);
CREATE POLICY "Clients can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Participants can update bookings" ON bookings FOR UPDATE USING (
  auth.uid() = client_id OR 
  auth.uid() IN (SELECT user_id FROM providers WHERE id = provider_id)
);

-- Reviews: public read, participants create
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Booking participants can create reviews" ON reviews FOR INSERT WITH CHECK (
  auth.uid() = reviewer_id AND
  auth.uid() IN (
    SELECT client_id FROM bookings WHERE id = booking_id
    UNION
    SELECT p.user_id FROM bookings b JOIN providers p ON b.provider_id = p.id WHERE b.id = booking_id
  )
);

-- Messages: booking participants only
CREATE POLICY "Booking participants can view messages" ON messages FOR SELECT USING (
  auth.uid() IN (
    SELECT client_id FROM bookings WHERE id = booking_id
    UNION
    SELECT p.user_id FROM bookings b JOIN providers p ON b.provider_id = p.id WHERE b.id = booking_id
  )
);
CREATE POLICY "Booking participants can send messages" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  auth.uid() IN (
    SELECT client_id FROM bookings WHERE id = booking_id
    UNION
    SELECT p.user_id FROM bookings b JOIN providers p ON b.provider_id = p.id WHERE b.id = booking_id
  )
);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
