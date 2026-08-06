import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

interface DotConfig {
  left: number;
  top: number;
  size: number;
  /** 0–1, offsets this dot's position along the shared twinkle wave. */
  phase: number;
}

const DOT_COUNT = 42;

/** Generated once at module load — stable for the life of the app, not re-randomized on render. */
const DOTS: DotConfig[] = Array.from({ length: DOT_COUNT }, () => ({
  left: 3 + Math.random() * 94,
  top: 3 + Math.random() * 94,
  size: 2 + Math.random() * 2.5,
  phase: Math.random(),
}));

interface DotProps {
  config: DotConfig;
  progress: SharedValue<number>;
  color: string;
  minOpacity: number;
  maxOpacity: number;
}

function Dot({ config, progress, color, minOpacity, maxOpacity }: DotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const wave = (Math.sin((progress.value + config.phase) * Math.PI * 2) + 1) / 2;
    return { opacity: minOpacity + wave * (maxOpacity - minOpacity) };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        animatedStyle,
        {
          left: `${config.left}%`,
          top: `${config.top}%`,
          width: config.size,
          height: config.size,
          borderRadius: config.size,
          backgroundColor: color,
        },
      ]}
    />
  );
}

interface DotFieldProps {
  color: string;
  minOpacity?: number;
  maxOpacity?: number;
}

/** A soft field of slowly twinkling dots, meant to sit behind screen content. */
export function DotField({ color, minOpacity = 0.12, maxOpacity = 0.55 }: DotFieldProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 6000, easing: Easing.linear }), -1, false);
  }, [progress]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {DOTS.map((config, index) => (
        <Dot
          key={index}
          config={config}
          progress={progress}
          color={color}
          minOpacity={minOpacity}
          maxOpacity={maxOpacity}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
  },
});
