-- =============================================================================
-- FIX: Disable RLS on User table for custom authentication
-- =============================================================================
-- The app uses custom JWT auth, not Supabase Auth, so RLS blocks all queries
-- =============================================================================

-- Disable RLS on User table to allow custom authentication
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;

-- Drop existing policies (they won't work with custom auth anyway)
DROP POLICY IF EXISTS "Users can view own profile" ON "User";
DROP POLICY IF EXISTS "Users can update own profile" ON "User";
DROP POLICY IF EXISTS "Public profiles visible" ON "User";

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'User';

-- Test: This should now return users
SELECT email, role, "isActive" FROM "User" LIMIT 3;
