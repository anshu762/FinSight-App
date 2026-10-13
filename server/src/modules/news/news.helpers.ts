import { prisma } from '../../lib/prisma.js';
import { getIstDateString } from '../gamification/streak.service.js';

export interface RelatedLessonPreview {
  id: string;
  slug: string;
  title: string;
  order: number;
  topicSlug: string;
  topicTitle: string;
  status: 'available' | 'locked' | 'completed';
  requiredLessonTitle: string | null;
  requiredLessonId: string | null;
}

export const getIstDayRange = (now = new Date()): { start: Date; end: Date } => {
  const istDateStr = getIstDateString(now);
  const start = new Date(`${istDateStr}T00:00:00.000+05:30`);
  const end = new Date(`${istDateStr}T23:59:59.999+05:30`);
  return { start, end };
};

export const resolveRelatedLesson = async (
  userId: string,
  relatedLessonSlug: string | null
): Promise<RelatedLessonPreview | null> => {
  if (!relatedLessonSlug) return null;

  const lesson = await prisma.lesson.findUnique({
    where: { slug: relatedLessonSlug },
    include: { topic: true },
  });

  if (!lesson) return null;

  const userProgress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId: lesson.id } },
  });

  let status: 'available' | 'locked' | 'completed' = 'locked';
  let requiredLessonTitle: string | null = null;
  let requiredLessonId: string | null = null;

  if (userProgress) {
    status = 'completed';
  } else if (lesson.order === 1) {
    status = 'available';
  } else {
    const prereq = await prisma.lesson.findFirst({
      where: { topicId: lesson.topicId, order: lesson.order - 1 },
    });

    if (prereq) {
      const prereqDone = await prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId: prereq.id } },
      });

      if (prereqDone) {
        status = 'available';
      } else {
        status = 'locked';
        requiredLessonTitle = prereq.title;
        requiredLessonId = prereq.id;
      }
    } else {
      status = 'available';
    }
  }

  return {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    order: lesson.order,
    topicSlug: lesson.topic.slug,
    topicTitle: lesson.topic.title,
    status,
    requiredLessonTitle,
    requiredLessonId,
  };
};
