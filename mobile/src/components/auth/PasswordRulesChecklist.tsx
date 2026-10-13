import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui';

interface PasswordRulesChecklistProps {
  hasLength: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
}

export const PasswordRulesChecklist: React.FC<PasswordRulesChecklistProps> = ({
  hasLength,
  hasUpper,
  hasNumber,
}) => {
  const items = [
    { label: 'At least 8 characters', met: hasLength },
    { label: 'At least 1 uppercase letter (A-Z)', met: hasUpper },
    { label: 'At least 1 number (0-9)', met: hasNumber },
  ];

  return (
    <View className="bg-slate-50 border border-border rounded-xl p-3 mb-4 gap-1.5">
      <AppText variant="caption" className="font-semibold text-slate-700 text-xs mb-0.5">
        Password Requirements:
      </AppText>
      {items.map((item, index) => (
        <View key={index} className="flex-row items-center gap-2">
          <Ionicons
            name={item.met ? 'checkmark-circle' : 'ellipse-outline'}
            size={14}
            color={item.met ? '#10B981' : '#94A3B8'}
          />
          <AppText
            variant="caption"
            className={`text-xs ${item.met ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}
          >
            {item.label}
          </AppText>
        </View>
      ))}
    </View>
  );
};
