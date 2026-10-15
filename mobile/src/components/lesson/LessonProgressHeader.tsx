import React, { useState, useEffect } from 'react';
import { View, Pressable, BackHandler } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { type LessonStep } from '../../features/lesson/lessonMachine';

export interface LessonProgressHeaderProps {
  currentStep: LessonStep;
  accentColor?: string;
  onLeaveConfirmed?: () => void;
}

const STEP_ORDER: LessonStep[] = ['hook', 'cards', 'simulation', 'quiz', 'reward'];

export const LessonProgressHeader: React.FC<LessonProgressHeaderProps> = ({
  currentStep,
  accentColor = '#4F46E5',
  onLeaveConfirmed,
}) => {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const currentStepIndex = STEP_ORDER.indexOf(currentStep);

  // Android hardware back listener
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // If on reward step, let user leave directly
        if (currentStep === 'reward') {
          router.back();
          return true;
        }
        setShowConfirm(true);
        return true;
      }
    );
    return () => subscription.remove();
  }, [currentStep, router]);

  const handleClosePress = () => {
    if (currentStep === 'reward') {
      router.back();
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmLeave = () => {
    setShowConfirm(false);
    if (onLeaveConfirmed) {
      onLeaveConfirmed();
    } else {
      router.back();
    }
  };

  return (
    <>
      <View className="flex-row items-center px-5 pt-2 pb-3 gap-3">
        {/* Close Button with 44x44 minimum touch target */}
        <Pressable
          onPress={handleClosePress}
          hitSlop={12}
          className="w-10 h-10 rounded-full items-center justify-center bg-slate-100 active:bg-slate-200"
          accessibilityLabel="Close lesson"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={22} color="#0F172A" />
        </Pressable>

        {/* 5-segment progress bar */}
        <View className="flex-1 flex-row items-center gap-1.5 h-2">
          {STEP_ORDER.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <View
                key={step}
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{
                  backgroundColor: isCompleted || isCurrent ? accentColor : '#E2E8F0',
                  opacity: isCurrent ? 1 : isCompleted ? 0.85 : 0.4,
                }}
              />
            );
          })}
        </View>
      </View>

      <ConfirmDialog
        visible={showConfirm}
        title="Leave lesson?"
        message="Progress in this lesson will be lost if you leave now."
        confirmTitle="Leave"
        cancelTitle="Stay"
        onConfirm={handleConfirmLeave}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};
