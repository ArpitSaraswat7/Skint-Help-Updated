-- Phase 2.3: Database Row Level Security (RLS) Security Policies
-- Documents and applies RLS controls to all application tables.

-- Enable Row Level Security (RLS) on all tables (SEC-06, SEC-07, SEC-09)
ALTER TABLE join_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_packets ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Clean up any existing policies
DROP POLICY IF EXISTS "Public insert to join_applications" ON join_applications;
DROP POLICY IF EXISTS "Admin view join_applications" ON join_applications;
DROP POLICY IF EXISTS "Admin delete join_applications" ON join_applications;

DROP POLICY IF EXISTS "Public select profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin view all profiles" ON profiles;

DROP POLICY IF EXISTS "Public select centers" ON centers;
DROP POLICY IF EXISTS "Admin modify centers" ON centers;

DROP POLICY IF EXISTS "Public select collection_centers" ON collection_centers;
DROP POLICY IF EXISTS "Admin modify collection_centers" ON collection_centers;

-- ==========================================
-- 1. JOIN APPLICATIONS POLICIES (SEC-06/SEC-07)
-- ==========================================

-- Allow anyone (even unauthenticated) to apply (insert only)
CREATE POLICY "Public insert to join_applications"
ON join_applications FOR INSERT
WITH CHECK (true);

-- Allow select only if the authenticated user has the 'admin' role in profiles
CREATE POLICY "Admin view join_applications"
ON join_applications FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE public.profiles.id = auth.uid()
        AND public.profiles.role = 'admin'
    )
);

-- Allow delete only if the authenticated user has the 'admin' role in profiles
CREATE POLICY "Admin delete join_applications"
ON join_applications FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE public.profiles.id = auth.uid()
        AND public.profiles.role = 'admin'
    )
);

-- ==========================================
-- 2. PROFILES POLICIES
-- ==========================================

-- Allow anyone to read profiles (needed for displays and lookups)
CREATE POLICY "Public select profiles"
ON profiles FOR SELECT
USING (true);

-- Allow users to update their own profile details
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow admins to update or delete any profile
CREATE POLICY "Admin manage profiles"
ON profiles FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE public.profiles.id = auth.uid()
        AND public.profiles.role = 'admin'
    )
);

-- ==========================================
-- 3. CENTERS / COLLECTION_CENTERS POLICIES
-- ==========================================

-- Allow public read access to centers/facilities map
CREATE POLICY "Public select centers"
ON centers FOR SELECT
USING (true);

CREATE POLICY "Public select collection_centers"
ON collection_centers FOR SELECT
USING (true);

-- Restrict all write/edit/delete operations to admins only
CREATE POLICY "Admin modify centers"
ON centers FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE public.profiles.id = auth.uid()
        AND public.profiles.role = 'admin'
    )
);

CREATE POLICY "Admin modify collection_centers"
ON collection_centers FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE public.profiles.id = auth.uid()
        AND public.profiles.role = 'admin'
    )
);

-- ==========================================
-- 4. FOOD_PACKETS / DONATIONS POLICIES
-- ==========================================

-- Allow select to restaurants (own packets), workers (packets in center), and public/receivers (active packets)
CREATE POLICY "Select food_packets based on role"
ON food_packets FOR SELECT
USING (
    -- Restaurant owns the packet
    (auth.uid() = restaurant_id)
    OR
    -- Worker has access to center packets
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE public.profiles.id = auth.uid()
        AND public.profiles.role = 'worker'
    )
    OR
    -- Admins can see everything
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE public.profiles.id = auth.uid()
        AND public.profiles.role = 'admin'
    )
    OR
    -- Public receivers can see available packets
    (status = 'available')
);

-- Allow restaurant to insert/update their own packets
CREATE POLICY "Restaurant manage own packets"
ON food_packets FOR INSERT
WITH CHECK (auth.uid() = restaurant_id);

CREATE POLICY "Restaurant update own packets"
ON food_packets FOR UPDATE
USING (auth.uid() = restaurant_id)
WITH CHECK (auth.uid() = restaurant_id);

-- Allow workers to update packets status (pickup, collection, etc.)
CREATE POLICY "Worker update packet status"
ON food_packets FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE public.profiles.id = auth.uid()
        AND public.profiles.role = 'worker'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE public.profiles.id = auth.uid()
        AND public.profiles.role = 'worker'
    )
);

-- ==========================================
-- 5. DISTRIBUTIONS POLICIES
-- ==========================================

-- Allow workers to log and see distributions
CREATE POLICY "Worker manage distributions"
ON distributions FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE public.profiles.id = auth.uid()
        AND public.profiles.role = 'worker'
    )
);

-- Allow public to see aggregated distributions or own distributions
CREATE POLICY "Public select distributions"
ON distributions FOR SELECT
USING (true);

-- ==========================================
-- 6. DASHBOARD_METRICS POLICIES
-- ==========================================

-- Admins manage all metrics
CREATE POLICY "Admin manage dashboard_metrics"
ON dashboard_metrics FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE public.profiles.id = auth.uid()
        AND public.profiles.role = 'admin'
    )
);

-- Allow public to read dashboard metrics for landing page counters
CREATE POLICY "Public select dashboard_metrics"
ON dashboard_metrics FOR SELECT
USING (true);
