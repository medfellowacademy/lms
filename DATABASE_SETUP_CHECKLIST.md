# DATABASE SETUP CHECKLIST
# Follow these steps to initialize your database

## Step 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard
2. Select your project: kwsykhgphxkyjkfjbmfk  
3. Click: SQL Editor (left sidebar)
4. Click: New query

## Step 2: Run SQL Scripts (copy file contents, paste, click RUN)

### ✅ Script 1: Create Tables
File: database/supabase/001_setup_complete.sql
Purpose: Creates User, Course, Module, Lesson tables

### ✅ Script 2: Add Username  
File: database/supabase/004_add_username_field.sql
Purpose: Adds username field for login

### ✅ Script 3: Add Locking Features
File: database/supabase/005_add_lesson_locks_and_presentations.sql
Purpose: Adds lesson locks and presentation upload

### ✅ Script 4: Create Admin User
File: database/supabase/insert_admin.sql
Purpose: Creates admin account

## Step 3: Test Login
URL: http://localhost:3000/login
Username: admin
Password: admin123

## Step 4: After Login Success
- Go to /admin to access admin panel
- Create your first course
- Upload videos and presentations
- Lock/unlock lessons as needed

## Troubleshooting
If login still fails after running scripts:
1. Check browser console for errors
2. Check Network tab for 500 error response
3. Verify all 4 SQL scripts ran successfully
4. Check Supabase logs: Dashboard > Logs > Postgres Logs
