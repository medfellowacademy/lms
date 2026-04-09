import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Run migrations one by one
    console.log('🚀 Adding isLocked column to Lesson table...');
    const { error: error1 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "isLocked" BOOLEAN NOT NULL DEFAULT false'
    });
    // Column might already exist, that's okay

    console.log('🚀 Adding presentationUrl column to Lesson table...');
    const { error: error2 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "presentationUrl" TEXT'
    });

    console.log('🚀 Adding isPublished column to Lesson table...');
    const { error: error3 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "isPublished" BOOLEAN NOT NULL DEFAULT true'
    });

    console.log('🚀 Adding isLocked column to Module table...');
    const { error: error4 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE "Module" ADD COLUMN IF NOT EXISTS "isLocked" BOOLEAN NOT NULL DEFAULT false'
    });

    console.log('🚀 Creating indexes...');
    const { error: error5 } = await supabase.rpc('exec_sql', {
      sql: 'CREATE INDEX IF NOT EXISTS "Lesson_isLocked_idx" ON "Lesson"("isLocked")'
    });

    const { error: error6 } = await supabase.rpc('exec_sql', {
      sql: 'CREATE INDEX IF NOT EXISTS "Module_isLocked_idx" ON "Module"("isLocked")'
    });

    console.log('🚀 Creating LessonLockHistory table...');
    const { error: error7 } = await supabase.rpc('exec_sql', {
      sql: `CREATE TABLE IF NOT EXISTS "LessonLockHistory" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "lessonId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "action" TEXT NOT NULL,
        "reason" TEXT,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT "LessonLockHistory_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "LessonLockHistory_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE,
        CONSTRAINT "LessonLockHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      )`
    });

    // Get lesson count to verify
    const { count } = await supabase.from('Lesson').select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully',
      lessonCount: count,
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Migration failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
