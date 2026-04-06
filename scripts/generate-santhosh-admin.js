const crypto = require('crypto');

// Generate password hash for new admin user
const password = 'Santhu@123';
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
const passwordHash = `${salt}:${hash}`;

console.log('='.repeat(70));
console.log('NEW ADMIN USER - SANTHOSH');
console.log('='.repeat(70));
console.log('Email: santhosh@medfellow.in');
console.log('Password:', password);
console.log('Hash:', passwordHash);
console.log('='.repeat(70));
console.log('\nCopy the SQL below and run in Supabase SQL Editor:\n');
console.log(`-- Delete existing admin if exists
DELETE FROM "User" WHERE email = 'santhosh@medfellow.in';

-- Insert new admin user
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
  'santhosh@medfellow.in',
  '${passwordHash}',
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

-- Verify
SELECT email, "firstName", "lastName", role FROM "User" WHERE email = 'santhosh@medfellow.in';`);
