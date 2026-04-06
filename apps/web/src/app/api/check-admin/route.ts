import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Check if admin user exists
    const adminUser = await db.user.findFirst({ 
      where: { email: 'admin@medfellow.academy' } 
    });

    if (adminUser) {
      return NextResponse.json({
        status: '✅ Admin user EXISTS',
        email: (adminUser as any).email,
        role: (adminUser as any).role,
        firstName: (adminUser as any).firstName,
        isActive: (adminUser as any).isActive,
        message: 'You can now login!',
      });
    } else {
      return NextResponse.json({
        status: '❌ Admin user NOT FOUND',
        message: 'You need to run the SQL script in Supabase',
        instructions: [
          '1. Go to: https://supabase.com/dashboard/project/kwsykhgphxkyjkfjbmfk/sql/new',
          '2. Copy SQL from: database/supabase/insert_admin.sql',
          '3. Paste and click RUN',
          '4. Refresh this page to verify',
        ],
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: '❌ Database Error',
      error: error?.message,
      hint: 'Database tables might not exist. Run database/supabase/001_setup_complete.sql first',
    }, { status: 500 });
  }
}
