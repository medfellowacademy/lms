# MedFellow LMS - Project Structure

## 📁 Directory Structure

```
MedFellow-LMS/
├── apps/                          # Applications
│   └── web/                       # Next.js web application
│       ├── src/
│       │   ├── app/              # Next.js App Router pages
│       │   │   ├── (admin)/     # Admin dashboard routes
│       │   │   ├── (auth)/      # Authentication routes
│       │   │   ├── (dashboard)/ # User dashboard routes
│       │   │   └── api/         # API routes
│       │   ├── components/       # React components
│       │   │   ├── admin/       # Admin-specific components
│       │   │   ├── landing/     # Landing page components
│       │   │   ├── layout/      # Layout components
│       │   │   ├── providers/   # Context providers
│       │   │   └── ui/          # Reusable UI components
│       │   └── lib/             # Utility libraries
│       │       ├── api/         # API client utilities
│       │       ├── email/       # Email service
│       │       ├── services/    # Business logic services
│       │       ├── storage/     # Storage utilities
│       │       ├── stripe/      # Payment processing
│       │       └── supabase/    # Database client
│       ├── public/              # Static assets
│       │   └── logo.png        # MedFellow logo
│       ├── next.config.js       # Next.js configuration
│       ├── tailwind.config.ts   # Tailwind CSS config
│       ├── tsconfig.json        # TypeScript config
│       └── vercel.json          # Vercel deployment config
├── database/                      # Database schema & migrations
│   ├── supabase/                # Supabase-specific SQL
│   │   ├── 001_setup_complete.sql
│   │   ├── 002_row_level_security.sql
│   │   └── 003_setup_storage.sql
│   ├── 001_create_database.sql
│   ├── 002_create_schema.sql
│   ├── 003_create_foreign_keys.sql
│   └── setup_all.sql
├── .gitignore                     # Git ignore rules
├── docker-compose.yml             # Docker services config
├── package.json                   # Root package.json
├── pnpm-lock.yaml                # pnpm lock file
├── pnpm-workspace.yaml           # pnpm workspace config
├── turbo.json                     # Turborepo configuration
└── README.md                      # Project documentation
```

## 🎯 Key Directories Explained

### `/apps/web`
The main Next.js application containing:
- **App Router** structure with route groups
- **Server Components** and **Client Components**
- **API Routes** for backend functionality
- **Component library** organized by feature

### `/database`
PostgreSQL schema files for:
- **Supabase** setup and configuration
- **Database models** (35+ tables)
- **Row Level Security** policies
- **Storage buckets** configuration

### `/apps/web/src/app`
Route structure:
- `(admin)/` - Admin dashboard (protected)
- `(auth)/` - Login/Register pages
- `(dashboard)/` - User dashboard (protected)
- `api/` - REST API endpoints

### `/apps/web/src/lib`
Shared utilities:
- `api/` - API client hooks (React Query)
- `services/` - Business logic (AI, gamification)
- `supabase/` - Database client & auth
- `stripe/` - Payment processing
- `storage/` - File upload utilities

## 🔧 Configuration Files

- **next.config.js** - Next.js framework config
- **tailwind.config.ts** - Design system (medical teal theme)
- **tsconfig.json** - TypeScript compiler options
- **turbo.json** - Build caching configuration
- **vercel.json** - Deployment settings
- **pnpm-workspace.yaml** - Monorepo workspace definition

## 🚀 Technologies

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Payments**: Stripe
- **Package Manager**: pnpm
- **Build Tool**: Turbo

## 📦 Package Management

This is a **pnpm monorepo** using **Turborepo** for build orchestration.

### Key Commands
```bash
pnpm install          # Install all dependencies
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm typecheck        # Run TypeScript checks
```

## 🎨 Branding

- **Primary Color**: #2d9596 (Medical Teal)
- **Secondary Color**: #1e6b6e (Darker Teal)
- **Accent Color**: #5eead4 (Light Teal)
- **Logo**: Located at `/apps/web/public/logo.png`

## 🔐 Environment Variables

Required environment variables (configure in `.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## 📝 Notes

- All source code is in `/apps/web/src`
- Static files go in `/apps/web/public`
- API routes are in `/apps/web/src/app/api`
- Database migrations are in `/database`
- Uses **Server Components** by default
- Client components marked with `'use client'`
