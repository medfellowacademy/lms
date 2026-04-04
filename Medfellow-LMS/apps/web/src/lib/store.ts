/**
 * JSON-file-based data store for local development.
 * Persists data to .data/ directory in the project root.
 * Drop-in replacement for Prisma - call store.users.findMany(), store.courses.create(), etc.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Data directory
const DATA_DIR = path.join(process.cwd(), '.data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readCollection<T>(name: string): T[] {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

function writeCollection<T>(name: string, data: T[]) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function generateId(): string {
  return crypto.randomUUID();
}

// Simple password hashing (bcrypt-like using pbkdf2)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const verify = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verify));
}

// Generic model operations
function createModel<T extends { id: string }>(collectionName: string) {
  return {
    findMany: (params?: any): T[] => {
      let items = readCollection<T>(collectionName);
      if (params?.where) {
        items = filterItems(items, params.where);
      }
      if (params?.orderBy) {
        items = sortItems(items, params.orderBy);
      }
      if (params?.skip) {
        items = items.slice(params.skip);
      }
      if (params?.take) {
        items = items.slice(0, params.take);
      }
      return items;
    },

    findUnique: (params: { where: any }): T | null => {
      const items = readCollection<T>(collectionName);
      return findItem(items, params.where) || null;
    },

    findFirst: (params?: { where?: any }): T | null => {
      const items = readCollection<T>(collectionName);
      if (!params?.where) return items[0] || null;
      return filterItems(items, params.where)[0] || null;
    },

    create: (params: { data: any }): T => {
      const items = readCollection<T>(collectionName);
      const newItem = {
        id: params.data.id || generateId(),
        ...params.data,
        createdAt: params.data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as T;
      items.push(newItem);
      writeCollection(collectionName, items);
      return newItem;
    },

    update: (params: { where: any; data: any }): T | null => {
      const items = readCollection<T>(collectionName);
      const index = items.findIndex((item) => matchWhere(item, params.where));
      if (index === -1) return null;
      
      // Handle increment operations
      const data = { ...params.data };
      for (const [key, value] of Object.entries(data)) {
        if (value && typeof value === 'object' && 'increment' in (value as any)) {
          (data as any)[key] = ((items[index] as any)[key] || 0) + (value as any).increment;
        }
      }
      
      items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
      writeCollection(collectionName, items);
      return items[index];
    },

    upsert: (params: { where: any; create: any; update: any }): T => {
      const items = readCollection<T>(collectionName);
      const index = items.findIndex((item) => matchWhere(item, params.where));
      if (index >= 0) {
        items[index] = { ...items[index], ...params.update, updatedAt: new Date().toISOString() };
        writeCollection(collectionName, items);
        return items[index];
      }
      const newItem = {
        id: params.create.id || generateId(),
        ...params.create,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as T;
      items.push(newItem);
      writeCollection(collectionName, items);
      return newItem;
    },

    delete: (params: { where: any }): T | null => {
      const items = readCollection<T>(collectionName);
      const index = items.findIndex((item) => matchWhere(item, params.where));
      if (index === -1) return null;
      const deleted = items.splice(index, 1)[0];
      writeCollection(collectionName, items);
      return deleted;
    },

    deleteMany: (params?: { where?: any }): { count: number } => {
      const items = readCollection<T>(collectionName);
      if (!params?.where) {
        writeCollection(collectionName, []);
        return { count: items.length };
      }
      const remaining = items.filter((item) => !matchWhere(item, params.where));
      writeCollection(collectionName, remaining);
      return { count: items.length - remaining.length };
    },

    count: (params?: { where?: any }): number => {
      const items = readCollection<T>(collectionName);
      if (!params?.where) return items.length;
      return filterItems(items, params.where).length;
    },

    updateMany: (params: { where?: any; data: any }): { count: number } => {
      const items = readCollection<T>(collectionName);
      let count = 0;
      const updated = items.map((item) => {
        if (!params.where || matchWhere(item, params.where)) {
          count++;
          return { ...item, ...params.data, updatedAt: new Date().toISOString() };
        }
        return item;
      });
      writeCollection(collectionName, updated);
      return { count };
    },
  };
}

// Filter items by where clause
function filterItems<T>(items: T[], where: any): T[] {
  return items.filter((item) => matchWhere(item, where));
}

function matchWhere(item: any, where: any): boolean {
  if (!where) return true;

  // Handle OR conditions
  if (where.OR) {
    return where.OR.some((clause: any) => matchWhere(item, clause));
  }

  // Handle AND conditions
  if (where.AND) {
    return where.AND.every((clause: any) => matchWhere(item, clause));
  }

  // Handle NOT conditions
  if (where.NOT) {
    return !matchWhere(item, where.NOT);
  }

  for (const [key, condition] of Object.entries(where)) {
    if (key === 'OR' || key === 'AND' || key === 'NOT') continue;

    // Handle compound keys like userId_courseId
    if (key.includes('_') && typeof condition === 'object' && condition !== null) {
      const parts = key.split('_');
      const allMatch = parts.every((part) => {
        return item[part] === (condition as any)[part];
      });
      if (!allMatch) return false;
      continue;
    }

    const itemValue = item[key];

    if (condition === null || condition === undefined) {
      if (typeof condition === 'undefined') continue;
      if (itemValue !== null && itemValue !== undefined) return false;
      continue;
    }

    if (typeof condition === 'object' && condition !== null && !Array.isArray(condition)) {
      // Handle operators
      const cond = condition as any;
      if ('contains' in cond) {
        const str = String(itemValue || '');
        const search = String(cond.contains);
        if (cond.mode === 'insensitive') {
          if (!str.toLowerCase().includes(search.toLowerCase())) return false;
        } else {
          if (!str.includes(search)) return false;
        }
        continue;
      }
      if ('in' in cond) {
        if (!cond.in.includes(itemValue)) return false;
        continue;
      }
      if ('not' in cond) {
        if (itemValue === cond.not) return false;
        continue;
      }
      if ('gte' in cond) {
        if (!(itemValue >= cond.gte)) return false;
        continue;
      }
      if ('lte' in cond) {
        if (!(itemValue <= cond.lte)) return false;
        continue;
      }
      if ('gt' in cond) {
        if (!(itemValue > cond.gt)) return false;
        continue;
      }
      if ('lt' in cond) {
        if (!(itemValue < cond.lt)) return false;
        continue;
      }
      // Nested object match
      if (!matchWhere(itemValue, cond)) return false;
      continue;
    }

    // Direct equality
    if (itemValue !== condition) return false;
  }

  return true;
}

// Sort items
function sortItems<T>(items: T[], orderBy: any): T[] {
  const sorted = [...items];
  // Normalize to array of {key: direction} objects
  const orderList: Array<{ key: string; direction: string }> = [];
  if (Array.isArray(orderBy)) {
    for (const o of orderBy) {
      const entries = Object.entries(o);
      if (entries.length > 0) {
        orderList.push({ key: entries[0][0], direction: entries[0][1] as string });
      }
    }
  } else if (typeof orderBy === 'object') {
    const entries = Object.entries(orderBy);
    if (entries.length > 0) {
      orderList.push({ key: entries[0][0], direction: entries[0][1] as string });
    }
  }
  if (orderList.length === 0) return sorted;

  sorted.sort((a: any, b: any) => {
    for (const { key, direction } of orderList) {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal === bVal) continue;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      const cmp = aVal < bVal ? -1 : 1;
      return direction === 'desc' ? -cmp : cmp;
    }
    return 0;
  });
  return sorted;
}

// Find single item
function findItem<T>(items: T[], where: any): T | undefined {
  return items.find((item) => matchWhere(item, where));
}

// Export the store - mirrors Prisma client API
export const store = {
  user: createModel('users'),
  course: createModel('courses'),
  module: createModel('modules'),
  lesson: createModel('lessons'),
  enrollment: createModel('enrollments'),
  lessonProgress: createModel('lesson_progress'),
  certificate: createModel('certificates'),
  achievement: createModel('achievements'),
  userAchievement: createModel('user_achievements'),
  notification: createModel('notifications'),
  resource: createModel('resources'),
  analyticsEvent: createModel('analytics_events'),
  aIConversation: createModel('ai_conversations'),
  aIMessage: createModel('ai_messages'),
  proposal: createModel('proposals'),
  vote: createModel('votes'),
  vRSession: createModel('vr_sessions'),
  quiz: createModel('quizzes'),
  question: createModel('questions'),
  assessment: createModel('assessments'),
  $connect: async () => {},
  $disconnect: async () => {},
};

export default store;
