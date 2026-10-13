import { prisma } from '../../lib/prisma.js';
import { Prisma } from '@prisma/client';
import { awardXp } from './xp.service.js';
import { evaluateBadges, type EarnedBadgeInfo } from './badge.service.js';
import { getLevelInfo, type LevelInfo } from './level.js';

export interface StreakReward {
  type: string;
  amount: number;
  xp: number;
  description: string;
}

export interface CheckInResult {
  streak: number;
  longestStreak: number;
  alreadyCheckedIn: boolean;
  rewards: StreakReward[];
  xpAwarded: number;
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
  newlyEarnedBadges: EarnedBadgeInfo[];
}

import { getIstDateString, getCalendarDayDiff } from './streak.helpers.js';
export { getIstDateString, getCalendarDayDiff };


/**
 * Daily check-in service using Asia/Kolkata timezone.
 */
export const dailyCheckIn = async (
  userId: string,
  now: Date = new Date()
): Promise<CheckInResult> => {
  const todayIst = getIstDateString(now);

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
    });

    // Case 1: Same day check-in (no-op)
    if (user.lastActiveDate === todayIst) {
      return {
        streak: user.streak,
        longestStreak: user.longestStreak,
        alreadyCheckedIn: true,
        rewards: [],
        xpAwarded: 0,
        userStats: {
          xp: user.xp,
          levelInfo: getLevelInfo(user.xp),
          streak: user.streak,
          longestStreak: user.longestStreak,
        },
        user: {
          id: user.id,
          xp: user.xp,
          levelInfo: getLevelInfo(user.xp),
        },
        newlyEarnedBadges: [],
      };
    }

    // Determine new streak
    let newStreak = 1;
    if (user.lastActiveDate) {
      const dayDiff = getCalendarDayDiff(user.lastActiveDate, todayIst);
      if (dayDiff === 1) {
        // Consecutive calendar day
        newStreak = user.streak + 1;
      } else {
        // Day gap >= 2 or clock skew
        newStreak = 1;
      }
    } else {
      // First active day
      newStreak = 1;
    }

    const newLongestStreak = Math.max(user.longestStreak, newStreak);

    // Update user date and streak numbers
    await tx.user.update({
      where: { id: userId },
      data: {
        lastActiveDate: todayIst,
        streak: newStreak,
        longestStreak: newLongestStreak,
      },
    });

    const rewards: StreakReward[] = [];
    let totalXpAwarded = 0;

    // 1. Base daily login: +25 XP
    const baseReward = await awardXp(
      tx,
      userId,
      'daily_login',
      25,
      `login:${todayIst}`
    );
    if (baseReward.xpAwarded > 0) {
      totalXpAwarded += baseReward.xpAwarded;
      rewards.push({
        type: 'daily_login',
        amount: 25,
        xp: 25,
        description: 'Daily Check-in Reward',
      });
    }

    // 2. 7-Day multiple milestone: +200 XP
    if (newStreak % 7 === 0) {
      const sevenReward = await awardXp(
        tx,
        userId,
        'streak_milestone_7',
        200,
        `streak_7:${todayIst}:${newStreak}`
      );
      if (sevenReward.xpAwarded > 0) {
        totalXpAwarded += sevenReward.xpAwarded;
        rewards.push({
          type: 'streak_milestone_7',
          amount: 200,
          xp: 200,
          description: `${newStreak}-Day Streak Bonus!`,
        });
      }
    }

    // 3. 30-Day multiple milestone: +1000 XP
    if (newStreak % 30 === 0) {
      const thirtyReward = await awardXp(
        tx,
        userId,
        'streak_milestone_30',
        1000,
        `streak_30:${todayIst}:${newStreak}`
      );
      if (thirtyReward.xpAwarded > 0) {
        totalXpAwarded += thirtyReward.xpAwarded;
        rewards.push({
          type: 'streak_milestone_30',
          amount: 1000,
          xp: 1000,
          description: `${newStreak}-Day Monthly Master Bonus!`,
        });
      }
    }

    // 4. Evaluate badges (e.g. daily_visitor)
    const newlyEarnedBadges = await evaluateBadges(tx, userId);

    const refreshedUser = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { xp: true },
    });

    return {
      streak: newStreak,
      longestStreak: newLongestStreak,
      alreadyCheckedIn: false,
      rewards,
      xpAwarded: totalXpAwarded,
      userStats: {
        xp: refreshedUser.xp,
        levelInfo: getLevelInfo(refreshedUser.xp),
        streak: newStreak,
        longestStreak: newLongestStreak,
      },
      user: {
        id: userId,
        xp: refreshedUser.xp,
        levelInfo: getLevelInfo(refreshedUser.xp),
      },
      newlyEarnedBadges,
    };
  }, {
    maxWait: 10000,
    timeout: 20000,
  });
};
