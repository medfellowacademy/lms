// API Client for frontend-backend communication

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  // Build URL with query params
  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new APIError(response.status, response.statusText, error.error || error.message);
  }

  return response.json();
}

// Simple API client for direct calls (used by React Query hooks)
export const apiClient = {
  get: <T = any>(endpoint: string) => fetchAPI<T>(endpoint),
  post: <T = any>(endpoint: string, data?: any) =>
    fetchAPI<T>(endpoint, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  patch: <T = any>(endpoint: string, data?: any) =>
    fetchAPI<T>(endpoint, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
  put: <T = any>(endpoint: string, data?: any) =>
    fetchAPI<T>(endpoint, { method: 'PUT', body: data ? JSON.stringify(data) : undefined }),
  delete: <T = any>(endpoint: string) =>
    fetchAPI<T>(endpoint, { method: 'DELETE' }),
};

// API Methods
export const api = {
  // Users
  users: {
    me: () => fetchAPI<UserResponse>('/users/me'),
    update: (data: UpdateUserData) =>
      fetchAPI<UserResponse>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  // Courses
  courses: {
    list: (params?: CourseListParams) =>
      fetchAPI<CourseListResponse>('/courses', { params: params as any }),
    get: (id: string) => fetchAPI<CourseDetailResponse>(`/courses/${id}`),
    enroll: (courseId: string) =>
      fetchAPI<EnrollmentResponse>(`/courses/${courseId}/enroll`, {
        method: 'POST',
        body: JSON.stringify({}),
      }),
    unenroll: (courseId: string) =>
      fetchAPI<{ success: boolean }>(`/courses/${courseId}/enroll`, {
        method: 'DELETE',
      }),
  },

  // Progress
  progress: {
    get: () => fetchAPI<ProgressResponse>('/progress'),
    update: (data: UpdateProgressData) =>
      fetchAPI<ProgressUpdateResponse>('/progress', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Achievements
  achievements: {
    list: () => fetchAPI<AchievementsResponse>('/achievements'),
  },

  // Certificates
  certificates: {
    list: () => fetchAPI<CertificatesResponse>('/certificates'),
    issue: (courseId: string, examScore?: number) =>
      fetchAPI<CertificateResponse>('/certificates', {
        method: 'POST',
        body: JSON.stringify({ courseId, examScore }),
      }),
  },

  // AI Chat
  ai: {
    getConversations: () => fetchAPI<ConversationsResponse>('/ai/chat'),
    getConversation: (id: string) =>
      fetchAPI<ConversationResponse>('/ai/chat', {
        params: { conversationId: id },
      }),
    chat: (data: ChatData) =>
      fetchAPI<ChatResponse>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ ...data, stream: false }),
      }),
    // For streaming, use the streamChat function below
  },

  // Governance
  governance: {
    proposals: {
      list: (params?: ProposalListParams) =>
        fetchAPI<ProposalsResponse>('/governance/proposals', { params: params as any }),
      create: (data: CreateProposalData) =>
        fetchAPI<ProposalResponse>('/governance/proposals', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      vote: (proposalId: string, vote: 'FOR' | 'AGAINST' | 'ABSTAIN') =>
        fetchAPI<VoteResponse>(`/governance/proposals/${proposalId}/vote`, {
          method: 'POST',
          body: JSON.stringify({ vote }),
        }),
    },
  },

  // Admin APIs
  admin: {
    stats: () => fetchAPI<any>('/admin/stats'),
    
    users: {
      list: (params?: any) => fetchAPI<any>('/admin/users', { params }),
      get: (id: string) => fetchAPI<any>(`/admin/users/${id}`),
      update: (id: string, data: any) =>
        fetchAPI<any>(`/admin/users/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
      delete: (id: string) => fetchAPI<any>(`/admin/users/${id}`, { method: 'DELETE' }),
    },

    courses: {
      list: (params?: any) => fetchAPI<any>('/admin/courses', { params }),
      get: (id: string) => fetchAPI<any>(`/admin/courses/${id}`),
      create: (data: any) =>
        fetchAPI<any>('/admin/courses', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      update: (id: string, data: any) =>
        fetchAPI<any>(`/admin/courses/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
      delete: (id: string) => fetchAPI<any>(`/admin/courses/${id}`, { method: 'DELETE' }),
      
      // Template & Import/Export
      fromTemplate: (templateId: string, data: any) =>
        fetchAPI<any>('/admin/courses/from-template', {
          method: 'POST',
          body: JSON.stringify({ templateId, ...data }),
        }),
      export: (params?: any) => fetch(`${API_BASE}/admin/courses/export?${new URLSearchParams(params)}`),
      import: (coursesData: any) =>
        fetchAPI<any>('/admin/courses/import', {
          method: 'POST',
          body: JSON.stringify({ courses: coursesData }),
        }),
    },

    achievements: {
      list: () => fetchAPI<any>('/admin/achievements'),
      create: (data: any) =>
        fetchAPI<any>('/admin/achievements', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      update: (id: string, data: any) =>
        fetchAPI<any>(`/admin/achievements/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
      delete: (id: string) =>
        fetchAPI<any>(`/admin/achievements/${id}`, {
          method: 'DELETE',
        }),
    },
  },

  // Upload
  upload: {
    file: async (file: File, bucket: string = 'images') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);

      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new APIError(response.status, response.statusText, error.error);
      }

      return response.json();
    },
    delete: (path: string, bucket: string = 'images') =>
      fetch(`${API_BASE}/upload?path=${path}&bucket=${bucket}`, {
        method: 'DELETE',
      }),
  },
};

// Streaming chat function
export async function* streamChat(data: ChatData): AsyncGenerator<string> {
  const response = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, stream: true }),
  });

  if (!response.ok) {
    throw new APIError(response.status, response.statusText, 'Stream error');
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No reader available');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.content) {
            yield data.content;
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
  }
}

// Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  medicalTitle?: string;
  currentRole?: string;
  specialty?: string;
  institution?: string;
  country?: string;
  yearsOfExperience?: number;
  level: number;
  xp: number;
  rank: string;
  streak: number;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  xpProgress: number;
  rank: string;
  rankTitle: string;
  streak: number;
  achievementsUnlocked: number;
  totalAchievements: number;
}

export interface UserResponse {
  user: User;
  stats: UserStats;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  medicalTitle?: string;
  currentRole?: string;
  specialty?: string;
  institution?: string;
  country?: string;
  yearsOfExperience?: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription?: string;
  thumbnail?: string;
  category: string;
  difficulty: string;
  duration: number;
  price: number;
  isFree: boolean;
  enrollmentCount: number;
  averageRating: number;
  status: string;
}

export interface CourseListParams {
  category?: string;
  difficulty?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface CourseListResponse {
  courses: Course[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CourseDetailResponse {
  course: Course & {
    modules: {
      id: string;
      title: string;
      lessons: {
        id: string;
        title: string;
        duration: number;
        type: string;
      }[];
    }[];
  };
  enrollment: Enrollment | null;
  progress: LessonProgress[];
}

export interface Enrollment {
  id: string;
  progress: number;
  status: string;
  enrolledAt: string;
}

export interface EnrollmentResponse {
  enrollment: Enrollment;
}

export interface LessonProgress {
  lessonId: string;
  progress: number;
  completedAt?: string;
}

export interface ProgressResponse {
  enrollments: (Enrollment & { course: Course })[];
  recentProgress: {
    lesson: { title: string; module: { course: { title: string } } };
  }[];
  stats: {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    totalWatchTime: number;
  };
}

export interface UpdateProgressData {
  lessonId: string;
  progress: number;
  watchTime?: number;
  lastPosition?: number;
  completed?: boolean;
}

export interface ProgressUpdateResponse {
  progress: LessonProgress;
  xpAwarded: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: string;
  category: string;
  xpReward: number;
  userProgress?: {
    progress: number;
    unlockedAt?: string;
  };
}

export interface AchievementsResponse {
  achievements: Record<string, Achievement[]>;
  totalUnlocked: number;
  totalAchievements: number;
}

export interface Certificate {
  id: string;
  title: string;
  description?: string;
  issuer: string;
  courseId?: string;
  examScore?: number;
  issuedAt: string;
  expiresAt?: string;
  verificationId: string;
  skills: string[];
}

export interface CertificatesResponse {
  certificates: Certificate[];
}

export interface CertificateResponse {
  certificate: Certificate;
}

export interface AIConversation {
  id: string;
  title?: string;
  mode: string;
  createdAt: string;
  updatedAt: string;
  _count?: { messages: number };
}

export interface AIMessage {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  createdAt: string;
}

export interface ConversationsResponse {
  conversations: AIConversation[];
}

export interface ConversationResponse {
  conversation: AIConversation & { messages: AIMessage[] };
}

export interface ChatData {
  message: string;
  conversationId?: string;
  mode?: string;
}

export interface ChatResponse {
  content: string;
  conversationId: string;
  tokensUsed?: number;
}

export interface Proposal {
  id: string;
  proposalId: string;
  title: string;
  description: string;
  category: string;
  status: string;
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  startDate: string;
  endDate: string;
  userVote?: string;
}

export interface ProposalListParams {
  status?: string;
  category?: string;
}

export interface ProposalsResponse {
  proposals: Proposal[];
}

export interface ProposalResponse {
  proposal: Proposal;
}

export interface CreateProposalData {
  title: string;
  description: string;
  category: string;
  endDate?: string;
}

export interface VoteResponse {
  success: boolean;
  message: string;
  votingPower: number;
}

export default api;

