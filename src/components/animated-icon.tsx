import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { SplashBackground } from '@/constants/theme';

const HOLD_DURATION = 250;
const ANIMATE_DURATION = 950;

/**
 * Splash-to-app handoff: shows a static frame that exactly matches the native
 * splash screen (so hiding it causes no visible jump), then plays a short
 * "breathe, then dissolve" animation before revealing the app underneath.
 */
export function AnimatedSplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);
  const isDark = useColorScheme() === 'dark';

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: {
      transform: [{ scale: 1 }],
      opacity: 1,
    },
    22: {
      transform: [{ scale: 1 }],
      opacity: 1,
      easing: Easing.out(Easing.quad),
    },
    45: {
      transform: [{ scale: 1.07 }],
      opacity: 1,
      easing: Easing.inOut(Easing.quad),
    },
    62: {
      transform: [{ scale: 1 }],
      opacity: 1,
      easing: Easing.inOut(Easing.quad),
    },
    100: {
      transform: [{ scale: 1.18 }],
      opacity: 0,
      easing: Easing.elastic(0.7),
    },
  });

  const image = <Image style={styles.image} source={require('@/assets/images/splash-icon.png')} />;
  const backgroundColor = isDark ? SplashBackground.dark : SplashBackground.light;

  return animate ? (
    <Animated.View
      entering={splashKeyframe.duration(HOLD_DURATION + ANIMATE_DURATION).withCallback((finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={[styles.splashOverlay, { backgroundColor }]}>
      {image}
    </Animated.View>
  ) : (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => {
          setAnimate(true);
        });
      }}
      style={[styles.splashOverlay, { backgroundColor }]}>
      {image}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 220,
    height: 220 * (318 / 900),
  },
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});
