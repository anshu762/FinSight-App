import React from 'react';
import {
  Modal,
  View,
  Pressable,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';

export interface ModalSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const ModalSheet: React.FC<ModalSheetProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback>
            <View className="bg-surface rounded-t-[24px] px-5 pt-4 pb-8 max-h-[85%] border-t border-border shadow-2xl">
              {/* Drag Handle */}
              <View className="w-10 h-1 bg-slate-300 rounded-full self-center mb-4" />

              {/* Header */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1 pr-3">
                  <AppText variant="h3">{title}</AppText>
                  {subtitle ? (
                    <AppText variant="caption" className="text-muted mt-0.5">
                      {subtitle}
                    </AppText>
                  ) : null}
                </View>
                <Pressable
                  onPress={onClose}
                  hitSlop={8}
                  className="w-11 h-11 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
                  accessibilityLabel="Close dialog"
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </Pressable>
              </View>

              {/* Body */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                {children}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
