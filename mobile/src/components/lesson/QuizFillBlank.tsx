import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui/AppText';
import { Card } from '../ui/Card';
import { type QuizStatus } from '../../features/lesson/lessonMachine';

export interface QuizFillBlankProps {
  question: string;
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
  quizStatus: QuizStatus;
  onSelectOption: (index: number) => void;
}

export const QuizFillBlank: React.FC<QuizFillBlankProps> = ({
  question,
  options,
  selectedIndex,
  correctIndex,
  quizStatus,
  onSelectOption,
}) => {
  const isFinalized = quizStatus === 'correct' || quizStatus === 'second_wrong';
  const selectedWord = selectedIndex !== null ? options[selectedIndex] : null;

  // Split question by "___"
  const parts = question.split('___');

  return (
    <View className="gap-4">
      {/* Dynamic Sentence Preview Card */}
      <Card className="p-5 bg-slate-50 border-border">
        <AppText variant="caption" className="font-bold text-muted uppercase text-[11px] mb-2 tracking-wider">
          Complete the statement:
        </AppText>

        <AppText variant="body" className="font-semibold text-text text-base leading-6">
          {parts[0]}
          <AppText
            className={`font-bold ${
              selectedWord
                ? quizStatus === 'correct'
                  ? 'text-emerald-600 underline'
                  : quizStatus === 'first_wrong' || quizStatus === 'second_wrong'
                  ? 'text-rose-600 underline line-through'
                  : 'text-primary underline'
                : 'text-slate-400'
            }`}
          >
            {selectedWord ? ` ${selectedWord} ` : ' [ ______ ] '}
          </AppText>
          {parts[1] || ''}
        </AppText>

        {quizStatus === 'second_wrong' ? (
          <View className="mt-3 pt-2.5 border-t border-slate-200 flex-row items-center gap-1.5">
            <Ionicons name="information-circle" size={16} color="#059669" />
            <AppText variant="caption" className="font-bold text-emerald-800 text-xs">
              Correct word: {options[correctIndex]}
            </AppText>
          </View>
        ) : null}
      </Card>

      {/* Selectable Choice Chips */}
      <View className="gap-2">
        <AppText variant="caption" className="font-bold text-slate-700 text-xs">
          Select word to fill the blank:
        </AppText>

        <View className="flex-row flex-wrap gap-2.5">
          {options.map((option, idx) => {
            const isSelected = selectedIndex === idx;
            const isCorrectOption = idx === correctIndex;

            let chipBorder = 'border-border';
            let chipBg = 'bg-surface';
            let chipText = 'text-text';

            if (quizStatus === 'correct' && isSelected) {
              chipBorder = 'border-emerald-500';
              chipBg = 'bg-emerald-50';
              chipText = 'text-emerald-800 font-bold';
            } else if ((quizStatus === 'first_wrong' || quizStatus === 'second_wrong') && isSelected) {
              chipBorder = 'border-rose-500';
              chipBg = 'bg-rose-50';
              chipText = 'text-rose-800 font-bold';
            } else if (quizStatus === 'second_wrong' && isCorrectOption) {
              chipBorder = 'border-emerald-500';
              chipBg = 'bg-emerald-50';
              chipText = 'text-emerald-800 font-bold';
            } else if (isSelected) {
              chipBorder = 'border-primary';
              chipBg = 'bg-primary';
              chipText = 'text-white font-bold';
            }

            return (
              <Pressable
                key={idx}
                onPress={() => onSelectOption(idx)}
                disabled={isFinalized}
                className={`px-4 py-3 rounded-xl border ${chipBorder} ${chipBg} active:opacity-85`}
                accessibilityRole="button"
                accessibilityLabel={`Word option: ${option}`}
              >
                <AppText variant="body" className={`text-sm ${chipText}`}>
                  {option}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};
