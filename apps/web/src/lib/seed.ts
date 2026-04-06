import { hashPassword } from './store';
import { db } from './db';

// Seed function for initial data setup
export async function seedIfNeeded(): Promise<void> {
  if (typeof window === 'undefined') {
    // Server-side only
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
        role: 'admin',
        isVerified: true,
        avatar: null,
      };
      
      await db.user.create({ data: adminUser });
      console.log('[Seed] ✅ Admin account created successfully!');
      console.log('[Seed] 📧 Email: admin@medfellow.academy');
      console.log('[Seed] 🔑 Password: MedFellow@Admin2026');
      console.log('[Seed] ⚠️  IMPORTANT: Change this password after first login!');
    } else {
      console.log(`[Seed] Users already exist (${existingUsers} users found)`);
    }
  }
}
