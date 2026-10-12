import { prisma } from '../../lib/prisma.js';
import {
  dailyCheckIn,
  getIstDateString,
  getCalendarDayDiff,
} from './streak.service.js';

async function runStreakTests(): Promise<void> {
  console.log('🧪 Starting Streak Engine Test Suite...');

  // 1. Test date math utilities
  const d1 = '2026-10-10';
  const d2 = '2026-10-11';
  const d3 = '2026-10-13';

  if (getCalendarDayDiff(d1, d2) !== 1) {
    throw new Error('Expected 1 day difference between 2026-10-10 and 2026-10-11');
  }
  if (getCalendarDayDiff(d1, d3) !== 3) {
    throw new Error('Expected 3 days difference between 2026-10-10 and 2026-10-13');
  }
  if (getCalendarDayDiff(d1, d1) !== 0) {
    throw new Error('Expected 0 days difference for identical dates');
  }
  const sampleIstDate = getIstDateString(new Date('2026-10-10T12:00:00Z'));
  if (sampleIstDate !== '2026-10-10') {
    throw new Error(`Expected 2026-10-10, got ${sampleIstDate}`);
  }
  console.log('✅ Date diff and IST format helper tests passed.');

  // 2. Create test user for simulation
  const testEmail = `streak-test-${Date.now()}@finsight.app`;
  const user = await prisma.user.create({
    data: {
      email: testEmail,
      name: 'Streak Tester',
      passwordHash: 'dummyhash',
      dob: new Date('2000-01-01'),
      cashBalance: 1000000,
    },
  });

  try {
    // Day 1: First check-in
    const day1Date = new Date('2026-10-01T10:00:00Z');
    const resDay1 = await dailyCheckIn(user.id, day1Date);
    if (resDay1.streak !== 1 || resDay1.xpAwarded !== 25) {
      throw new Error(`Day 1 failed: streak=${resDay1.streak}, xp=${resDay1.xpAwarded}`);
    }
    console.log('✅ Day 1 check-in: streak = 1, +25 XP');

    // Day 1 duplicate: same day check-in
    const resDay1Dup = await dailyCheckIn(user.id, day1Date);
    if (resDay1Dup.alreadyCheckedIn !== true || resDay1Dup.xpAwarded !== 0 || resDay1Dup.streak !== 1) {
      throw new Error('Day 1 duplicate failed to act as no-op');
    }
    console.log('✅ Day 1 duplicate check-in: no-op, 0 XP, streak = 1');

    // Day 2: Consecutive check-in
    const day2Date = new Date('2026-10-02T10:00:00Z');
    const resDay2 = await dailyCheckIn(user.id, day2Date);
    if (resDay2.streak !== 2 || resDay2.xpAwarded !== 25) {
      throw new Error(`Day 2 failed: streak=${resDay2.streak}, xp=${resDay2.xpAwarded}`);
    }
    console.log('✅ Day 2 check-in: streak = 2, +25 XP');

    // Days 3 to 6: Simulate consecutive check-ins
    for (let day = 3; day <= 6; day++) {
      const date = new Date(`2026-10-0${day}T10:00:00Z`);
      const res = await dailyCheckIn(user.id, date);
      if (res.streak !== day) {
        throw new Error(`Day ${day} streak mismatch: ${res.streak}`);
      }
    }
    console.log('✅ Days 3-6 check-ins: streaks 3, 4, 5, 6 verified');

    // Day 7: Milestone bonus check-in (25 base + 200 milestone = 225 XP)
    const day7Date = new Date('2026-10-07T10:00:00Z');
    const resDay7 = await dailyCheckIn(user.id, day7Date);
    if (resDay7.streak !== 7) {
      throw new Error(`Day 7 streak expected 7, got ${resDay7.streak}`);
    }
    if (resDay7.xpAwarded !== 225) {
      throw new Error(`Day 7 XP expected 225, got ${resDay7.xpAwarded}`);
    }
    const hasMilestone7 = resDay7.rewards.some((r) => r.type === 'streak_milestone_7');
    if (!hasMilestone7) {
      throw new Error('Day 7 missing streak_milestone_7 reward');
    }
    const hasDailyVisitorBadge = resDay7.newlyEarnedBadges.some((b) => b.key === 'daily_visitor');
    if (!hasDailyVisitorBadge) {
      throw new Error('Day 7 should have awarded daily_visitor badge');
    }
    console.log('✅ Day 7 check-in: streak = 7, +225 XP (25 + 200), daily_visitor badge earned!');

    // Day 10: Missed 2 days (gap from 2026-10-07 to 2026-10-10) -> Reset to 1
    const day10Date = new Date('2026-10-10T10:00:00Z');
    const resDay10 = await dailyCheckIn(user.id, day10Date);
    if (resDay10.streak !== 1) {
      throw new Error(`Day 10 streak expected to reset to 1, got ${resDay10.streak}`);
    }
    if (resDay10.longestStreak !== 7) {
      throw new Error(`Longest streak expected to remain 7, got ${resDay10.longestStreak}`);
    }
    console.log('✅ Day 10 check-in (after 2 missed days): streak reset to 1, longest streak preserved = 7');

    console.log('🎉 All Streak Engine Tests Passed Successfully!');
  } finally {
    // Cleanup test user
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.$disconnect();
  }
}

runStreakTests().catch((e) => {
  console.error('❌ Streak test failed:', e);
  process.exit(1);
});
