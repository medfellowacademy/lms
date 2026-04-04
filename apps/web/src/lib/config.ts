// ===========================================
// MedFellow Academy - Configuration
// ===========================================

export const config = {
  // Application
  app: {
    name: 'MedFellow Academy',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },

  // Database
  database: {
    url: process.env.DATABASE_URL,
  },

  // Authentication
  auth: {
    secret: process.env.AUTH0_SECRET || process.env.JWT_SECRET,
    issuer: process.env.AUTH0_ISSUER_BASE_URL,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
  },

  // AI Services
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: process.env.ANTHROPIC_MODEL || 'claude-3-opus-20240229',
    },
  },

  // Storage
  storage: {
    provider: process.env.STORAGE_PROVIDER || 's3',
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
      bucket: process.env.AWS_S3_BUCKET,
    },
  },

  // Email
  email: {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM || 'noreply@medfellowacademy.com',
  },

  // Payments
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  },

  // Cache
  redis: {
    url: process.env.REDIS_URL,
  },

  // Feature flags
  features: {
    aiTutor: false,
    vrSurgery: false,
    socialNetwork: false,
    governance: false,
    research: false,
    analytics: true,
  },

  // Gamification
  gamification: {
    xpPerLesson: 10,
    xpPerQuiz: 50,
    xpPerCourse: 100,
    xpPerAchievement: 25,
    streakBonus: 1.5,
    ranks: [
      { name: 'Intern', minLevel: 1, maxLevel: 5 },
      { name: 'Resident', minLevel: 6, maxLevel: 15 },
      { name: 'Fellow', minLevel: 16, maxLevel: 30 },
      { name: 'Attending', minLevel: 31, maxLevel: 50 },
      { name: 'Specialist', minLevel: 51, maxLevel: 75 },
      { name: 'Expert', minLevel: 76, maxLevel: 99 },
      { name: 'Master', minLevel: 100, maxLevel: Infinity },
    ],
  },

  // Rate limiting
  rateLimit: {
    requests: parseInt(process.env.RATE_LIMIT_REQUESTS || '100'),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  },
};

// Helper to get rank from level
export function getRankFromLevel(level: number): string {
  const rank = config.gamification.ranks.find(
    (r) => level >= r.minLevel && level <= r.maxLevel
  );
  return rank?.name || 'Intern';
}

// Helper to calculate XP needed for next level
export function getXpForNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Helper to validate environment
export function validateEnv(): { valid: boolean; missing: string[] } {
  const required = ['DATABASE_URL'];
  const missing = required.filter((key) => !process.env[key]);
  return { valid: missing.length === 0, missing };
}

