import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../lib/api-error.js';
import { awardXp } from '../gamification/xp.service.js';
import { evaluateBadges, type EarnedBadgeInfo } from '../gamification/badge.service.js';
import { getLevelInfo, type LevelInfo } from '../gamification/level.js';
import { type CompleteLessonInput } from './learn.schema.js';

export interface XpBreakdownItem {
  item: string;
  xp: number;
}

export interface CompleteLessonResult {
  xpEarned: number;
  breakdown: XpBreakdownItem[];
  leveledUp: boolean;
  newLevel: number;
  levelInfo: LevelInfo;
  streak: number;
  newBadges: EarnedBadgeInfo[];
  topicCompleted: boolean;
  nextLesson: { id: string; slug: string; title: string; order: number } | null;
  alreadyCompleted: boolean;
}

export const calculateLessonXp = (
  quizAttempts: number,
  hintsUsed: number
): { totalXp: number; breakdown: XpBreakdownItem[] } => {
  const microXp = 100;
  const simXp = 150;
  const quizXp = quizAttempts === 1 ? 100 : quizAttempts === 2 ? 50 : 0;
  const hintDeduction = hintsUsed * 10;

  const rawTotal = microXp + simXp + quizXp - hintDeduction;
  const totalXp = Math.max(0, rawTotal);

  const breakdown: XpBreakdownItem[] = [
    { item: 'Micro Lesson', xp: microXp },
    { item: 'Simulation', xp: simXp },
    { item: 'Quiz', xp: quizXp },
  ];

  if (hintDeduction > 0) {
    breakdown.push({ item: 'Hints Penalty', xp: -hintDeduction });
  }

  return { totalXp, breakdown };
};

export const completeLesson = async (
  userId: string,
  lessonId: string,
  input: CompleteLessonInput
): Promise<CompleteLessonResult> => {
  // Validate lesson exists
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { topic: true },
  });

  if (!lesson) {
    throw ApiError.notFound('Lesson not found', 'LESSON_NOT_FOUND');
  }

  // Verify prerequisite lock
  if (lesson.order > 1) {
    const prerequisite = await prisma.lesson.findFirst({
      where: { topicId: lesson.topicId, order: lesson.order - 1 },
    });

    if (prerequisite) {
      const prereqDone = await prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId: prerequisite.id } },
      });

      if (!prereqDone) {
        throw ApiError.forbidden(
          `Lesson is locked. You must complete '${prerequisite.title}' first.`,
          'LESSON_LOCKED',
          {
            requiredLessonId: prerequisite.id,
            requiredLessonTitle: prerequisite.title,
          }
        );
      }
    }
  }

  return await prisma.$transaction(async (tx) => {
    const existingProgress = await tx.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    const userLevelInfo = getLevelInfo(user.xp);

    const nextInTopic = await tx.lesson.findFirst({
      where: { topicId: lesson.topicId, order: lesson.order + 1 },
      select: { id: true, slug: true, title: true, order: true },
    });

    // Idempotent case: replay already completed lesson
    if (existingProgress) {
      return {
        xpEarned: 0,
        breakdown: [],
        leveledUp: false,
        newLevel: userLevelInfo.level,
        levelInfo: userLevelInfo,
        streak: user.streak,
        newBadges: [],
        topicCompleted: false,
        nextLesson: nextInTopic,
        alreadyCompleted: true,
      };
    }

    // First completion: calculate XP
    const { totalXp, breakdown } = calculateLessonXp(input.quizAttempts, input.hintsUsed);

    await tx.lessonProgress.create({
      data: {
        userId,
        lessonId,
        xpEarned: totalXp,
        quizAttempts: input.quizAttempts,
        hintsUsed: input.hintsUsed,
      },
    });

    // Award base lesson XP
    await awardXp(tx, userId, 'lesson_completion', totalXp, `lesson:${lessonId}`);

    // Check if topic is fully completed
    const topicLessonCount = await tx.lesson.count({ where: { topicId: lesson.topicId } });
    const userDoneInTopic = await tx.lessonProgress.count({
      where: {
        userId,
        lesson: { topicId: lesson.topicId },
      },
    });

    let topicBonusEarned = 0;
    const isTopicNowComplete = userDoneInTopic >= topicLessonCount;

    if (isTopicNowComplete) {
      const topicBonus = await awardXp(
        tx,
        userId,
        'topic_completion_bonus',
        500,
        `topic_bonus:${lesson.topicId}`
      );
      if (topicBonus.xpAwarded > 0) {
        topicBonusEarned = topicBonus.xpAwarded;
        breakdown.push({ item: 'Topic Completion Bonus', xp: 500 });
      }
    }

    const newBadges = await evaluateBadges(tx, userId);
    const finalUser = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    const finalLevelInfo = getLevelInfo(finalUser.xp);

    return {
      xpEarned: totalXp + topicBonusEarned,
      breakdown,
      leveledUp: finalLevelInfo.level > userLevelInfo.level,
      newLevel: finalLevelInfo.level,
      levelInfo: finalLevelInfo,
      streak: finalUser.streak,
      newBadges,
      topicCompleted: isTopicNowComplete,
      nextLesson: nextInTopic,
      alreadyCompleted: false,
    };
  }, {
    maxWait: 10000,
    timeout: 20000,
  });
};
