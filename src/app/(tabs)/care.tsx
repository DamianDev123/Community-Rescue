import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/animated-pressable';
import { FacilityList } from '@/components/facility-list';
import { FacilityMap } from '@/components/facility-map';
import { OfflineBanner } from '@/components/offline-banner';
import { Screen } from '@/components/screen';
import { Radius, SemanticColors, Spacing } from '@/constants/theme';
import type { Facility, FacilityType } from '@/data/facilities';
import { useLocation } from '@/hooks/use-location';
import { useTheme } from '@/hooks/use-theme';

type TypeFilter = 'all' | FacilityType;

const FILTERS: { key: TypeFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'hospital', label: 'Hospital' },
  { key: 'urgent_care', label: 'Urgent care' },
  { key: 'clinic', label: 'Clinic' },
  { key: 'pharmacy', label: 'Pharmacy' },
  { key: 'dentist', label: 'Dentist' },
  { key: 'veterinary', label: 'Vet' },
];

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const theme = useTheme();
  const progress = useDerivedValue(() => withTiming(active ? 1 : 0, { duration: 180 }));

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [theme.backgroundElement, theme.primary]),
    borderColor: interpolateColor(progress.value, [0, 1], [theme.border, theme.primary]),
  }));
  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [theme.text, SemanticColors.onColor]),
  }));

  return (
    <AnimatedPressable onPress={onPress} scaleTo={0.95} haptic="selection" style={[styles.filterChip, animatedStyle]}>
      <Animated.Text style={[styles.filterChipText, animatedTextStyle]}>{label}</Animated.Text>
    </AnimatedPressable>
  );
}

export default function CareScreen() {
  const theme = useTheme();
  const { coords, status: locationStatus } = useLocation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [selectedId, setSelectedId] = useState<string | null>(typeof id === 'string' ? id : null);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const handleSelect = (facility: Facility) => {
    setSelectedId((current) => (current === facility.id ? null : facility.id));
  };

  const activeType = useMemo(() => (typeFilter === 'all' ? null : typeFilter), [typeFilter]);

  return (
    <Screen title="Find Care" subtitle="McDowell County medical, dental, pharmacy & vet care, closest first.">
      <OfflineBanner />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTERS.map((filter) => (
          <FilterChip
            key={filter.key}
            label={filter.label}
            active={filter.key === typeFilter}
            onPress={() => setTypeFilter(filter.key)}
          />
        ))}
      </ScrollView>

      <Animated.View entering={FadeIn.duration(400)} style={[styles.mapWrap, { borderColor: theme.border }]}>
        <FacilityMap
          selectedId={selectedId}
          onSelectFacility={handleSelect}
          typeFilter={activeType}
          style={styles.map}
        />
      </Animated.View>
      <FacilityList
        userCoords={coords}
        selectedId={selectedId}
        onSelectFacility={handleSelect}
        typeFilter={activeType}
        locationStatus={locationStatus}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    gap: Spacing.two,
    paddingRight: Spacing.two,
  },
  filterChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  filterChipText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  mapWrap: {
    borderRadius: Radius.medium,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  map: {
    height: 320,
  },
});
