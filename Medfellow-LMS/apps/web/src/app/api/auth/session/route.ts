import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  const { passwordHash, ...safeUser } = (user.dbUser || {}) as any;
  return NextResponse.json({ authenticated: true, user: safeUser });
}
