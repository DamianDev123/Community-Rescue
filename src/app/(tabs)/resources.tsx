import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/animated-pressable';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CardShadow, Radius, SemanticColors, Spacing } from '@/constants/theme';
import {
  CONTACT_CATEGORY_LABEL,
  COMMUNITY_CONTACTS,
  PREP_GUIDES,
  type ContactCategory,
} from '@/data/resources';
import { SAFETY_PROGRAMS, type SafetyProgram } from '@/data/events';
import { useTheme } from '@/hooks/use-theme';

const CATEGORY_ORDER: ContactCategory[] = ['emergency-adjacent', 'crisis', 'health', 'utilities'];

function ContactCard({ id, name, phone, description, index }: { id: string; name: string; phone: string; description: string; index: number }) {
  const theme = useTheme();
  return (
    <Animated.View key={id} entering={FadeInDown.delay(index * 40).springify().damping(16)}>
      <ThemedView
        type="backgroundElement"
        style={[styles.contactCard, CardShadow, { borderColor: theme.border }]}>
        <View style={styles.contactText}>
          <ThemedText type="smallBold">{name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {description}
          </ThemedText>
        </View>
        <AnimatedPressable onPress={() => Linking.openURL(`tel:${phone}`)} style={styles.callButton}>
          <ThemedText type="smallBold" style={styles.callButtonText}>
            Call
          </ThemedText>
        </AnimatedPressable>
      </ThemedView>
    </Animated.View>
  );
}

function Chevron({ expanded }: { expanded: boolean }) {
  const rotation = useDerivedValue(() => withTiming(expanded ? 180 : 0, { duration: 200 }));
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  return (
    <Animated.View style={animatedStyle}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        ⌄
      </ThemedText>
    </Animated.View>
  );
}

function PrepGuideCard({
  id,
  title,
  summary,
  steps,
  expanded,
  index,
  onPress,
}: {
  id: string;
  title: string;
  summary: string;
  steps: string[];
  expanded: boolean;
  index: number;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Animated.View
      key={id}
      entering={FadeInDown.delay(index * 40).springify().damping(16)}
      layout={LinearTransition.duration(220)}>
      <AnimatedPressable onPress={onPress} scaleTo={0.985}>
        <ThemedView
          type="backgroundElement"
          style={[styles.guideCard, CardShadow, { borderColor: theme.border }]}>
          <View style={styles.guideHeader}>
            <ThemedText type="smallBold" style={styles.guideTitle}>
              {title}
            </ThemedText>
            <Chevron expanded={expanded} />
          </View>
          {!expanded && (
            <ThemedText type="small" themeColor="textSecondary">
              {summary}
            </ThemedText>
          )}
          {expanded && (
            <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)} style={styles.guideSteps}>
              {steps.map((step, stepIndex) => (
                <View key={stepIndex} style={styles.stepRow}>
                  <ThemedText type="smallBold" themeColor="textSecondary" style={styles.stepNumber}>
                    {stepIndex + 1}
                  </ThemedText>
                  <ThemedText type="small" style={styles.stepText}>
                    {step}
                  </ThemedText>
                </View>
              ))}
            </Animated.View>
          )}
        </ThemedView>
      </AnimatedPressable>
    </Animated.View>
  );
}

