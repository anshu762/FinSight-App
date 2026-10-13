import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui/AppText';
import { type QuizStatus } from '../../features/lesson/lessonMachine';

export interface QuizTrueFalseProps {
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
  quizStatus: QuizStatus;
  onSelectOption: (index: number) => void;
}

export const QuizTrueFalse: React.FC<QuizTrueFalseProps> = ({
  options,
  selectedIndex,
  correctIndex,
  quizStatus,
  onSelectOption,
}) => {
  const isFinalized = quizStatus === 'correct' || quizStatus === 'second_wrong';

  return (
    <View className="flex-row gap-3">
      {options.map((option, idx) => {
        const isSelected = selectedIndex === idx;
        const isCorrectOption = idx === correctIndex;
        const isTrue = option.toLowerCase().includes('true');

        let borderColor = 'border-border';
        let bgColor = 'bg-surface';
        let textColor = 'text-text';

        if (quizStatus === 'correct' && isSelected) {
          borderColor = 'border-emerald-500';
          bgColor = 'bg-emerald-50';
          textColor = 'text-emerald-950';
        } else if ((quizStatus === 'first_wrong' || quizStatus === 'second_wrong') && isSelected) {
          borderColor = 'border-rose-500';
          bgColor = 'bg-rose-50';
          textColor = 'text-rose-950';
        } else if (quizStatus === 'second_wrong' && isCorrectOption) {
          borderColor = 'border-emerald-500';
          bgColor = 'bg-emerald-50';
          textColor = 'text-emerald-950';
        } else if (isSelected) {
          borderColor = 'border-primary';
          bgColor = 'bg-indigo-50/40';
          textColor = 'text-primary';
        }

        return (
          <Pressable
            key={idx}
            onPress={() => onSelectOption(idx)}
            disabled={isFinalized}
            className={`flex-1 p-5 rounded-card border ${borderColor} ${bgColor} items-center justify-center active:opacity-85`}
            accessibilityRole="button"
            accessibilityLabel={`Answer: ${option}`}
          >
            <View className="mb-2">
              <Ionicons
                name={isTrue ? 'thumbs-up' : 'thumbs-down'}
                size={28}
                color={
                  isSelected
                    ? quizStatus === 'correct'
                      ? '#10B981'
                      : quizStatus === 'first_wrong' || quizStatus === 'second_wrong'
                      ? '#EF4444'
                      : '#4F46E5'
                    : '#64748B'
                }
              />
            </View>

            <AppText variant="h3" className={`font-bold ${textColor}`}>
              {option}
            </AppText>

            {quizStatus === 'second_wrong' && isCorrectOption ? (
              <View className="mt-2 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                <AppText className="text-[10px] font-bold text-emerald-800">
                  Correct Answer
                </AppText>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
};
