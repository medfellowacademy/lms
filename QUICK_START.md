# 🚀 Quick Start - Get Live in 1 Hour

Follow these exact steps to deploy your MedFellow LMS and start uploading videos.

---

## ⚡ STEP 1: Supabase Setup (15 min)

### 1.1 Create Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub/email
4. Create new organization (e.g., "MedFellow Academy")

### 1.2 Create Project
1. Click "New Project"
2. **Project name**: `medfellow-lms`
3. **Database password**: Create strong password ⚠️ **SAVE THIS!**
4. **Region**: Choose closest to your students
5. Click "Create new project"
6. ⏱️ Wait 2-3 minutes for provisioning

### 1.3 Run Database Setup
1. Click **"SQL Editor"** in left sidebar
2. Click **"New query"**
3. Open file: `database/supabase/001_setup_complete.sql`
4. Copy ALL content → Paste in SQL Editor
5. Click **"Run"** (bottom right)
6. ✅ Should see "Success. No rows returned"

7. **Repeat for security:**
   - New query → Copy `database/supabase/002_row_level_security.sql` → Run

8. **Repeat for storage:**
   - New query → Copy `database/supabase/003_setup_storage.sql` → Run

### 1.4 Get Credentials

**Database URL:**
1. Click **"Project Settings"** (gear icon)
2. Click **"Database"** tab
3. Scroll to **"Connection string"** → **"URI"**
4. Copy **"Connection pooling"** URL (with `[YOUR-PASSWORD]` placeholder)
5. Replace `[YOUR-PASSWORD]` with your actual password
6. Save this as `DATABASE_URL`

**API Keys:**
1. Click **"Project Settings"** → **"API"**
2. Copy and save:
   - **Project URL** → Save as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → Save as `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **SECRET!**

**Example:**
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdX...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdX...
DATABASE_URL=postgresql://postgres.abcdefghijk:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

---

## ⚡ STEP 2: Configure Environment (5 min)

### 2.1 Create Environment File

In your project folder: `MedFellow-LMS/apps/web/`

Create file: `.env.local`

```bash
# Copy this entire block, replace values with your credentials from Step 1.4

# ==============================================
# DATABASE (Required)
# ==============================================
DATABASE_URL="postgresql://postgres.[REF]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres"

# ==============================================
# SUPABASE (Required)
# ==============================================
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_JWT_SECRET="your-super-secret-jwt-token-with-at-least-32-characters-1234"

# ==============================================
# APP CONFIG (Required)
# ==============================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="MedFellow Academy"
NODE_ENV="development"

# ==============================================
# OPTIONAL - AI Tutor (add later)
# ==============================================
# OPENAI_API_KEY="sk-..."

# ==============================================
# OPTIONAL - Payments (add later)
# ==============================================
# STRIPE_SECRET_KEY="sk_test_..."
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
# STRIPE_WEBHOOK_SECRET="whsec_..."

# ==============================================
# OPTIONAL - Emails (add later)
# ==============================================
# RESEND_API_KEY="re_..."
```

### 2.2 Verify Setup

Open PowerShell in project root:

```powershell
cd C:\Users\hp\Downloads\MedFellow-LMS
pnpm install
cd apps/web
npx prisma generate
```

Expected output: ✅ "Generated Prisma Client"

---

## ⚡ STEP 3: Test Locally (5 min)

### 3.1 Start Development Server

```powershell
cd C:\Users\hp\Downloads\MedFellow-LMS
pnpm dev
```

Expected output:
```
> medfellow-academy@1.0.0 dev
> turbo run dev

@medfellow/web:dev: ready - started server on 0.0.0.0:3000
```

### 3.2 Open Browser

Go to: http://localhost:3000

You should see the landing page! 🎉

### 3.3 Create Test Account

1. Click **"Get Started"** or **"Register"**
2. Fill in:
   - Username: your_username
   - Password: secure-password
   - First Name: Your Name
   - Last Name: Your Last Name
3. Click **"Create Account"**
4. You're logged in!

### 3.4 Promote to Admin

**Open Supabase SQL Editor** and run:

```sql
-- Replace with your actual username
UPDATE "User"
SET 
  role = 'ADMIN',
  "isVerified" = true
