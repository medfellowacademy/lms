# 🚀 Production Deployment Checklist for MedFellow LMS

## ✅ Pre-Deployment Checklist

This guide will help you deploy your MedFellow LMS platform to production and enable video uploads with student monitoring.

---

## 📋 STEP 1: Database Setup (Supabase)

### 1.1 Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)** and sign up/login
2. **Click "New Project"**
   - Project name: `medfellow-lms-production`
   - Database password: ⚠️ **SAVE THIS - YOU'LL NEED IT!**
   - Region: Choose closest to your users
   - Plan: Start with **Free tier** (upgrade when needed)

3. **Wait for provisioning** (2-3 minutes)

### 1.2 Run Database Setup

1. **Open SQL Editor** in Supabase Dashboard
2. **Click "New Query"**
3. **Copy & paste** contents from: `database/supabase/001_setup_complete.sql`
4. **Click "Run"** - Creates all tables, enums, indexes
5. **Repeat** for `database/supabase/002_row_level_security.sql` (security policies)
6. **Repeat** for `database/supabase/003_setup_storage.sql` (video/image storage)

### 1.3 Get Database Credentials

Go to **Project Settings → Database** and copy:

```bash
# Connection Pooler (for Vercel/serverless)
postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

# Direct Connection (for migrations)
postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

### 1.4 Get Supabase API Keys

Go to **Project Settings → API**:
- Project URL
- `anon` public key
- `service_role` secret key (⚠️ **KEEP SECRET!**)

---

## 📋 STEP 2: Environment Variables Setup

### 2.1 Create `.env.local` file

Create this file in `apps/web/.env.local`:

```bash
# ==============================================
# DATABASE (Required)
# ==============================================
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# ==============================================
# SUPABASE (Required)
# ==============================================
NEXT_PUBLIC_SUPABASE_URL="https://[REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_JWT_SECRET="your-jwt-secret-from-supabase"

# ==============================================
# APP CONFIG (Required)
# ==============================================
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_APP_NAME="MedFellow Academy"
NODE_ENV="production"

# ==============================================
# AI FEATURES (Optional - for AI Tutor)
# ==============================================
OPENAI_API_KEY="sk-..."  # Get from https://platform.openai.com
ANTHROPIC_API_KEY="sk-ant-..."  # Get from https://console.anthropic.com

# ==============================================
# PAYMENT (Optional - for student payments)
# ==============================================
STRIPE_SECRET_KEY="sk_live_..."  # Get from https://dashboard.stripe.com
STRIPE_WEBHOOK_SECRET="whsec_..."  # After setting up webhooks
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# ==============================================
# EMAIL (Optional - for notifications)
# ==============================================
RESEND_API_KEY="re_..."  # Get from https://resend.com

# ==============================================
# ANALYTICS (Optional)
# ==============================================
NEXT_PUBLIC_ANALYTICS_ID="G-XXXXXXXXXX"  # Google Analytics
```

---

## 📋 STEP 3: Supabase Storage Buckets (For Video Uploads)

### 3.1 Create Storage Buckets

In Supabase Dashboard → **Storage**:

1. **Create bucket: `videos`**
   - Public: ✅ Yes
   - Allowed MIME types: `video/mp4, video/webm, video/quicktime`
   - Max file size: `500MB`

2. **Create bucket: `thumbnails`**
   - Public: ✅ Yes
   - Allowed MIME types: `image/jpeg, image/png, image/webp`
   - Max file size: `10MB`

3. **Create bucket: `images`**
   - Public: ✅ Yes
   - Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`
   - Max file size: `10MB`

4. **Create bucket: `documents`**
   - Public: ✅ Yes
   - Allowed MIME types: `application/pdf, application/msword`
   - Max file size: `50MB`

5. **Create bucket: `certificates`**
   - Public: ✅ Yes
   - Allowed MIME types: `application/pdf, image/png`
   - Max file size: `5MB`

### 3.2 Configure Storage Policies

Run this in SQL Editor to allow uploads:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('videos', 'images', 'documents', 'thumbnails'));

-- Allow public read access
CREATE POLICY "Allow public downloads" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id IN ('videos', 'images', 'documents', 'thumbnails', 'certificates'));

-- Allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated deletes" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id IN ('videos', 'images', 'documents', 'thumbnails'));
```

---

## 📋 STEP 4: Deploy to Vercel

### 4.1 Install Vercel CLI

```bash
npm i -g vercel
```

### 4.2 Login to Vercel

```bash
vercel login
```

### 4.3 Link Project

From the root directory:

```bash
cd apps/web
vercel link
```

### 4.4 Add Environment Variables

```bash
# Add all environment variables from .env.local
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... add all other variables
```

Or add them in **Vercel Dashboard → Project Settings → Environment Variables**

### 4.5 Deploy

```bash
vercel --prod
```

Your site will be live at: `https://your-project.vercel.app`

### 4.6 Add Custom Domain (Optional)

1. Go to **Vercel Dashboard → Domains**
2. Add your domain (e.g., `academy.medfellow.com`)
3. Update DNS records as instructed

