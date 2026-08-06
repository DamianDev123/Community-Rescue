/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#10141C',
    background: '#F4F6F9',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E8EFFC',
    textSecondary: '#5B6472',
    border: '#E6E9EF',
    primary: '#1768D1',
  },
  dark: {
    text: '#F4F6FB',
    background: '#0A0E1B',
    backgroundElement: '#161C31',
    backgroundSelected: '#22315A',
    textSecondary: '#99A3C2',
    border: '#2A3358',
    primary: '#5EA1FF',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Full-screen background for dark mode — a soft night-sky gradient (deep indigo →
 * navy → blue-black) instead of a flat charcoal, so accent colors have more to pop
 * against. Light mode stays a flat fill (`Colors.light.background`).
 */
export const DarkBackgroundGradient = ['#0A0E1B', '#141C36', '#0D1428'] as const;

/**
 * Native + JS splash screen background, light/dark. Mirrors `app.json`'s
 * `expo-splash-screen` plugin config (`backgroundColor` / `dark.backgroundColor`) —
 * app.json is static JSON and can't import this, so keep the two in sync by hand.
 * Dark matches `DarkBackgroundGradient[0]` so the splash fades straight into the
 * app's own background with no visible color jump.
 */
export const SplashBackground = {
  light: '#E6F4FE',
  dark: '#0A0E1B',
} as const;

/**
 * Meaning-carrying colors (danger/warning/etc.) that stay constant across light and dark
 * mode — they're used against solid fills or badges, not as page backgrounds.
 */
export const SemanticColors = {
  danger: '#D6394B',
  dangerStrong: '#B92C3D',
  warning: '#C9781A',
  info: '#1768D1',
  success: '#1E9E64',
  teal: '#0E9488',
  violet: '#7C5CFC',
  onColor: '#FFFFFF',
} as const;

export const CardShadow = {
  shadowColor: '#0A1120',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 2,
} as const;

export const Radius = {
  small: 10,
  medium: 16,
  large: 22,
  pill: 999,
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
