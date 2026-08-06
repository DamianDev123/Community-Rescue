import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, useColorScheme, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DotField } from '@/components/dot-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, DarkBackgroundGradient, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ScreenProps {
  title: string;
  subtitle?: string;
  headerAccessory?: ReactNode;
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

/** Shared scaffold for each tab: safe area, scrollable content, and a consistent header. */
export function Screen({ title, subtitle, headerAccessory, children, contentContainerStyle }: ScreenProps) {
  const isDark = useColorScheme() === 'dark';
  const theme = useTheme();

  const dots = (
    <DotField
      color={isDark ? '#FFFFFF' : theme.text}
      minOpacity={isDark ? 0.15 : 0.03}
      maxOpacity={isDark ? 0.6 : 0.1}
    />
  );

  const body = (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.duration(300)} style={styles.header}>
          <View style={styles.headerText}>
            <ThemedText type="title" style={styles.title}>
              {title}
            </ThemedText>
            {subtitle && (
              <ThemedText type="small" themeColor="textSecondary">
                {subtitle}
              </ThemedText>
            )}
          </View>
          {headerAccessory}
        </Animated.View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );

  if (isDark) {
    return (
      <LinearGradient
        colors={DarkBackgroundGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.container}>
        {dots}
        {body}
      </LinearGradient>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {dots}
      {body}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  headerText: {
    flex: 1,
    gap: Spacing.half,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
  },
});
