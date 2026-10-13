import { NewsCategory } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../lib/api-error.js';
import { awardXp } from '../gamification/xp.service.js';
import { evaluateBadges, type EarnedBadgeInfo } from '../gamification/badge.service.js';
import {
  getIstDayRange,
  resolveRelatedLesson,
  type RelatedLessonPreview,
} from './news.helpers.js';

export { type RelatedLessonPreview };

export const getNewsArticles = async (params: {
  userId: string;
  category?: string;
  cursor?: string;
  limit?: number;
}) => {
  const { userId, category, cursor, limit = 10 } = params;
  const pageLimit = Math.min(Math.max(limit, 1), 50);

  const filterCategory =
    category && category !== 'ALL' && Object.values(NewsCategory).includes(category as NewsCategory)
      ? (category as NewsCategory)
      : undefined;

  const rawArticles = await prisma.newsArticle.findMany({
    where: filterCategory ? { category: filterCategory } : undefined,
    orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
    take: pageLimit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      slug: true,
      category: true,
      title: true,
      summary: true,
      readMinutes: true,
      publishedAt: true,
    },
  });

  const hasMore = rawArticles.length > pageLimit;
  const articles = hasMore ? rawArticles.slice(0, pageLimit) : rawArticles;
  const nextCursor = hasMore && articles.length > 0 ? articles[articles.length - 1].id : null;

  const readRecords = await prisma.newsRead.findMany({
    where: {
      userId,
      articleId: { in: articles.map((a) => a.id) },
    },
    select: { articleId: true },
  });
  const readSet = new Set(readRecords.map((r) => r.articleId));

  const items = articles.map((art) => ({
    ...art,
    publishedAt: art.publishedAt.toISOString(),
    isRead: readSet.has(art.id),
  }));

  return { articles: items, nextCursor, hasMore };
};

export const getNewsArticleById = async (userId: string, id: string) => {
  const article = await prisma.newsArticle.findUnique({
    where: { id },
  });

  if (!article) {
    throw ApiError.notFound('News article not found', 'ARTICLE_NOT_FOUND');
  }

  const readRecord = await prisma.newsRead.findUnique({
    where: { userId_articleId: { userId, articleId: id } },
  });

  const relatedLesson = await resolveRelatedLesson(userId, article.relatedLessonSlug);

  return {
    ...article,
    publishedAt: article.publishedAt.toISOString(),
    isRead: Boolean(readRecord),
    relatedLesson,
  };
};

export const markArticleAsRead = async (
  userId: string,
  articleId: string
): Promise<{ xpEarned: number; newBadges: EarnedBadgeInfo[]; alreadyRead: boolean }> => {
  const article = await prisma.newsArticle.findUnique({
    where: { id: articleId },
    select: { id: true },
  });

  if (!article) {
    throw ApiError.notFound('News article not found', 'ARTICLE_NOT_FOUND');
  }

  return await prisma.$transaction(async (tx) => {
    const existing = await tx.newsRead.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });

    if (existing) {
      return { xpEarned: 0, newBadges: [], alreadyRead: true };
    }

    await tx.newsRead.create({
      data: { userId, articleId },
    });

    const { start, end } = getIstDayRange();
    const readsToday = await tx.xpEvent.count({
      where: {
        userId,
        type: 'news_read',
        createdAt: { gte: start, lte: end },
      },
    });

    let xpEarned = 0;
    if (readsToday < 5) {
      const xpResult = await awardXp(tx, userId, 'news_read', 25, `news:${articleId}`);
      xpEarned = xpResult.xpAwarded;
    }

    const newBadges = await evaluateBadges(tx, userId);

    return { xpEarned, newBadges, alreadyRead: false };
  }, {
    maxWait: 10000,
    timeout: 20000,
  });
};