---

## 📋 STEP 5: Create Admin Account

### 5.1 Sign Up

1. Go to your deployed site: `https://your-domain.com/register`
2. Create your admin account
3. Verify email (if email is configured)

### 5.2 Promote to Admin

Run this in **Supabase SQL Editor**:

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE "User"
SET 
  role = 'SUPER_ADMIN',
  "emailVerified" = NOW()
WHERE email = 'your-email@example.com';
```

### 5.3 Login as Admin

1. Go to `https://your-domain.com/login`
2. Login with your credentials
3. Access admin at `https://your-domain.com/admin`

---

## 📋 STEP 6: Upload Videos & Create Courses

### 6.1 Access Admin Dashboard

Navigate to: `https://your-domain.com/admin`

### 6.2 Create Your First Course

1. **Go to Admin → Courses**
2. **Click "+ Create Course"**
3. Fill in:
   - Title: "Introduction to Cardiology"
   - Description: Detailed description
   - Category: Cardiology
   - Difficulty: BEGINNER
   - Price: $99 (or 0 for free)
   - Duration: 600 minutes
   - XP Reward: 500
4. **Click "Create"**

### 6.3 Add Modules & Lessons

1. **Click on your course** → Edit
2. **Add Module**: 
   - Name: "Module 1: Basics"
   - Order: 1
3. **Add Lesson**:
   - Title: "Introduction Video"
   - Type: VIDEO
   - **Upload Video**: Click upload, select video file (up to 500MB)
   - Duration: Auto-detected
   - Order: 1
4. **Save lesson**

### 6.4 Publish Course

1. **Change status** from DRAFT to PUBLISHED
2. Course is now live for students!

---

## 📋 STEP 7: Monitor Students

### 7.1 Real-Time Activity Monitor

Go to **Admin → Activity** to see:
- Live student logins
- Course enrollments
- Lesson completions  
- Quiz attempts
- AI tutor interactions
- Real-time global activity

### 7.2 Analytics Dashboard

Go to **Admin → Analytics** to view:
- **Daily Active Users** (DAU)
- **Course completion rates**
- **Revenue metrics**
- **Engagement trends**
- **Most popular courses**
- **Student retention rates**

### 7.3 User Management

Go to **Admin → Users** to:
- View all students
- Search & filter users
- See individual progress
- Grant/revoke access
- View enrollment history

### 7.4 Enrollment Tracking

Go to **Admin → Enrollments** to:
- Track all course enrollments
- Monitor progress per student
- See completion percentages
- Export enrollment data

---

## 📋 STEP 8: Optional Features Setup

### 8.1 Enable AI Tutor (Dr. Nexus)

1. **Get OpenAI API Key**: https://platform.openai.com/api-keys
2. **Add to environment variables**:
   ```bash
   OPENAI_API_KEY="sk-..."
   ```
3. **Redeploy**: `vercel --prod`
4. Students can now chat with AI tutor!

### 8.2 Enable Payments (Stripe)

1. **Create Stripe account**: https://dashboard.stripe.com
2. **Get API keys** from Dashboard → Developers → API keys
3. **Add to environment**:
   ```bash
   STRIPE_SECRET_KEY="sk_live_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
   ```
