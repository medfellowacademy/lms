import { hashPassword } from './store';
import { db } from './db';

// Seed function for initial data setup
export async function seedIfNeeded(): Promise<void> {
  if (typeof window === 'undefined') {
    // Server-side only
    try {
      console.log('[Seed] Checking if seeding is needed...');
      
      // Check if admin user exists
      const existingUsers = await db.user.count();
      
      if (existingUsers === 0) {
        console.log('[Seed] No users found, creating initial admin account...');
        
        // Create ONLY the admin account
        // All other users (students, instructors) must be created via admin panel
        const adminUser = {
          email: 'admin@medfellow.academy',
          passwordHash: hashPassword('MedFellow@Admin2026'),
          firstName: 'Platform',
          lastName: 'Administrator',
          role: 'ADMIN',
          isVerified: true,
          isActive: true,
          avatar: null,
          bio: '',
          level: 1,
          xp: 0,
          rank: 'Administrator',
          streak: 0,
        };
        
        await db.user.create({ data: adminUser });
        console.log('[Seed] ✅ Admin account created successfully!');
        console.log('[Seed] 📧 Email: admin@medfellow.academy');
        console.log('[Seed] 🔑 Password: MedFellow@Admin2026');
        console.log('[Seed] ⚠️  IMPORTANT: Change this password after first login!');
      } else {
        console.log(`[Seed] Users already exist (${existingUsers} users found)`);
      }
    } catch (error) {
      console.error('[Seed] ⚠️  Database not ready or tables not created:', error);
      console.error('[Seed] Please run the SQL setup script in Supabase dashboard first!');
      console.error('[Seed] See: database/supabase/001_setup_complete.sql');
    }
  }
}
