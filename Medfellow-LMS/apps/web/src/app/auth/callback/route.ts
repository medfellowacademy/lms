import { createServerSupabaseClient } from '@/lib/supabase/server';
import { syncUserToDatabase } from '@/lib/supabase/auth';
import { sendWelcomeEmail } from '@/lib/email/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Sync user to database
      const user = await syncUserToDatabase({
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata as { firstName?: string; lastName?: string; avatar_url?: string },
      });

      // Send welcome email for new users
      if (user && data.user.email) {
        const firstName = user.firstName || 'Doctor';
        // Send welcome email (fire and forget)
        sendWelcomeEmail(data.user.email, firstName).catch(console.error);
      }
    }
  }

  // Redirect to the dashboard or specified page
  return NextResponse.redirect(new URL(next, request.url));
}

