'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

// ==================== ADMIN STATS ====================

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => apiClient.get('/admin/stats'),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

// ==================== ADMIN USERS ====================

interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useAdminUsers(params: UsersQueryParams = {}) {
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();

  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => apiClient.get(`/admin/users?${queryString}`),
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => apiClient.get(`/admin/users/${id}`),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.post('/admin/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useUpdateUserAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.patch(`/admin/users/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

// ==================== ADMIN COURSES ====================

interface CoursesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useAdminCourses(params: CoursesQueryParams = {}) {
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();

  return useQuery({
    queryKey: ['admin', 'courses', params],
    queryFn: () => apiClient.get(`/admin/courses?${queryString}`),
  });
}

export function useAdminCourse(id: string) {
  return useQuery({
    queryKey: ['admin', 'courses', id],
    queryFn: () => apiClient.get(`/admin/courses/${id}`),
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.post('/admin/courses', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.patch(`/admin/courses/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses', id] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/courses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

// ==================== ADMIN ACHIEVEMENTS ====================

export function useAdminAchievements(params: { category?: string; rarity?: string } = {}) {
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();

  return useQuery({
    queryKey: ['admin', 'achievements', params],
    queryFn: () => apiClient.get(`/admin/achievements?${queryString}`),
  });
}

export function useCreateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.post('/admin/achievements', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'achievements'] });
    },
  });
}

// ==================== ADMIN VR SCENARIOS ====================

export function useAdminVRScenarios() {
  return useQuery({
    queryKey: ['admin', 'vr-scenarios'],
    queryFn: () => apiClient.get('/admin/vr-scenarios'),
  });
}

export function useCreateVRScenario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.post('/admin/vr-scenarios', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'vr-scenarios'] });
    },
  });
}

// ==================== ADMIN CERTIFICATES ====================

export function useAdminCertificates(params: { page?: number; search?: string } = {}) {
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();

  return useQuery({
    queryKey: ['admin', 'certificates', params],
    queryFn: () => apiClient.get(`/admin/certificates?${queryString}`),
  });
}

// ==================== ADMIN PROPOSALS ====================

export function useAdminProposals(params: { status?: string } = {}) {
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();

  return useQuery({
    queryKey: ['admin', 'proposals', params],
    queryFn: () => apiClient.get(`/admin/proposals?${queryString}`),
  });
}

// ==================== ADMIN ANALYTICS ====================

export function useAdminAnalytics(timeRange: string = '30d') {
  return useQuery({
    queryKey: ['admin', 'analytics', timeRange],
    queryFn: () => apiClient.get(`/admin/analytics?range=${timeRange}`),
  });
}

// ==================== ADMIN ACTIVITY ====================

export function useAdminActivity(limit: number = 50) {
  return useQuery({
    queryKey: ['admin', 'activity', limit],
    queryFn: () => apiClient.get(`/admin/activity?limit=${limit}`),
    refetchInterval: 10000, // Refresh every 10 seconds
  });
}

// ==================== ADMIN AI MONITORING ====================

export function useAdminAIStats() {
  return useQuery({
    queryKey: ['admin', 'ai', 'stats'],
    queryFn: () => apiClient.get('/admin/ai/stats'),
    refetchInterval: 30000,
  });
}

export function useAdminAIConversations(limit: number = 20) {
  return useQuery({
    queryKey: ['admin', 'ai', 'conversations', limit],
    queryFn: () => apiClient.get(`/admin/ai/conversations?limit=${limit}`),
    refetchInterval: 15000,
  });
}

// ==================== ADMIN SYSTEM HEALTH ====================

export function useAdminSystemHealth() {
  return useQuery({
    queryKey: ['admin', 'system', 'health'],
    queryFn: () => apiClient.get('/admin/system/health'),
    refetchInterval: 60000, // Refresh every minute
  });
}

// ==================== ADMIN SETTINGS ====================

export function useAdminSettings() {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => apiClient.get('/admin/settings'),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.patch('/admin/settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
    },
  });
}

