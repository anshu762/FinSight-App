import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Button, Card, ConfirmDialog } from '../ui';
import { type ChoiceScenarioSim as ChoiceScenarioSimType } from '../../api/types';
import { useLessonMachine } from '../../features/lesson/lessonMachine';
import { ScenarioStepCard } from './ScenarioStepCard';

export interface ChoiceScenarioSimProps {
  simulation: ChoiceScenarioSimType;
  topicColor?: string;
  onContinue: () => void;
}

export const ChoiceScenarioSim: React.FC<ChoiceScenarioSimProps> = ({
  simulation,
  topicColor = '#4F46E5',
  onContinue,
}) => {
  const [showHintDialog, setShowHintDialog] = useState(false);

  const scenarioStepIndex = useLessonMachine((s) => s.scenarioStepIndex);
  const scenarioSelections = useLessonMachine((s) => s.scenarioSelections);
  const hintsUsed = useLessonMachine((s) => s.hintsUsed);
  const hintsRevealed = useLessonMachine((s) => s.hintsRevealed);

  const selectChoiceOption = useLessonMachine((s) => s.selectChoiceOption);
  const nextScenarioStep = useLessonMachine((s) => s.nextScenarioStep);
  const revealHint = useLessonMachine((s) => s.revealHint);
  const resetScenarioSim = useLessonMachine((s) => s.resetScenarioSim);

  const steps = simulation.steps;
  const currentStep = steps[scenarioStepIndex] || steps[0];
  const selectedOptionIndex = scenarioSelections[scenarioStepIndex];
  const isOptionSelected = selectedOptionIndex !== undefined;
  const isLastStep = scenarioStepIndex === steps.length - 1;
  const isHintRevealed = Boolean(hintsRevealed[scenarioStepIndex]);
  const hasHint = Boolean(currentStep.hint);

  const handleNext = () => {
    if (isLastStep) onContinue();
    else nextScenarioStep();
  };

  const handleHintPress = () => {
    if (isHintRevealed || hintsUsed >= 3) return;
    setShowHintDialog(true);
  };

  return (
    <View className="flex-1 justify-between px-5 pb-6">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}>
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-1">
            <AppText variant="caption" className="font-bold uppercase text-[11px] text-muted tracking-wider">
              Interactive Scenario • Step {scenarioStepIndex + 1} of {steps.length}
            </AppText>

            <Pressable onPress={resetScenarioSim} hitSlop={8} className="flex-row items-center gap-1 active:opacity-70" accessibilityLabel="Reset simulation">
              <Ionicons name="refresh" size={14} color="#64748B" />
              <AppText variant="caption" className="text-muted font-bold text-xs">Reset</AppText>
            </Pressable>
          </View>

          <AppText variant="h3" className="text-text mb-1">{simulation.title}</AppText>
          <AppText variant="caption" className="text-slate-600 leading-5">{simulation.intro}</AppText>
        </View>

        <Card className="p-4 bg-surface border-border mb-4">
          <View className="flex-row items-start gap-2.5">
            <View style={{ backgroundColor: `${topicColor}15` }} className="w-7 h-7 rounded-full items-center justify-center mt-0.5">
              <Ionicons name="help" size={16} color={topicColor} />
            </View>
            <AppText variant="body" className="flex-1 font-bold text-slate-800 text-sm leading-5">
              {currentStep.prompt}
            </AppText>
          </View>
        </Card>

        {isHintRevealed && currentStep.hint ? (
          <View className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4 flex-row items-start gap-2.5">
            <Ionicons name="bulb" size={18} color="#D97706" />
            <View className="flex-1">
              <AppText variant="caption" className="font-bold text-amber-800 text-xs mb-0.5">Lesson Hint (-10 XP)</AppText>
              <AppText variant="caption" className="text-amber-900 leading-4 text-xs">{currentStep.hint}</AppText>
            </View>
          </View>
        ) : null}

        <View className="mb-4">
          {currentStep.options.map((option, idx) => (
            <ScenarioStepCard
              key={idx}
              option={option}
              index={idx}
              isSelected={selectedOptionIndex === idx}
              onSelect={() => selectChoiceOption(scenarioStepIndex, idx)}
            />
          ))}
        </View>

        {hasHint && !isHintRevealed && (
          <View className="items-center my-2">
            <Pressable onPress={handleHintPress} hitSlop={8} className="flex-row items-center gap-1.5 py-1.5 px-3 rounded-full bg-amber-50 border border-amber-200 active:opacity-75">
              <Ionicons name="bulb-outline" size={15} color="#D97706" />
              <AppText variant="caption" className="text-amber-800 font-bold text-xs">Need a hint? (-10 XP)</AppText>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <View className="pt-3 border-t border-border bg-background">
        <Button
          title={!isOptionSelected ? 'Select an Option to Continue' : isLastStep ? 'Proceed to Quiz →' : 'Next Step →'}
          variant="primary"
          disabled={!isOptionSelected}
          onPress={handleNext}
        />
      </View>

      <ConfirmDialog
        visible={showHintDialog}
        title="Use a Hint?"
        message="Revealing this hint deducts 10 XP from your final lesson reward. Are you sure?"
        confirmText="Reveal Hint (-10 XP)"
        cancelText="Cancel"
        onConfirm={() => { setShowHintDialog(false); revealHint(scenarioStepIndex); }}
        onCancel={() => setShowHintDialog(false)}
      />
    </View>
  );
};
