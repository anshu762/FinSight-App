import { type PrismaClient } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import {
  evaluateLessonBadges,
  evaluatePortfolioAndNewsBadges,
  type UserBadgeContext,
} from './badge.evaluators.js';

type PrismaTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export interface EarnedBadgeInfo {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  category: string;
  requirementText: string;
  earnedAt: string;
}

export interface UserBadgeWithStatus extends Omit<EarnedBadgeInfo, 'earnedAt'> {
  isEarned: boolean;
  earnedAt: string | null;
}

export const evaluateBadges = async (
  tx: PrismaTransactionClient,
  userId: string
): Promise<EarnedBadgeInfo[]> => {
  const user = (await tx.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      lessonProgress: {
        include: {
          lesson: { select: { id: true, topicId: true } },
        },
      },
      holdings: { include: { asset: true } },
      transactions: { include: { asset: true } },
      newsReads: true,
      userBadges: { include: { badge: true } },
    },
  })) as UserBadgeContext & { userBadges: { badge: { key: string } }[] };

  const allBadges = await tx.badge.findMany();
  const existingBadgeKeys = new Set(user.userBadges.map((ub) => ub.badge.key));
  const isCandidate = (key: string) => !existingBadgeKeys.has(key);

  const topicsWithLessons = await tx.topic.findMany({
    include: { lessons: { select: { id: true } } },
  });
  const topicsSummary = topicsWithLessons.map((t) => ({
    id: t.id,
    lessonIds: t.lessons.map((l) => l.id),
  }));

  const lessonBadgeKeys = evaluateLessonBadges(user, isCandidate, topicsSummary);
  const otherBadgeKeys = evaluatePortfolioAndNewsBadges(user, isCandidate);
  const badgesToAward = [...lessonBadgeKeys, ...otherBadgeKeys];

  const newlyEarnedBadges: EarnedBadgeInfo[] = [];

  for (const badgeKey of badgesToAward) {
    const badgeDef = allBadges.find((b) => b.key === badgeKey);
    if (!badgeDef) continue;

    const userBadge = await tx.userBadge.upsert({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badgeDef.id,
        },
      },
      update: {},
      create: {
        userId,
        badgeId: badgeDef.id,
      },
      include: { badge: true },
    });

    newlyEarnedBadges.push({
      id: userBadge.badge.id,
      key: userBadge.badge.key,
      name: userBadge.badge.name,
      description: userBadge.badge.description,
      icon: userBadge.badge.icon,
      rarity: userBadge.badge.rarity,
      category: userBadge.badge.category,
      requirementText: userBadge.badge.requirementText,
      earnedAt: userBadge.earnedAt.toISOString(),
    });
  }

  return newlyEarnedBadges;
};

export const getAllBadgesForUser = async (userId: string): Promise<UserBadgeWithStatus[]> => {
  const [badges, userBadges] = await Promise.all([
    prisma.badge.findMany({ orderBy: [{ category: 'asc' }, { rarity: 'asc' }] }),
    prisma.userBadge.findMany({ where: { userId } }),
  ]);

  const earnedMap = new Map(userBadges.map((ub) => [ub.badgeId, ub.earnedAt.toISOString()]));

  return badges.map((badge) => ({
    id: badge.id,
    key: badge.key,
    name: badge.name,
    description: badge.description,
    icon: badge.icon,
    rarity: badge.rarity,
    category: badge.category,
    requirementText: badge.requirementText,
    isEarned: earnedMap.has(badge.id),
    earnedAt: earnedMap.get(badge.id) ?? null,
  }));
};
