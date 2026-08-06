import { Link } from 'expo-router';
import { useMemo } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/animated-pressable';
import { OfflineBanner } from '@/components/offline-banner';
import { PulseGlow } from '@/components/pulse-glow';
import { Screen } from '@/components/screen';
import { Surface } from '@/components/surface';
import { ThemedText } from '@/components/themed-text';
import { CardShadow, Radius, SemanticColors, Spacing } from '@/constants/theme';
import {
  EMERGENCY_PHONE,
  FACILITIES,
  FACILITY_TYPE_LABEL,
  POISON_CONTROL_LABEL,
  POISON_CONTROL_PHONE,
  type FacilityType,
} from '@/data/facilities';
import { FIRST_AID_TOPICS } from '@/data/first-aid';
import { useLocation } from '@/hooks/use-location';
import { useTheme } from '@/hooks/use-theme';
import { bearingDegrees, bearingToCompass, distanceMiles, formatMiles } from '@/lib/geo';

const HOME_QUICK_TOPIC_IDS = ['cpr-cardiac-arrest', 'choking', 'severe-bleeding', 'snake-bite'];
const EMERGENCY_CARE_TYPES: FacilityType[] = ['hospital', 'urgent_care', 'clinic'];

export default function HomeScreen() {
  const theme = useTheme();
  const { coords } = useLocation();

  const nearest = useMemo(() => {
    const emergencyCare = FACILITIES.filter((facility) => EMERGENCY_CARE_TYPES.includes(facility.type));
    const withDistance = emergencyCare.map((facility) => ({
      facility,
      distance: coords ? distanceMiles(coords, facility) : null,
      compass: coords ? bearingToCompass(bearingDegrees(coords, facility)) : null,
    }));
    if (coords) withDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    return withDistance.slice(0, 2);
  }, [coords]);

  const quickTopics = useMemo(
    () =>
      HOME_QUICK_TOPIC_IDS.map((id) => FIRST_AID_TOPICS.find((topic) => topic.id === id)).filter(
        (topic): topic is (typeof FIRST_AID_TOPICS)[number] => Boolean(topic)
      ),
    []
  );

  return (
    <Screen title="CRM" subtitle="McDowell County · works with no signal">
      <Animated.View entering={FadeIn.duration(450)} style={styles.emergencyWrap}>
        <PulseGlow color={SemanticColors.danger} borderRadius={Radius.large} />
        <AnimatedPressable
          onPress={() => Linking.openURL(`tel:${EMERGENCY_PHONE}`)}
          style={[styles.emergencyButton, CardShadow]}
          scaleTo={0.97}
          haptic="warning">
          <ThemedText type="title" style={styles.emergencyButtonText}>
            Call 911
          </ThemedText>
          <ThemedText type="small" style={styles.emergencySubtext}>
            Medical, fire, or police emergency
          </ThemedText>
        </AnimatedPressable>
      </Animated.View>

      <AnimatedPressable onPress={() => Linking.openURL(`tel:${POISON_CONTROL_PHONE}`)} scaleTo={0.98}>
        <ThemedText type="link" themeColor="textSecondary" style={styles.centerText}>
          {POISON_CONTROL_LABEL}
        </ThemedText>
      </AnimatedPressable>

      <Link href="/emergency-mode" asChild>
        <AnimatedPressable haptic="medium">
          <View style={[styles.emergencyModeButton, CardShadow, { backgroundColor: theme.primary }]}>
            <View style={styles.emergencyModeText}>
              <ThemedText type="smallBold" style={styles.emergencyModeTitle}>
                Start Emergency Mode
              </ThemedText>
              <ThemedText type="small" style={styles.emergencyModeSubtitle}>
                Answer a couple quick questions — I'll tell you what to do.
              </ThemedText>
            </View>
            <ThemedText type="title" style={styles.emergencyModeArrow}>
              ›
            </ThemedText>
          </View>
        </AnimatedPressable>
      </Link>

      <OfflineBanner />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Nearest care
          </ThemedText>
          <Link href="/care" asChild>
            <AnimatedPressable hitSlop={8}>
              <ThemedText type="linkPrimary" themeColor="primary">
                Map & full list →
              </ThemedText>
            </AnimatedPressable>
          </Link>
        </View>

        {nearest.map(({ facility, distance, compass }, index) => (
          <Animated.View key={facility.id} entering={FadeInDown.delay(index * 80).springify().damping(16)}>
            <Link href={{ pathname: '/care', params: { id: facility.id } }} asChild>
              <AnimatedPressable>
                <Surface style={[styles.card, CardShadow, { borderColor: theme.border }]}>
                  <View style={styles.cardHeader}>
                    <ThemedText type="smallBold" style={styles.cardTitle}>
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
                </Surface>
              </AnimatedPressable>
            </Link>
          </Animated.View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            What do I do?
          </ThemedText>
          <Link href="/first-aid" asChild>
            <AnimatedPressable hitSlop={8}>
              <ThemedText type="linkPrimary" themeColor="primary">
                Search →
              </ThemedText>
            </AnimatedPressable>
          </Link>
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          Step-by-step first-aid guidance, bundled with the app.
        </ThemedText>
        <View style={styles.chipsWrap}>
          {quickTopics.map((topic, index) => (
            <Animated.View key={topic.id} entering={FadeInDown.delay(index * 60).springify().damping(16)}>
              <Link href={{ pathname: '/first-aid', params: { q: topic.title } }} asChild>
                <AnimatedPressable>
                  <Surface style={[styles.chip, CardShadow, { borderColor: theme.border }]}>
                    <ThemedText type="small">{topic.title}</ThemedText>
                  </Surface>
                </AnimatedPressable>
              </Link>
            </Animated.View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Community & prep
        </ThemedText>
        <Link href="/resources" asChild>
          <AnimatedPressable>
            <Surface style={[styles.card, CardShadow, { borderColor: theme.border }]}>
              <ThemedText type="smallBold">Resources & prep guides</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Non-emergency numbers, power outage reporting, road conditions, and storm/flood
                readiness — plus pharmacies, dentists, and vets nearby.
              </ThemedText>
            </Surface>
          </AnimatedPressable>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  emergencyWrap: {
    justifyContent: 'center',
  },
  emergencyButton: {
    backgroundColor: SemanticColors.danger,
    borderRadius: Radius.large,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    gap: Spacing.half,
  },
  emergencyButtonText: {
    color: SemanticColors.onColor,
    fontSize: 26,
    lineHeight: 30,
  },
  emergencySubtext: {
    color: SemanticColors.onColor,
    opacity: 0.85,
  },
  centerText: {
    textAlign: 'center',
  },
  emergencyModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius.large,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  emergencyModeText: {
    flex: 1,
    gap: Spacing.half,
  },
  emergencyModeTitle: {
    color: SemanticColors.onColor,
  },
  emergencyModeSubtitle: {
    color: SemanticColors.onColor,
    opacity: 0.85,
  },
  emergencyModeArrow: {
    color: SemanticColors.onColor,
    fontSize: 28,
  },
  section: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 21,
    lineHeight: 26,
  },
  card: {
    gap: Spacing.half,
    borderRadius: Radius.medium,
    padding: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  cardTitle: {
    flex: 1,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