WHERE username = 'your_username';
```

### 3.5 Access Admin Dashboard

**Refresh page**, then go to: http://localhost:3000/admin

You should see the admin dashboard! 🎉

**Test it works:**
- ✅ Can see admin sidebar
- ✅ Dashboard shows stats (will be 0)
- ✅ Click "Courses" → See empty course list
- ✅ Click "Users" → See your account

---

## ⚡ STEP 4: Upload Your First Video (10 min)

### 4.1 Create Course

1. Go to **Admin → Courses**
2. Click **"+ Create Course"** (top right)
3. Fill in form:
   ```
   Title: Introduction to Medical Practice
   Description: Learn the fundamentals of medical practice with comprehensive video lectures.
   Short Description: Fundamentals of medical practice
   Category: Cardiology
   Difficulty: BEGINNER
   Price: 0 (free for testing)
   Duration: 600 (minutes)
   XP Reward: 500
   ```
4. Click **"Create Course"**
5. ✅ Course created!

### 4.2 Add Module

1. Click on your new course
2. Click **"Add Module"**
3. Fill in:
   ```
   Name: Module 1: Introduction
   Description: Welcome to the course
   Order: 1
   ```
4. Click **"Save"**

### 4.3 Add Video Lesson

1. Click on **"Module 1: Introduction"**
2. Click **"Add Lesson"**
3. Fill in:
   ```
   Title: Welcome Video
   Type: VIDEO
   Description: Introduction to the course
   Order: 1
   ```
4. **Upload Video:**
   - Click **"Upload Video"** button
   - Select your .mp4 file (must be < 500MB)
   - Wait for upload progress bar
   - Duration auto-fills when complete
5. Click **"Save Lesson"**

### 4.4 Publish Course

1. In course editor, change **Status** dropdown
2. Select **"PUBLISHED"**
3. Click **"Save Changes"**

✅ **Your first course with video is LIVE!**

### 4.5 Test as Student

1. **Logout** (click profile icon → Logout)
2. **Register** a new test student account
3. Go to **Dashboard**
4. Click **"Browse Courses"**
5. Find your course → Click **"Enroll"**
6. Click **"Start Learning"**
7. **Watch your video!** 🎥

---

## ⚡ STEP 5: Monitor Students (2 min)

### 5.1 Check Activity Feed

1. **Login as admin** again
2. Go to **Admin → Activity**
3. You'll see live feed:
   - Your test student enrollment
   - Lesson starts
   - Video views
   - All actions in real-time

### 5.2 Check Analytics

1. Go to **Admin → Analytics**
2. View:
   - Daily Active Users
   - Course enrollments
   - Revenue (if paid courses)
   - Engagement charts
   - Top content

### 5.3 View Student Details

1. Go to **Admin → Users**
2. Click on your test student
3. See:
   - Enrolled courses
   - Progress percentage
   - Lessons completed
   - Last activity
   - XP and level

---

## ⚡ STEP 6: Deploy to Production (20 min)

### 6.1 Push to GitHub

```powershell
cd C:\Users\hp\Downloads\MedFellow-LMS

# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit - Ready for production"

# Create GitHub repository (via GitHub website)
# Then:
git remote add origin https://github.com/your-username/medfellow-lms.git
git branch -M main
git push -u origin main
```

### 6.2 Deploy to Vercel

**Option A: Website (Easier)**

1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click **"Add New..."** → **"Project"**
4. **Import** your GitHub repository
5. **Framework Preset**: Next.js (auto-detected)
6. **Root Directory**: `apps/web`
7. **Build Command**: Leave default
8. Click **"Deploy"**
9. ⏱️ Wait 3-5 minutes

**Option B: CLI**

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from apps/web
cd apps\web
vercel

# Follow prompts:
# - Setup new project? Y
# - Which scope? Your account
# - Link to existing project? N
# - Project name? medfellow-lms
# - Directory? ./
# - Override settings? N

# Deploy to production
vercel --prod
```

### 6.3 Add Environment Variables to Vercel

**Via Dashboard:**
1. Go to **Vercel Dashboard** → Your Project
2. Click **"Settings"** → **"Environment Variables"**
3. Add each variable from your `.env.local`:
   ```
   DATABASE_URL = [paste value]
   DIRECT_URL = [paste value]
   NEXT_PUBLIC_SUPABASE_URL = [paste value]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [paste value]
   SUPABASE_SERVICE_ROLE_KEY = [paste value]
   SUPABASE_JWT_SECRET = [paste value]
   NEXT_PUBLIC_APP_URL = https://your-site.vercel.app
   NEXT_PUBLIC_APP_NAME = MedFellow Academy
   NODE_ENV = production
   ```
4. Important: Set **NEXT_PUBLIC_APP_URL** to your Vercel URL
5. Click **"Save"**

**Via CLI:**
```powershell
vercel env add DATABASE_URL
# Paste value, press Enter
# Select "Production" → Press Enter

# Repeat for all variables
```

### 6.4 Redeploy with Variables

```powershell
vercel --prod
```

Or in Vercel Dashboard: **Deployments** → **"Redeploy"**

### 6.5 Update Supabase URL

In your `.env.local`, change:
```bash
NEXT_PUBLIC_APP_URL="https://your-project.vercel.app"
```

Update in Vercel environment variables too!

---

## ⚡ STEP 7: Go Live! (2 min)

### 7.1 Create Production Admin

1. Go to your deployed site: `https://your-project.vercel.app/register`
2. Create your admin account
3. In Supabase SQL Editor, run:

```sql
UPDATE "User"
SET 
  role = 'SUPER_ADMIN',
  "emailVerified" = NOW()
WHERE email = 'your-production-email@example.com';
```

### 7.2 Access Production Admin

Go to: `https://your-project.vercel.app/admin`

✅ **You're live!**

### 7.3 Upload Production Videos

Follow Step 4 again, but now on your live site!

### 7.4 Invite Students

