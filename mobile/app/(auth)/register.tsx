import React, { useRef, useState, useMemo } from 'react';
import { View, type TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardScreen, ScreenHeader, Input, Button, AppText } from '../../src/components/ui';
import { PasswordRulesChecklist, DobPicker } from '../../src/components/auth';
import { registerUser } from '../../src/api/auth';
import { useAuthStore } from '../../src/stores/auth';
import { type AppError } from '../../src/api/types';

export default function RegisterScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState<Date>(new Date(2008, 0, 1));
  const [hasPickedDob, setHasPickedDob] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const passwordRules = useMemo(() => ({
    hasLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  }), [password]);

  const isUnder13 = useMemo(() => {
    if (!hasPickedDob) return false;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age < 13;
  }, [dob, hasPickedDob]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Valid email required';
    if (!passwordRules.hasLength || !passwordRules.hasUpper || !passwordRules.hasNumber) {
      errors.password = 'Password does not meet requirements';
    }
    if (!hasPickedDob) errors.dob = 'Please select your birth date';
    if (isUnder13) errors.dob = 'Must be at least 13 years old';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (loading) return;
    setErrorMessage('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        dob: dob.toISOString(),
      });

      await login(response.token, response.user);
      router.replace('/(auth)/age-group');
    } catch (err) {
      const appErr = err as AppError;
      setErrorMessage(appErr.message || 'Registration failed. Please try again.');
      if (appErr.fields) setFieldErrors(appErr.fields);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardScreen>
      <ScreenHeader title="" showBack onBack={() => router.back()} />

      <View className="mb-5 mt-1 items-center">
        <View className="w-14 h-14 rounded-2xl bg-primary items-center justify-center mb-3 shadow-md shadow-indigo-200">
          <Ionicons name="sparkles" size={26} color="#FFFFFF" />
        </View>
        <AppText variant="title" className="text-2xl font-extrabold text-text text-center">
          Join FinSight
        </AppText>
        <AppText variant="body" className="text-sm text-muted text-center mt-1 px-4">
          Bite-sized financial lessons & ₹10,00,000 virtual cash simulator
        </AppText>
      </View>

      {Boolean(errorMessage) && (
        <View className="flex-row items-center p-3.5 mb-4 bg-rose-50 border border-rose-200 rounded-2xl gap-2.5">
          <Ionicons name="alert-circle" size={20} color="#EF4444" />
          <AppText variant="caption" className="text-danger flex-1 text-xs font-semibold">
            {errorMessage}
          </AppText>
        </View>
      )}

      <View className="bg-surface rounded-3xl p-5 border border-border shadow-sm mb-4">
        <Input
          label="Full Name"
          placeholder="e.g. Anubhav Singh"
          value={name}
          onChangeText={(t) => { setName(t); if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined as unknown as string })); }}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          error={fieldErrors.name}
        />

        <Input
          ref={emailRef}
          label="Email Address"
          placeholder="name@example.com"
          value={email}
          onChangeText={(t) => { setEmail(t); if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined as unknown as string })); }}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          error={fieldErrors.email}
        />

        <Input
          ref={passwordRef}
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={(t) => { setPassword(t); if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined as unknown as string })); }}
          isPassword
          returnKeyType="done"
          error={fieldErrors.password}
          containerClassName="mb-1"
        />

        <PasswordRulesChecklist {...passwordRules} />

        <DobPicker
          dob={dob}
          onChange={(d) => { setDob(d); setHasPickedDob(true); }}
          hasPicked={hasPickedDob}
          isUnder13={isUnder13}
          error={fieldErrors.dob}
        />
      </View>

      <Button
        title="Create Free Account"
        variant="primary"
        size="lg"
        loading={loading}
        disabled={loading || isUnder13}
        onPress={handleRegister}
        className="mb-4 shadow-sm"
      />

      <View className="flex-row justify-center items-center py-2">
        <AppText variant="body" className="text-sm text-muted">
          Already have an account?{' '}
        </AppText>
        <Button
          title="Log In"
          variant="ghost"
          size="sm"
          onPress={() => router.replace('/(auth)/login')}
        />
      </View>
    </KeyboardScreen>
  );
}
