import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface PulseGlowProps {
  color: string;
  borderRadius: number;
}

/**
 * A soft, looping "radar ping" glow rendered behind another element (e.g. an
 * emergency call button) to draw the eye without being distracting.
 */
export function PulseGlow({ color, borderRadius }: PulseGlowProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.out(Easing.ease) }), -1, false);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: (1 - progress.value) * 0.35,
    transform: [{ scale: 1 + progress.value * 0.08 }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, styles.ring, { backgroundColor: color, borderRadius }, animatedStyle]}
    />
  );
}

const styles = StyleSheet.create({
  ring: {
    zIndex: -1,
  },
});
