import { getLevelInfo, getXpForLevel } from './level.js';

interface TestCase {
  targetLevel: number;
  expectedXp: number;
}

const testCases: TestCase[] = [
  { targetLevel: 1, expectedXp: 0 },
  { targetLevel: 2, expectedXp: 200 },
  { targetLevel: 3, expectedXp: 500 },
  { targetLevel: 5, expectedXp: 1400 },
  { targetLevel: 25, expectedXp: 32400 },
];

console.log('--- Testing FinSight Gamification Level Formula ---');

let allPassed = true;

for (const { targetLevel, expectedXp } of testCases) {
  const calculatedThreshold = getXpForLevel(targetLevel);
  const info = getLevelInfo(expectedXp);

  const passedThreshold = calculatedThreshold === expectedXp;
  const passedLevel = info.level === targetLevel;
  const passedInto = info.xpIntoLevel === 0;

  if (passedThreshold && passedLevel && passedInto) {
    console.log(`✓ Level ${targetLevel} threshold verified: ${expectedXp} XP (level: ${info.level}, xpIntoLevel: ${info.xpIntoLevel}, xpForNextLevel: ${info.xpForNextLevel}, progress: ${info.progress})`);
  } else {
    allPassed = false;
    console.error(`✗ FAILED Level ${targetLevel}: Expected ${expectedXp} XP, got threshold ${calculatedThreshold}, computed level ${info.level}`);
  }
}

// Intermediate test: XP midway through level 1
const midLevel1 = getLevelInfo(100);
if (midLevel1.level === 1 && midLevel1.xpIntoLevel === 100 && midLevel1.progress === 0.5) {
  console.log(`✓ Mid-level progress verified: 100 XP -> Level 1 with 50% progress (xpIntoLevel: 100, xpForNextLevel: 200)`);
} else {
  allPassed = false;
  console.error(`✗ FAILED mid-level test:`, midLevel1);
}

if (!allPassed) {
  process.exit(1);
}

console.log('All gamification level formula tests passed successfully!\n');
