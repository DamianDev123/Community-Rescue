import { useEffect, useMemo, useState } from 'react';
import { Linking, StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  LinearTransition,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/animated-pressable';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CardShadow, Radius, SemanticColors, Spacing } from '@/constants/theme';
import { EMERGENCY_PHONE } from '@/data/facilities';
import { FIRST_AID_TOPICS, SEVERITY_LABEL, searchFirstAid, type FirstAidTopic } from '@/data/first-aid';
import { useTheme } from '@/hooks/use-theme';

const QUICK_ACCESS_IDS = ['cpr-cardiac-arrest', 'choking', 'severe-bleeding', 'snake-bite', 'opioid-overdose'];

const SEVERITY_COLOR: Record<FirstAidTopic['severity'], string> = {
  'call-911': SemanticColors.danger,
  urgent: SemanticColors.warning,
  'self-care': SemanticColors.info,
};

function SeverityBadge({ severity }: { severity: FirstAidTopic['severity'] }) {
  return (
    <View style={[styles.badge, { backgroundColor: SEVERITY_COLOR[severity] }]}>
      <ThemedText type="small" style={styles.badgeText}>
        {SEVERITY_LABEL[severity]}
      </ThemedText>
    </View>
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

function TopicDetail({ topic }: { topic: FirstAidTopic }) {
  return (
    <View style={styles.detail}>
      {topic.severity === 'call-911' && (
        <AnimatedPressable
          onPress={() => Linking.openURL(`tel:${EMERGENCY_PHONE}`)}
          style={styles.callButton}
          haptic="warning">
          <ThemedText type="smallBold" style={styles.badgeText}>
            Call 911
          </ThemedText>
        </AnimatedPressable>
      )}
      {topic.steps.map((step, index) => (
        <View key={index} style={styles.stepRow}>
          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.stepNumber}>
            {index + 1}
          </ThemedText>
          <ThemedText type="small" style={styles.stepText}>
            {step}
          </ThemedText>
        </View>
      ))}
      {topic.doNot && topic.doNot.length > 0 && (
        <View style={styles.doNotBox}>
          <ThemedText type="smallBold">Avoid</ThemedText>
          {topic.doNot.map((item, index) => (
            <ThemedText key={index} type="small">
              • {item}
            </ThemedText>
          ))}
        </View>
      )}
    </View>
  );
}

interface ResultCardProps {
  topic: FirstAidTopic;
  expanded: boolean;
  index: number;
  onPress: () => void;
}

function ResultCard({ topic, expanded, index, onPress }: ResultCardProps) {
  const theme = useTheme();
  const progress = useDerivedValue(() => withTiming(expanded ? 1 : 0, { duration: 200 }));
  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(progress.value, [0, 1], [theme.border, theme.primary]),
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify().damping(16)}
      layout={LinearTransition.duration(220)}>
      <AnimatedPressable onPress={onPress} scaleTo={0.985}>
        <Animated.View style={[styles.card, CardShadow, animatedBorderStyle]}>
          <ThemedView type="backgroundElement" style={StyleSheet.absoluteFill} />
          <View style={styles.cardBody}>
            <View style={styles.cardHeader}>
              <ThemedText type="smallBold" style={styles.title}>
                {topic.title}
              </ThemedText>
              <View style={styles.headerRight}>
                <SeverityBadge severity={topic.severity} />
                <Chevron expanded={expanded} />
              </View>
            </View>
            {!expanded && (
              <ThemedText type="small" themeColor="textSecondary">
                {topic.summary}
              </ThemedText>
            )}
            {expanded && (
              <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)}>
                <TopicDetail topic={topic} />
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </AnimatedPressable>
    </Animated.View>
  );
}

interface FirstAidSearchProps {
  /** Pre-fills the search box, e.g. when arriving from a Home screen quick-access link. */
  initialQuery?: string;
}

/** Order topics appear in when browsing (no search yet) — most time-critical first. */
const CATEGORY_ORDER = [
  'Cardiac',
  'Respiratory',
  'Trauma',
  'Neurological',
  'Allergic',
  'Environmental',
  'Poisoning',
  'Medical',
  'Minor injury',
  'Mental health',
];

