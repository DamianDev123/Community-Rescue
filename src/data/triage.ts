/**
 * Emergency Mode decision tree — a short sequence of yes/no-style questions that
 * routes to the right first-aid topic (from `first-aid.ts`) in 1–2 taps, for
 * someone who's panicking and doesn't know what to search for.
 *
 * This is a triage aid, not a diagnosis — every critical branch also tells the
 * person to call 911.
 */

export type TriageOutcome =
  | { type: 'topic'; topicId: string; call911: boolean }
  | { type: 'search' };

export interface TriageOption {
  label: string;
  next: string | TriageOutcome;
}

export interface TriageQuestion {
  id: string;
  question: string;
  helpText?: string;
  options: TriageOption[];
}

export const TRIAGE_START = 'start';

export const TRIAGE_QUESTIONS: Record<string, TriageQuestion> = {
  start: {
    id: 'start',
    question: "What's happening right now?",
    options: [
      {
        label: 'Not breathing, or unconscious and unresponsive',
        next: { type: 'topic', topicId: 'cpr-cardiac-arrest', call911: true },
      },
      {
        label: "Choking — can't cough, talk, or breathe",
        next: { type: 'topic', topicId: 'choking', call911: true },
      },
      { label: 'Heavy or severe bleeding', next: { type: 'topic', topicId: 'severe-bleeding', call911: true } },
      { label: 'Chest pain, stroke signs, or a severe allergic reaction', next: 'critical-detail' },
      { label: 'A seizure is happening now', next: { type: 'topic', topicId: 'seizure', call911: false } },
      { label: 'A burn', next: { type: 'topic', topicId: 'burns', call911: false } },
      { label: 'Broken bone, bad fall, or crash', next: 'injury-detail' },
      { label: 'Snake bite, animal bite, or insect sting', next: 'bite-detail' },
      {
        label: 'Poisoning, overdose, or swallowed something dangerous',
        next: { type: 'topic', topicId: 'poisoning', call911: true },
      },
      { label: 'Too hot, too cold, or frostbite', next: 'temp-detail' },
      { label: "Something else / I'm not sure", next: { type: 'search' } },
    ],
  },
  'critical-detail': {
    id: 'critical-detail',
    question: 'Which of these matches best?',
    options: [
      {
        label: 'Chest pain or pressure (possible heart attack)',
        next: { type: 'topic', topicId: 'heart-attack', call911: true },
      },
      {
        label: 'Face drooping, arm weakness, or slurred speech (possible stroke)',
        next: { type: 'topic', topicId: 'stroke', call911: true },
      },
      {
        label: 'Swelling, hives, or trouble breathing after a sting/food/medicine',
        next: { type: 'topic', topicId: 'anaphylaxis', call911: true },
      },
    ],
  },
  'injury-detail': {
    id: 'injury-detail',
    question: 'What kind of injury?',
    options: [
      { label: 'Possible broken bone', next: { type: 'topic', topicId: 'fracture', call911: false } },
      { label: 'Head injury / hit their head', next: { type: 'topic', topicId: 'head-injury', call911: false } },
      {
        label: 'Chest injury from a fall or impact',
        next: { type: 'topic', topicId: 'broken-rib-chest-trauma', call911: false },
      },
      {
        label: 'Car or ATV accident',
        next: { type: 'topic', topicId: 'vehicle-accident', call911: true },
      },
    ],
  },
  'bite-detail': {
    id: 'bite-detail',
    question: 'What kind of bite or sting?',
    options: [
      { label: 'Snake bite', next: { type: 'topic', topicId: 'snake-bite', call911: true } },
      { label: 'Animal or dog bite', next: { type: 'topic', topicId: 'animal-bite', call911: false } },
      { label: 'Bee, wasp, or insect sting', next: { type: 'topic', topicId: 'insect-sting', call911: false } },
      { label: 'Tick bite', next: { type: 'topic', topicId: 'tick-bite', call911: false } },
    ],
  },
  'temp-detail': {
    id: 'temp-detail',
    question: 'Which best describes it?',
    options: [
      { label: 'Overheated / possible heat stroke', next: { type: 'topic', topicId: 'heat-illness', call911: false } },
      { label: 'Too cold / frostbite', next: { type: 'topic', topicId: 'hypothermia', call911: false } },
      {
        label: 'Carbon monoxide exposure (generator, heater indoors)',
        next: { type: 'topic', topicId: 'carbon-monoxide', call911: true },
      },
    ],
  },
};
