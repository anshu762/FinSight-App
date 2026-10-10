import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNetInfo } from '@react-native-community/netinfo';

export const OfflineBanner: React.FC = () => {
  const netInfo = useNetInfo();
  const isOffline = netInfo.isConnected === false;

  if (!isOffline) return null;

  return (
    <View className="bg-amber-500 px-4 py-2.5 flex-row items-center justify-center shadow-sm">
      <Ionicons name="cloud-offline-outline" size={18} color="#FFFFFF" />
      <Text className="text-white text-xs font-semibold ml-2">
        You are offline. Showing cached information.
      </Text>
    </View>
  );
};
