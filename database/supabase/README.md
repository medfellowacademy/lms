# IBMP Platform - Supabase Database Setup

Complete guide for setting up the IBMP database on Supabase.

## 🚀 Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project (save your database password!)
4. Wait for the project to be provisioned

### 2. Get Your Connection String

1. Go to **Project Settings** → **Database**
2. Copy the **Connection string** (URI format)
3. It looks like: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

### 3. Run the SQL Scripts

**Option A: Using Supabase SQL Editor (Recommended)**

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the sidebar
3. Create a new query
4. Copy and paste the contents of `001_setup_complete.sql`
5. Click **Run**

**Option B: Using psql**

```bash
psql "postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres" -f 001_setup_complete.sql
```

### 4. Configure Your App

Add to your `.env.local`:

```bash
# Supabase Database URL (use the pooler connection for serverless)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# For Prisma migrations, use direct connection
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

### 5. Generate Prisma Client

```bash
cd apps/web
npx prisma generate
```

## 📁 Files

| File | Description |
|------|-------------|
| `001_setup_complete.sql` | Complete schema for Supabase |
| `002_row_level_security.sql` | Optional RLS policies for extra security |
| `003_setup_storage.sql` | Storage buckets for videos, images, documents |

## 🔐 Supabase Features

### Row Level Security (RLS)

Supabase enables RLS by default. The `002_row_level_security.sql` script adds policies for:
- Users can only read/update their own data
- Public read access for courses
- Admin full access

### Realtime

Enable realtime for specific tables in Supabase Dashboard:
- Go to **Database** → **Replication**
- Enable for: `Notification`, `AIMessage`, `SocialPost`, `Comment`

### Edge Functions

You can use Supabase Edge Functions for:
- AI chat processing
- Certificate generation
- Email notifications

## 💡 Tips

1. **Use Connection Pooling**: Always use the pooler URL for serverless
2. **Enable RLS**: Add security policies for production
3. **Set up Backups**: Enable Point-in-Time Recovery in Dashboard
4. **Monitor Usage**: Check the Database usage in Dashboard

## 🔗 Useful Links

- [Supabase Dashboard](https://app.supabase.com)
- [Supabase Docs](https://supabase.com/docs)
- [Prisma + Supabase Guide](https://supabase.com/docs/guides/integrations/prisma)

