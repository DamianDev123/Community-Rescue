import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/animated-pressable';
import { PulseGlow } from '@/components/pulse-glow';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CardShadow, Radius, SemanticColors, Spacing } from '@/constants/theme';
import { EMERGENCY_PHONE } from '@/data/facilities';
import { FIRST_AID_TOPICS, SEVERITY_LABEL, type Severity } from '@/data/first-aid';
import { TRIAGE_QUESTIONS, TRIAGE_START, type TriageOption, type TriageOutcome } from '@/data/triage';
import { useTheme } from '@/hooks/use-theme';

function CloseButton() {
  return (
    <AnimatedPressable onPress={() => router.back()} scaleTo={0.9} hitSlop={8}>
      <ThemedView type="backgroundElement" style={styles.closeButton}>
        <ThemedText type="smallBold">✕</ThemedText>
      </ThemedView>
    </AnimatedPressable>
  );
}

function CallButton({ label = 'Call 911', big = false }: { label?: string; big?: boolean }) {
  return (
    <View style={big ? styles.bigCallWrap : undefined}>
      {big && <PulseGlow color={SemanticColors.danger} borderRadius={Radius.large} />}
      <AnimatedPressable
        onPress={() => Linking.openURL(`tel:${EMERGENCY_PHONE}`)}
        haptic="warning"
        style={[big ? styles.bigCallButton : styles.smallCallButton, CardShadow]}>
        <ThemedText type={big ? 'title' : 'smallBold'} style={styles.callButtonText}>
          {label}
        </ThemedText>
      </AnimatedPressable>
    </View>
  );
}

function OptionButton({ label, index, onPress }: { label: string; index: number; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Animated.View entering={FadeInDown.delay(index * 40).springify().damping(16)}>
      <AnimatedPressable
        onPress={onPress}
        haptic="selection"
        style={[styles.option, CardShadow, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <ThemedText type="default" style={styles.optionText}>
          {label}
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          ›
        </ThemedText>
      </AnimatedPressable>
    </Animated.View>
  );
}

function OutcomeView({ outcome, onRestart }: { outcome: TriageOutcome; onRestart: () => void }) {
  if (outcome.type === 'search') {
    return (
      <Animated.View entering={FadeInRight.duration(220)} style={styles.outcomeWrap}>
        <ThemedText type="subtitle" style={styles.outcomeTitle}>
          Let's find it in the full list
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          That didn't match one of the quick categories — search the full first-aid guide instead, or call 911 if
          you're not sure and something seems seriously wrong.
        </ThemedText>
        <AnimatedPressable
          onPress={() => router.replace('/first-aid')}
          style={styles.primaryButton}
          haptic="medium">
          <ThemedText type="smallBold" style={styles.callButtonText}>
            Open First Aid search
          </ThemedText>
        </AnimatedPressable>
        <AnimatedPressable onPress={onRestart} scaleTo={0.97}>
          <ThemedText type="link" themeColor="textSecondary" style={styles.centerText}>
            Start over
          </ThemedText>
        </AnimatedPressable>
      </Animated.View>
    );
  }

  const topic = FIRST_AID_TOPICS.find((item) => item.id === outcome.topicId);
  if (!topic) return null;

  return (
    <Animated.View entering={FadeInRight.duration(220)} style={styles.outcomeWrap}>
      {outcome.call911 && <CallButton big />}

      <View style={styles.outcomeHeader}>
        <ThemedText type="subtitle" style={styles.outcomeTitle}>
          {topic.title}
        </ThemedText>
        <View style={[styles.badge, { backgroundColor: SEMANTIC_SEVERITY[topic.severity] }]}>
          <ThemedText type="small" style={styles.badgeText}>
            {SEVERITY_LABEL[topic.severity]}
          </ThemedText>
        </View>
      </View>

      <View style={styles.steps}>
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
      </View>

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

      <AnimatedPressable onPress={onRestart} scaleTo={0.97}>
        <ThemedText type="link" themeColor="textSecondary" style={styles.centerText}>
          Start over
        </ThemedText>
      </AnimatedPressable>
    </Animated.View>
  );
}

const SEMANTIC_SEVERITY: Record<Severity, string> = {
  'call-911': SemanticColors.danger,
  urgent: SemanticColors.warning,
  'self-care': SemanticColors.info,
};

export default function EmergencyModeScreen() {
  const [path, setPath] = useState<string[]>([TRIAGE_START]);
  const [outcome, setOutcome] = useState<TriageOutcome | null>(null);

  const currentQuestion = TRIAGE_QUESTIONS[path[path.length - 1]];
  const canGoBack = outcome !== null || path.length > 1;

  const handleSelect = (option: TriageOption) => {
    if (typeof option.next === 'string') {
      setPath((p) => [...p, option.next as string]);
    } else {
      setOutcome(option.next);
    }
  };

  const handleBack = () => {
    if (outcome) {
      setOutcome(null);
      return;
    }
    setPath((p) => (p.length > 1 ? p.slice(0, -1) : p));
  };

  const handleRestart = () => {
    setPath([TRIAGE_START]);
    setOutcome(null);
  };

  const headerAccessory = useMemo(() => <CloseButton />, []);

  return (
    <Screen
      title="Emergency Mode"
      subtitle="Answer a couple quick questions — I'll tell you what to do."
      headerAccessory={headerAccessory}>
      {!outcome && <CallButton />}

      {canGoBack && (
        <AnimatedPressable onPress={handleBack} scaleTo={0.97} style={styles.backRow}>
          <ThemedText type="smallBold" themeColor="primary">
            ← Back
          </ThemedText>
        </AnimatedPressable>
      )}

      {outcome ? (
        <OutcomeView outcome={outcome} onRestart={handleRestart} />
      ) : (
        <Animated.View entering={FadeInRight.duration(220)} key={currentQuestion.id} style={styles.questionWrap}>
          <ThemedText type="subtitle" style={styles.questionTitle}>
            {currentQuestion.question}
          </ThemedText>
          {currentQuestion.helpText && (
            <ThemedText type="small" themeColor="textSecondary">
              {currentQuestion.helpText}
            </ThemedText>
          )}
          <View style={styles.optionList}>
            {currentQuestion.options.map((option, index) => (
              <OptionButton
                key={option.label}
                label={option.label}
                index={index}
                onPress={() => handleSelect(option)}
              />
            ))}
          </View>
        </Animated.View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigCallWrap: {
    justifyContent: 'center',
  },
  bigCallButton: {
    backgroundColor: SemanticColors.danger,
    borderRadius: Radius.large,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  smallCallButton: {
    backgroundColor: SemanticColors.danger,
    borderRadius: Radius.pill,
    paddingVertical: Spacing.two + 2,
    alignItems: 'center',
  },
  callButtonText: {
    color: SemanticColors.onColor,
  },
  backRow: {
    alignSelf: 'flex-start',
  },
  questionWrap: {
    gap: Spacing.two,
  },
  questionTitle: {
    fontSize: 24,
    lineHeight: 30,
  },
  optionList: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    borderRadius: Radius.medium,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  optionText: {
    flex: 1,
  },
  outcomeWrap: {
    gap: Spacing.three,
  },
  outcomeHeader: {
    gap: Spacing.two,
  },
  outcomeTitle: {
    fontSize: 24,
    lineHeight: 30,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  badgeText: {
    color: SemanticColors.onColor,
  },
  steps: {
    gap: Spacing.two,
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
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#88888855',
  },
  primaryButton: {
    backgroundColor: SemanticColors.info,
    borderRadius: Radius.pill,
    paddingVertical: Spacing.two + 2,
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
});
