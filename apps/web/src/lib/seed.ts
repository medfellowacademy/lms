import { store, hashPassword } from './store';

// Seed function for initial data setup
export function seedIfNeeded(): void {
  if (typeof window === 'undefined') {
    // Server-side only
    console.log('[Seed] Checking if seeding is needed...');
    
    // Check if users exist
    const existingUsers = store.user.count();
    
    if (existingUsers === 0) {
      console.log('[Seed] No users found, creating demo accounts...');
      
      // Create demo users
      const demoUsers = [
        {
          email: 'admin@example.com',
          passwordHash: hashPassword('demo123'),
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          isVerified: true,
          avatar: null,
        },
        {
          email: 'instructor@medfellow.academy',
          passwordHash: hashPassword('instructor123'),
          firstName: 'Dr. Sarah',
          lastName: 'Johnson',
          role: 'instructor',
          isVerified: true,
          avatar: null,
        },
        {
          email: 'student@medfellow.academy',
          passwordHash: hashPassword('student123'),
          firstName: 'John',
          lastName: 'Doe',
          role: 'student',
          isVerified: true,
          avatar: null,
        },
      ];
      
      demoUsers.forEach((userData) => {
        const user = store.user.create({ data: userData });
        console.log(`[Seed] Created user: ${user.email}`);
      });
      
      console.log('[Seed] Demo accounts created successfully!');
    } else {
      console.log(`[Seed] Users already exist (${existingUsers} users found)`);
    }
  }
}
