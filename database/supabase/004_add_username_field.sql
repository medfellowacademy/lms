-- =============================================================================
-- Migration: Add username field to User table
-- =============================================================================
-- This migration adds a username column to support simple username/password auth
-- Date: 2026-04-07
-- =============================================================================

-- Add username column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'User' AND column_name = 'username'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "username" TEXT;
    END IF;
END $$;

-- Update existing users to have usernames based on their email
UPDATE "User" 
SET "username" = LOWER(SPLIT_PART(email, '@', 1))
WHERE "username" IS NULL;

-- Make username NOT NULL after all records are updated
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;

-- Create unique index on username if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'User_username_key'
    ) THEN
        CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
    END IF;
END $$;

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name = 'User' AND column_name = 'username';

-- Show sample data
SELECT 
    username, 
    email, 
    "firstName", 
    "lastName", 
    role 
FROM "User" 
LIMIT 5;

-- Migration completed successfully!
