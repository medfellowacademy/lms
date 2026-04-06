-- =============================================================================
-- Insert Admin User Manually
-- =============================================================================
-- Run this in Supabase SQL Editor to create the admin account
-- Email: admin@medfellow.academy
-- Password: MedFellow@Admin2026
-- =============================================================================

-- Delete existing admin if exists (in case of duplicates)
DELETE FROM "User" WHERE email = 'admin@medfellow.academy';

-- Insert admin user with hashed password
INSERT INTO "User" (
  email,
  "passwordHash",
  "firstName",
  "lastName",
  role,
  "isVerified",
  "isActive",
  level,
  xp,
  rank,
  streak
) VALUES (
  'admin@medfellow.academy',
  '37621ab67d99e7beaf838637ebad01eb:0ed38ddd2fc9f6f6f3ede293f8d9cf586ff45ee483c612d45a087c7727c7c9b5d43f09526cc58936ad66df1b194fa75f84888285774de1256d23b47f2fc673ed',
  'Platform',
  'Administrator',
  'ADMIN',
  true,
  true,
  1,
  0,
  'Administrator',
  0
);

-- Verify the admin user was created successfully
SELECT email, "firstName", "lastName", role, "isVerified", "isActive" 
FROM "User" 
WHERE email = 'admin@medfellow.academy';
