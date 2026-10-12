import { type User, type LessonProgress, type Holding, type Transaction, type NewsRead, type Asset } from '@prisma/client';

export type UserBadgeContext = User & {
  lessonProgress: (LessonProgress & { lesson: { id: string; topicId: string } })[];
  holdings: (Holding & { asset: Asset })[];
  transactions: (Transaction & { asset: Asset })[];
  newsReads: NewsRead[];
};

export const evaluateLessonBadges = (
  user: UserBadgeContext,
  candidate: (key: string) => boolean,
  topicsWithLessonIds: { id: string; lessonIds: string[] }[]
): string[] => {
  const earned: string[] = [];

  // 1. first_steps
  if (candidate('first_steps') && user.lessonProgress.length >= 1) {
    earned.push('first_steps');
  }

  // 2. knowledge_seeker
  if (candidate('knowledge_seeker') && user.lessonProgress.length >= 10) {
    earned.push('knowledge_seeker');
  }

  // 3. topic_master
  if (candidate('topic_master')) {
    const completedLessonIds = new Set(user.lessonProgress.map((lp) => lp.lessonId));
    const hasMasteredAny = topicsWithLessonIds.some(
      (topic) => topic.lessonIds.length > 0 && topic.lessonIds.every((id) => completedLessonIds.has(id))
    );
    if (hasMasteredAny) {
      earned.push('topic_master');
    }
  }

  // 4. speed_learner
  if (candidate('speed_learner')) {
    const istToday = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
    }).format(new Date());

    const lessonsDoneTodayIst = user.lessonProgress.filter((lp) => {
      const lpDate = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
      }).format(new Date(lp.completedAt));
      return lpDate === istToday;
    });

    if (lessonsDoneTodayIst.length >= 5) {
      earned.push('speed_learner');
    }
  }

  return earned;
};

export const evaluatePortfolioAndNewsBadges = (
  user: UserBadgeContext,
  candidate: (key: string) => boolean
): string[] => {
  const earned: string[] = [];

  // 5. daily_visitor
  if (candidate('daily_visitor') && (user.streak >= 7 || user.longestStreak >= 7)) {
    earned.push('daily_visitor');
  }

  // 6. first_investment
  if (candidate('first_investment') && user.transactions.length >= 1) {
    earned.push('first_investment');
  }

  // 7. portfolio_builder
  if (candidate('portfolio_builder')) {
    const activeHoldings = user.holdings.filter((h) => h.quantity > 0);
    if (activeHoldings.length >= 5) {
      earned.push('portfolio_builder');
    }
  }

  // 8. diversified_investor
  if (candidate('diversified_investor')) {
    const active = user.holdings.filter((h) => h.quantity > 0);
    const hasStock = active.some((h) => h.asset.type === 'STOCK');
    const hasEtf = active.some((h) => h.asset.type === 'ETF');
    const hasMf = active.some((h) => h.asset.type === 'MUTUAL_FUND');
    if (hasStock && hasEtf && hasMf) {
      earned.push('diversified_investor');
    }
  }

  // 9. crypto_pioneer
  if (candidate('crypto_pioneer')) {
    const hasCryptoTx = user.transactions.some((t) => t.asset.type === 'CRYPTO');
    const hasCryptoHolding = user.holdings.some((h) => h.asset.type === 'CRYPTO' && h.quantity > 0);
    if (hasCryptoTx || hasCryptoHolding) {
      earned.push('crypto_pioneer');
    }
  }

  // 10. bull_market_winner
  if (candidate('bull_market_winner')) {
    let invested = 0;
    let currVal = 0;
    for (const h of user.holdings) {
      if (h.quantity > 0) {
        invested += h.quantity * h.avgBuyPrice;
        currVal += h.quantity * h.asset.basePrice;
      }
    }
    if (invested > 0 && (currVal - invested) / invested >= 0.25) {
      earned.push('bull_market_winner');
    }
  }

  // 11. news_reader
  if (candidate('news_reader') && user.newsReads.length >= 1) {
    earned.push('news_reader');
  }

  // 12. informed_investor
  if (candidate('informed_investor') && user.newsReads.length >= 50) {
    earned.push('informed_investor');
  }

  return earned;
};
