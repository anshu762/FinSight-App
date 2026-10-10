export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number;
}

/**
 * Calculates cumulative XP required to reach a specific level L.
 * Formula: 50 * (L - 1) * (L + 2)
 */
export const getXpForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return 50 * (level - 1) * (level + 2);
};

/**
 * Calculates user's level, progress into current level, and XP needed for next level.
 * @param xp Non-negative integer representing user's total cumulative XP.
 */
export const getLevelInfo = (xp: number): LevelInfo => {
  const safeXp = Math.max(0, Math.floor(xp));

  // Solve quadratic equation: 50 * (L - 1) * (L + 2) <= safeXp
  // 50 * (L^2 + L - 2) <= safeXp
  // L^2 + L - (2 + safeXp / 50) <= 0
  // L = (-1 + Math.sqrt(1 + 4 * (2 + safeXp / 50))) / 2
  //   = (-1 + Math.sqrt(9 + 2 * safeXp / 25)) / 2
  const computedLevel = Math.floor((-1 + Math.sqrt(9 + (2 * safeXp) / 25)) / 2);
  const level = Math.max(1, computedLevel);

  const baseXp = getXpForLevel(level);
  const nextLevelBaseXp = getXpForLevel(level + 1);

  const xpIntoLevel = safeXp - baseXp;
  const xpForNextLevel = nextLevelBaseXp - baseXp;

  const rawProgress = xpForNextLevel > 0 ? xpIntoLevel / xpForNextLevel : 1;
  const progress = Number(Math.min(1, Math.max(0, rawProgress)).toFixed(4));

  return {
    level,
    xpIntoLevel,
    xpForNextLevel,
    progress,
  };
};
