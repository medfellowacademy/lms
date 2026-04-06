# 🚨 URGENT: Database Setup Required

Your deployment is failing because **the database tables have not been created yet**.

## ✅ Step 1: Set Environment Variables in Vercel

Go to: https://vercel.com/medfellowacademy/lms/settings/environment-variables

Add these variables (copy from `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=https://kwsykhgphxkyjkfjbmfk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3c3lraGdwaHhreWprZmpibWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NTA0NjgsImV4cCI6MjA5MTAyNjQ2OH0.C4IZHWu2_FAk6nU8RsjRAl6r8F7uLdQkNLZBAnwHv0Y
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3c3lraGdwaHhreWprZmpibWZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MDQ2OCwiZXhwIjoyMDkxMDI2NDY4fQ.ddXbEwTz_Z7nJ6XrSuvzO-YA2ExT_i1-lMfovFsJRfI
SUPABASE_JWT_SECRET=1uGv+03iuFwoVThBGOHDVX3U25P98yJX40iqjJV4aVWcf0YH7hvq/H0mKP+3n24kh+RhQ4GUOk0K/HzRaNWiVA==
DATABASE_URL=postgresql://postgres.kwsykhgphxkyjkfjbmfk:Medfellow@321@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
SESSION_SECRET=medfellow-prod-secret-2026-change-this
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Important:** Set these for **all environments** (Production, Preview, Development)

## ✅ Step 2: Create Database Tables

1. **Go to Supabase SQL Editor:**
   https://supabase.com/dashboard/project/kwsykhgphxkyjkfjbmfk/sql/new

2. **Open this file and copy ALL contents:**
   `database/supabase/001_setup_complete.sql`

3. **Paste into SQL Editor and click "RUN"**

4. **Wait for success message** - should see "Success. No rows returned"

## ✅ Step 3: Verify Setup

After Vercel redeploys, visit:
```
https://your-app.vercel.app/api/diagnostic
```

You should see:
```json
{
  "status": "✅ System Ready",
  "message": "All checks passed. You can now login."
}
```

## ✅ Step 4: Login

- **Email:** admin@medfellow.academy
- **Password:** MedFellow@Admin2026

The admin user will be created automatically on first login.

---

## 🔧 Troubleshooting

### If you see "Database not initialized" error:
- Run the SQL setup script in Supabase (Step 2)

### If you see "Missing environment variables":
- Add all variables in Vercel dashboard (Step 1)
- Trigger a new deployment

### If login still fails:
- Check Vercel function logs
- Check Supabase logs
- Visit `/api/diagnostic` to see what's wrong

---

## 📝 What Was Fixed

Previously the app was using a file-based storage system (for development only). 
Now it properly uses your Supabase PostgreSQL database for production.

Changes:
- ✅ `lib/auth.ts` - Now queries Supabase instead of JSON files
- ✅ `lib/seed.ts` - Now inserts into Supabase database  
- ✅ Better error handling with helpful messages
- ✅ Diagnostic endpoint to check system health
