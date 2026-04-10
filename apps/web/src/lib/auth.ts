/**
 * Authentication library — cookie-based session auth.
 * Uses JWT stored in httpOnly cookie for session management.
 */

import crypto from 'crypto';
import { cookies } from 'next/headers';
import { verifyPassword } from './store';
import { db } from './db';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  role: string;
}

export interface SessionUser extends AuthUser {
  dbUser: any | null;
}

const SESSION_COOKIE = 'medfellow_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'medfellow-dev-secret-change-in-production';

if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable must be set in production. Generate one with: openssl rand -base64 32');
}

// Simple HMAC-based session token (userId signed with secret)
function createSessionToken(userId: string): string {
  const payload = Buffer.from(JSON.stringify({ userId, iat: Date.now() })).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifySessionToken(token: string): { userId: string } | null {
  try {
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return null;
    const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    // Expire after 7 days
    if (Date.now() - data.iat > 7 * 24 * 60 * 60 * 1000) return null;
    return { userId: data.userId };
  } catch {
    return null;
  }
}

// Login with username/password — returns session token
export async function loginUser(username: string, password: string): Promise<{ token: string; user: any } | null> {
  console.log('[Auth] Looking up user:', username);
  const user = await db.user.findFirst({ where: { username: username.toLowerCase() } });
  
  if (!user) {
    console.error('[Auth] User not found:', username);
    return null;
  }
  
  console.log('[Auth] User found, verifying password');
  if (!verifyPassword(password, (user as any).passwordHash)) {
    console.error('[Auth] Password verification failed');
    return null;
  }

  console.log('[Auth] Password verified, creating session');
  const token = createSessionToken((user as any).id);
  return { token, user };
}

// Set session cookie
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

// Clear session cookie
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// Get the current authenticated user from cookie
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const session = verifySessionToken(token);
    if (!session) return null;

    const user = await db.user.findUnique({ where: { id: session.userId } });
    if (!user) return null;

    return {
      id: (user as any).id,
      email: (user as any).email,
      name: `${(user as any).firstName} ${(user as any).lastName}`,
      picture: (user as any).avatar,
      role: (user as any).role,
      dbUser: user,
    };
  } catch {
    return null;
  }
}

// Check if user has required role
export function hasRole(user: SessionUser | null, roles: string[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

// Require authentication — throws if not logged in
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

// Require specific role
export async function requireRole(roles: string[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (!hasRole(user, roles)) throw new Error('Forbidden');
  return user;
}

