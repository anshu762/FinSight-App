import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui/AppText';
import { type QuizStatus } from '../../features/lesson/lessonMachine';

export interface QuizMcqProps {
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
  quizStatus: QuizStatus;
  onSelectOption: (index: number) => void;
}

export const QuizMcq: React.FC<QuizMcqProps> = ({
  options,
  selectedIndex,
  correctIndex,
  quizStatus,
  onSelectOption,
}) => {
  const isFinalized = quizStatus === 'correct' || quizStatus === 'second_wrong';

  return (
    <View className="gap-2.5">
      {options.map((option, idx) => {
        const isSelected = selectedIndex === idx;
        const isCorrectOption = idx === correctIndex;

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
            className={`p-4 rounded-card border ${borderColor} ${bgColor} flex-row items-center justify-between active:opacity-85`}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`Option ${idx + 1}: ${option}`}
          >
            <View className="flex-row items-center gap-3 flex-1 pr-2">
              <View
                className={`w-6 h-6 rounded-full border items-center justify-center ${
                  isSelected ? 'border-primary bg-primary' : 'border-slate-300 bg-white'
                }`}
              >
                {quizStatus === 'correct' && isSelected ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : (quizStatus === 'first_wrong' || quizStatus === 'second_wrong') && isSelected ? (
                  <Ionicons name="close" size={14} color="#EF4444" />
                ) : quizStatus === 'second_wrong' && isCorrectOption ? (
                  <Ionicons name="checkmark" size={14} color="#10B981" />
                ) : isSelected ? (
                  <View className="w-2 h-2 rounded-full bg-white" />
                ) : (
                  <AppText className="text-[10px] text-slate-400 font-bold">
                    {String.fromCharCode(65 + idx)}
                  </AppText>
                )}
              </View>

              <AppText variant="body" className={`font-semibold text-sm ${textColor}`}>
                {option}
              </AppText>
            </View>

            {quizStatus === 'second_wrong' && isCorrectOption ? (
              <View className="bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
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
