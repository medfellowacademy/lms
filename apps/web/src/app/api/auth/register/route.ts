import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/store';
import { db } from '@/lib/db';
import { loginUser, setSessionCookie } from '@/lib/auth';
import { seedIfNeeded } from '@/lib/seed';

export async function POST(request: NextRequest) {
  try {
    // Ensure database is seeded on first access
    await seedIfNeeded();

    const body = await request.json();
    const { username, password, firstName, lastName } = body;

    if (!username || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await db.user.findFirst({ where: { username: username.toLowerCase() } });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this username already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const user = await db.user.create({
      data: {
        username: username.toLowerCase(),
        email: `${username.toLowerCase()}@medfellow.local`, // Generate a placeholder email
        passwordHash: hashPassword(password),
        firstName,
        lastName,
        role: 'STUDENT',
        avatar: null,
        bio: '',
        level: 1,
        xp: 0,
        rank: 'Intern',
        streak: 0,
        isActive: true,
        isVerified: false,
      },
    });

    // Auto-login after registration
    const result = await loginUser(username.toLowerCase(), password);
    if (result) {
      await setSessionCookie(result.token);
    }

    const { passwordHash, ...safeUser } = user as any;

    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
