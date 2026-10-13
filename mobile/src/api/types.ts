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
  latestNews: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    readMinutes: number;
    category: NewsCategory;
    publishedAt: string;
  } | null;
  portfolioValue: number | null;
  portfolio: null;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface CardItem {
  title: string;
  body: string;
  emoji: string;
  keyTerms?: KeyTerm[];
}

export interface HookContent {
  emoji: string;
  title: string;
  question: string;
  subtitle?: string;
}

export interface ChoiceOption {
  label: string;
  outcome: string;
  isGood: boolean;
}

export interface ChoiceStep {
  prompt: string;
  options: ChoiceOption[];
  hint?: string;
}

export interface ChoiceScenarioSim {
  type: 'choice_scenario';
  title: string;
  intro: string;
  steps: ChoiceStep[];
}

export interface CalculatorInputConfig {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  prefix?: string;
  suffix?: string;
}

export interface CalculatorSim {
  type: 'calculator';
  title: string;
  intro: string;
  kind: 'compound_growth' | 'net_salary';
  inputs: CalculatorInputConfig[];
}

export type SimulationContent = ChoiceScenarioSim | CalculatorSim;

export type QuizType = 'mcq' | 'true_false' | 'fill_blank';

export interface QuizContent {
  type: QuizType;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonContent {
  hook: HookContent;
  cards: CardItem[];
  simulation: SimulationContent;
  quiz: QuizContent;
}

export interface LessonDetail {
  id: string;
  slug: string;
  topicId: string;
  order: number;
  title: string;
  content: LessonContent;
  status: 'completed' | 'available' | 'locked';
  isCompleted: boolean;
  completedAt: string | null;
  topic: {
    id: string;
    slug: string;
    title: string;
    color: string;
    icon: string;
    order: number;
  };
}

export interface CompleteLessonPayload {
  quizAttempts: number;
  hintsUsed: number;
}

export interface XpBreakdownItem {
  item: string;
  xp: number;
}

export interface CompleteLessonResponse {
  xpEarned: number;
  breakdown: XpBreakdownItem[];
  leveledUp: boolean;
  newLevel: number;
  levelInfo: LevelInfo;
  streak: number;
  newBadges: Array<{
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
  topicCompleted: boolean;
  nextLesson: { id: string; slug: string; title: string; order: number } | null;
  alreadyCompleted: boolean;
}

export type AssetType = 'STOCK' | 'ETF' | 'MUTUAL_FUND' | 'CRYPTO';
export type TransactionSide = 'BUY' | 'SELL';

export interface AssetItem {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  basePrice: number;
  volatility: number;
  minInvestment: number;
  allowFractional: boolean;
  currentPrice: number;
  dayChange: number;
  dayChangePct: number;
}

export interface PricePoint {
  timestamp: string;
  price: number;
}

export interface UserAssetHolding {
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  value: number;
  gain: number;
  gainPct: number;
}

export interface AssetDetailResponse {
  asset: AssetItem;
  series: PricePoint[];
  userHolding: UserAssetHolding | null;
}

export interface PortfolioHoldingItem {
  id: string;
  assetId: string;
  asset: {
    id: string;
    symbol: string;
    name: string;
    type: AssetType;
    allowFractional: boolean;
    minInvestment: number;
  };
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  value: number;
  gain: number;
  gainPct: number;
}

export interface AllocationItem {
  type: 'CASH' | AssetType;
  label: string;
  value: number;
  pct: number;
}

export interface PortfolioSummary {
  cash: number;
  holdingsValue: number;
  totalValue: number;
  totalReturn: number;
  totalReturnPct: number;
  dayChange: number;
  dayChangePct: number;
  bestPerformer: PortfolioHoldingItem | null;
  worstPerformer: PortfolioHoldingItem | null;
  allocation: AllocationItem[];
  holdings: PortfolioHoldingItem[];
}

export interface TradePayload {
  assetId: string;
  side: TransactionSide;
  quantity: number;
}

export interface TradeResult {
  trade: {
    id: string;
    side: TransactionSide;
    quantity: number;
    price: number;
    total: number;
    createdAt: string;
    asset: {
      id: string;
      symbol: string;
      name: string;
      type: AssetType;
    };
  };
  xpAwarded: number;
  newBadges: Array<{
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
  learningTip: string | null;
}

export interface TransactionItem {
  id: string;
  side: TransactionSide;
  quantity: number;
  price: number;
  total: number;
  createdAt: string;
  asset: {
    id: string;
    symbol: string;
    name: string;
    type: AssetType;
  };
}

export interface TransactionsResponse {
  transactions: TransactionItem[];
  nextCursor: string | null;
}

export type NewsCategory = 'STOCK_MARKET' | 'INVESTING' | 'TAXES' | 'CRYPTO';

export interface NewsArticleItem {
  id: string;
  slug: string;
  category: NewsCategory;
  title: string;
  summary: string;
  readMinutes: number;
  publishedAt: string;
  isRead: boolean;
}

export interface RelatedLessonInfo {
  id: string;
  slug: string;
  title: string;
  order: number;
  topicSlug: string;
  topicTitle: string;
  status: 'available' | 'locked' | 'completed';
  requiredLessonTitle: string | null;
  requiredLessonId: string | null;
}

export interface NewsArticleDetail {
  id: string;
  slug: string;
  category: NewsCategory;
  title: string;
  summary: string;
  whatHappened: string;
  whyItMatters: string[];
  keyTakeaway: string;
  imageUrl?: string | null;
  readMinutes: number;
  publishedAt: string;
  isRead: boolean;
  relatedLessonSlug?: string | null;
  relatedLesson: RelatedLessonInfo | null;
}

export interface NewsListResponse {
  articles: NewsArticleItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ReadNewsResult {
  xpEarned: number;
  newBadges: BadgeItem[];
  alreadyRead: boolean;
}
