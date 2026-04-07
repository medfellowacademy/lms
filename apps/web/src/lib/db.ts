/**
 * Database layer — uses Supabase PostgreSQL.
 * Provides a Prisma-like API for database operations.
 */

import { SupabaseClient } from '@supabase/supabase-js';

// Helper to create model methods
function createModel(tableName: string, getClient: () => Promise<SupabaseClient>) {
  return {
    findMany: async (options?: any) => {
      const supabase = await getClient();
      let query = supabase.from(tableName).select(options?.select || '*');
      
      if (options?.where) {
        Object.entries(options.where).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      if (options?.orderBy) {
        const orderKey = Object.keys(options.orderBy)[0];
        const orderDir = options.orderBy[orderKey] === 'desc' ? false : true;
        query = query.order(orderKey, { ascending: orderDir });
      }
      if (options?.take) query = query.limit(options.take);
      if (options?.skip) query = query.range(options.skip, options.skip + (options.take || 10) - 1);
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    
    findUnique: async (options: any) => {
      const supabase = await getClient();
      const whereKey = Object.keys(options.where)[0];
      const { data, error } = await supabase
        .from(tableName)
        .select(options?.select || '*')
        .eq(whereKey, options.where[whereKey])
        .single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return data;
    },
    
    findFirst: async (options?: any) => {
      const supabase = await getClient();
      let query = supabase.from(tableName).select(options?.select || '*').limit(1);
      
      if (options?.where) {
        Object.entries(options.where).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      if (options?.orderBy) {
        const orderKey = Object.keys(options.orderBy)[0];
        const orderDir = options.orderBy[orderKey] === 'desc' ? false : true;
        query = query.order(orderKey, { ascending: orderDir });
      }
      
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return data;
    },
    
    create: async (options: any) => {
      const supabase = await getClient();
      const { data, error } = await supabase
        .from(tableName)
        .insert(options.data)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    
    createMany: async (options: any) => {
      const supabase = await getClient();
      const { data, error } = await supabase
        .from(tableName)
        .insert(options.data)
        .select();
      if (error) throw error;
      return { count: data?.length || 0 };
    },
    
    update: async (options: any) => {
      const supabase = await getClient();
      const whereKey = Object.keys(options.where)[0];
      const { data, error} = await supabase
        .from(tableName)
        .update(options.data)
        .eq(whereKey, options.where[whereKey])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    
    updateMany: async (options: any) => {
      const supabase = await getClient();
      let query = supabase.from(tableName).update(options.data);
      
      if (options?.where) {
        Object.entries(options.where).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            // Handle comparison operators like { gt: value }
            const operator = Object.keys(value)[0];
            const opValue = (value as any)[operator];
            if (operator === 'gt') query = query.gt(key, opValue);
            else if (operator === 'lt') query = query.lt(key, opValue);
            else if (operator === 'gte') query = query.gte(key, opValue);
            else if (operator === 'lte') query = query.lte(key, opValue);
            else query = query.eq(key, value);
          } else {
            query = query.eq(key, value);
          }
        });
      }
      
      const { data, error } = await query.select();
      if (error) throw error;
      return { count: data?.length || 0 };
    },
    
    delete: async (options: any) => {
      const supabase = await getClient();
      const whereKey = Object.keys(options.where)[0];
      const { data, error } = await supabase
        .from(tableName)
        .delete()
        .eq(whereKey, options.where[whereKey])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    
    deleteMany: async (options: any) => {
      const supabase = await getClient();
      let query = supabase.from(tableName).delete().select();
      
      if (options?.where) {
        Object.entries(options.where).forEach(([key, value]: [string, any]) => {
          if (typeof value === 'object' && value !== null) {
            if ('in' in value) {
              query = query.in(key, value.in);
            } else if ('gt' in value) {
              query = query.gt(key, value.gt);
            } else if ('lt' in value) {
              query = query.lt(key, value.lt);
            } else if ('gte' in value) {
              query = query.gte(key, value.gte);
            } else if ('lte' in value) {
              query = query.lte(key, value.lte);
            }
          } else {
            query = query.eq(key, value);
          }
        });
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return { count: data?.length || 0 };
    },
    
    count: async (options?: any) => {
      const supabase = await getClient();
      let query = supabase.from(tableName).select('*', { count: 'exact', head: true });
      
      if (options?.where) {
        Object.entries(options.where).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
    
    upsert: async (options: any) => {
      const supabase = await getClient();
      const { data, error } = await supabase
        .from(tableName)
        .upsert(options.create, { onConflict: options.where ? Object.keys(options.where).join(',') : 'id' })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  };
}

// Create database client factory
async function createDbClient() {
  // Use admin client with service role to bypass RLS
  // Since we're using custom session auth, not Supabase Auth
  const { createAdminClient } = await import('./supabase/server');
  return createAdminClient();
}

// Create the db object with all models
export const db = {
  user: createModel('User', createDbClient),
  course: createModel('Course', createDbClient),
  module: createModel('Module', createDbClient),
  lesson: createModel('Lesson', createDbClient),
  enrollment: createModel('Enrollment', createDbClient),
  lessonProgress: createModel('LessonProgress', createDbClient),
  lessonLock: createModel('LessonLock', createDbClient),
  certificate: createModel('Certificate', createDbClient),
  achievement: createModel('Achievement', createDbClient),
  userAchievement: createModel('UserAchievement', createDbClient),
  notification: createModel('Notification', createDbClient),
  aIConversation: createModel('AIConversation', createDbClient),
  aIMessage: createModel('AIMessage', createDbClient),
  analyticsEvent: createModel('AnalyticsEvent', createDbClient),
  proposal: createModel('Proposal', createDbClient),
  vote: createModel('Vote', createDbClient),
  vRSession: createModel('VRSession', createDbClient),
  vRScenario: createModel('VRScenario', createDbClient),
  quiz: createModel('Quiz', createDbClient),
  question: createModel('Question', createDbClient),
  resource: createModel('Resource', createDbClient),
};

// Export as both db and prisma for backward compatibility
export const prisma = db;

