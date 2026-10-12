import { useEffect, useRef, useCallback } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { checkIn } from '../api/user';
import { useAuthStore } from '../stores/auth';
import { useToastStore } from '../stores/toast';
import { invalidateHome, invalidateBadges } from '../api/query-client';

const LAST_CHECKIN_KEY = 'finsight_last_checkin_date';

export const getTodayIstString = (): string => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
};

export const useCheckIn = () => {
  const { token, user } = useAuthStore();
  const showToast = useToastStore((s) => s.show);
  const isCheckingRef = useRef(false);

  const performCheckIn = useCallback(async () => {
    if (!token || !user || isCheckingRef.current) return;

    try {
      isCheckingRef.current = true;
      const today = getTodayIstString();
      const lastCheckIn = await SecureStore.getItemAsync(LAST_CHECKIN_KEY);

      if (lastCheckIn === today) {
        return; // Already checked in today
      }

      const res = await checkIn();
      await SecureStore.setItemAsync(LAST_CHECKIN_KEY, today);

      if (!res.alreadyCheckedIn && res.rewards && res.rewards.length > 0) {
        const totalXp = res.rewards.reduce((sum, r) => sum + (r.xp || r.amount || 0), 0);
        showToast(
          `🔥 ${res.streak}-Day Streak! +${totalXp} XP earned`,
          'success'
        );
        invalidateHome();
        if (res.newlyEarnedBadges && res.newlyEarnedBadges.length > 0) {
          invalidateBadges();
        }
      }
    } catch {
      // Check-in failure should be silent in background
    } finally {
      isCheckingRef.current = false;
    }
  }, [token, user, showToast]);

  useEffect(() => {
    performCheckIn();

    const subscription = AppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        if (nextState === 'active') {
          performCheckIn();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [performCheckIn]);
};
