import React from 'react';
import { Modal, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { Button } from './Button';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmTitle?: string;
  confirmText?: string;
  cancelTitle?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmTitle,
  confirmText,
  cancelTitle,
  cancelText,
  destructive = false,
  onConfirm,
  onCancel,
}) => {
  const resolvedConfirmTitle = confirmTitle ?? confirmText ?? 'Confirm';
  const resolvedCancelTitle = cancelTitle ?? cancelText ?? 'Cancel';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Pressable
        onPress={onCancel}
        className="flex-1 bg-slate-900/65 items-center justify-center p-5"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="w-full max-w-[350px] bg-surface rounded-3xl p-6 border border-border shadow-2xl items-center"
        >
          {/* Header Icon Badge */}
          <View
            className={`w-14 h-14 rounded-2xl items-center justify-center mb-3.5 border ${
              destructive
                ? 'bg-rose-50 border-rose-200'
                : 'bg-indigo-50 border-indigo-200'
            }`}
          >
            <Ionicons
              name={destructive ? 'alert-circle-outline' : 'help-circle-outline'}
              size={28}
              color={destructive ? '#EF4444' : '#4F46E5'}
            />
          </View>

          <AppText variant="h2" className="text-lg font-bold text-text text-center mb-1.5">
            {title}
          </AppText>

          <AppText
            variant="caption"
            className="text-sm text-slate-500 text-center leading-5 mb-6 px-1"
          >
            {message}
          </AppText>

          <View className="flex-row items-center gap-3 w-full">
            <Button
              title={resolvedCancelTitle}
              variant="secondary"
              size="md"
              onPress={onCancel}
              className="flex-1"
            />
            <Button
              title={resolvedConfirmTitle}
              variant={destructive ? 'danger' : 'primary'}
              size="md"
              onPress={onConfirm}
              className="flex-1"
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
