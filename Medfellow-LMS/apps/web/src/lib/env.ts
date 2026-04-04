/**
 * Environment Variables Validation and Configuration
 * Validates all required environment variables at build time
 */

// Required environment variables
const requiredEnvVars = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL || process.env.DATABASE_URL,
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  
  // App URL
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

// Optional but recommended environment variables
const optionalEnvVars = {
  // AI Services
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  
  // Payment
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  
  // Email
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  
  // Analytics (optional)
  NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
} as const;

// Validate required environment variables
export function validateEnv() {
  const missingVars: string[] = [];
  
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missingVars.push(key);
    }
  });
  
  if (missingVars.length > 0) {
    throw new Error(
      `❌ Missing required environment variables:\n${missingVars.map((v) => `  - ${v}`).join('\n')}\n\nPlease check your .env.local file.`
    );
  }
  
  // Warn about missing optional variables
  const missingOptional: string[] = [];
  Object.entries(optionalEnvVars).forEach(([key, value]) => {
    if (!value) {
      missingOptional.push(key);
    }
  });
  
  if (missingOptional.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn(
      `⚠️  Missing optional environment variables:\n${missingOptional.map((v) => `  - ${v}`).join('\n')}\n\nSome features may be disabled.`
    );
  }
}

// Export validated environment variables with proper types
export const env = {
  // Database
  DATABASE_URL: requiredEnvVars.DATABASE_URL!,
  DIRECT_URL: requiredEnvVars.DIRECT_URL!,
  
  // Supabase
  SUPABASE_URL: requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: requiredEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_KEY: requiredEnvVars.SUPABASE_SERVICE_ROLE_KEY!,
  
  // App
  APP_URL: requiredEnvVars.NEXT_PUBLIC_APP_URL!,
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // AI Services
  OPENAI_API_KEY: optionalEnvVars.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: optionalEnvVars.ANTHROPIC_API_KEY,
  
  // Payment
  STRIPE_SECRET_KEY: optionalEnvVars.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: optionalEnvVars.STRIPE_WEBHOOK_SECRET,
  STRIPE_PUBLISHABLE_KEY: optionalEnvVars.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  
  // Email
  RESEND_API_KEY: optionalEnvVars.RESEND_API_KEY,
  
  // Analytics
  ANALYTICS_ID: optionalEnvVars.NEXT_PUBLIC_ANALYTICS_ID,
} as const;

// Feature flags based on available API keys
export const features = {
  aiTutor: Boolean(env.OPENAI_API_KEY || env.ANTHROPIC_API_KEY),
  payments: Boolean(env.STRIPE_SECRET_KEY),
  email: Boolean(env.RESEND_API_KEY),
  analytics: Boolean(env.ANALYTICS_ID),
} as const;

// Run validation on module load (only in server context)
if (typeof window === 'undefined') {
  try {
    validateEnv();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  }
}

export default env;

