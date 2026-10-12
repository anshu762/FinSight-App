import { type PrismaClient } from '@prisma/client';
import { getLevelInfo, type LevelInfo } from './level.js';

export interface AwardXpResult {
  newXp: number;
  level: number;
  leveledUp: boolean;
  previousLevel: number;
  xpAwarded: number;
  alreadyAwarded: boolean;
  levelInfo: LevelInfo;
}

type PrismaTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

/**
 * Idempotently awards XP to a user using a unique refKey per user.
 * Must be executed within a Prisma transaction or with a client instance.
 */
export const awardXp = async (
  tx: PrismaTransactionClient,
  userId: string,
  type: string,
  amount: number,
  refKey: string
): Promise<AwardXpResult> => {
  // 1. Check for existing XP event with unique refKey for this user
  const existingEvent = await tx.xpEvent.findUnique({
    where: {
      userId_refKey: {
        userId,
        refKey,
      },
    },
  });

  const currentUser = await tx.user.findUniqueOrThrow({
    where: { id: userId },
    select: { xp: true },
  });

  const currentLevelInfo = getLevelInfo(currentUser.xp);

  if (existingEvent || amount <= 0) {
    return {
      newXp: currentUser.xp,
      level: currentLevelInfo.level,
      leveledUp: false,
      previousLevel: currentLevelInfo.level,
      xpAwarded: 0,
      alreadyAwarded: Boolean(existingEvent),
      levelInfo: currentLevelInfo,
    };
  }

  // 2. Create idempotent XpEvent record
  await tx.xpEvent.create({
    data: {
      userId,
      type,
      amount,
      refKey,
    },
  });

  // 3. Increment user cumulative XP
  const updatedUser = await tx.user.update({
    where: { id: userId },
    data: {
      xp: { increment: amount },
    },
    select: { xp: true },
  });

  const newLevelInfo = getLevelInfo(updatedUser.xp);
  const leveledUp = newLevelInfo.level > currentLevelInfo.level;

  return {
    newXp: updatedUser.xp,
    level: newLevelInfo.level,
    leveledUp,
    previousLevel: currentLevelInfo.level,
    xpAwarded: amount,
    alreadyAwarded: false,
    levelInfo: newLevelInfo,
  };
};
