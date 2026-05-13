// Shared TypeScript types for TLCC Platform

export interface User {
  id: string;
  email: string;
  username: string;
  role: Role;
  avatarUrl?: string;
  phone?: string;
}

export type Role = 'ADMIN' | 'MODERATOR' | 'LEADER' | 'MEMBER' | 'GUEST';

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  imageUrl?: string;
  maxCapacity?: number;
  currentRegistrations: number;
}

export interface PrayerRequest {
  id: string;
  userId: string;
  content: string;
  category?: string;
  isPublic: boolean;
  prayCount: number;
  isAnswered: boolean;
  createdAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
