import { Ionicons } from '@expo/vector-icons';
import { type NewsCategory } from '../api/types';

/**
 * Converts a date or ISO string into a human-readable relative time string.
 * Example outputs: "Just now", "15 mins ago", "2 hours ago", "Yesterday", "3 days ago"
 */
export const formatRelativeTime = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) {
    return 'Just now';
  }

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'Just now';
  }
  if (diffMins < 60) {
    return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });
};

export interface CategoryTheme {
  label: string;
  emoji: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgLight: string;
  borderColor: string;
  textColor: string;
}

export const getCategoryTheme = (category: NewsCategory | string): CategoryTheme => {
  switch (category) {
    case 'STOCK_MARKET':
      return {
        label: 'Stocks',
        emoji: '📈',
        icon: 'trending-up-outline',
        color: '#3B82F6',
        bgLight: '#EFF6FF',
        borderColor: '#BFDBFE',
        textColor: '#1D4ED8',
      };
    case 'INVESTING':
      return {
        label: 'Investing',
        emoji: '🌱',
        icon: 'leaf-outline',
        color: '#10B981',
        bgLight: '#ECFDF5',
        borderColor: '#A7F3D0',
        textColor: '#047857',
      };
    case 'TAXES':
      return {
        label: 'Taxes',
        emoji: '🧾',
        icon: 'receipt-outline',
        color: '#F59E0B',
        bgLight: '#FFFBEB',
        borderColor: '#FDE68A',
        textColor: '#B45309',
      };
    case 'CRYPTO':
      return {
        label: 'Crypto',
        emoji: '🪙',
        icon: 'swap-horizontal-outline',
        color: '#8B5CF6',
        bgLight: '#F5F3FF',
        borderColor: '#DDD6FE',
        textColor: '#6D28D9',
      };
    default:
      return {
        label: 'General',
        emoji: '📰',
        icon: 'newspaper-outline',
        color: '#4F46E5',
        bgLight: '#EEF2FF',
        borderColor: '#C7D2FE',
        textColor: '#4338CA',
      };
  }
};
