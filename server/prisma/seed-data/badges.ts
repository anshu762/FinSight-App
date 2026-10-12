import { BadgeRarity } from '@prisma/client';

export interface BadgeSeed {
  key: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  category: string;
  requirementText: string;
}

export const badgesSeedData: BadgeSeed[] = [
  {
    key: 'first_steps',
    name: 'First Steps',
    description: 'Completed your very first financial literacy lesson.',
    icon: '🌱',
    rarity: BadgeRarity.COMMON,
    category: 'learn',
    requirementText: 'Complete your first lesson',
  },
  {
    key: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    description: 'Mastered 10 financial lessons across multiple topics.',
    icon: '📚',
    rarity: BadgeRarity.UNCOMMON,
    category: 'learn',
    requirementText: 'Complete at least 10 lessons',
  },
  {
    key: 'topic_master',
    name: 'Topic Master',
    description: 'Completed every single lesson in at least one financial topic.',
    icon: '🎓',
    rarity: BadgeRarity.UNCOMMON,
    category: 'learn',
    requirementText: 'Complete all lessons in any topic',
  },
  {
    key: 'speed_learner',
    name: 'Speed Learner',
    description: 'Completed 5 lessons in a single IST day.',
    icon: '⚡',
    rarity: BadgeRarity.RARE,
    category: 'learn',
    requirementText: 'Complete 5 lessons in one day',
  },
  {
    key: 'daily_visitor',
    name: 'Daily Visitor',
    description: 'Maintained a daily login streak of 7 consecutive days.',
    icon: '🔥',
    rarity: BadgeRarity.UNCOMMON,
    category: 'streak',
    requirementText: 'Reach a 7-day daily check-in streak',
  },
  {
    key: 'first_investment',
    name: 'First Investment',
    description: 'Executed your first virtual transaction in the portfolio simulator.',
    icon: '💼',
    rarity: BadgeRarity.COMMON,
    category: 'portfolio',
    requirementText: 'Execute your first trade in the simulator',
  },
  {
    key: 'portfolio_builder',
    name: 'Portfolio Builder',
    description: 'Expanded your portfolio to hold at least 5 distinct assets.',
    icon: '🏗️',
    rarity: BadgeRarity.UNCOMMON,
    category: 'portfolio',
    requirementText: 'Hold 5 or more distinct assets simultaneously',
  },
  {
    key: 'diversified_investor',
    name: 'Diversified Investor',
    description: 'Demonstrated asset allocation by holding a Stock, an ETF, and a Mutual Fund simultaneously.',
    icon: '🌐',
    rarity: BadgeRarity.RARE,
    category: 'portfolio',
    requirementText: 'Hold a Stock, ETF, and Mutual Fund simultaneously',
  },
  {
    key: 'crypto_pioneer',
    name: 'Crypto Pioneer',
    description: 'Completed your first digital token transaction in the virtual simulator.',
    icon: '🪙',
    rarity: BadgeRarity.UNCOMMON,
    category: 'portfolio',
    requirementText: 'Execute at least 1 crypto transaction',
  },
  {
    key: 'bull_market_winner',
    name: 'Bull Market Winner',
    description: 'Achieved an overall portfolio gain of 25% or greater.',
    icon: '🐂',
    rarity: BadgeRarity.LEGENDARY,
    category: 'portfolio',
    requirementText: 'Achieve a 25% or higher virtual portfolio gain',
  },
  {
    key: 'news_reader',
    name: 'News Reader',
    description: 'Read your first curated financial news breakdown.',
    icon: '📰',
    rarity: BadgeRarity.COMMON,
    category: 'news',
    requirementText: 'Read your first financial news article',
  },
  {
    key: 'informed_investor',
    name: 'Informed Investor',
    description: 'Read 50 curated financial news breakdowns to stay ahead of the markets.',
    icon: '🧐',
    rarity: BadgeRarity.RARE,
    category: 'news',
    requirementText: 'Read 50 financial news articles',
  },
];
