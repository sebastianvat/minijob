-- MiniJob.ro - Projects & Skills Migration
-- Run this in Supabase SQL Editor AFTER initial schema

-- ============================================
-- CUSTOM TYPES FOR PROJECTS
-- ============================================
CREATE TYPE project_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');
CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE urgency_level AS ENUM ('urgent', 'normal', 'flexible');
CREATE TYPE skill_level AS ENUM ('new', 'experienced', 'expert', 'master', 'top_pro');

-- ============================================
-- UPDATE CATEGORIES - New Skill Zones
-- ============================================
-- First, delete old categories
DELETE FROM categories;

-- Insert new Skill Zones
INSERT INTO categories (slug, name, description, icon, price_type, price_min, price_max, sort_order) VALUES
  ('casa', 'Casă', 'Curățenie, gătit, organizare, menaj', 'Home', 'hourly', 40, 100, 1),
  ('constructii', 'Construcții', 'Zugrăvit, parchet, renovări, reparații', 'Hammer', 'custom', 100, 10000, 2),
  ('auto', 'Auto', 'Detailing, polish, mecanică ușoară, transport', 'Car', 'fixed', 100, 1000, 3),
  ('tech', 'Tech Jobs', 'Social media, răspuns mesaje, data entry, tech support', 'Laptop', 'hourly', 50, 200, 4),
  ('pets', 'Pet Care', 'Plimbat câini, pet sitting, îngrijire animale', 'PawPrint', 'hourly', 30, 80, 5),
  ('kids', 'Kids & Learning', 'Bonă, meditații, învățare skill-uri noi', 'Baby', 'hourly', 50, 150, 6);

-- ============================================
-- SKILLS (sub-categorii/skill-uri specifice)
-- ============================================
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  price_unit TEXT DEFAULT 'ora',  -- ora, mp, bucată, proiect
  price_min INTEGER,
  price_max INTEGER,
  active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed skills per category
