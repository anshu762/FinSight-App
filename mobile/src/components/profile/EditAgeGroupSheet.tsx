import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Button, ModalSheet } from '../ui';
import { AGE_GROUPS } from '../../lib/ageGroups';
import { type AgeGroup } from '../../api/types';

interface EditAgeGroupSheetProps {
  visible: boolean;
  selectedAgeGroup?: AgeGroup;
  onSelect: (group: AgeGroup) => void;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export const EditAgeGroupSheet: React.FC<EditAgeGroupSheetProps> = ({
  visible,
  selectedAgeGroup,
  onSelect,
  onClose,
  onSave,
  isSaving,
}) => {
  return (
    <ModalSheet
      visible={visible}
      onClose={onClose}
      title="Change Learning Stage"
      subtitle="Tailor lessons and simulations to your stage"
    >
      <View className="gap-2.5 py-1 mb-4">
        {AGE_GROUPS.map((group) => {
          const isSelected = selectedAgeGroup === group.id;
          return (
            <Pressable
              key={group.id}
              onPress={() => onSelect(group.id)}
              className={`p-3.5 rounded-card border flex-row items-center gap-3 active:opacity-90 ${
                isSelected
                  ? 'border-primary bg-primary-soft/40'
                  : 'border-border bg-surface'
              }`}
            >
              <AppText className="text-2xl">{group.emoji}</AppText>
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <AppText variant="body" className="font-bold text-sm">
                    {group.title}
                  </AppText>
                  <AppText variant="caption" className="text-muted text-xs">
                    {group.age}
                  </AppText>
                </View>
                <AppText variant="caption" className="text-muted text-xs mt-0.5">
                  {group.desc}
                </AppText>
              </View>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={20} color="#4F46E5" />
              )}
            </Pressable>
          );
        })}
      </View>

      <Button
        title="Save Changes"
        variant="primary"
        loading={isSaving}
        onPress={onSave}
      />
    </ModalSheet>
  );
};
