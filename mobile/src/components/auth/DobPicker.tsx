import React, { useState, useMemo } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { AppText, Button, ModalSheet } from '../ui';

interface DobPickerProps {
  dob: Date;
  onChange: (date: Date) => void;
  hasPicked: boolean;
  error?: string;
  isUnder13: boolean;
}

const MONTHS = [
  { label: 'Jan', full: 'January', value: 0 },
  { label: 'Feb', full: 'February', value: 1 },
  { label: 'Mar', full: 'March', value: 2 },
  { label: 'Apr', full: 'April', value: 3 },
  { label: 'May', full: 'May', value: 4 },
  { label: 'Jun', full: 'June', value: 5 },
  { label: 'Jul', full: 'July', value: 6 },
  { label: 'Aug', full: 'August', value: 7 },
  { label: 'Sep', full: 'September', value: 8 },
  { label: 'Oct', full: 'October', value: 9 },
  { label: 'Nov', full: 'November', value: 10 },
  { label: 'Dec', full: 'December', value: 11 },
];

export const DobPicker: React.FC<DobPickerProps> = ({
  dob,
  onChange,
  hasPicked,
  error,
  isUnder13,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Local draft states inside modal
  const [selectedYear, setSelectedYear] = useState<number>(dob.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(dob.getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(dob.getDate());

  const currentYear = new Date().getFullYear();

  // Target youth demo: 1992 through currentYear - 10 (e.g. 2016)
  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = currentYear - 11; y >= currentYear - 35; y--) {
      list.push(y);
    }
    return list;
  }, [currentYear]);

  // Days in month calculation
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedYear, selectedMonth]);

  const days = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [daysInMonth]);

  // If selected day exceeds max days in new month (e.g. Feb 31), clamp it
  const effectiveDay = Math.min(selectedDay, daysInMonth);

  // Live draft age calculation
  const draftAge = useMemo(() => {
    const today = new Date();
    let age = today.getFullYear() - selectedYear;
    const m = today.getMonth() - selectedMonth;
    if (m < 0 || (m === 0 && today.getDate() < effectiveDay)) age--;
    return age;
  }, [selectedYear, selectedMonth, effectiveDay]);

  const draftUnder13 = draftAge < 13;

  const stageLabel = useMemo(() => {
    if (draftUnder13) return 'Must be at least 13 yrs';
    if (draftAge <= 15) return 'Teen Beginner Stage (13–15)';
    if (draftAge <= 18) return 'Teen Advanced Stage (16–18)';
    if (draftAge <= 21) return 'Young Adult Stage (19–21)';
    if (draftAge <= 25) return 'Young Professional (22–25)';
    return 'Adult Learner (26+)';
  }, [draftAge, draftUnder13]);

  const quickPresets = useMemo(() => [
    { label: '14 yrs', year: currentYear - 14 },
    { label: '16 yrs', year: currentYear - 16 },
    { label: '18 yrs', year: currentYear - 18 },
    { label: '21 yrs', year: currentYear - 21 },
    { label: '24 yrs', year: currentYear - 24 },
  ], [currentYear]);

  const handleOpen = () => {
    setSelectedYear(dob.getFullYear());
    setSelectedMonth(dob.getMonth());
    setSelectedDay(dob.getDate());
    setShowPicker(true);
  };

  const handleConfirm = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Haptics fallback
    }
    const newDate = new Date(selectedYear, selectedMonth, effectiveDay);
    onChange(newDate);
    setShowPicker(false);
  };

  const handlePresetSelect = (presetYear: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics fallback
    }
    setSelectedYear(presetYear);
    setSelectedMonth(0); // Jan
    setSelectedDay(1);
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
        onPress={handleOpen}
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
        <View className="w-8 h-8 rounded-full bg-indigo-50 items-center justify-center border border-indigo-100">
          <Ionicons name="calendar-outline" size={17} color="#4F46E5" />
        </View>
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

      {/* FinSight Branded Date Picker Modal */}
      <ModalSheet
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        title="Select Date of Birth"
        subtitle="Used to customize your curriculum and simulation track"
      >
        <View className="gap-3 py-1">
          {/* Live Preview & Stage Card */}
          <View
            className={`p-3.5 rounded-2xl border ${
              draftUnder13
                ? 'bg-rose-50/70 border-rose-200'
                : 'bg-indigo-50/70 border-indigo-200'
            }`}
          >
            <View className="flex-row items-center justify-between mb-1">
              <AppText variant="caption" className="text-slate-500 font-semibold text-xs">
                Selected Birth Date
              </AppText>
              <View
                className={`px-2.5 py-0.5 rounded-full border ${
                  draftUnder13
                    ? 'bg-rose-100 border-rose-300'
                    : 'bg-indigo-100 border-indigo-300'
                }`}
              >
                <AppText
                  className={`text-[11px] font-bold ${
                    draftUnder13 ? 'text-rose-800' : 'text-primary'
                  }`}
                >
                  {draftAge} Years Old
                </AppText>
              </View>
            </View>

            <AppText
              variant="h3"
              className={`text-lg font-extrabold ${
                draftUnder13 ? 'text-rose-700' : 'text-primary'
              }`}
            >
              {effectiveDay} {MONTHS[selectedMonth]?.full} {selectedYear}
            </AppText>

            <View className="flex-row items-center gap-1.5 mt-1.5">
              <Ionicons
                name={draftUnder13 ? 'alert-circle' : 'sparkles'}
                size={14}
                color={draftUnder13 ? '#EF4444' : '#4F46E5'}
              />
              <AppText
                variant="caption"
                className={`text-xs font-semibold ${
                  draftUnder13 ? 'text-rose-700' : 'text-indigo-800'
                }`}
              >
                {stageLabel}
              </AppText>
            </View>
          </View>

          {/* Quick Age Presets */}
          <View>
            <AppText variant="caption" className="text-slate-500 font-semibold text-xs mb-2">
              Quick Age Shortcuts
            </AppText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingBottom: 2 }}
            >
              {quickPresets.map((preset) => {
                const isActive = selectedYear === preset.year;
                return (
                  <Pressable
                    key={preset.label}
                    onPress={() => handlePresetSelect(preset.year)}
                    style={{ height: 32, borderRadius: 16 }}
                    className={`px-3 items-center justify-center border active:opacity-80 ${
                      isActive
                        ? 'bg-primary border-primary'
                        : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    <AppText
                      className={`text-xs font-bold ${
                        isActive ? 'text-white' : 'text-slate-700'
                      }`}
                    >
                      {preset.label}
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* 3 Column Wheels: Day | Month | Year */}
          <View className="flex-row gap-2 mt-1 mb-2">
            {/* Day Column */}
            <View className="flex-1 bg-slate-50/80 border border-border rounded-2xl p-2 items-center">
              <AppText variant="caption" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Day
              </AppText>
              <ScrollView
                showsVerticalScrollIndicator={false}
                className="h-[150px] w-full"
                nestedScrollEnabled
              >
                <View className="gap-1.5 items-center pb-2">
                  {days.map((d) => {
                    const isSelected = effectiveDay === d;
                    return (
                      <Pressable
                        key={d}
                        onPress={() => {
                          try { Haptics.selectionAsync(); } catch {}
                          setSelectedDay(d);
                        }}
                        style={{ height: 32, borderRadius: 16 }}
                        className={`w-full items-center justify-center border ${
                          isSelected
                            ? 'bg-primary border-primary shadow-xs'
                            : 'bg-white border-slate-200/80 active:bg-slate-100'
                        }`}
                      >
                        <AppText
                          className={`text-xs font-bold ${
                            isSelected ? 'text-white' : 'text-slate-700'
                          }`}
                        >
                          {d}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            {/* Month Column */}
            <View className="flex-[1.2] bg-slate-50/80 border border-border rounded-2xl p-2 items-center">
              <AppText variant="caption" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Month
              </AppText>
              <ScrollView
                showsVerticalScrollIndicator={false}
                className="h-[150px] w-full"
                nestedScrollEnabled
              >
                <View className="gap-1.5 items-center pb-2">
                  {MONTHS.map((m) => {
                    const isSelected = selectedMonth === m.value;
                    return (
                      <Pressable
                        key={m.value}
                        onPress={() => {
                          try { Haptics.selectionAsync(); } catch {}
                          setSelectedMonth(m.value);
                        }}
                        style={{ height: 32, borderRadius: 16 }}
                        className={`w-full items-center justify-center border ${
                          isSelected
                            ? 'bg-primary border-primary shadow-xs'
                            : 'bg-white border-slate-200/80 active:bg-slate-100'
                        }`}
                      >
                        <AppText
                          className={`text-xs font-bold ${
                            isSelected ? 'text-white' : 'text-slate-700'
                          }`}
                        >
                          {m.label}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            {/* Year Column */}
            <View className="flex-[1.2] bg-slate-50/80 border border-border rounded-2xl p-2 items-center">
              <AppText variant="caption" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Year
              </AppText>
              <ScrollView
                showsVerticalScrollIndicator={false}
                className="h-[150px] w-full"
                nestedScrollEnabled
              >
                <View className="gap-1.5 items-center pb-2">
                  {years.map((y) => {
                    const isSelected = selectedYear === y;
                    return (
                      <Pressable
                        key={y}
                        onPress={() => {
                          try { Haptics.selectionAsync(); } catch {}
                          setSelectedYear(y);
                        }}
                        style={{ height: 32, borderRadius: 16 }}
                        className={`w-full items-center justify-center border ${
                          isSelected
                            ? 'bg-primary border-primary shadow-xs'
                            : 'bg-white border-slate-200/80 active:bg-slate-100'
                        }`}
                      >
                        <AppText
                          className={`text-xs font-bold ${
                            isSelected ? 'text-white' : 'text-slate-700'
                          }`}
                        >
                          {y}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Action Button */}
          <Button
            title={draftUnder13 ? 'Under 13 Not Eligible' : 'Confirm Date of Birth'}
            variant="primary"
            size="lg"
            disabled={draftUnder13}
            onPress={handleConfirm}
            className="w-full mt-1"
          />
        </View>
      </ModalSheet>
    </View>
  );
};
