import React, { useRef, useState } from 'react';
import { View, type TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardScreen, ScreenHeader, Input, Button, AppText } from '../../src/components/ui';
import { loginUser } from '../../src/api/auth';
import { useAuthStore } from '../../src/stores/auth';
import { type AppError } from '../../src/api/types';

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
    if (loading) return;
    setErrorMessage('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await loginUser({
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
        setFieldErrors(appErr.fields);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardScreen>
      <ScreenHeader title="Welcome Back" showBack onBack={() => router.back()} />

      <View className="mb-6 mt-2">
        <AppText variant="h2" className="text-2xl font-bold text-text">
          Log in to FinSight
        </AppText>
        <AppText variant="body" className="text-sm text-muted mt-1">
          Continue your financial literacy and simulation journey.
        </AppText>
      </View>

      {Boolean(errorMessage) && (
        <View className="flex-row items-center p-3.5 mb-5 bg-rose-50 border border-rose-200 rounded-xl gap-2.5">
          <Ionicons name="alert-circle" size={20} color="#EF4444" />
          <AppText variant="caption" className="text-danger flex-1 text-xs font-medium">
            {errorMessage}
          </AppText>
        </View>
      )}

      <View className="mb-4">
        <Input
          label="Email Address"
          placeholder="e.g. anubhav@example.com"
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
        />
      </View>

      <View className="mb-6">
        <Input
          ref={passwordRef}
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
          }}
          isPassword
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          error={fieldErrors.password}
        />
      </View>

      <Button
        title="Log In"
        variant="primary"
        loading={loading}
        disabled={loading}
        onPress={handleLogin}
        className="mb-4"
      />

      <View className="flex-row justify-center items-center py-2">
        <AppText variant="body" className="text-sm text-muted">
          Don't have an account?{' '}
        </AppText>
        <Button
          title="Sign Up"
          variant="ghost"
          size="sm"
          onPress={() => router.replace('/(auth)/register')}
        />
      </View>
    </KeyboardScreen>
  );
}
