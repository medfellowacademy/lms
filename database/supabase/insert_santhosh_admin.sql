-- =============================================================================
-- Create Admin User: Santhosh
-- =============================================================================
-- Username: santhosh
-- Email: santhosh@medfellow.in
-- Password: Santhu@123
-- =============================================================================

-- Delete existing user if exists
DELETE FROM "User" WHERE email = 'santhosh@medfellow.in' OR username = 'santhosh';

-- Insert admin user with hashed password
INSERT INTO "User" (
  username,
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
  'santhosh',
  'santhosh@medfellow.in',
  'ee038ce23d0f055372d3bf259588413c:5ef830a75029f1c6668b5f32c2a0365d7979be1d532a66b0468f6c9747ba00a26ee7024d8ec8c930467564545237de82e389a44bf3be4a40ca2810612a532819',
  'Santhosh',
  'Reddy',
  'ADMIN',
  true,
  true,
  1,
  0,
  'Administrator',
  0
);

-- Verify the admin user was created successfully
SELECT username, email, "firstName", "lastName", role, "isVerified", "isActive" 
FROM "User" 
WHERE username = 'santhosh';