4. **Setup webhook**:
   - Endpoint: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`
5. **Redeploy**

### 8.3 Enable Email Notifications

1. **Create Resend account**: https://resend.com
2. **Get API key**
3. **Add to environment**:
   ```bash
   RESEND_API_KEY="re_..."
   ```
4. **Verify domain** in Resend dashboard
5. Students get emails for:
   - Course enrollment
   - Lesson completion
   - Certificate earned
   - Achievement unlocked

---

## 📋 STEP 9: Performance Optimization

### 9.1 Enable Video CDN (Optional but Recommended)

For better video streaming, consider:

**Option A: Cloudflare Stream** ($1/1000 minutes viewed)
- Upload videos to Cloudflare
- Get streaming URL
- Paste in lesson video URL

**Option B: Mux** ($0.005/minute viewed)
- Sign up at https://mux.com
- Upload via Mux dashboard
- Use Mux player URL

**Option C: Keep Supabase Storage** (Included in plan)
- Works well for small-medium traffic
- Free up to storage limits
- Slower for global audiences

### 9.2 Database Optimization

```sql
-- Add indexes for common queries (already in setup scripts)
CREATE INDEX IF NOT EXISTS idx_enrollment_user ON "Enrollment"("userId");
CREATE INDEX IF NOT EXISTS idx_enrollment_course ON "Enrollment"("courseId");
CREATE INDEX IF NOT EXISTS idx_progress_user ON "LessonProgress"("userId");
```

### 9.3 Enable Caching

In `next.config.js`, caching is already configured:

```javascript
images: {
  domains: ['[REF].supabase.co'],
  formats: ['image/webp'],
}
```

---

## 📋 STEP 10: Security Hardening

### ✅ Checklist:

- [ ] **Row Level Security enabled** (RLS) - ✅ Already in `002_row_level_security.sql`
- [ ] **HTTPS enforced** - ✅ Automatic with Vercel
- [ ] **Environment variables in Vercel** - ⚠️ Never commit secrets to Git
- [ ] **Supabase service key protected** - ⚠️ Only use server-side
- [ ] **Rate limiting enabled** - ✅ Already in API routes (`lib/rate-limit.ts`)
- [ ] **CORS configured** - ✅ Already in API routes
- [ ] **Content Security Policy** - ✅ Already in `vercel.json`

### 10.1 Update CORS (if needed)

If you have a separate domain for admin:

```typescript
// In API routes
const allowedOrigins = [
  'https://your-domain.com',
  'https://admin.your-domain.com', // If separate
];
```

---

## 📋 STEP 11: Testing Before Launch

### 11.1 Test Video Upload

1. Login as admin
2. Go to **Admin → Courses → Create Course**
3. Add a lesson with video
4. Upload a small test video (< 50MB)
5. Verify:
   - [ ] Upload succeeds
   - [ ] Video plays in browser
   - [ ] Thumbnail is generated
   - [ ] Duration is detected

### 11.2 Test Student Flow

1. **Register** a test student account
2. **Enroll** in a course
3. **Watch** a lesson video
4. **Complete** the lesson
5. **Check** progress tracking
6. Verify in admin:
   - [ ] Enrollment shows up
   - [ ] Progress is tracked
   - [ ] Activity log shows student actions

### 11.3 Test Admin Monitoring

From admin dashboard:
- [ ] **Activity page** shows real-time actions
- [ ] **Analytics** displays metrics
- [ ] **User list** shows all students
- [ ] **Course stats** are accurate

---

## 📋 STEP 12: Launch Checklist

Before inviting students:

### Pre-Launch:
- [ ] All environment variables set
- [ ] Database setup complete
- [ ] Storage buckets created
- [ ] At least 1 course published
- [ ] Admin account created and tested
- [ ] Video upload tested
- [ ] Student registration tested
- [ ] Monitoring dashboard works
- [ ] SSL certificate active (HTTPS)
- [ ] Custom domain configured (optional)

### Content:
- [ ] Welcome email configured (if using Resend)
- [ ] Terms of Service page set up
- [ ] Privacy Policy page set up
- [ ] Support email configured

### Marketing:
- [ ] Landing page ready
- [ ] Social media accounts created
- [ ] Email marketing setup (Mailchimp/ConvertKit)
- [ ] Analytics tracking (Google Analytics)

---

## 🎯 POST-LAUNCH: Ongoing Monitoring

### Daily:
- Check **Admin → Activity** for student engagement
- Monitor **Admin → Analytics** for metrics
- Review any error logs in Vercel dashboard

### Weekly:
- Analyze course completion rates
- Review student feedback
- Check storage usage in Supabase
- Monitor Vercel bandwidth usage

### Monthly:
- Review and optimize slow queries
- Backup database (Supabase auto-backups enabled)
- Update course content based on analytics
- Plan new course releases

---

## 📊 Scaling Guidelines

### When to Upgrade:

**Supabase:**
- Free: Up to 500MB database, 1GB storage
- Pro ($25/mo): 8GB database, 100GB storage
- **Upgrade when**: > 1000 students or > 50GB videos

**Vercel:**
- Hobby: Good for testing
- Pro ($20/mo): Recommended for production
- **Upgrade when**: > 100GB bandwidth/month

**Video Storage:**
- If videos > 100GB, consider Cloudflare Stream or Mux
- Saves Supabase storage costs
- Better global CDN performance

---

## 🆘 Troubleshooting

### Videos won't upload
- Check Supabase storage bucket created
- Verify storage policies in SQL
- Check file size < 500MB
- Verify MIME type is allowed

### Students can't see courses
- Check course status is PUBLISHED
- Verify RLS policies applied
- Check enrollment required setting

### Admin dashboard shows no data
- Verify you're logged in as SUPER_ADMIN
- Check database has data
- Open browser console for errors

### Emails not sending
- Verify RESEND_API_KEY is set
- Check domain verification in Resend
- Review email templates in code

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Stripe Docs**: https://stripe.com/docs
- **OpenAI Docs**: https://platform.openai.com/docs

---

## ✅ Quick Start Summary

**Fastest path to production:**

1. **Create Supabase project** (5 min)
2. **Run SQL setup scripts** (2 min)
3. **Create storage buckets** (3 min)
4. **Deploy to Vercel** (10 min)
5. **Create admin account** (2 min)
6. **Upload first course** (20 min)
7. **Test everything** (15 min)

**Total time**: ~1 hour to go live! 🚀

---

## 🎉 You're Ready!

Your MedFellow LMS is now production-ready with:
- ✅ Video upload & streaming
- ✅ Student monitoring & analytics
- ✅ Course management
- ✅ Real-time activity tracking
- ✅ Secure, scalable infrastructure

**Start inviting your students and building your medical education empire!** 🏥📚