function SafetyProgramCard({
  program,
  expanded,
  index,
  onPress,
}: {
  program: SafetyProgram;
  expanded: boolean;
  index: number;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Animated.View
      key={program.id}
      entering={FadeInDown.delay(index * 40).springify().damping(16)}
      layout={LinearTransition.duration(220)}>
      <AnimatedPressable onPress={onPress} scaleTo={0.985}>
        <ThemedView
          type="backgroundElement"
          style={[styles.guideCard, CardShadow, { borderColor: theme.border }]}>
          <View style={styles.guideHeader}>
            <View style={styles.guideTitle}>
              <ThemedText type="smallBold">{program.title}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {program.organizer} · {program.cadence}
              </ThemedText>
            </View>
            <Chevron expanded={expanded} />
          </View>
          {!expanded && (
            <ThemedText type="small" themeColor="textSecondary">
              {program.summary}
            </ThemedText>
          )}
          {expanded && (
            <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)} style={styles.guideSteps}>
              {program.details.map((detail, index) => (
                <View key={index} style={styles.stepRow}>
                  <ThemedText type="smallBold" themeColor="textSecondary" style={styles.stepNumber}>
                    •
                  </ThemedText>
                  <ThemedText type="small" style={styles.stepText}>
                    {detail}
                  </ThemedText>
                </View>
              ))}
              {(program.linkUrl || program.contactPhone) && (
                <AnimatedPressable
                  onPress={() => Linking.openURL(program.linkUrl ?? `tel:${program.contactPhone}`)}
                  style={styles.programButton}>
                  <ThemedText type="smallBold" style={styles.callButtonText}>
                    {program.linkLabel ?? 'Learn more'}
                  </ThemedText>
                </AnimatedPressable>
              )}
            </Animated.View>
          )}
        </ThemedView>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function ResourcesScreen() {
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(null);
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);

  return (
    <Screen title="Resources" subtitle="Non-emergency contacts and readiness guides for McDowell County.">
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Community contacts
        </ThemedText>
        {CATEGORY_ORDER.map((category) => {
          const contacts = COMMUNITY_CONTACTS.filter((contact) => contact.category === category);
          if (contacts.length === 0) return null;
          return (
            <View key={category} style={styles.categoryGroup}>
              <ThemedText type="smallBold" themeColor="textSecondary" style={styles.categoryLabel}>
                {CONTACT_CATEGORY_LABEL[category]}
              </ThemedText>
              {contacts.map((contact, index) => (
                <ContactCard
                  key={contact.id}
                  id={contact.id}
                  name={contact.name}
                  phone={contact.phone}
                  description={contact.description}
                  index={index}
                />
              ))}
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Get ready
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          General readiness guides — tap one to expand.
        </ThemedText>
        <View style={styles.guideList}>
          {PREP_GUIDES.map((guide, index) => {
            const expanded = expandedGuideId === guide.id;
            return (
              <PrepGuideCard
                key={guide.id}
                id={guide.id}
                title={guide.title}
                summary={guide.summary}
                steps={guide.steps}
                expanded={expanded}
                index={index}
                onPress={() => setExpandedGuideId(expanded ? null : guide.id)}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Get involved & stay safe
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Free classes, blood drives, and safety programs run in the county on an ongoing basis —
          this app can't show a live event calendar, so each one links to where to find the current
          schedule.
        </ThemedText>
        <View style={styles.guideList}>
          {SAFETY_PROGRAMS.map((program, index) => {
            const expanded = expandedProgramId === program.id;
            return (
              <SafetyProgramCard
                key={program.id}
                program={program}
                expanded={expanded}
                index={index}
                onPress={() => setExpandedProgramId(expanded ? null : program.id)}
              />
            );
          })}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  sectionTitle: {
    fontSize: 21,
    lineHeight: 26,
  },
  categoryGroup: {
    gap: Spacing.two,
  },
  categoryLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.two,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: Radius.medium,
    padding: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
  },
  contactText: {
    flex: 1,
    gap: Spacing.half,
  },
  callButton: {
    backgroundColor: SemanticColors.info,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  callButtonText: {
    color: SemanticColors.onColor,
  },
  guideList: {
    gap: Spacing.two,
  },
  guideCard: {
    gap: Spacing.half,
    borderRadius: Radius.medium,
    padding: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
  },
  guideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  guideTitle: {
    flex: 1,
    gap: Spacing.half,
  },
  guideSteps: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  stepRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  stepNumber: {
    width: 18,
  },
  stepText: {
    flex: 1,
  },
  programButton: {
    alignSelf: 'flex-start',
    backgroundColor: SemanticColors.info,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    marginTop: Spacing.one,
  },
});
