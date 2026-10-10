import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { Button } from './Button';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmTitle?: string;
  cancelTitle?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmTitle = 'Confirm',
  cancelTitle = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        onPress={onCancel}
        className="flex-1 bg-black/40 items-center justify-center p-5"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="w-full max-w-[340px] bg-surface rounded-card p-5 border border-border shadow-lg"
        >
          <Text className="text-lg font-bold text-text mb-2">{title}</Text>
          <Text className="text-sm text-muted mb-5 leading-5">{message}</Text>

          <View className="flex-row items-center gap-3">
            <Button
              title={cancelTitle}
              variant="secondary"
              size="sm"
              onPress={onCancel}
              className="flex-1"
            />
            <Button
              title={confirmTitle}
              variant={destructive ? 'danger' : 'primary'}
              size="sm"
              onPress={onConfirm}
              className="flex-1"
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
