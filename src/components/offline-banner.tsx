import { useNetworkState } from 'expo-network';
import { StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Radius, SemanticColors, Spacing } from '@/constants/theme';

/** Lets the user know they're offline — everything below still works without a connection. */
export function OfflineBanner() {
  const network = useNetworkState();

  if (network.isConnected !== false) return null;

  return (
    <Animated.View entering={FadeInUp.duration(250)} exiting={FadeOutUp.duration(200)} style={styles.banner}>
      <ThemedText type="smallBold" style={styles.text}>
        No connection — hospital info and first-aid steps below still work offline.
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: SemanticColors.warning,
    borderRadius: Radius.medium,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  text: {
    color: SemanticColors.onColor,
  },
});
