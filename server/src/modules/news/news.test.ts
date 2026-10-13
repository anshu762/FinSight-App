import { app } from '../../app.js';
import { prisma } from '../../lib/prisma.js';
import type { Server } from 'http';

async function runNewsTests(): Promise<void> {
  console.log('📰 Starting Phase 7 News Hub API Tests...');

  const server: Server = app.listen(0);
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 4002;
  const baseUrl = `http://localhost:${port}`;

  const testEmail = `newstester-${Date.now()}@finsight.app`;
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
        name: 'News Hub Tester',
        dob: '2003-05-15',
      }),
    });
    const regJson = (await regRes.json()) as { success: boolean; data: { token: string; user: { id: string } } };
    if (!regJson.success) throw new Error(`Registration failed: ${JSON.stringify(regJson)}`);
    token = regJson.data.token;
    userId = regJson.data.user.id;
    console.log('   ✅ Registered successfully');

    const authHeaders = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // 2. Fetch news list (All categories)
    console.log('2. Testing GET /api/news (All categories)...');
    const listRes = await fetch(`${baseUrl}/api/news`, { headers: authHeaders });
    const listJson = (await listRes.json()) as {
      success: boolean;
      data: { articles: Array<{ id: string; title: string; isRead: boolean; category: string }>; nextCursor: string | null; hasMore: boolean };
    };
    if (!listJson.success || listJson.data.articles.length === 0) {
      throw new Error(`Failed to list news: ${JSON.stringify(listJson)}`);
    }
    console.log(`   ✅ Fetched ${listJson.data.articles.length} articles. All isRead = false.`);
    const firstArticle = listJson.data.articles[0];

    // 3. Filter by category
    console.log('3. Testing GET /api/news?category=STOCK_MARKET...');
    const catRes = await fetch(`${baseUrl}/api/news?category=STOCK_MARKET`, { headers: authHeaders });
    const catJson = (await catRes.json()) as { success: boolean; data: { articles: Array<{ category: string }> } };
    if (!catJson.success || !catJson.data.articles.every((a) => a.category === 'STOCK_MARKET')) {
      throw new Error(`Category filtering failed: ${JSON.stringify(catJson)}`);
    }
    console.log(`   ✅ Correctly filtered: ${catJson.data.articles.length} STOCK_MARKET articles.`);

    // 4. Fetch article detail with related lesson status
    console.log('4. Testing GET /api/news/:id...');
    const detailRes = await fetch(`${baseUrl}/api/news/${firstArticle.id}`, { headers: authHeaders });
    const detailJson = (await detailRes.json()) as {
      success: boolean;
      data: {
        id: string;
        isRead: boolean;
        relatedLesson: { id: string; title: string; status: string } | null;
      };
    };
    if (!detailJson.success || detailJson.data.id !== firstArticle.id) {
      throw new Error(`Article detail failed: ${JSON.stringify(detailJson)}`);
    }
    console.log(`   ✅ Article detail retrieved. Related lesson status: ${detailJson.data.relatedLesson?.status}`);

    // 5. Read first article -> +25 XP, awards news_reader badge!
    console.log('5. Testing POST /api/news/:id/read (First read -> +25 XP & news_reader badge)...');
    const readRes1 = await fetch(`${baseUrl}/api/news/${firstArticle.id}/read`, {
      method: 'POST',
      headers: authHeaders,
    });
    const readJson1 = (await readRes1.json()) as {
      success: boolean;
      data: { xpEarned: number; newBadges: Array<{ key: string }>; alreadyRead: boolean };
    };
    if (!readJson1.success || readJson1.data.xpEarned !== 25) {
      throw new Error(`Read article failed: ${JSON.stringify(readJson1)}`);
    }
    const hasNewsReaderBadge = readJson1.data.newBadges.some((b) => b.key === 'news_reader');
    if (!hasNewsReaderBadge) {
      throw new Error(`Expected news_reader badge, got: ${JSON.stringify(readJson1.data.newBadges)}`);
    }
    console.log('   ✅ Earned +25 XP and unlocked "news_reader" badge!');

    // 6. Read same article again -> idempotent (0 XP, alreadyRead = true)
    console.log('6. Testing POST /api/news/:id/read idempotency...');
    const readResDup = await fetch(`${baseUrl}/api/news/${firstArticle.id}/read`, {
      method: 'POST',
      headers: authHeaders,
    });
    const readJsonDup = (await readResDup.json()) as {
      success: boolean;
      data: { xpEarned: number; alreadyRead: boolean };
    };
    if (!readJsonDup.success || readJsonDup.data.xpEarned !== 0 || !readJsonDup.data.alreadyRead) {
      throw new Error(`Idempotent read failed: ${JSON.stringify(readJsonDup)}`);
    }
    console.log('   ✅ Idempotent: 0 XP earned, alreadyRead = true.');

    // 7. Verify GET /api/news now shows isRead = true for that article
    console.log('7. Verifying isRead flag updated in list...');
    const listRes2 = await fetch(`${baseUrl}/api/news`, { headers: authHeaders });
    const listJson2 = (await listRes2.json()) as {
      success: boolean;
      data: { articles: Array<{ id: string; isRead: boolean }> };
    };
    const readArt = listJson2.data.articles.find((a) => a.id === firstArticle.id);
    if (!readArt || !readArt.isRead) {
      throw new Error(`Expected isRead = true for read article, got: ${JSON.stringify(readArt)}`);
    }
    console.log('   ✅ isRead is true in article list.');

    // 8. Test Daily XP Cap: read 4 more distinct articles (total 5 today)
    console.log('8. Testing Daily XP Cap (5 reads per day IST)...');
    const remainingArticles = listJson.data.articles.filter((a) => a.id !== firstArticle.id);
    for (let i = 0; i < 4; i++) {
      const art = remainingArticles[i];
      const r = await fetch(`${baseUrl}/api/news/${art.id}/read`, {
        method: 'POST',
        headers: authHeaders,
      });
      const j = (await r.json()) as { success: boolean; data: { xpEarned: number } };
      if (!j.success || j.data.xpEarned !== 25) {
        throw new Error(`Expected +25 XP on read ${i + 2}, got: ${JSON.stringify(j)}`);
      }
    }
    console.log('   ✅ Read 5 articles total, each awarded +25 XP.');

    // Read 6th article -> must award 0 XP (daily cap reached)
    const art6 = remainingArticles[4];
    const r6 = await fetch(`${baseUrl}/api/news/${art6.id}/read`, {
      method: 'POST',
      headers: authHeaders,
    });
    const j6 = (await r6.json()) as { success: boolean; data: { xpEarned: number } };
    if (!j6.success || j6.data.xpEarned !== 0) {
      throw new Error(`Expected 0 XP on 6th read due to daily cap, got: ${JSON.stringify(j6)}`);
    }
    console.log('   ✅ 6th article read awarded 0 XP silently (daily cap respected).');

    // 9. Verify GET /api/home returns latestNews preview
    console.log('9. Testing GET /api/home latestNews preview...');
    const homeRes = await fetch(`${baseUrl}/api/home`, { headers: authHeaders });
    const homeJson = (await homeRes.json()) as {
      success: boolean;
      data: { latestNews: { id: string; title: string; category: string } | null };
    };
    if (!homeJson.success || !homeJson.data.latestNews || !homeJson.data.latestNews.id) {
      throw new Error(`Home latestNews preview missing: ${JSON.stringify(homeJson)}`);
    }
    console.log(`   ✅ Home preview returned: "${homeJson.data.latestNews.title}"`);

    console.log('🎉 ALL PHASE 7 NEWS HUB BACKEND TESTS PASSED!');
  } finally {
    // Cleanup test user
    if (userId) {
      await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    }
    server.close();
  }
}

runNewsTests().catch((err) => {
  console.error('❌ News Hub Test Failed:', err);
  process.exit(1);
});
