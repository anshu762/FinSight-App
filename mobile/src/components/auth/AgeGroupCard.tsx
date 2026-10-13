import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { AppText, Card } from '../ui';
import { type AgeGroupDefinition } from '../../lib/ageGroups';

interface AgeGroupCardProps {
  option: AgeGroupDefinition;
  isSelected: boolean;
  onSelect: () => void;
}

export const AgeGroupCard: React.FC<AgeGroupCardProps> = ({
  option,
  isSelected,
  onSelect,
}) => {
  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    onSelect();
  };

  return (
    <Pressable
      onPress={handlePress}
      className="mb-3.5 active:opacity-90"
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${option.title}, ${option.ageRange}`}
    >
      <Card
        className={`p-4 border-2 ${
          isSelected ? 'bg-primary-soft/50 border-primary' : 'bg-surface border-border'
        }`}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-center gap-3 flex-1">
            <View
              style={{ backgroundColor: option.bgSoft }}
              className="w-12 h-12 rounded-2xl items-center justify-center border border-slate-100"
            >
              <Ionicons name={option.icon} size={24} color={option.color} />
            </View>

            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <AppText variant="h3" className="text-base font-bold text-text">
                  {option.title}
                </AppText>
                <View
                  style={{ backgroundColor: option.bgSoft }}
                  className="px-2 py-0.5 rounded-full"
                >
                  <AppText
                    variant="caption"
                    style={{ color: option.color }}
                    className="text-[11px] font-bold"
                  >
                    {option.ageRange}
                  </AppText>
                </View>
              </View>

              <AppText variant="caption" className="text-muted text-xs leading-4 mt-1">
                {option.description}
              </AppText>
            </View>
          </View>

          <View className="ml-2 mt-1">
            <Ionicons
              name={isSelected ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={isSelected ? '#4F46E5' : '#CBD5E1'}
            />
          </View>
        </View>
      </Card>
    </Pressable>
  );
};
