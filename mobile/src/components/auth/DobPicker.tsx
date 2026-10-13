import React, { useState } from 'react';
import { View, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { AppText } from '../ui';

interface DobPickerProps {
  dob: Date;
  onChange: (date: Date) => void;
  hasPicked: boolean;
  error?: string;
  isUnder13: boolean;
}

export const DobPicker: React.FC<DobPickerProps> = ({
  dob,
  onChange,
  hasPicked,
  error,
  isUnder13,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formattedDate = hasPicked
    ? dob.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Select your birth date';

  return (
    <View className="mb-4">
      <AppText variant="caption" className="font-semibold text-slate-700 text-xs mb-1.5">
        Date of Birth
      </AppText>

      <Pressable
        onPress={() => setShowPicker(true)}
        className={`flex-row items-center justify-between h-[52px] px-4 rounded-input border bg-surface active:opacity-85 ${
          error || isUnder13 ? 'border-danger bg-rose-50/20' : 'border-border'
        }`}
        accessibilityRole="button"
        accessibilityLabel={`Date of birth selector, currently ${formattedDate}`}
      >
        <AppText
          variant="body"
          className={`text-sm ${hasPicked ? 'text-text font-medium' : 'text-slate-400'}`}
        >
          {formattedDate}
        </AppText>
        <Ionicons name="calendar-outline" size={20} color="#64748B" />
      </Pressable>

      {isUnder13 && (
        <AppText variant="caption" className="text-danger text-xs mt-1.5 ml-1">
          FinSight is designed for ages 13–25. Users under 13 cannot register.
        </AppText>
      )}

      {error && !isUnder13 && (
        <AppText variant="caption" className="text-danger text-xs mt-1.5 ml-1">
          {error}
        </AppText>
      )}

      {showPicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};
