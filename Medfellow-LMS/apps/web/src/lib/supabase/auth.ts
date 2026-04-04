import { createClient } from './client';
import { createServerSupabaseClient } from './server';
import { prisma } from '@/lib/db';

// Client-side auth helpers
export const auth = {
  // Sign up with email and password
  async signUp(email: string, password: string, metadata?: { firstName?: string; lastName?: string }) {
    const supabase = createClient();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) throw error;

    // Create user in our database
    if (data.user) {
      await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          firstName: metadata?.firstName,
          lastName: metadata?.lastName,
        }),
      });
    }

    return data;
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const supabase = createClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign in with OAuth provider
  async signInWithProvider(provider: 'google' | 'github' | 'apple') {
    const supabase = createClient();
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  async getSession() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Get current user
  async getUser() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  // Reset password
  async resetPassword(email: string) {
    const supabase = createClient();
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) throw error;
  },

  // Update password
  async updatePassword(newPassword: string) {
    const supabase = createClient();
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    const supabase = createClient();
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Server-side auth helpers
export async function getServerSession() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getServerUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Get user from database with full profile
export async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: {
        include: {
          course: true,
        },
      },
      achievements: {
        include: {
          achievement: true,
        },
      },
      certificates: true,
    },
  });
}

// Sync Supabase user to database
export async function syncUserToDatabase(supabaseUser: {
  id: string;
  email?: string;
  user_metadata?: { firstName?: string; lastName?: string; avatar_url?: string };
}) {
  const existingUser = await prisma.user.findUnique({
    where: { id: supabaseUser.id },
  });

  if (existingUser) {
    // Update last activity
    return prisma.user.update({
      where: { id: supabaseUser.id },
      data: {
        lastActivityAt: new Date(),
      },
    });
  }

  // Create new user
  return prisma.user.create({
    data: {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      firstName: supabaseUser.user_metadata?.firstName,
      lastName: supabaseUser.user_metadata?.lastName,
      avatar: supabaseUser.user_metadata?.avatar_url,
      role: 'STUDENT',
      level: 1,
      xp: 0,
      rank: 'Intern',
      streak: 0,
    },
  });
}

