-- =============================================================================
-- Migration: Add Lesson Locking and Presentation Support
-- Description: Adds isLocked field to lessons and presentation support
-- Date: 2026-04-09
-- =============================================================================

-- Add isLocked column to Lesson table
ALTER TABLE "Lesson" 
ADD COLUMN IF NOT EXISTS "isLocked" BOOLEAN NOT NULL DEFAULT false;

-- Add presentationUrl column for PowerPoint/PDF presentations
ALTER TABLE "Lesson" 
ADD COLUMN IF NOT EXISTS "presentationUrl" TEXT;

-- Add isPublished column to control visibility
ALTER TABLE "Lesson" 
ADD COLUMN IF NOT EXISTS "isPublished" BOOLEAN NOT NULL DEFAULT true;

-- Add index for faster queries on locked lessons
CREATE INDEX IF NOT EXISTS "Lesson_isLocked_idx" ON "Lesson"("isLocked");

-- Update Resource type enum to include PRESENTATION
-- First check if the type exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ResourceType') THEN
        CREATE TYPE "ResourceType" AS ENUM ('PDF', 'DOCUMENT', 'LINK', 'IMAGE', 'VIDEO', 'PRESENTATION');
    ELSE
        -- Add PRESENTATION if it doesn't exist
        BEGIN
            ALTER TYPE "ResourceType" ADD VALUE IF NOT EXISTS 'PRESENTATION';
        EXCEPTION WHEN duplicate_object THEN null;
        END;
    END IF;
END$$;

-- Add comments for documentation
COMMENT ON COLUMN "Lesson"."isLocked" IS 'Controls whether students can access this lesson. Admin can lock/unlock from dashboard.';
COMMENT ON COLUMN "Lesson"."presentationUrl" IS 'URL to PowerPoint/PDF presentation file for this lesson';
COMMENT ON COLUMN "Lesson"."isPublished" IS 'Controls whether lesson is visible to enrolled students';

-- Create audit log for lock/unlock actions (optional but recommended)
CREATE TABLE IF NOT EXISTS "LessonLockHistory" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "lessonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL, -- 'LOCKED' or 'UNLOCKED'
    "reason" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT "LessonLockHistory_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "LessonLockHistory_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE,
    CONSTRAINT "LessonLockHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "LessonLockHistory_lessonId_idx" ON "LessonLockHistory"("lessonId");
CREATE INDEX IF NOT EXISTS "LessonLockHistory_userId_idx" ON "LessonLockHistory"("userId");

-- Update Module table to add isLocked at module level (optional)
ALTER TABLE "Module" 
ADD COLUMN IF NOT EXISTS "isLocked" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS "Module_isLocked_idx" ON "Module"("isLocked");

COMMENT ON COLUMN "Module"."isLocked" IS 'When true, all lessons in this module are locked regardless of individual lesson lock status';

-- Display current state
SELECT 
    'Migration completed successfully!' as message,
    COUNT(*) as total_lessons,
    SUM(CASE WHEN "isLocked" = true THEN 1 ELSE 0 END) as locked_lessons,
    SUM(CASE WHEN "isLocked" = false THEN 1 ELSE 0 END) as unlocked_lessons
FROM "Lesson";
