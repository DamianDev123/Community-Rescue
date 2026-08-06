import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Facility, FacilityType } from '@/data/facilities';

interface FacilityMapProps {
  selectedId: string | null;
  onSelectFacility: (facility: Facility) => void;
  typeFilter?: FacilityType | null;
  style?: StyleProp<ViewStyle>;
}

/**
 * The interactive MapLibre map is native-only (iOS/Android). On web, the list
 * below still has full addresses, distances, and directions links — this is
 * just a placeholder where the map would be.
 */
export function FacilityMap({ style }: FacilityMapProps) {
  return (
    <ThemedView type="backgroundElement" style={[styles.container, style]}>
      <ThemedText type="smallBold" style={styles.text}>
        Map view is available in the mobile app
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.text}>
        On the web, use the list below — it has addresses, distances, and one-tap directions.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.four,
  },
  text: {
    textAlign: 'center',
  },
});
