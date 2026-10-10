import React, { useRef, useState } from 'react';
import { View, Text, type TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardScreen, ScreenHeader, Input, Button } from '../../src/components/ui';
import { apiClient } from '../../src/api/client';
import { useAuthStore } from '../../src/stores/auth';
import { type AuthResponse, type AppError } from '../../src/api/types';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    setErrorMessage('');
    if (!validateForm() || loading) return;

    setLoading(true);
    try {
      const response = await apiClient.post<unknown, AuthResponse>('/api/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      await login(response.token, response.user);

      if (!response.user.ageGroup) {
        router.replace('/(auth)/age-group');
      } else {
        router.replace('/(tabs)');
      }
    } catch (err) {
      const appErr = err as AppError;
      setErrorMessage(appErr.message || 'Invalid email or password. Please try again.');
      if (appErr.fields) {
        setFieldErrors((prev) => ({ ...prev, ...appErr.fields }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardScreen>
      <ScreenHeader title="" />

      <View className="mb-8 mt-2">
        <Text className="text-2xl font-bold text-text">Welcome Back</Text>
        <Text className="text-sm text-muted mt-1.5">
          Log in to continue your financial journey and track your virtual portfolio.
        </Text>
      </View>

      {errorMessage ? (
        <View className="bg-rose-50 border border-rose-200 rounded-card p-4 mb-5 flex-row items-center">
          <Ionicons name="alert-circle" size={20} color="#EF4444" />
          <Text className="text-xs font-semibold text-danger ml-2.5 flex-1">
            {errorMessage}
          </Text>
        </View>
      ) : null}

      <Input
        label="Email Address"
        placeholder="you@example.com"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        error={fieldErrors.email}
        leftIcon={<Ionicons name="mail-outline" size={20} color="#64748B" />}
      />

      <Input
        ref={passwordRef}
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
        }}
        isPassword
        autoCapitalize="none"
        returnKeyType="done"
        onSubmitEditing={handleLogin}
        error={fieldErrors.password}
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#64748B" />}
      />

      <View className="mt-6">
        <Button
          title="Log In"
          variant="primary"
          loading={loading}
          onPress={handleLogin}
        />
      </View>

      <View className="flex-row items-center justify-center mt-6">
        <Text className="text-sm text-muted">Don't have an account? </Text>
        <Text
          onPress={() => router.replace('/(auth)/register')}
          className="text-sm font-bold text-primary"
        >
          Sign Up
        </Text>
      </View>
    </KeyboardScreen>
  );
}
