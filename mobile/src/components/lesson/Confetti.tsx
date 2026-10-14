import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COLORS = [
  '#4F46E5', // indigo
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EC4899', // pink
  '#3B82F6', // blue
  '#8B5CF6', // purple
];

interface ParticleProps {
  index: number;
}

const Particle: React.FC<ParticleProps> = ({ index }) => {
  const startX = Math.random() * SCREEN_WIDTH;
  const targetX = startX + (Math.random() - 0.5) * 120;
  const size = 8 + Math.random() * 6;
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const delay = Math.random() * 400;
  const duration = 2200 + Math.random() * 800;

  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(startX);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT * 0.85, {
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );
    translateX.value = withDelay(
      delay,
      withTiming(targetX, { duration, easing: Easing.linear })
    );
    rotation.value = withDelay(
      delay,
      withTiming(360 * (Math.random() > 0.5 ? 2 : -2), {
        duration,
        easing: Easing.linear,
      })
    );
    opacity.value = withDelay(
      delay + duration * 0.7,
      withTiming(0, { duration: duration * 0.3 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        {
          width: size,
          height: size * 1.5,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
};

export const Confetti: React.FC = () => {
  const particles = Array.from({ length: 36 });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particles.map((_, i) => (
        <Particle key={i} index={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    borderRadius: 2,
  },
});
