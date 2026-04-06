import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {},
  };

  // Check environment variables
  diagnostics.checks.env = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
  };

  try {
    // Test direct Supabase query
    const supabase = await createServerSupabaseClient();
    
    // Test 1: Can we query the User table?
    const { data: users, error: queryError } = await supabase
      .from('User')
      .select('email, role, isActive')
      .limit(5);

    if (queryError) {
      diagnostics.checks.database = {
        status: '❌ Query Failed',
        error: queryError.message,
        code: queryError.code,
        hint: queryError.hint,
      };
    } else {
      diagnostics.checks.database = {
        status: '✅ Connected',
        userCount: users?.length || 0,
        users: users?.map((u: any) => ({ email: u.email, role: u.role })) || [],
      };
    }

    // Test 2: Check for specific admin users
    const { data: adminUser, error: adminError } = await supabase
      .from('User')
      .select('*')
      .eq('email', 'santhosh@medfellow.in')
      .maybeSingle();

    if (adminError) {
      diagnostics.checks.santhoshAdmin = {
        status: '❌ Query Failed',
        error: adminError.message,
      };
    } else if (adminUser) {
      diagnostics.checks.santhoshAdmin = {
        status: '✅ Found',
        email: adminUser.email,
        role: adminUser.role,
        isActive: adminUser.isActive,
        hasPasswordHash: !!adminUser.passwordHash,
        passwordHashFormat: adminUser.passwordHash?.substring(0, 20) + '...',
      };
    } else {
      diagnostics.checks.santhoshAdmin = {
        status: '⚠️ Not Found',
        message: 'User santhosh@medfellow.in does not exist in database',
      };
    }

    // Test 3: Check old admin
    const { data: oldAdmin } = await supabase
      .from('User')
      .select('email, role')
      .eq('email', 'admin@medfellow.academy')
      .maybeSingle();

    diagnostics.checks.oldAdmin = oldAdmin 
      ? { status: '✅ Found', email: oldAdmin.email } 
      : { status: '⚠️ Not Found' };

  } catch (error: any) {
    diagnostics.checks.criticalError = {
      status: '❌ Fatal Error',
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3),
    };
  }

  return NextResponse.json(diagnostics, { status: 200 });
}
