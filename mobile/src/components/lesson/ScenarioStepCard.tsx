import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui';
import { type ChoiceOption } from '../../api/types';

interface ScenarioStepCardProps {
  option: ChoiceOption;

  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

export const ScenarioStepCard: React.FC<ScenarioStepCardProps> = ({
  option,
  index,
  isSelected,
  onSelect,
}) => {
  let cardBorder = 'border-border';
  let cardBg = 'bg-surface';
  if (isSelected) {
    cardBorder = option.isGood ? 'border-emerald-500' : 'border-rose-500';
    cardBg = option.isGood ? 'bg-emerald-50/50' : 'bg-rose-50/50';
  }

  return (
    <Pressable
      onPress={onSelect}
      className={`p-4 rounded-card border ${cardBorder} ${cardBg} active:opacity-90 mb-3`}
      accessibilityRole="button"
      accessibilityLabel={`Option ${index + 1}: ${option.label}`}
    >
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1">
          <AppText variant="body" className="font-semibold text-text text-sm">
            {option.label}
          </AppText>
        </View>

        <View className="mt-0.5">
          {isSelected ? (
            option.isGood ? (
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            ) : (
              <Ionicons name="close-circle" size={20} color="#EF4444" />
            )
          ) : (
            <Ionicons name="ellipse-outline" size={20} color="#CBD5E1" />
          )}
        </View>
      </View>

      {isSelected && (
        <View className={`mt-2.5 pt-2 border-t ${option.isGood ? 'border-emerald-200' : 'border-rose-200'}`}>
          <AppText
            variant="caption"
            className={`text-xs leading-4 ${option.isGood ? 'text-emerald-800' : 'text-rose-800'}`}
          >
            {option.outcome}
          </AppText>
        </View>
      )}

    </Pressable>
  );
};
