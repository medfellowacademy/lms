const crypto = require('crypto');

// Generate password hash for admin user
const password = 'MedFellow@Admin2026';
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
const passwordHash = `${salt}:${hash}`;

console.log('='.repeat(70));
console.log('ADMIN USER PASSWORD HASH');
console.log('='.repeat(70));
console.log('Password:', password);
console.log('Hash:', passwordHash);
console.log('='.repeat(70));
console.log('\nCopy the SQL below and run in Supabase SQL Editor:\n');
console.log(`-- Delete existing admin if exists
DELETE FROM "User" WHERE email = 'admin@medfellow.academy';

-- Insert admin user
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
  '${passwordHash}',
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

-- Verify
SELECT email, role FROM "User" WHERE email = 'admin@medfellow.academy';`);