Share your course URL:
```
https://your-project.vercel.app/dashboard
```

Students can:
1. Register
2. Browse courses
3. Enroll  
4. Start learning
5. Watch your videos!

---

## 🎯 What You Can Monitor Right Now

### Real-Time Activity (Admin → Activity)
- Student logins
- Course enrollments  
- Lesson completions
- Video views
- Quiz attempts
- Time on site

### Analytics Dashboard (Admin → Analytics)
- Total students
- Active students today
- Course completion rates
- Revenue (if charging)
- Most popular courses
- Engagement trends

### Student Management (Admin → Users)
- View all students
- Search by name/email
- See individual progress
- Track enrollment history
- Monitor learning time
- View achievements earned

### Course Statistics (Admin → Courses)
- Enrollments per course
- Completion rates
- Average ratings
- Revenue per course
- Most watched videos
- Student feedback

---

## 🎬 Video Upload Limits & Tips

### Current Limits:
- **Max size per video**: 500MB
- **Supported formats**: MP4, WebM, QuickTime
- **Supabase free tier**: 1GB total storage
- **Recommended**: Upgrade to Pro ($25/mo) for 100GB

### Optimize Videos:

**Using Handbrake (Free):**
1. Download from https://handbrake.fr
2. Load your video
3. Preset: **"Fast 1080p30"** or **"Fast 720p30"**
4. Click **"Start"**
5. Output will be smaller, optimized for web

**Typical Results:**
- 1GB raw video → 150MB compressed
- 500MB video → 75MB compressed
- Quality stays high!

### When to Upgrade Storage:

**Supabase Free**: 1GB storage
- ~2-5 videos (depending on length)
- Good for testing

**Supabase Pro**: 100GB storage ($25/mo)
- ~200-500 videos
- Recommended for production

**External Video CDN**: Unlimited
- Cloudflare Stream: $1 per 1,000 minutes viewed
- Mux: $0.005 per minute viewed
- Best for high traffic

---

## ✅ Success Checklist

You're ready when you have:

### Infrastructure:
- [x] Supabase project created
- [x] Database tables created (SQL run)
- [x] Storage buckets created
- [x] Environment variables configured
- [x] Deployed to Vercel
- [x] Production URL working

### Content:
- [x] Admin account created
- [x] Admin access verified
- [x] First course created
- [x] First video uploaded
- [x] Course published

### Testing:
- [x] Test student registered
- [x] Student enrolled in course
- [x] Video plays correctly
- [x] Progress tracked
- [x] Activity shows in admin
- [x] Analytics working

---

## 🎓 Next Steps

### This Week:
1. Upload 3-5 more videos
2. Create 2-3 complete courses
3. Test all features
4. Invite 5-10 beta students

### This Month:
1. Get student feedback
2. Add quizzes to courses
3. Enable AI tutor (OpenAI key)
4. Set up payments (Stripe)
5. Configure email notifications

### This Quarter:
1. Reach 100 students
2. Create 10+ courses
3. Add more instructors
4. Build community features
5. Scale infrastructure

---

## 🆘 Troubleshooting

### "Can't connect to database"
- Check DATABASE_URL is correct
- Verify password has no special chars (or URL encode them)
- Make sure Supabase project is running

### "Video upload fails"
- Check storage bucket 'videos' exists
- Verify storage policies in Supabase
- Check file size < 500MB
- Try smaller test video first

### "Not authorized" when accessing admin
- Verify you ran the UPDATE User SQL command
- Check email matches exactly
- Refresh browser after SQL update
- Clear cookies and login again

### "Environment variables not working"
- Make sure .env.local is in apps/web/ folder
- Restart dev server after changes
- For Vercel: Check variables are set in dashboard
- Redeploy after adding Vercel env vars

### "Module not found" errors
```powershell
cd C:\Users\hp\Downloads\MedFellow-LMS
pnpm install
cd apps\web
npx prisma generate
pnpm dev
```

---

## 📞 Resources

- **Your Codebase Docs**: 
  - `README.md` - Project overview
  - `PRODUCTION_CHECKLIST.md` - Detailed deployment guide
  - `READY_FOR_PRODUCTION.md` - Feature overview
  
- **External Docs**:
  - Supabase: https://supabase.com/docs
  - Vercel: https://vercel.com/docs
  - Next.js: https://nextjs.org/docs

---

## 🎉 You're Done!

**In ~1 hour you've:**
- ✅ Set up production database
- ✅ Configured environment
- ✅ Deployed to the web
- ✅ Uploaded your first video
- ✅ Enabled student monitoring
- ✅ Gone LIVE with your LMS!

**Your students can now:**
- Register and login
- Browse courses
- Enroll in courses
- Watch your videos
- Track their progress
- Earn certificates

**You can now:**
- Upload unlimited courses
- Monitor all student activity
- View real-time analytics
- Manage all users
- Track revenue
- Scale to thousands of students

---

## 🚀 Start Teaching!

**Your MedFellow LMS is live and ready for students!**

Share your course: `https://your-site.vercel.app`

Happy teaching! 🎓📹
