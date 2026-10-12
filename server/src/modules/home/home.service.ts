import { prisma } from '../../lib/prisma.js';
import { getLevelInfo } from '../gamification/level.js';
import { getTopicsWithProgress } from '../learn/learn.service.js';

export const getHomeDashboard = async (userId: string) => {
  const [user, topics, totalBadgesCount, recentUserBadges, totalUserBadgesCount] =
    await Promise.all([
      prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          xp: true,
          streak: true,
          longestStreak: true,
          cashBalance: true,
        },
      }),
      getTopicsWithProgress(userId),
      prisma.badge.count(),
      prisma.userBadge.findMany({
        where: { userId },
        orderBy: { earnedAt: 'desc' },
        take: 4,
        include: { badge: true },
      }),
      prisma.userBadge.count({
        where: { userId },
      }),
    ]);

  // Determine continueLesson: the first available incomplete lesson across topics
  let continueLesson: {
    id: string;
    slug: string;
    title: string;
    order: number;
    topicSlug: string;
    topicTitle: string;
  } | null = null;

  for (const topic of topics) {
    if (topic.nextLesson) {
      continueLesson = {
        id: topic.nextLesson.id,
        slug: topic.nextLesson.slug,
        title: topic.nextLesson.title,
        order: topic.nextLesson.order,
        topicSlug: topic.slug,
        topicTitle: topic.title,
      };
      break;
    }
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      xp: user.xp,
      levelInfo: getLevelInfo(user.xp),
      streak: user.streak,
      longestStreak: user.longestStreak,
      cashBalance: user.cashBalance,
    },
    continueLesson,
    topics,
    badges: {
      earnedCount: totalUserBadgesCount,
      totalCount: totalBadgesCount,
      recent: recentUserBadges.map((ub) => ({
        id: ub.badge.id,
        key: ub.badge.key,
        name: ub.badge.name,
        description: ub.badge.description,
        icon: ub.badge.icon,
        rarity: ub.badge.rarity,
        category: ub.badge.category,
        requirementText: ub.badge.requirementText,
        earnedAt: ub.earnedAt.toISOString(),
      })),
    },
    latestNews: null,
    portfolioValue: null,
  };
};
