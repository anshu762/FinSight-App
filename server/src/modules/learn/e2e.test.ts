import { app } from '../../app.js';
import { prisma } from '../../lib/prisma.js';
import type { Server } from 'http';

async function runE2eTests(): Promise<void> {
  console.log('🚀 Starting FinSight Phase 3 End-to-End API Test Suite...');

  // Start express server on ephemeral port
  const server: Server = app.listen(0);
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 4001;
  const baseUrl = `http://localhost:${port}`;

  const testEmail = `e2e-${Date.now()}@finsight.app`;
  let token = '';
  let userId = '';

  try {
    // 1. Register test user
    console.log('1. Registering test user...');
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password123',
        name: 'E2E Tester',
        dob: '2004-01-01',
      }),
    });
    const regJson = (await regRes.json()) as any;
    if (!regJson.success) throw new Error(`Registration failed: ${JSON.stringify(regJson)}`);
    token = regJson.data.token;
    userId = regJson.data.user.id;
    console.log('   ✅ Registered successfully');

    const authHeaders = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // 2. Check-in
    console.log('2. Testing Daily Check-in...');
    const checkinRes = await fetch(`${baseUrl}/api/me/checkin`, {
      method: 'POST',
      headers: authHeaders,
    });
    const checkinJson = (await checkinRes.json()) as any;
    if (!checkinJson.success || checkinJson.data.streak !== 1 || checkinJson.data.xpAwarded !== 25) {
      throw new Error(`Check-in failed: ${JSON.stringify(checkinJson)}`);
    }
    console.log('   ✅ Check-in success: streak = 1, +25 XP');

    // 3. Duplicate check-in on same day
    console.log('3. Testing Duplicate Check-in (Same Day Idempotency)...');
    const dupCheckinRes = await fetch(`${baseUrl}/api/me/checkin`, {
      method: 'POST',
      headers: authHeaders,
    });
    const dupCheckinJson = (await dupCheckinRes.json()) as any;
    if (dupCheckinJson.data.alreadyCheckedIn !== true || dupCheckinJson.data.xpAwarded !== 0) {
      throw new Error(`Duplicate check-in failed: ${JSON.stringify(dupCheckinJson)}`);
    }
    console.log('   ✅ Duplicate check-in: no-op, 0 XP');

    // 4. Fetch topics list
    console.log('4. Testing GET /api/topics...');
    const topicsRes = await fetch(`${baseUrl}/api/topics`, { headers: authHeaders });
    const topicsJson = (await topicsRes.json()) as any;
    if (!topicsJson.success || topicsJson.data.length !== 4) {
      throw new Error(`Topics list failed: ${JSON.stringify(topicsJson)}`);
    }
    console.log(`   ✅ Received ${topicsJson.data.length} topics`);

    // 5. Fetch stocks topic details
    console.log('5. Testing GET /api/topics/stocks...');
    const stockTopicRes = await fetch(`${baseUrl}/api/topics/stocks`, { headers: authHeaders });
    const stockTopicJson = (await stockTopicRes.json()) as any;
    if (!stockTopicJson.success || stockTopicJson.data.lessons.length !== 3) {
      throw new Error(`Topic details failed: ${JSON.stringify(stockTopicJson)}`);
    }
    const lessons = stockTopicJson.data.lessons;
    if (lessons[0].status !== 'available' || lessons[1].status !== 'locked') {
      throw new Error(`Initial lock state incorrect: L1=${lessons[0].status}, L2=${lessons[1].status}`);
    }
    console.log('   ✅ Stock topic lessons: L1 available, L2 locked');

    // 6. Test locked lesson 2 returns 403
    console.log('6. Testing GET /api/lessons/:id on locked Lesson 2 (expects 403)...');
    const lockRes = await fetch(`${baseUrl}/api/lessons/${lessons[1].id}`, { headers: authHeaders });
    const lockJson = (await lockRes.json()) as any;
    if (lockRes.status !== 403 || lockJson.error?.code !== 'LESSON_LOCKED') {
      throw new Error(`Expected 403 LESSON_LOCKED, got ${lockRes.status}: ${JSON.stringify(lockJson)}`);
    }
    console.log('   ✅ Locked lesson returns 403 LESSON_LOCKED');

    // 7. Test available lesson 1 returns 200 with full content
    console.log('7. Testing GET /api/lessons/:id on available Lesson 1...');
    const l1Res = await fetch(`${baseUrl}/api/lessons/${lessons[0].id}`, { headers: authHeaders });
    const l1Json = (await l1Res.json()) as any;
    if (l1Res.status !== 200 || !l1Json.data.content) {
      throw new Error(`Lesson 1 fetch failed: ${JSON.stringify(l1Json)}`);
    }
    console.log('   ✅ Lesson 1 fetched with full content');

    // 8. Complete lesson 1
    console.log('8. Testing POST /api/lessons/:id/complete on Lesson 1...');
    const comp1Res = await fetch(`${baseUrl}/api/lessons/${lessons[0].id}/complete`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ quizAttempts: 1, hintsUsed: 1 }),
    });
    const comp1Json = (await comp1Res.json()) as any;
    if (!comp1Json.success || comp1Json.data.xpEarned !== 340) {
      throw new Error(`Complete L1 failed (expected 340 XP): ${JSON.stringify(comp1Json)}`);
    }
    const hasFirstSteps = comp1Json.data.newBadges.some((b: any) => b.key === 'first_steps');
    if (!hasFirstSteps) {
      throw new Error('Expected first_steps badge to be awarded');
    }
    console.log('   ✅ Lesson 1 completed: +340 XP, first_steps badge earned!');

    // 9. Double submit lesson 1
    console.log('9. Testing duplicate complete on Lesson 1 (idempotency check)...');
    const comp1DupRes = await fetch(`${baseUrl}/api/lessons/${lessons[0].id}/complete`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ quizAttempts: 1, hintsUsed: 0 }),
    });
    const comp1DupJson = (await comp1DupRes.json()) as any;
    if (comp1DupJson.data.alreadyCompleted !== true || comp1DupJson.data.xpEarned !== 0) {
      throw new Error(`Duplicate complete failed: ${JSON.stringify(comp1DupJson)}`);
    }
    console.log('   ✅ Duplicate completion returned alreadyCompleted: true, 0 XP');

    // 10. Lesson 2 should now be unlocked
    console.log('10. Testing GET /api/lessons/:id on now unlocked Lesson 2...');
    const l2Res = await fetch(`${baseUrl}/api/lessons/${lessons[1].id}`, { headers: authHeaders });
    if (l2Res.status !== 200) {
      throw new Error(`Lesson 2 should now be unlocked (got ${l2Res.status})`);
    }
    console.log('   ✅ Lesson 2 is now available (200 OK)');

    // 11. Complete Lesson 2 and Lesson 3
    console.log('11. Completing Lesson 2 & 3 to test topic completion bonus (+500 XP)...');
    await fetch(`${baseUrl}/api/lessons/${lessons[1].id}/complete`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ quizAttempts: 1, hintsUsed: 0 }),
    });

    const comp3Res = await fetch(`${baseUrl}/api/lessons/${lessons[2].id}/complete`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ quizAttempts: 1, hintsUsed: 0 }),
    });
    const comp3Json = (await comp3Res.json()) as any;
    if (comp3Json.data.topicCompleted !== true) {
      throw new Error('Expected topicCompleted to be true');
    }
    // Base 350 + Topic bonus 500 = 850 XP
    if (comp3Json.data.xpEarned !== 850) {
      throw new Error(`Expected 850 XP for completing topic, got ${comp3Json.data.xpEarned}`);
    }
    const hasTopicMaster = comp3Json.data.newBadges.some((b: any) => b.key === 'topic_master');
    if (!hasTopicMaster) {
      throw new Error('Expected topic_master badge to be awarded');
    }
    console.log('   ✅ Topic finished: +850 XP (+500 bonus included), topic_master badge awarded!');

    // 12. Test GET /api/badges
    console.log('12. Testing GET /api/badges...');
    const badgesRes = await fetch(`${baseUrl}/api/badges`, { headers: authHeaders });
    const badgesJson = (await badgesRes.json()) as any;
    if (!badgesJson.success || badgesJson.data.length !== 12) {
      throw new Error(`Badges list failed: ${JSON.stringify(badgesJson)}`);
    }
    const earnedCount = badgesJson.data.filter((b: any) => b.isEarned).length;
    if (earnedCount < 2) {
      throw new Error(`Expected at least 2 earned badges, got ${earnedCount}`);
    }
    console.log(`   ✅ Badges list: ${badgesJson.data.length} total, ${earnedCount} earned`);

    // 13. Test GET /api/home
    console.log('13. Testing GET /api/home dashboard...');
    const homeRes = await fetch(`${baseUrl}/api/home`, { headers: authHeaders });
    const homeJson = (await homeRes.json()) as any;
    if (!homeJson.success || !homeJson.data.user || !homeJson.data.continueLesson) {
      throw new Error(`Home dashboard failed: ${JSON.stringify(homeJson)}`);
    }
    console.log('   ✅ Home dashboard verified: continueLesson points to', homeJson.data.continueLesson.title);

    console.log('\n🎉 ALL Phase 3 End-to-End API Tests Passed Successfully!\n');
  } finally {
    // Teardown
    if (userId) {
      await prisma.user.delete({ where: { id: userId } });
    }
    server.close();
    await prisma.$disconnect();
  }
}

runE2eTests().catch((e) => {
  console.error('❌ E2E tests failed:', e);
  process.exit(1);
});
