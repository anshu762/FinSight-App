import { type AgeGroup } from '../api/types';
import { type Ionicons } from '@expo/vector-icons';

export interface AgeGroupDefinition {
  key: AgeGroup;
  title: string;
  ageRange: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  emoji: string;
  color: string;
  bgSoft: string;
}

export const AGE_GROUP_DEFINITIONS: AgeGroupDefinition[] = [
  {
    key: 'TEEN_BEGINNER',
    title: 'Teen Beginner',
    ageRange: 'Ages 13–15',
    description: 'Master money basics, pocket money saving, smart habits, and budgeting.',
    icon: 'wallet-outline',
    emoji: '🌱',
    color: '#3B82F6',
    bgSoft: '#EFF6FF',
  },
  {
    key: 'TEEN_ADVANCED',
    title: 'Teen Advanced',
    ageRange: 'Ages 16–18',
    description: 'Learn stock market fundamentals, compound interest, banking, and digital payments.',
    icon: 'trending-up-outline',
    emoji: '📈',
    color: '#10B981',
    bgSoft: '#ECFDF5',
  },
  {
    key: 'YOUNG_ADULT',
    title: 'Young Adult',
    ageRange: 'Ages 19–21',
    description: 'College money management, mutual funds, ETFs, credit scores, and side hustles.',
    icon: 'school-outline',
    emoji: '🚀',
    color: '#F59E0B',
    bgSoft: '#FFFBEB',
  },
  {
    key: 'YOUNG_PROFESSIONAL',
    title: 'Young Professional',
    ageRange: 'Ages 22–25',
    description: 'Salary budgeting, income tax slabs, portfolio asset allocation, and wealth creation.',
    icon: 'briefcase-outline',
    emoji: '💼',
    color: '#8B5CF6',
    bgSoft: '#F5F3FF',
  },
];


export interface AgeGroupItem {
  id: AgeGroup;
  title: string;
  age: string;
  desc: string;
  emoji: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgSoft: string;
}

export const AGE_GROUPS: AgeGroupItem[] = AGE_GROUP_DEFINITIONS.map((d) => ({
  id: d.key,
  title: d.title,
  age: d.ageRange,
  desc: d.description,
  emoji: d.emoji,
  icon: d.icon,
  color: d.color,
  bgSoft: d.bgSoft,
}));

