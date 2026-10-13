import React from 'react';
import { View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { type QuizContent } from '../../api/types';
import { useLessonMachine } from '../../features/lesson/lessonMachine';
import { QuizMcq } from './QuizMcq';
import { QuizTrueFalse } from './QuizTrueFalse';
import { QuizFillBlank } from './QuizFillBlank';

export interface QuizStepProps {
  quiz: QuizContent;
  topicColor?: string;
  onContinue: () => void;
}

export const QuizStep: React.FC<QuizStepProps> = ({
  quiz,
  topicColor = '#4F46E5',
  onContinue,
}) => {
  const selectedOption = useLessonMachine((s) => s.selectedQuizOption);
  const quizStatus = useLessonMachine((s) => s.quizStatus);
  const quizAttempts = useLessonMachine((s) => s.quizAttempts);

  const selectQuizOption = useLessonMachine((s) => s.selectQuizOption);
  const checkQuizAnswer = useLessonMachine((s) => s.checkQuizAnswer);
  const retryQuiz = useLessonMachine((s) => s.retryQuiz);

  const handleCheck = () => {
    checkQuizAnswer(quiz.correctIndex);
  };

  const handleRetry = () => {
    retryQuiz();
  };

  return (
    <View className="flex-1 justify-between px-5 pb-6">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
      >
        {/* Header & Attempt Counter */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-1">
            <AppText
              variant="caption"
              className="font-bold uppercase text-[11px] text-muted tracking-wider"
            >
              Knowledge Check • {quiz.type.replace('_', ' ').toUpperCase()}
            </AppText>

            <View className="bg-slate-100 px-2.5 py-0.5 rounded-full">
              <AppText variant="caption" className="font-bold text-slate-600 text-xs">
                Attempt {quizAttempts}/2
              </AppText>
            </View>
          </View>

          {/* Question (for non fill_blank) */}
          {quiz.type !== 'fill_blank' ? (
            <Card className="p-4 bg-surface border-border mb-4">
              <AppText variant="body" className="font-bold text-text text-base leading-6">
                {quiz.question}
              </AppText>
            </Card>
          ) : null}
        </View>

        {/* Dynamic Quiz Sub-Component */}
        <View className="mb-4">
          {quiz.type === 'mcq' ? (
            <QuizMcq
              options={quiz.options}
              selectedIndex={selectedOption}
              correctIndex={quiz.correctIndex}
              quizStatus={quizStatus}
              onSelectOption={selectQuizOption}
            />
          ) : quiz.type === 'true_false' ? (
            <QuizTrueFalse
              options={quiz.options}
              selectedIndex={selectedOption}
              correctIndex={quiz.correctIndex}
              quizStatus={quizStatus}
              onSelectOption={selectQuizOption}
            />
          ) : (
            <QuizFillBlank
              question={quiz.question}
              options={quiz.options}
              selectedIndex={selectedOption}
              correctIndex={quiz.correctIndex}
              quizStatus={quizStatus}
              onSelectOption={selectQuizOption}
            />
          )}
        </View>

        {/* Feedback Section */}
        {quizStatus === 'correct' ? (
          <View className="bg-emerald-50 border border-emerald-300 rounded-card p-4 mb-2 flex-row items-start gap-3">
            <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center mt-0.5">
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
            </View>
            <View className="flex-1">
              <AppText variant="body" className="font-bold text-emerald-950 text-sm mb-1">
                {quizAttempts === 1 ? 'Brilliant! Correct on first try (+100 XP)' : 'Well done! Correct answer (+50 XP)'}
              </AppText>
              <AppText variant="caption" className="text-emerald-900 leading-5 text-xs">
                {quiz.explanation}
              </AppText>
            </View>
          </View>
        ) : quizStatus === 'first_wrong' ? (
          <View className="bg-rose-50 border border-rose-300 rounded-card p-4 mb-2 flex-row items-start gap-3">
            <View className="w-8 h-8 rounded-full bg-rose-100 items-center justify-center mt-0.5">
              <Ionicons name="close-circle" size={20} color="#E11D48" />
            </View>
            <View className="flex-1">
              <AppText variant="body" className="font-bold text-rose-950 text-sm mb-1">
                Not quite right. Take another look!
              </AppText>
              <AppText variant="caption" className="text-rose-900 leading-5 text-xs">
                {quiz.explanation}
              </AppText>
            </View>
          </View>
        ) : quizStatus === 'second_wrong' ? (
          <View className="bg-rose-50 border border-rose-300 rounded-card p-4 mb-2 flex-row items-start gap-3">
            <View className="w-8 h-8 rounded-full bg-rose-100 items-center justify-center mt-0.5">
              <Ionicons name="close-circle" size={20} color="#E11D48" />
            </View>
            <View className="flex-1">
              <AppText variant="body" className="font-bold text-rose-950 text-sm mb-1">
                Second attempt missed (0 XP for Quiz)
              </AppText>
              <AppText variant="caption" className="text-rose-900 leading-5 text-xs mb-1">
                The correct answer has been highlighted above so you can learn for next time.
              </AppText>
              <AppText variant="caption" className="text-slate-700 leading-5 text-xs italic">
                {quiz.explanation}
              </AppText>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Dynamic Action Button */}
      {quizStatus === 'unanswered' ? (
        <Button
          title="Check Answer"
          variant="primary"
          disabled={selectedOption === null}
          onPress={handleCheck}
          className="w-full"
        />
      ) : quizStatus === 'first_wrong' ? (
        <Button
          title="Try Again"
          variant="secondary"
          onPress={handleRetry}
          className="w-full"
        />
      ) : (
        <Button
          title="Continue to Rewards"
          variant="primary"
          onPress={onContinue}
          className="w-full"
        />
      )}
    </View>
  );
};
