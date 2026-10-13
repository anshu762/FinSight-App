import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../lib/api-error.js';

export * from './learn.completion.js';

export const getTopicsWithProgress = async (userId: string) => {
  const [topics, userProgress] = await Promise.all([
    prisma.topic.findMany({
      orderBy: { order: 'asc' },
      include: {
        lessons: {
          select: { id: true, slug: true, title: true, order: true },
          orderBy: { order: 'asc' },
        },
      },
    }),
    prisma.lessonProgress.findMany({
      where: { userId },
      select: { lessonId: true },
    }),
  ]);

  const completedLessonSet = new Set(userProgress.map((p) => p.lessonId));

  return topics.map((topic) => {
    const totalLessons = topic.lessons.length;
    const completedLessons = topic.lessons.filter((l) => completedLessonSet.has(l.id)).length;
    const progress = totalLessons > 0 ? Number((completedLessons / totalLessons).toFixed(4)) : 0;
    const nextLesson = topic.lessons.find((l) => !completedLessonSet.has(l.id)) ?? null;

    return {
      id: topic.id,
      slug: topic.slug,
      title: topic.title,
      description: topic.description,
      icon: topic.icon,
      color: topic.color,
      order: topic.order,
      totalLessons,
      completedLessons,
      progress,
      nextLesson: nextLesson
        ? {
            id: nextLesson.id,
            slug: nextLesson.slug,
            title: nextLesson.title,
            order: nextLesson.order,
          }
        : null,
    };
  });
};

export const getTopicBySlug = async (userId: string, slug: string) => {
  const topic = await prisma.topic.findUnique({
    where: { slug },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        select: { id: true, slug: true, order: true, title: true },
      },
    },
  });

  if (!topic) {
    throw ApiError.notFound(`Topic with slug '${slug}' not found`, 'TOPIC_NOT_FOUND');
  }

  const userProgress = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: topic.lessons.map((l) => l.id) },
    },
  });

  const progressMap = new Map(userProgress.map((p) => [p.lessonId, p.xpEarned]));

  const lessonsWithStatus = topic.lessons.map((lesson, index) => {
    const isCompleted = progressMap.has(lesson.id);
    let status: 'completed' | 'available' | 'locked' = 'locked';

    if (isCompleted) {
      status = 'completed';
    } else if (index === 0 || progressMap.has(topic.lessons[index - 1].id)) {
      status = 'available';
    }

    return {
      id: lesson.id,
      slug: lesson.slug,
      order: lesson.order,
      title: lesson.title,
      status,
      xpEarned: progressMap.get(lesson.id) ?? 0,
    };
  });

  return {
    topic: {
      id: topic.id,
      slug: topic.slug,
      title: topic.title,
      description: topic.description,
      icon: topic.icon,
      color: topic.color,
      order: topic.order,
    },
    lessons: lessonsWithStatus,
  };
};


export const getLessonById = async (userId: string, lessonId: string) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { topic: true },
  });

  if (!lesson) {
    throw ApiError.notFound('Lesson not found', 'LESSON_NOT_FOUND');
  }

  // Check prerequisite if lesson is not first in topic
  if (lesson.order > 1) {
    const prerequisite = await prisma.lesson.findFirst({
      where: {
        topicId: lesson.topicId,
        order: lesson.order - 1,
      },
    });

    if (prerequisite) {
      const isPrereqDone = await prisma.lessonProgress.findUnique({
        where: {
          userId_lessonId: {
            userId,
            lessonId: prerequisite.id,
          },
        },
      });

      if (!isPrereqDone) {
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

  const progress = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
  });

  return {
    ...lesson,
    status: progress ? ('completed' as const) : ('available' as const),
    isCompleted: Boolean(progress),
    completedAt: progress?.completedAt ?? null,
  };
};
