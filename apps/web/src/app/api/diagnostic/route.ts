import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    checks: {},
    status: 'checking',
  };

  // Check 1: Environment Variables
  diagnostics.checks.environmentVariables = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_JWT_SECRET: !!process.env.SUPABASE_JWT_SECRET,
    SESSION_SECRET: !!process.env.SESSION_SECRET,
    DATABASE_URL: !!process.env.DATABASE_URL,
  };

  const envOk = Object.values(diagnostics.checks.environmentVariables).every(v => v === true);
  diagnostics.checks.environmentVariables.status = envOk ? '✅ OK' : '❌ MISSING';

  // Check 2: Database Connection
  try {
    await db.user.count();
    diagnostics.checks.database = {
      status: '✅ Connected',
      message: 'Database tables exist and are accessible',
    };
  } catch (error: any) {
    diagnostics.checks.database = {
      status: '❌ Failed',
      message: error?.message || 'Unknown error',
      hint: 'Run database/supabase/001_setup_complete.sql in Supabase SQL Editor',
    };
  }

  // Check 3: User Table Status
  try {
    const userCount = await db.user.count();
    diagnostics.checks.users = {
      status: userCount > 0 ? '✅ Users exist' : '⚠️ No users',
      count: userCount,
      message: userCount === 0 ? 'Admin user will be created on first login attempt' : `${userCount} user(s) in database`,
    };
  } catch (error: any) {
    diagnostics.checks.users = {
      status: '❌ Cannot check',
      message: 'User table does not exist',
    };
  }

  // Check 4: Other Tables
  const tables = ['course', 'module', 'lesson', 'enrollment'];
  diagnostics.checks.tables = {};
  
  for (const table of tables) {
    try {
      await (db as any)[table].count();
      diagnostics.checks.tables[table] = '✅';
    } catch {
      diagnostics.checks.tables[table] = '❌';
    }
  }

  // Overall Status
  const hasDatabase = diagnostics.checks.database.status.includes('✅');
  const hasEnv = diagnostics.checks.environmentVariables.status.includes('✅');
  
  if (hasDatabase && hasEnv) {
    diagnostics.status = '✅ System Ready';
    diagnostics.message = 'All checks passed. You can now login.';
  } else if (!hasEnv) {
    diagnostics.status = '❌ Configuration Error';
    diagnostics.message = 'Missing environment variables in Vercel dashboard';
    diagnostics.action = 'Add all environment variables in Vercel project settings';
  } else if (!hasDatabase) {
    diagnostics.status = '❌ Database Not Set Up';
    diagnostics.message = 'Database tables do not exist';
    diagnostics.action = 'Run database/supabase/001_setup_complete.sql in Supabase SQL Editor';
  }

  return NextResponse.json(diagnostics, { status: 200 });
}