INSERT INTO skills (category_id, slug, name, description, icon, price_unit, price_min, price_max, sort_order)
SELECT c.id, s.slug, s.name, s.description, s.icon, s.price_unit, s.price_min, s.price_max, s.sort_order
FROM categories c
CROSS JOIN (VALUES
  -- CASĂ
  ('casa', 'curatenie-generala', 'Curățenie Generală', 'Curățenie standard apartament/casă', 'Sparkles', 'ora', 40, 80, 1),
  ('casa', 'curatenie-dupa-constructor', 'Curățenie după Constructor', 'Curățenie intensivă post-renovare', 'Sparkles', 'ora', 80, 120, 2),
  ('casa', 'curatenie-birouri', 'Curățenie Birouri', 'Curățenie spații comerciale', 'Building', 'ora', 50, 100, 3),
  ('casa', 'gatit', 'Gătit', 'Preparare mese, meal prep', 'ChefHat', 'ora', 60, 120, 4),
  ('casa', 'organizare-casa', 'Organizare Casă', 'Declutter, organizare dulapuri', 'FolderOpen', 'ora', 50, 100, 5),
  ('casa', 'calcat-rufe', 'Călcat Rufe', 'Călcat și aranjat haine', 'Shirt', 'ora', 40, 60, 6),
  -- CONSTRUCȚII
  ('constructii', 'zugravit', 'Zugrăvit', 'Zugrăvit interior/exterior', 'PaintBucket', 'mp', 15, 40, 1),
  ('constructii', 'parchet', 'Montaj Parchet', 'Instalare parchet laminat/lemn', 'Layers', 'mp', 25, 60, 2),
  ('constructii', 'gresie-faianta', 'Gresie & Faianță', 'Montaj plăci ceramice', 'Grid3x3', 'mp', 40, 100, 3),
  ('constructii', 'instalatii-sanitare', 'Instalații Sanitare', 'Montaj/reparații țevi, robineți', 'Droplet', 'ora', 80, 150, 4),
  ('constructii', 'instalatii-electrice', 'Instalații Electrice', 'Montaj/reparații electrice', 'Zap', 'ora', 80, 150, 5),
  ('constructii', 'montaj-mobila', 'Montaj Mobilă', 'Asamblare mobilier', 'Package', 'ora', 60, 120, 6),
  ('constructii', 'tamplarie', 'Tâmplărie', 'Lucrări lemn, uși, ferestre', 'Hammer', 'ora', 70, 140, 7),
  ('constructii', 'rigips', 'Rigips', 'Montaj tavane/pereți gips-carton', 'Square', 'mp', 30, 80, 8),
  -- AUTO
  ('auto', 'detailing', 'Detailing Auto', 'Curățare profesională interior/exterior', 'CarFront', 'bucata', 150, 500, 1),
  ('auto', 'polish', 'Polish Auto', 'Polish și ceruire caroserie', 'Sparkle', 'bucata', 200, 600, 2),
  ('auto', 'spalatorie-mobila', 'Spălătorie Mobilă', 'Spălare auto la domiciliu', 'Droplets', 'bucata', 50, 150, 3),
  ('auto', 'mecanica-usoara', 'Mecanică Ușoară', 'Schimb ulei, filtre, becuri', 'Wrench', 'ora', 60, 120, 4),
  ('auto', 'transport-persoane', 'Transport Persoane', 'Șofer personal, transport', 'Car', 'ora', 50, 100, 5),
  -- TECH
  ('tech', 'social-media', 'Social Media', 'Gestionare conturi, postări, răspuns mesaje', 'MessageCircle', 'ora', 50, 150, 1),
  ('tech', 'data-entry', 'Data Entry', 'Introducere date, transcriere', 'FileText', 'ora', 40, 80, 2),
  ('tech', 'tech-support', 'Tech Support', 'Ajutor tehnic PC, telefon, smart home', 'Monitor', 'ora', 60, 120, 3),
  ('tech', 'web-research', 'Web Research', 'Căutare informații, research', 'Search', 'ora', 50, 100, 4),
  ('tech', 'virtual-assistant', 'Asistent Virtual', 'Task-uri administrative diverse', 'UserCircle', 'ora', 60, 150, 5),
  -- PETS
  ('pets', 'plimbat-caini', 'Plimbat Câini', 'Plimbări zilnice sau ocazionale', 'Dog', 'ora', 30, 60, 1),
  ('pets', 'pet-sitting', 'Pet Sitting', 'Îngrijire animale la domiciliu', 'Home', 'zi', 80, 200, 2),
  ('pets', 'pet-transport', 'Transport Animale', 'Transport la veterinar/salon', 'Car', 'cursa', 50, 150, 3),
  ('pets', 'toaletaj', 'Toaletaj', 'Băi, tuns, îngrijire blană', 'Scissors', 'bucata', 50, 200, 4),
  -- KIDS
  ('kids', 'bona', 'Bonă', 'Supraveghere copii', 'Baby', 'ora', 40, 80, 1),
  ('kids', 'meditatii-matematica', 'Meditații Matematică', 'Pregătire matematică orice nivel', 'Calculator', 'ora', 60, 150, 2),
  ('kids', 'meditatii-engleza', 'Meditații Engleză', 'Pregătire limba engleză', 'Languages', 'ora', 60, 150, 3),
  ('kids', 'meditatii-romana', 'Meditații Română', 'Pregătire limba română', 'BookOpen', 'ora', 50, 120, 4),
  ('kids', 'lectii-muzica', 'Lecții Muzică', 'Chitară, pian, alte instrumente', 'Music', 'ora', 70, 150, 5),
  ('kids', 'lectii-desen', 'Lecții Desen', 'Arte plastice, pictură', 'Palette', 'ora', 50, 100, 6),
  ('kids', 'after-school', 'After School', 'Supraveghere și ajutor teme', 'Backpack', 'ora', 40, 80, 7)
) AS s(cat_slug, slug, name, description, icon, price_unit, price_min, price_max, sort_order)
WHERE c.slug = s.cat_slug;

