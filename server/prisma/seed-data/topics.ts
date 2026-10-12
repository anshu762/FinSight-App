export interface TopicSeed {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
}

export const topicsSeedData: TopicSeed[] = [
  {
    slug: 'stocks',
    title: 'Stock Market',
    description: 'Master how companies issue shares, how stock exchanges work, and why market prices fluctuate.',
    icon: '📈',
    color: '#3B82F6',
    order: 1,
  },
  {
    slug: 'investing',
    title: 'Investing',
    description: 'Learn how to defeat inflation, harness the power of compounding, and build long-term wealth.',
    icon: '🌱',
    color: '#10B981',
    order: 2,
  },
  {
    slug: 'taxes',
    title: 'Taxes & Salaries',
    description: 'Decode your pay slip, calculate gross vs net in-hand salary, and navigate direct and indirect taxes.',
    icon: '💰',
    color: '#F59E0B',
    order: 3,
  },
  {
    slug: 'crypto',
    title: 'Crypto & Digital Assets',
    description: 'Understand blockchain fundamentals, digital tokens, market volatility, and stay safe from scams.',
    icon: '₿',
    color: '#8B5CF6',
    order: 4,
  },
];
