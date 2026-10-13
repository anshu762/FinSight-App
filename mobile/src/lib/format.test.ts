import { formatRelativeTime, getCategoryTheme } from './format';

describe('formatRelativeTime', () => {
  it('returns "Just now" for dates within 60 seconds', () => {
    const now = new Date();
    expect(formatRelativeTime(now.toISOString())).toBe('Just now');
  });

  it('returns minutes ago for dates within 60 minutes', () => {
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
    expect(formatRelativeTime(tenMinsAgo.toISOString())).toBe('10 mins ago');

    const oneMinAgo = new Date(Date.now() - 60 * 1000);
    expect(formatRelativeTime(oneMinAgo.toISOString())).toBe('1 min ago');
  });

  it('returns hours ago for dates within 24 hours', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(formatRelativeTime(twoHoursAgo.toISOString())).toBe('2 hours ago');

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    expect(formatRelativeTime(oneHourAgo.toISOString())).toBe('1 hour ago');
  });

  it('returns "Yesterday" for dates between 24 and 48 hours ago', () => {
    const yesterday = new Date(Date.now() - 25 * 60 * 60 * 1000);
    expect(formatRelativeTime(yesterday.toISOString())).toBe('Yesterday');
  });

  it('returns days ago for dates within 7 days', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(threeDaysAgo.toISOString())).toBe('3 days ago');
  });
});

describe('getCategoryTheme', () => {
  it('returns correct theme colors for STOCK_MARKET', () => {
    const theme = getCategoryTheme('STOCK_MARKET');
    expect(theme.label).toBe('Stocks');
    expect(theme.emoji).toBe('📈');
    expect(theme.color).toBe('#3B82F6');
  });

  it('returns correct theme colors for INVESTING', () => {
    const theme = getCategoryTheme('INVESTING');
    expect(theme.label).toBe('Investing');
    expect(theme.emoji).toBe('🌱');
    expect(theme.color).toBe('#10B981');
  });

  it('returns correct theme colors for TAXES', () => {
    const theme = getCategoryTheme('TAXES');
    expect(theme.label).toBe('Taxes');
    expect(theme.emoji).toBe('🧾');
    expect(theme.color).toBe('#F59E0B');
  });

  it('returns correct theme colors for CRYPTO', () => {
    const theme = getCategoryTheme('CRYPTO');
    expect(theme.label).toBe('Crypto');
    expect(theme.emoji).toBe('🪙');
    expect(theme.color).toBe('#8B5CF6');
  });
});
