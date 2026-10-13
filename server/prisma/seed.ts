import { PrismaClient } from '@prisma/client';
import { LessonContentSchema } from '../src/modules/learn/content.schema.js';
import { topicsSeedData } from './seed-data/topics.js';
import { stocksLessons } from './seed-data/stocks.js';
import { investingLessons } from './seed-data/investing.js';
import { taxesLessons } from './seed-data/taxes.js';
import { cryptoLessons } from './seed-data/crypto.js';
import { badgesSeedData } from './seed-data/badges.js';
import { assetsSeedData } from './seed-data/assets.js';
import { newsSeedData } from './seed-data/news.js';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting idempotent database seed...');

  // 1. Seed Topics
  console.log('Seeding topics...');
  for (const topic of topicsSeedData) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: {
        title: topic.title,
        description: topic.description,
        icon: topic.icon,
        color: topic.color,
        order: topic.order,
      },
      create: {
        slug: topic.slug,
        title: topic.title,
        description: topic.description,
        icon: topic.icon,
        color: topic.color,
        order: topic.order,
      },
    });
  }

  const allTopics = await prisma.topic.findMany();
  const topicMap = new Map<string, string>(allTopics.map((t) => [t.slug, t.id]));

  // 2. Validate and Seed Lessons
  const allLessons = [
    ...stocksLessons,
    ...investingLessons,
    ...taxesLessons,
    ...cryptoLessons,
  ];

  console.log(`Seeding ${allLessons.length} lessons...`);
  for (const lesson of allLessons) {
    const topicId = topicMap.get(lesson.topicSlug);
    if (!topicId) {
      throw new Error(`Topic with slug "${lesson.topicSlug}" not found`);
    }

    // Strict runtime validation against Zod schema
    LessonContentSchema.parse(lesson.content);

    await prisma.lesson.upsert({
      where: { slug: lesson.slug },
      update: {
        topicId,
        order: lesson.order,
        title: lesson.title,
        content: lesson.content,
      },
      create: {
        slug: lesson.slug,
        topicId,
        order: lesson.order,
        title: lesson.title,
        content: lesson.content,
      },
    });
  }

  // 3. Seed Badges
  console.log(`Seeding ${badgesSeedData.length} badges...`);
  for (const badge of badgesSeedData) {
    await prisma.badge.upsert({
      where: { key: badge.key },
      update: {
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        rarity: badge.rarity,
        category: badge.category,
        requirementText: badge.requirementText,
      },
      create: {
        key: badge.key,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        rarity: badge.rarity,
        category: badge.category,
        requirementText: badge.requirementText,
      },
    });
  }

  // 4. Seed Assets
  console.log(`Seeding ${assetsSeedData.length} assets...`);
  for (const asset of assetsSeedData) {
    await prisma.asset.upsert({
      where: { symbol: asset.symbol },
      update: {
        name: asset.name,
        type: asset.type,
        basePrice: asset.basePrice,
        volatility: asset.volatility,
        minInvestment: asset.minInvestment,
        allowFractional: asset.allowFractional,
      },
      create: {
        symbol: asset.symbol,
        name: asset.name,
        type: asset.type,
        basePrice: asset.basePrice,
        volatility: asset.volatility,
        minInvestment: asset.minInvestment,
        allowFractional: asset.allowFractional,
      },
    });
  }

  // 5. Seed News Articles
  console.log(`Seeding ${newsSeedData.length} news articles...`);
  const now = Date.now();
  for (const news of newsSeedData) {
    const publishedAt = new Date(now - news.hoursAgo * 60 * 60 * 1000);
    await prisma.newsArticle.upsert({
      where: { slug: news.slug },
      update: {
        category: news.category,
        title: news.title,
        summary: news.summary,
        whatHappened: news.whatHappened,
        whyItMatters: news.whyItMatters,
        keyTakeaway: news.keyTakeaway,
        readMinutes: news.readMinutes,
        publishedAt,
        relatedLessonSlug: news.relatedLessonSlug,
      },
      create: {
        slug: news.slug,
        category: news.category,
        title: news.title,
        summary: news.summary,
        whatHappened: news.whatHappened,
        whyItMatters: news.whyItMatters,
        keyTakeaway: news.keyTakeaway,
        readMinutes: news.readMinutes,
        publishedAt,
        relatedLessonSlug: news.relatedLessonSlug,
      },
    });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
