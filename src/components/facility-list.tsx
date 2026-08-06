import { Linking, Platform, StyleSheet, View } from 'react-native';
import { useEffect, useMemo } from 'react';
import Animated, {
  FadeInDown,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/animated-pressable';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CardShadow, Radius, SemanticColors, Spacing } from '@/constants/theme';
import { FACILITIES, FACILITY_TYPE_LABEL, type Facility, type FacilityType } from '@/data/facilities';
import { bearingDegrees, bearingToCompass, distanceMiles, formatMiles, type Coordinates } from '@/lib/geo';
import { useTheme } from '@/hooks/use-theme';
import type { LocationStatus } from '@/hooks/use-location';

interface FacilityListProps {
  userCoords: Coordinates | null;
  selectedId: string | null;
  onSelectFacility: (facility: Facility) => void;
  /** When set, only facilities of this type are shown. */
  typeFilter?: FacilityType | null;
  /** Shows a "finding your location" indicator while this is `'requesting'`. */
  locationStatus?: LocationStatus;
}

function PulsingDot({ delay }: { delay: number }) {
  const theme = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(1, { duration: 400 }), withTiming(0, { duration: 400 })), -1, false)
    );
  }, [progress, delay]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: 0.25 + progress.value * 0.75 }));

  return <Animated.View style={[styles.dot, { backgroundColor: theme.primary }, animatedStyle]} />;
}

function LocatingIndicator() {
  return (
    <View style={styles.locatingRow}>
      <View style={styles.dotsRow}>
        <PulsingDot delay={0} />
        <PulsingDot delay={150} />
        <PulsingDot delay={300} />
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        Finding your location…
      </ThemedText>
    </View>
  );
}

function openDialer(phone: string) {
  Linking.openURL(`tel:${phone}`);
}

function openDirections(facility: Facility) {
  const label = encodeURIComponent(facility.name);
  const url = Platform.select({
    ios: `maps:0,0?q=${label}@${facility.latitude},${facility.longitude}`,
    android: `geo:0,0?q=${facility.latitude},${facility.longitude}(${label})`,
    default: `https://www.openstreetmap.org/?mlat=${facility.latitude}&mlon=${facility.longitude}#map=16/${facility.latitude}/${facility.longitude}`,
  });
  Linking.openURL(url);
}

const TYPE_ACCENT: Record<Facility['type'], string> = {
  hospital: SemanticColors.danger,
  urgent_care: SemanticColors.warning,
  clinic: SemanticColors.info,
  pharmacy: SemanticColors.success,
  dentist: SemanticColors.teal,
  veterinary: SemanticColors.violet,
};

interface FacilityCardProps {
  facility: Facility;
  distance: number | null;
  compass: string | null;
  selected: boolean;
  index: number;
  onPress: () => void;
}

function FacilityCard({ facility, distance, compass, selected, index, onPress }: FacilityCardProps) {
  const theme = useTheme();

  const progress = useDerivedValue(() => withTiming(selected ? 1 : 0, { duration: 200 }));
  const animatedCardStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(progress.value, [0, 1], [theme.border, theme.primary]),
  }));

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify().damping(16)}>
      <AnimatedPressable onPress={onPress} scaleTo={0.985}>
        <Animated.View style={[styles.card, CardShadow, animatedCardStyle]}>
          <ThemedView type="backgroundElement" style={StyleSheet.absoluteFill} />
          <View style={[styles.accent, { backgroundColor: TYPE_ACCENT[facility.type] }]} />
          <View style={styles.cardBody}>
            <View style={styles.cardHeader}>
              <ThemedText type="smallBold" style={styles.name}>
                {facility.name}
              </ThemedText>
              {distance != null && compass != null && (
                <ThemedText type="smallBold" themeColor="primary">
                  {formatMiles(distance)} {compass}
                </ThemedText>
              )}
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              {FACILITY_TYPE_LABEL[facility.type]}
            </ThemedText>
            <ThemedText type="small">{facility.address}</ThemedText>
            {facility.hours && (
              <ThemedText type="small" themeColor="textSecondary">
                {facility.hours}
              </ThemedText>
            )}
            {facility.notes && (
              <ThemedText type="small" themeColor="textSecondary">
                {facility.notes}
              </ThemedText>
            )}
            <View style={styles.actions}>
              <AnimatedPressable
                onPress={() => openDialer(facility.phone)}
                haptic="medium"
                style={[styles.actionButton, { backgroundColor: theme.primary }]}>
                <ThemedText type="smallBold" style={styles.actionButtonTextOnPrimary}>
                  Call
                </ThemedText>
              </AnimatedPressable>
              <AnimatedPressable
                onPress={() => openDirections(facility)}
                style={[styles.actionButton, styles.actionButtonOutline, { borderColor: theme.border }]}>
                <ThemedText type="smallBold">Directions</ThemedText>
              </AnimatedPressable>
            </View>
          </View>
        </Animated.View>
      </AnimatedPressable>
    </Animated.View>
  );
}

export function FacilityList({
  userCoords,
  selectedId,
  onSelectFacility,
  typeFilter,
  locationStatus,
}: FacilityListProps) {
  const rows = useMemo(() => {
    const filtered = typeFilter ? FACILITIES.filter((facility) => facility.type === typeFilter) : FACILITIES;
    const withDistance = filtered.map((facility) => {
      if (!userCoords) return { facility, distance: null, compass: null };
      const distance = distanceMiles(userCoords, facility);
      const compass = bearingToCompass(bearingDegrees(userCoords, facility));
      return { facility, distance, compass };
    });

    if (!userCoords) return withDistance;
    return withDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
  }, [userCoords, typeFilter]);

  return (
    <View style={styles.list}>
      {locationStatus === 'requesting' && !userCoords && <LocatingIndicator />}
      {locationStatus !== 'requesting' && !userCoords && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
          Turn on location to sort these by how close they are to you.
        </ThemedText>
      )}
      {rows.length === 0 && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
          No locations of this type on file yet.
        </ThemedText>
      )}
      {rows.map(({ facility, distance, compass }, index) => (
        <FacilityCard
          key={facility.id}
          facility={facility}
          distance={distance}
          compass={compass}
          selected={facility.id === selectedId}
          index={index}
          onPress={() => onSelectFacility(facility)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
  },
  hint: {
    paddingHorizontal: Spacing.one,
  },
  locatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: Spacing.half,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  card: {
    flexDirection: 'row',
    borderRadius: Radius.medium,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  accent: {
    width: 5,
  },
  cardBody: {
    flex: 1,
    gap: Spacing.half,
    padding: Spacing.three,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  name: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  actionButton: {
    flex: 1,
    borderRadius: Radius.pill,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  actionButtonOutline: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  actionButtonTextOnPrimary: {
    color: SemanticColors.onColor,
  },
});
