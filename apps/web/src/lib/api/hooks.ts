'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, streamChat } from './client';
import type {
  CourseListParams,
  UpdateUserData,
  UpdateProgressData,
  ChatData,
  CreateProposalData,
  ProposalListParams,
} from './client';

// Query Keys
export const queryKeys = {
  user: ['user'] as const,
  courses: (params?: CourseListParams) => ['courses', params] as const,
  enrolledCourses: (params?: CourseListParams) => ['courses', 'enrolled', params] as const,
  course: (id: string) => ['course', id] as const,
  progress: ['progress'] as const,
  achievements: ['achievements'] as const,
  certificates: ['certificates'] as const,
  conversations: ['ai', 'conversations'] as const,
  conversation: (id: string) => ['ai', 'conversation', id] as const,
  proposals: (params?: ProposalListParams) => ['governance', 'proposals', params] as const,
};

// ==================== USER HOOKS ====================

export function useUser() {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: () => api.users.me(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserData) => api.users.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
}

// ==================== COURSE HOOKS ====================

export function useCourses(params?: CourseListParams) {
  return useQuery({
    queryKey: queryKeys.courses(params),
    queryFn: () => api.courses.list(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useEnrolledCourses(params?: CourseListParams) {
  return useQuery({
    queryKey: queryKeys.enrolledCourses(params),
    queryFn: async () => {
      const response = await fetch('/api/courses/enrolled?' + new URLSearchParams(params as any));
      if (!response.ok) throw new Error('Failed to fetch enrolled courses');
      const data = await response.json();
      return data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: queryKeys.course(id),
    queryFn: () => api.courses.get(id),
    enabled: !!id,
  });
}

export function useEnrollCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => api.courses.enroll(courseId),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.course(courseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.enrolledCourses() });
      queryClient.invalidateQueries({ queryKey: queryKeys.progress });
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
}

export function useUnenrollCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => api.courses.unenroll(courseId),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.course(courseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.enrolledCourses() });
      queryClient.invalidateQueries({ queryKey: queryKeys.progress });
    },
  });
}

// ==================== PROGRESS HOOKS ====================

export function useProgress() {
  return useQuery({
    queryKey: queryKeys.progress,
    queryFn: () => api.progress.get(),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProgressData) => api.progress.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.progress });
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
}

// ==================== ACHIEVEMENT HOOKS ====================

export function useAchievements() {
  return useQuery({
    queryKey: queryKeys.achievements,
    queryFn: () => api.achievements.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ==================== CERTIFICATE HOOKS ====================

export function useCertificates() {
  return useQuery({
    queryKey: queryKeys.certificates,
    queryFn: () => api.certificates.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useIssueCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, examScore }: { courseId: string; examScore?: number }) =>
      api.certificates.issue(courseId, examScore),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certificates });
    },
  });
}

// ==================== AI CHAT HOOKS ====================

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.conversations,
    queryFn: () => api.ai.getConversations(),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: queryKeys.conversation(id),
    queryFn: () => api.ai.getConversation(id),
    enabled: !!id,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChatData) => api.ai.chat(data),
    onSuccess: (result) => {
      if (result.conversationId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.conversation(result.conversationId) 
        });
        queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
      }
    },
  });
}

// Hook for streaming chat
export function useStreamChat() {
  return {
    streamChat: async function* (data: ChatData) {
      yield* streamChat(data);
    },
  };
}

// ==================== GOVERNANCE HOOKS ====================

export function useProposals(params?: ProposalListParams) {
  return useQuery({
    queryKey: queryKeys.proposals(params),
    queryFn: () => api.governance.proposals.list(params),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useCreateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProposalData) => api.governance.proposals.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance', 'proposals'] });
    },
  });
}

export function useVoteOnProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ proposalId, vote }: { proposalId: string; vote: 'FOR' | 'AGAINST' | 'ABSTAIN' }) =>
      api.governance.proposals.vote(proposalId, vote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance', 'proposals'] });
    },
  });
}

