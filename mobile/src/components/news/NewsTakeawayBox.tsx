import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui';

interface NewsTakeawayBoxProps {
  takeaway: string;
}

export const NewsTakeawayBox: React.FC<NewsTakeawayBoxProps> = ({ takeaway }) => {
  return (
    <View className="bg-emerald-50/70 border border-emerald-200 rounded-card p-4 mb-6">
      <View className="flex-row items-center mb-1.5">
        <View className="w-5 h-5 rounded-full bg-emerald-100 items-center justify-center mr-1.5">
          <Ionicons name="bulb-outline" size={13} color="#059669" />
        </View>
        <AppText variant="caption" className="text-emerald-800 font-bold text-xs uppercase tracking-wide">
          Key Takeaway
        </AppText>
      </View>
      <AppText variant="body" className="text-emerald-950 font-semibold text-sm leading-5">
        {takeaway}
      </AppText>
    </View>
  );
};