-- ============================================
-- PROVIDER_SKILLS (skill-uri per provider)
-- ============================================
CREATE TABLE provider_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  
  -- Pricing per skill
  price INTEGER NOT NULL,
  price_type price_type DEFAULT 'hourly',
  
  -- Stats per skill (updated by triggers)
  jobs_completed INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0,
  
  -- Calculated level
  level skill_level DEFAULT 'new',
  skill_score INTEGER DEFAULT 0 CHECK (skill_score >= 0 AND skill_score <= 100),
  
  -- Availability
  available BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(provider_id, skill_id)
);

-- ============================================
-- SKILL_PORTFOLIO (poze per skill)
-- ============================================
CREATE TABLE skill_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_skill_id UUID NOT NULL REFERENCES provider_skills(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  project_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROJECTS (proiecte postate de clienți)
-- ============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  
  budget_min INTEGER,
  budget_max INTEGER,
  
  location_city TEXT NOT NULL,
  location_address TEXT,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  
  deadline DATE,
  urgency urgency_level DEFAULT 'normal',
  
  status project_status DEFAULT 'open',
  offers_count INTEGER DEFAULT 0,
  
  accepted_offer_id UUID,  -- Will reference project_offers after creation
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROJECT_OFFERS (oferte de la specialiști)
-- ============================================
CREATE TABLE project_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  provider_skill_id UUID REFERENCES provider_skills(id) ON DELETE SET NULL,
  
  price INTEGER NOT NULL,
  message TEXT,
  estimated_duration TEXT,  -- "2-3 zile", "4 ore"
  available_from DATE,
  includes_materials BOOLEAN DEFAULT FALSE,
  
  status offer_status DEFAULT 'pending',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(project_id, provider_id)  -- One offer per provider per project
);

-- Add foreign key for accepted_offer_id
ALTER TABLE projects 
  ADD CONSTRAINT fk_accepted_offer 
  FOREIGN KEY (accepted_offer_id) 
  REFERENCES project_offers(id) 
  ON DELETE SET NULL;

-- ============================================
-- SKILL_REVIEWS (recenzii per skill executat)
-- ============================================
CREATE TABLE skill_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  provider_skill_id UUID NOT NULL REFERENCES provider_skills(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  photos TEXT[] DEFAULT '{}',
  
  would_recommend BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Either booking_id or project_id must be set
  CONSTRAINT must_have_reference CHECK (booking_id IS NOT NULL OR project_id IS NOT NULL)
);

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Update offers_count on project when offer is added
CREATE OR REPLACE FUNCTION update_project_offers_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects SET offers_count = offers_count + 1 WHERE id = NEW.project_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects SET offers_count = offers_count - 1 WHERE id = OLD.project_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_offer_change
  AFTER INSERT OR DELETE ON project_offers
  FOR EACH ROW EXECUTE FUNCTION update_project_offers_count();

-- Update provider_skills stats when skill_review is added
CREATE OR REPLACE FUNCTION update_provider_skill_stats()
RETURNS TRIGGER AS $$
DECLARE
  new_rating DECIMAL;
  review_count INTEGER;
  jobs_count INTEGER;
  new_level skill_level;
  new_score INTEGER;
