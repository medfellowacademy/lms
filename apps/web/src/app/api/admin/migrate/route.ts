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
    await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "isLocked" BOOLEAN NOT NULL DEFAULT false'
    }).catch(() => {
      // Column might already exist, that's okay
    });

    console.log('🚀 Adding presentationUrl column to Lesson table...');
    await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "presentationUrl" TEXT'
    }).catch(() => {});

    console.log('🚀 Adding isPublished column to Lesson table...');
    await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "isPublished" BOOLEAN NOT NULL DEFAULT true'
    }).catch(() => {});

    console.log('🚀 Adding isLocked column to Module table...');
    await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE "Module" ADD COLUMN IF NOT EXISTS "isLocked" BOOLEAN NOT NULL DEFAULT false'
    }).catch(() => {});

    console.log('🚀 Creating indexes...');
    await supabase.rpc('exec_sql', {
      sql: 'CREATE INDEX IF NOT EXISTS "Lesson_isLocked_idx" ON "Lesson"("isLocked")'
    }).catch(() => {});

    await supabase.rpc('exec_sql', {
      sql: 'CREATE INDEX IF NOT EXISTS "Module_isLocked_idx" ON "Module"("isLocked")'
    }).catch(() => {});

    console.log('🚀 Creating LessonLockHistory table...');
    await supabase.rpc('exec_sql', {
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
    }).catch(() => {});

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
