import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { ThemedView } from '@/components/themed-view';

interface SurfaceProps {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

/**
 * A card-like surface that renders as real liquid glass on iOS 26+ and falls
 * back to a themed flat card everywhere else (Android, web, older iOS).
 */
export function Surface({ style, children }: SurfaceProps) {
  if (isLiquidGlassAvailable()) {
    return (
      <GlassView glassEffectStyle="regular" isInteractive style={style}>
        {children}
      </GlassView>
    );
  }

  return (
    <ThemedView type="backgroundElement" style={style}>
      {children}
    </ThemedView>
  );
}
