import { NextRequest, NextResponse } from 'next/server';
import { loginUser, setSessionCookie } from '@/lib/auth';
import { seedIfNeeded } from '@/lib/seed';

export async function POST(request: NextRequest) {
  try {
    // Ensure database is seeded on first access
    await seedIfNeeded();

    const body = await request.json();
    const { username, password } = body;

    console.log('[Login] Attempting login for:', username);

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const result = await loginUser(username, password);

    if (!result) {
      console.error('[Login] Login failed for:', username);
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    console.log('[Login] Login successful for:', username);

    // Set session cookie
    await setSessionCookie(result.token);

    // Return user data (without password hash)
    const { passwordHash, ...safeUser } = result.user as any;

    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Check if it's a database connection error
    if (error?.message?.includes('relation') || error?.message?.includes('table')) {
      return NextResponse.json(
        { 
          error: 'Database not initialized. Please run the SQL setup script first.',
          hint: 'See database/supabase/001_setup_complete.sql'
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}
