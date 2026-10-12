export interface AppError {
  code: string;
  message: string;
  fields?: Record<string, string>;
  isNetwork: boolean;
  status?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

export type AgeGroup =
  | 'TEEN_BEGINNER'
  | 'TEEN_ADVANCED'
  | 'YOUNG_ADULT'
  | 'YOUNG_PROFESSIONAL';

export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  dob: string;
  ageGroup?: AgeGroup | null;
  xp: number;
  streak: number;
  longestStreak: number;
  lastActiveDate?: string | null;
  cashBalance: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface TopicSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  nextLesson: {
    id: string;
    slug: string;
    title: string;
    order: number;
  } | null;
}

export interface TopicLessonItem {
  id: string;
  slug: string;
  order: number;
  title: string;
  status: 'completed' | 'available' | 'locked';
  xpEarned: number;
}

export interface TopicDetailResponse {
  topic: {
    id: string;
    slug: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    order: number;
  };
  lessons: TopicLessonItem[];
}

export type BadgeRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'LEGENDARY';

export interface BadgeItem {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  category: string;
  requirementText: string;
  isEarned: boolean;
  earnedAt: string | null;
}

export interface CheckInReward {
  type: string;
  amount: number;
  xp: number;
  description: string;
}

export interface CheckInResponse {
  streak: number;
  longestStreak: number;
  alreadyCheckedIn: boolean;
  rewards: CheckInReward[];
  userStats: {
    xp: number;
    levelInfo: LevelInfo;
    streak: number;
    longestStreak: number;
  };
  user: {
    id: string;
    xp: number;
    levelInfo: LevelInfo;
  };
  newlyEarnedBadges: Array<{
    id: string;
    key: string;
    name: string;
    description: string;
    icon: string;
    rarity: BadgeRarity;
    category: string;
    requirementText: string;
    earnedAt: string;
  }>;
}

export interface HomeDashboard {
  user: {
    id: string;
    name: string;
    email: string;
    xp: number;
    streak: number;
    longestStreak: number;
    cashBalance: number;
    levelInfo: LevelInfo;
  };
  continueLesson: {
    id: string;
    slug: string;
    order: number;
    title: string;
    topicSlug?: string;
    topicTitle?: string;
    topic?: {
      slug: string;
      title: string;
      icon: string;
      color: string;
    };
  } | null;
  topics: TopicSummary[];
  badges: {
    earnedCount: number;
    totalCount: number;
    recent?: BadgeItem[];
    recentEarned?: BadgeItem[];
  };
  latestNews: null;
  portfolioValue: number | null;
  portfolio: null;
}
