export type UserRole = 'admin' | 'staff' | 'guardian' | 'member';

/*
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  features: string[];
}

export interface ClassSession {
  id: string;
  title: string;
  coach: string;
  discipline: 'MMA' | 'BJJ' | 'Muay Thai' | 'Boxing' | 'Wrestling' | 'Striking';
  startsAt: string;
  endsAt: string;
  capacity: number;
  booked: number;
  location: string;
  level: 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'active' | 'paused' | 'cancelled' | 'pending';
  planName: string;
  joinedAt: string;
  avatarUrl?: string;
  isMinor?: boolean;
}

export interface AttendanceRecord {
  id: string;
  memberName: string;
  sessionTitle: string;
  date: string;
  status: 'attended' | 'no_show' | 'booked' | 'cancelled';
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  sessionsToday: number;
  attendanceRate: number;
  revenueThisMonth: number;
  newMembersThisMonth: number;
}

export interface ProgressMetric {
  label: string;
  value: number;
  unit: string;
  change?: number;
}
*/