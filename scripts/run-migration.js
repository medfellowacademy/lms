const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DIRECT_URL || 'postgresql://postgres.kwsykhgphxkyjkfjbmfk:Medfellow@321@aws-0-us-east-1.pooler.supabase.com:5432/postgres',
  });

  try {
    console.log('🔌 Connecting to database...');
    
    const sqlPath = path.join(__dirname, '..', 'database', 'supabase', '005_add_lesson_locks_and_presentations.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('🚀 Running migration: 005_add_lesson_locks_and_presentations.sql');
    
    await pool.query(sql);
    
    console.log('✅ Migration completed successfully!');
    
    // Check the results
    const result = await pool.query('SELECT COUNT(*) as total FROM "Lesson"');
    console.log(`📊 Total lessons in database: ${result.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
