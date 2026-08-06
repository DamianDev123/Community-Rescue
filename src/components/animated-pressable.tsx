import * as Haptics from 'expo-haptics';
import { forwardRef } from 'react';
import { Pressable, type PressableProps, type View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type AnimatedStyle,
} from 'react-native-reanimated';

const SPRING = { damping: 16, stiffness: 300, mass: 0.6 } as const;

const ReanimatedPressable = Animated.createAnimatedComponent(Pressable);

export type HapticKind = 'none' | 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning';

function fireHaptic(kind: HapticKind) {
  switch (kind) {
    case 'none':
      return;
    case 'selection':
      Haptics.selectionAsync();
      return;
    case 'success':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    case 'warning':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    case 'medium':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    case 'heavy':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      return;
    case 'light':
    default:
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  /** How much the element shrinks while pressed. @default 0.96 */
  scaleTo?: number;
  /** Haptic pulse fired on press-in. @default 'light' */
  haptic?: HapticKind;
  style?: PressableProps['style'] | AnimatedStyle<ViewStyle> | Array<PressableProps['style'] | AnimatedStyle<ViewStyle>>;
}

/**
 * Drop-in replacement for `Pressable` that adds a tactile scale-down and a haptic
 * pulse on press. Note: when used as the direct child of `<Link asChild>`, pass
 * `style` as a plain object (e.g. via `StyleSheet.flatten`) rather than an array —
 * expo-router's `Slot` clones props onto its immediate child and can't merge array
 * styles.
 */
export const AnimatedPressable = forwardRef<View, AnimatedPressableProps>(
  ({ style, scaleTo = 0.96, haptic = 'light', onPressIn, onPressOut, ...rest }, ref) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return (
      <ReanimatedPressable
        ref={ref}
        onPressIn={(event) => {
          scale.value = withSpring(scaleTo, SPRING);
          fireHaptic(haptic);
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scale.value = withSpring(1, SPRING);
          onPressOut?.(event);
        }}
        style={[animatedStyle, style]}
        {...rest}
      />
    );
  }
);
AnimatedPressable.displayName = 'AnimatedPressable';
