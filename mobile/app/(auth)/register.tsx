import React, { useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
  type TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { KeyboardScreen, ScreenHeader, Input, Button } from '../../src/components/ui';
import { apiClient } from '../../src/api/client';
import { useAuthStore } from '../../src/stores/auth';
import { type AuthResponse, type AppError } from '../../src/api/types';

export default function RegisterScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [dob, setDob] = useState<Date>(new Date(2008, 0, 1));
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [hasPickedDob, setHasPickedDob] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Password Live Checklist
  const passwordRules = useMemo(() => {
    return {
      hasLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };
  }, [password]);

  // Age calculation
  const calculatedAge = useMemo(() => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }, [dob]);

  const isUnder13 = hasPickedDob && calculatedAge < 13;

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDob(selectedDate);
      setHasPickedDob(true);
      if (fieldErrors.dob) {
        setFieldErrors((prev) => ({ ...prev, dob: undefined as unknown as string }));
      }
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      errors.name = 'Name must be between 2 and 60 characters';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!passwordRules.hasLength || !passwordRules.hasUpper || !passwordRules.hasNumber) {
      errors.password = 'Please meet all password requirements';
    }

    if (!hasPickedDob) {
      errors.dob = 'Please select your date of birth';
    } else if (isUnder13) {
      errors.dob = 'You must be at least 13 years old to use FinSight';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    setErrorMessage('');
    if (!validateForm() || loading) return;

    setLoading(true);
    try {
      const response = await apiClient.post<unknown, AuthResponse>('/api/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        dob: dob.toISOString(),
      });

      await login(response.token, response.user);
      router.replace('/(auth)/age-group');
    } catch (err) {
      const appErr = err as AppError;
      setErrorMessage(appErr.message || 'Registration failed. Please check your information.');
      if (appErr.fields) {
        setFieldErrors((prev) => ({ ...prev, ...appErr.fields }));
      }
    } finally {
      setLoading(false);
    }
  };

  const formattedDob = hasPickedDob
    ? dob.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Select your birth date';

  return (
    <KeyboardScreen>
      <ScreenHeader title="" />

      <View className="mb-6 mt-1">
        <Text className="text-2xl font-bold text-text">Create Account</Text>
        <Text className="text-sm text-muted mt-1.5">
          Join FinSight to learn, earn XP, and practice virtual trading.
        </Text>
      </View>

      {errorMessage ? (
        <View className="bg-rose-50 border border-rose-200 rounded-card p-4 mb-4 flex-row items-center">
          <Ionicons name="alert-circle" size={20} color="#EF4444" />
          <Text className="text-xs font-semibold text-danger ml-2.5 flex-1">{errorMessage}</Text>
        </View>
      ) : null}

      {/* Full Name */}
      <Input
        label="Full Name"
        placeholder="Aarav Sharma"
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined as unknown as string }));
        }}
        autoCapitalize="words"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
        error={fieldErrors.name}
        leftIcon={<Ionicons name="person-outline" size={20} color="#64748B" />}
      />

      {/* Email */}
      <Input
        ref={emailRef}
        label="Email Address"
        placeholder="you@example.com"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined as unknown as string }));
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        error={fieldErrors.email}
        leftIcon={<Ionicons name="mail-outline" size={20} color="#64748B" />}
      />

      {/* Password */}
      <Input
        ref={passwordRef}
        label="Password"
        placeholder="Choose a strong password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined as unknown as string }));
        }}
        isPassword
        autoCapitalize="none"
        error={fieldErrors.password}
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#64748B" />}
      />

      {/* Live Password Rules Checklist */}
      <View className="bg-surface border border-border rounded-input p-3.5 mb-4 shadow-sm">
        <Text className="text-xs font-semibold text-text mb-2">Password Requirements</Text>
        
        <View className="flex-row items-center mb-1.5">
          <Ionicons
            name={passwordRules.hasLength ? 'checkmark-circle' : 'ellipse-outline'}
            size={16}
            color={passwordRules.hasLength ? '#10B981' : '#94A3B8'}
          />
          <Text className={`text-xs ml-2 ${passwordRules.hasLength ? 'text-success font-medium' : 'text-muted'}`}>
            At least 8 characters
          </Text>
        </View>

        <View className="flex-row items-center mb-1.5">
          <Ionicons
            name={passwordRules.hasUpper ? 'checkmark-circle' : 'ellipse-outline'}
            size={16}
            color={passwordRules.hasUpper ? '#10B981' : '#94A3B8'}
          />
          <Text className={`text-xs ml-2 ${passwordRules.hasUpper ? 'text-success font-medium' : 'text-muted'}`}>
            At least 1 uppercase letter (A-Z)
          </Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons
            name={passwordRules.hasNumber ? 'checkmark-circle' : 'ellipse-outline'}
            size={16}
            color={passwordRules.hasNumber ? '#10B981' : '#94A3B8'}
          />
          <Text className={`text-xs ml-2 ${passwordRules.hasNumber ? 'text-success font-medium' : 'text-muted'}`}>
            At least 1 number (0-9)
          </Text>
        </View>
      </View>

      {/* Date of Birth Picker Trigger */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-text mb-1.5">Date of Birth</Text>
        <Pressable
          onPress={() => setShowPicker(true)}
          className={`h-[52px] px-3.5 bg-surface border rounded-input flex-row items-center justify-between ${
            fieldErrors.dob || isUnder13 ? 'border-danger' : 'border-border'
          }`}
        >
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={20} color="#64748B" className="mr-2.5" />
            <Text className={`text-base ml-2.5 ${hasPickedDob ? 'text-text font-medium' : 'text-slate-400'}`}>
              {formattedDob}
            </Text>
          </View>
          <Text className="text-xs text-primary font-semibold">Change</Text>
        </Pressable>

        {isUnder13 ? (
          <Text className="text-xs text-danger mt-1 font-semibold">
            You must be at least 13 years old to use FinSight (current age: {calculatedAge}).
          </Text>
        ) : fieldErrors.dob ? (
          <Text className="text-xs text-danger mt-1 font-medium">{fieldErrors.dob}</Text>
        ) : (
          <Text className="text-xs text-muted mt-1">Must be at least 13 years old.</Text>
        )}
      </View>

      {/* DatePicker Component */}
      {showPicker ? (
        <View className="mb-4">
          <DateTimePicker
            value={dob}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            minimumDate={new Date(1920, 0, 1)}
            onChange={handleDateChange}
          />
          {Platform.OS === 'ios' ? (
            <Button
              title="Done Selecting Date"
              size="sm"
              variant="secondary"
              onPress={() => setShowPicker(false)}
              className="mt-2"
            />
          ) : null}
        </View>
      ) : null}

      {/* Submit Button */}
      <View className="mt-4 mb-6">
        <Button
          title="Create Account"
          variant="primary"
          loading={loading}
          disabled={isUnder13}
          onPress={handleRegister}
        />
      </View>

      <View className="flex-row items-center justify-center pb-4">
        <Text className="text-sm text-muted">Already have an account? </Text>
        <Text
          onPress={() => router.replace('/(auth)/login')}
          className="text-sm font-bold text-primary"
        >
          Log In
        </Text>
      </View>
    </KeyboardScreen>
  );
}