BEGIN
  -- Calculate new stats
  SELECT 
    AVG(rating)::DECIMAL(2,1), 
    COUNT(*)
  INTO new_rating, review_count
  FROM skill_reviews
  WHERE provider_skill_id = NEW.provider_skill_id;
  
  -- Get jobs count (completed bookings + completed projects)
  SELECT COALESCE(ps.jobs_completed, 0) INTO jobs_count
  FROM provider_skills ps
  WHERE ps.id = NEW.provider_skill_id;
  
  -- Increment jobs_completed
  jobs_count := jobs_count + 1;
  
  -- Calculate level based on jobs and rating
  IF jobs_count >= 150 AND new_rating >= 4.9 THEN
    new_level := 'top_pro';
  ELSIF jobs_count >= 76 AND new_rating >= 4.8 THEN
    new_level := 'master';
  ELSIF jobs_count >= 26 AND new_rating >= 4.7 THEN
    new_level := 'expert';
  ELSIF jobs_count >= 6 AND new_rating >= 4.5 THEN
    new_level := 'experienced';
  ELSE
    new_level := 'new';
  END IF;
  
  -- Calculate skill_score (0-100)
  new_score := LEAST(100, (
    (COALESCE(new_rating, 0) / 5.0 * 30) +  -- 30% rating
    (LEAST(jobs_count, 100) / 100.0 * 25) +  -- 25% jobs (max 100)
    (LEAST(review_count, 50) / 50.0 * 20) +  -- 20% reviews with text (max 50)
    15 + 10  -- placeholder for portfolio and response time
  ))::INTEGER;
  
  -- Update provider_skills
  UPDATE provider_skills SET
    jobs_completed = jobs_count,
    rating = COALESCE(new_rating, 0),
    reviews_count = review_count,
    level = new_level,
    skill_score = new_score,
    updated_at = NOW()
  WHERE id = NEW.provider_skill_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_skill_review_created
  AFTER INSERT ON skill_reviews
  FOR EACH ROW EXECUTE FUNCTION update_provider_skill_stats();

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_skills_category ON skills(category_id);
CREATE INDEX idx_skills_slug ON skills(slug);
CREATE INDEX idx_provider_skills_provider ON provider_skills(provider_id);
CREATE INDEX idx_provider_skills_skill ON provider_skills(skill_id);
CREATE INDEX idx_provider_skills_level ON provider_skills(level);
CREATE INDEX idx_provider_skills_score ON provider_skills(skill_score DESC);
CREATE INDEX idx_skill_portfolio_provider_skill ON skill_portfolio(provider_skill_id);
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_category ON projects(category_id);
CREATE INDEX idx_projects_skill ON projects(skill_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_city ON projects(location_city);
CREATE INDEX idx_project_offers_project ON project_offers(project_id);
CREATE INDEX idx_project_offers_provider ON project_offers(provider_id);
CREATE INDEX idx_project_offers_status ON project_offers(status);
CREATE INDEX idx_skill_reviews_provider_skill ON skill_reviews(provider_skill_id);
CREATE INDEX idx_skill_reviews_client ON skill_reviews(client_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_reviews ENABLE ROW LEVEL SECURITY;

-- Skills: public read
CREATE POLICY "Skills are viewable by everyone" ON skills FOR SELECT USING (active = true);

-- Provider Skills: public read, owner manage
CREATE POLICY "Provider skills are viewable by everyone" ON provider_skills FOR SELECT USING (available = true);
CREATE POLICY "Providers can manage own skills" ON provider_skills FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM providers WHERE id = provider_id)
);

-- Skill Portfolio: public read, owner manage  
CREATE POLICY "Portfolios are viewable by everyone" ON skill_portfolio FOR SELECT USING (true);
CREATE POLICY "Providers can manage own portfolio" ON skill_portfolio FOR ALL USING (
  auth.uid() IN (
    SELECT p.user_id FROM providers p 
    JOIN provider_skills ps ON ps.provider_id = p.id 
    WHERE ps.id = provider_skill_id
  )
);

-- Projects: public read open, owner manage
CREATE POLICY "Open projects are viewable by everyone" ON projects FOR SELECT USING (status = 'open' OR auth.uid() = client_id);
CREATE POLICY "Clients can create projects" ON projects FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients can update own projects" ON projects FOR UPDATE USING (auth.uid() = client_id);

-- Project Offers: project owner and offer owner can view
CREATE POLICY "Offers viewable by project owner and offer owner" ON project_offers FOR SELECT USING (
  auth.uid() IN (SELECT client_id FROM projects WHERE id = project_id)
  OR auth.uid() IN (SELECT user_id FROM providers WHERE id = provider_id)
);
CREATE POLICY "Providers can create offers" ON project_offers FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM providers WHERE id = provider_id)
);
CREATE POLICY "Offer owners can update own offers" ON project_offers FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM providers WHERE id = provider_id)
);

-- Skill Reviews: public read, verified clients create
CREATE POLICY "Skill reviews are viewable by everyone" ON skill_reviews FOR SELECT USING (true);
CREATE POLICY "Clients can create skill reviews" ON skill_reviews FOR INSERT WITH CHECK (auth.uid() = client_id);

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE TRIGGER update_provider_skills_updated_at BEFORE UPDATE ON provider_skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_offers_updated_at BEFORE UPDATE ON project_offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
