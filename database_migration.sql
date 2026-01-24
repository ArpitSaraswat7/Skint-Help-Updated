-- ============================================
-- Skint Help - Database Schema Migration
-- ============================================
-- This migration adds missing columns to the profiles table
-- and creates additional tables needed by the application.
-- 
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Update profiles table with missing columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS email TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'receiver' 
  CHECK (role IN ('admin', 'restaurant', 'worker', 'receiver')),
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending' 
  CHECK (status IN ('active', 'pending', 'blocked')),
ADD COLUMN IF NOT EXISTS total_contributions INTEGER DEFAULT 0;

-- 2. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 3. Create centers table (for collection centers)
CREATE TABLE IF NOT EXISTS centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  current_inventory INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_centers_active ON centers(is_active);

-- 4. Create restaurants table (optional - can use profiles with role='restaurant')
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create food_packets table
CREATE TABLE IF NOT EXISTS food_packets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  center_id UUID REFERENCES centers(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  food_type TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'at_center', 'distributed', 'cancelled')),
  qr_code TEXT UNIQUE,
  collected_at TIMESTAMPTZ,
  distributed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_food_packets_restaurant ON food_packets(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_food_packets_center ON food_packets(center_id);
CREATE INDEX IF NOT EXISTS idx_food_packets_status ON food_packets(status);
CREATE INDEX IF NOT EXISTS idx_food_packets_qr ON food_packets(qr_code);

-- 6. Create distributions table
CREATE TABLE IF NOT EXISTS distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  packet_id UUID REFERENCES food_packets(id) ON DELETE CASCADE,
  center_id UUID REFERENCES centers(id) ON DELETE SET NULL,
  quantity_distributed INTEGER NOT NULL,
  distributed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_distributions_worker ON distributions(worker_id);
CREATE INDEX IF NOT EXISTS idx_distributions_packet ON distributions(packet_id);
CREATE INDEX IF NOT EXISTS idx_distributions_center ON distributions(center_id);

-- 7. Add profile reference columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS restaurant_id UUID REFERENCES restaurants(id),
ADD COLUMN IF NOT EXISTS center_id UUID REFERENCES centers(id);

-- 8. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Add triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_centers_updated_at ON centers;
CREATE TRIGGER update_centers_updated_at
  BEFORE UPDATE ON centers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_restaurants_updated_at ON restaurants;
CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_food_packets_updated_at ON food_packets;
CREATE TRIGGER update_food_packets_updated_at
  BEFORE UPDATE ON food_packets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 10. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_packets ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS Policies (Basic - adjust based on your needs)

-- Profiles: Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Profiles: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Centers: Everyone can view active centers
CREATE POLICY "Anyone can view active centers" ON centers
  FOR SELECT USING (is_active = true);

-- Food packets: Restaurants can manage their own packets
CREATE POLICY "Restaurants can manage own packets" ON food_packets
  FOR ALL USING (restaurant_id = auth.uid());

-- Food packets: Workers can view packets at their center
CREATE POLICY "Workers can view center packets" ON food_packets
  FOR SELECT USING (
    center_id IN (
      SELECT center_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Distributions: Workers can create distributions
CREATE POLICY "Workers can create distributions" ON distributions
  FOR INSERT WITH CHECK (worker_id = auth.uid());

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check profiles table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Count records in each table
SELECT 
  'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'centers', COUNT(*) FROM centers
UNION ALL
SELECT 'restaurants', COUNT(*) FROM restaurants
UNION ALL
SELECT 'food_packets', COUNT(*) FROM food_packets
UNION ALL
SELECT 'distributions', COUNT(*) FROM distributions;
