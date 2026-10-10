export const colors = {
  primary: {
    DEFAULT: '#4F46E5',
    dark: '#4338CA',
    soft: '#EEF2FF',
  },
  topic: {
    stocks: '#3B82F6',
    investing: '#10B981',
    taxes: '#F59E0B',
    crypto: '#8B5CF6',
  },
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  muted: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
} as const;

export type Colors = typeof colors;