export function FirstAidSearch({ initialQuery }: FirstAidSearchProps) {
  const theme = useTheme();
  const [query, setQuery] = useState(initialQuery ?? '');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery]);

  const results = useMemo(() => searchFirstAid(query), [query]);
  const quickAccess = useMemo(
    () => QUICK_ACCESS_IDS.map((id) => FIRST_AID_TOPICS.find((t) => t.id === id)).filter(
      (t): t is FirstAidTopic => Boolean(t)
    ),
    []
  );

  const categories = useMemo(() => {
    const present = new Set(FIRST_AID_TOPICS.map((topic) => topic.category));
    const ordered = CATEGORY_ORDER.filter((category) => present.has(category));
    return ordered.map((category) => ({
      category,
      topics: FIRST_AID_TOPICS.filter((topic) => topic.category === category),
    }));
  }, []);

  const isBrowsing = !query.trim();

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          setExpandedId(null);
        }}
        placeholder="What's happening? e.g. bleeding, snake bite, not breathing"
        placeholderTextColor={theme.textSecondary}
        autoCorrect={false}
        style={[
          styles.input,
          CardShadow,
          { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}
      />

      {isBrowsing && (
        <View style={styles.quickAccessWrap}>
          {quickAccess.map((topic, index) => (
            <Animated.View key={topic.id} entering={FadeInDown.delay(index * 50).springify().damping(16)}>
              <AnimatedPressable
                onPress={() => setQuery(topic.title)}
                style={[styles.chip, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <ThemedText type="small">{topic.title}</ThemedText>
              </AnimatedPressable>
            </Animated.View>
          ))}
        </View>
      )}

      {!isBrowsing && results.length === 0 && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
          No exact match. Try a simpler word (e.g. "burn" instead of "burned my hand"), or call 911 if this is an emergency.
        </ThemedText>
      )}

      {!isBrowsing && (
        <View style={styles.results}>
          {results.map((topic, index) => {
            const expanded = expandedId === topic.id;
            return (
              <ResultCard
                key={topic.id}
                topic={topic}
                expanded={expanded}
                index={index}
                onPress={() => setExpandedId(expanded ? null : topic.id)}
              />
            );
          })}
        </View>
      )}

      {isBrowsing && (
        <View style={styles.browseWrap}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
            Or browse everything below ({FIRST_AID_TOPICS.length} topics).
          </ThemedText>
          {categories.map(({ category, topics }) => (
            <View key={category} style={styles.categoryGroup}>
              <ThemedText type="smallBold" themeColor="textSecondary" style={styles.categoryLabel}>
                {category}
              </ThemedText>
              <View style={styles.results}>
                {topics.map((topic, index) => {
                  const expanded = expandedId === topic.id;
                  return (
                    <ResultCard
                      key={topic.id}
                      topic={topic}
                      expanded={expanded}
                      index={Math.min(index, 6)}
                      onPress={() => setExpandedId(expanded ? null : topic.id)}
                    />
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  input: {
    borderRadius: Radius.large,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    fontSize: 16,
  },
  quickAccessWrap: {
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
  hint: {
    paddingHorizontal: Spacing.one,
  },
  browseWrap: {
    gap: Spacing.three,
  },
  categoryGroup: {
    gap: Spacing.two,
  },
  categoryLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: Spacing.one,
  },
  results: {
    gap: Spacing.two,
  },
  card: {
    borderRadius: Radius.medium,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  cardBody: {
    gap: Spacing.half,
    padding: Spacing.three,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    flex: 1,
  },
  badge: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  badgeText: {
    color: SemanticColors.onColor,
  },
  callButton: {
    alignSelf: 'flex-start',
    backgroundColor: SemanticColors.danger,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    marginBottom: Spacing.one,
  },
  detail: {
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
  doNotBox: {
    gap: Spacing.half,
    marginTop: Spacing.one,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#88888855',
  },
});
