# Database Migration: Lesson Locking & Presentation Support

## Overview
This migration adds:
- **Lesson locking** - Control student access to individual lessons
- **Module locking** - Lock entire modules (locks all lessons within)
- **Presentation support** - Upload PPT/PDF for lessons
- **Audit logging** - Track lock/unlock actions

## How to Run This Migration

### Option 1: Supabase SQL Editor (Recommended)

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Click **SQL Editor** in the left sidebar
3. Create a new query
4. Open `database/supabase/005_add_lesson_locks_and_presentations.sql`
5. Copy and paste the entire contents into the SQL Editor
6. Click **Run** or press `Ctrl+Enter`
7. Wait for "Success. No rows returned" message

### Option 2: Using psql Command Line

```powershell
$env:PGPASSWORD="Medfellow@321"
psql -h aws-0-us-east-1.pooler.supabase.com -p 5432 -U postgres.kwsykhgphxkyjkfjbmfk -d postgres -f database/supabase/005_add_lesson_locks_and_presentations.sql
```

## What Gets Added

### To `Lesson` Table
- `isLocked` (BOOLEAN) - Controls if students can access the lesson
- `presentationUrl` (TEXT) - URL to PowerPoint/PDF presentation
- `isPublished` (BOOLEAN) - Controls visibility to enrolled students
- Index on `isLocked` for faster queries

### To `Module` Table
- `isLocked` (BOOLEAN) - When true, all lessons in module are locked
- Index on `isLocked` for faster queries

### New Table: `LessonLockHistory`
Audit trail for lock/unlock actions:
- `id` - Unique identifier
- `lessonId` - Which lesson was affected
- `userId` - Who performed the action
- `action` - 'LOCKED' or 'UNLOCKED'
- `reason` - Optional explanation
- `createdAt` - Timestamp

## Admin Features Now Available

After running this migration, admins can:

1. **Lock/Unlock Individual Lessons**
   - Click lock/unlock icon next to any lesson
   - Locked lessons show red lock badge
   - API: `PATCH /api/admin/lessons/{lessonId}/lock`

2. **Lock/Unlock Entire Modules**
   - Click lock/unlock icon on module header
   - Locks all lessons within the module
   - API: `PATCH /api/admin/modules/{moduleId}/lock`

3. **Add Presentations to Lessons**
   - Upload PPT/PDF when creating/editing lessons
   - Blue presentation badge shows on lessons with files
   - Students can view presentations alongside video content

4. **View Lock History**
   - See who locked/unlocked lessons and when
   - API: `GET /api/admin/lessons/{lessonId}/lock`

## Student Experience

- **Locked lessons** show lock icon and "Content Locked" message
- **Locked modules** hide all lessons from students
- **Only enrolled courses** appear in student dashboard
- **Presentations** display in lesson viewer

## Verification

After migration, verify in Supabase:

```sql
-- Check new columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Lesson' 
AND column_name IN ('isLocked', 'presentationUrl', 'isPublished');

-- Check lesson lock counts
SELECT 
  COUNT(*) as total_lessons,
  SUM(CASE WHEN "isLocked" = true THEN 1 ELSE 0 END) as locked_lessons
FROM "Lesson";
```

## Rollback (if needed)

If you need to undo this migration:

```sql
-- Remove new columns
ALTER TABLE "Lesson" DROP COLUMN IF EXISTS "isLocked";
ALTER TABLE "Lesson" DROP COLUMN IF EXISTS "presentationUrl";
ALTER TABLE "Lesson" DROP COLUMN IF EXISTS "isPublished";
ALTER TABLE "Module" DROP COLUMN IF EXISTS "isLocked";

-- Drop audit table
DROP TABLE IF EXISTS "LessonLockHistory";

-- Drop indexes
DROP INDEX IF EXISTS "Lesson_isLocked_idx";
DROP INDEX IF EXISTS "Module_isLocked_idx";
DROP INDEX IF EXISTS "LessonLockHistory_lessonId_idx";
DROP INDEX IF EXISTS "LessonLockHistory_userId_idx";
```

## Troubleshooting

### "Column already exists"
- Safe to ignore - migration uses `IF NOT EXISTS`
- Columns won't be re-created if they exist

### "Permission denied"
- Use the service role key from your Supabase project
- Or use postgres superuser credentials

### "Relation does not exist"
- Ensure previous migrations (001-004) have been run
- Check that `Lesson` and `Module` tables exist

## Next Steps

1. Run the migration ✓
2. Restart your development server
3. Go to Admin → Courses → Edit a course
4. Test lock/unlock functionality
5. Add presentation URLs to lessons
6. Verify students see locked content correctly
