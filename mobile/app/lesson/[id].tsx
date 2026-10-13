import React, { useEffect, useState } from 'react';
import { View, BackHandler } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, Skeleton, ErrorState, ConfirmDialog } from '../../src/components/ui';
import { useLesson } from '../../src/hooks/useLesson';
import { useLessonMachine } from '../../src/features/lesson/lessonMachine';
import {
  LessonProgressHeader,
  HookStep,
  CardsStep,
  ChoiceScenarioSim,
  CalculatorSim,
  QuizStep,
  RewardStep,
  LessonLockedState,
} from '../../src/components/lesson';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: lesson, isLoading, isError, error, refetch } = useLesson(id || '');

  const currentStep = useLessonMachine((s) => s.currentStep);
  const initLesson = useLessonMachine((s) => s.initLesson);
  const setStep = useLessonMachine((s) => s.setStep);
  const resetMachine = useLessonMachine((s) => s.resetMachine);

  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    if (lesson) initLesson(lesson);
  }, [lesson?.id]);

  useEffect(() => {
    return () => { resetMachine(); };
  }, []);

  // Intercept Android hardware back button to confirm exit
  useEffect(() => {
    const onBackPress = () => {
      if (currentStep !== 'reward') {
        setShowExitDialog(true);
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [currentStep]);

  if (isLoading || (!lesson && !isError)) {
    return (
      <Screen paddingHorizontal={false}>
        <View className="px-5 pt-3 pb-2 flex-row items-center gap-3">
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width="80%" height={10} borderRadius={5} />
        </View>
        <View className="flex-1 px-5 justify-center items-center gap-4">
          <Skeleton width={96} height={96} borderRadius={48} />
          <Skeleton width={220} height={32} borderRadius={8} />
          <Skeleton width="100%" height={140} borderRadius={16} />
          <Skeleton width="100%" height={52} borderRadius={14} />
        </View>
      </Screen>
    );
  }

  if (isError && (error?.status === 403 || error?.code === 'LESSON_LOCKED')) {
    return (
      <Screen paddingHorizontal={false}>
        <LessonLockedState message={error?.message} onBack={() => router.back()} />
      </Screen>
    );
  }

  if (isError || !lesson) {
    return (
      <Screen paddingHorizontal={false}>
        <View className="flex-1 px-5 justify-center items-center">
          <ErrorState
            title="Failed to load lesson"
            message={error?.message || 'Something went wrong while retrieving lesson content.'}
            onRetry={refetch}
          />
        </View>
      </Screen>
    );
  }

  const topicColor = lesson.topic?.color || '#4F46E5';
  const topicTitle = lesson.topic?.title;

  return (
    <Screen paddingHorizontal={false}>
      <LessonProgressHeader
        currentStep={currentStep}
        accentColor={topicColor}
        onLeaveConfirmed={() => router.back()}
      />

      <View className="flex-1">
        {currentStep === 'hook' && (
          <HookStep
            hook={lesson.content.hook}
            topicTitle={topicTitle}
            topicColor={topicColor}
            onContinue={() => setStep('cards')}
          />
        )}
        {currentStep === 'cards' && (
          <CardsStep
            cards={lesson.content.cards}
            topicColor={topicColor}
            onStartPractice={() => setStep('simulation')}
          />
        )}
        {currentStep === 'simulation' && (
          lesson.content.simulation.type === 'choice_scenario' ? (
            <ChoiceScenarioSim
              simulation={lesson.content.simulation}
              topicColor={topicColor}
              onContinue={() => setStep('quiz')}
            />
          ) : (
            <CalculatorSim
              simulation={lesson.content.simulation}
              topicColor={topicColor}
              onContinue={() => setStep('quiz')}
            />
          )
        )}
        {currentStep === 'quiz' && (
          <QuizStep
            quiz={lesson.content.quiz}
            topicColor={topicColor}
            onContinue={() => setStep('reward')}
          />
        )}
        {currentStep === 'reward' && (
          <RewardStep
            lessonId={lesson.id}
            topicSlug={lesson.topic?.slug}
            topicColor={topicColor}
            onNavigateNextLesson={(nextLessonId) => router.replace(`/lesson/${nextLessonId}`)}
          />
        )}
      </View>

      <ConfirmDialog
        visible={showExitDialog}
        title="Leave Lesson?"
        message="Your progress in this current session will not be saved until completed."
        confirmText="Leave"
        cancelText="Stay"
        destructive
        onConfirm={() => { setShowExitDialog(false); router.back(); }}
        onCancel={() => setShowExitDialog(false)}
      />
    </Screen>
  );
}
