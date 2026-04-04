// Seed function for initial data setup
export function seedIfNeeded(): void {
  // This function can be used to seed initial data
  // Currently a no-op placeholder
  // In production, you might check if data exists and seed if needed
  
  if (typeof window === 'undefined') {
    // Server-side only
    console.log('[Seed] Checking if seeding is needed...');
    // Add your seeding logic here
  }
}
