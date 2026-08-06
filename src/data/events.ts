/**
 * Community safety programs and classes for McDowell County, WV.
 *
 * This app is bundled and offline, so it can't show a live calendar of one-off
 * event dates (they'd go stale the moment they're shipped). Instead, each entry
 * below is a real, ongoing program plus a way to find its current schedule —
 * sourced from the organizer's own site (Aug 2026), verify before relying on it.
 */

export interface SafetyProgram {
  id: string;
  title: string;
  organizer: string;
  /** How often it runs — these are ongoing programs, not one-off dated events. */
  cadence: string;
  summary: string;
  details: string[];
  /** Digits only, for a tel: link. */
  contactPhone?: string;
  linkUrl?: string;
  linkLabel?: string;
}

export const SAFETY_PROGRAMS: SafetyProgram[] = [
  {
    id: 'wvpst-cpr-classes',
    title: 'Free monthly CPR & AED classes',
    organizer: 'West Virginia Public Service Training (WVPST) — Pineville',
    cadence: 'Ongoing — third Tuesday of every month, 5:30pm',
    summary: 'Layperson and healthcare-provider CPR/AED classes, held monthly and open to the public.',
    details: [
      'CPR classes are held on the third Tuesday of every month at 5:30pm at the EPIC office.',
      'Covers both general/layperson CPR and professional healthcare-provider certification, including AED training.',
      'Preregistration and payment are required before the class starts — call ahead to reserve a spot.',
      'WVPST Pineville serves McDowell County along with several other southern WV counties.',
    ],
    contactPhone: '3045962653',
    linkLabel: 'Call (304) 596-2653',
  },
  {
    id: 'red-cross-classes',
    title: 'Red Cross CPR, First Aid & babysitting certification',
    organizer: 'American Red Cross',
    cadence: 'Ongoing — online, blended, and in-person options',
    summary: 'Certified CPR/AED, First Aid, and babysitting classes — search by zip code for the nearest option.',
    details: [
      'Offered as fully online, blended (online + an in-person skills check), or fully in-person courses.',
      'Certifications are typically valid for two years and meet OSHA/workplace requirements.',
      'Use the Red Cross class finder and search zip code 24801 (or your own) for current openings near you.',
    ],
    linkUrl: 'https://www.redcross.org/take-a-class',
    linkLabel: 'redcross.org/take-a-class',
  },
  {
    id: 'red-cross-blood-drive',
    title: 'Donate blood',
    organizer: 'American Red Cross',
    cadence: 'Ongoing — drives are scheduled throughout the region',
    summary: 'Blood donations are always needed, especially after storms disrupt normal supply chains.',
    details: [
      'Find or schedule an appointment at a blood drive near you using the Red Cross blood donor tool.',
      'Drives are often hosted at churches, schools, and community centers around the county — check the live schedule for current locations and dates.',
      'You can also call to find or schedule an appointment instead of using the site.',
    ],
    linkUrl: 'https://www.redcrossblood.org/give.html',
    contactPhone: '18007332767',
    linkLabel: 'redcrossblood.org, or call 1-800-RED-CROSS',
  },
  {
    id: 'extension-safety-classes',
    title: 'Food, home & family safety classes',
    organizer: 'WVU Extension Service — McDowell County',
    cadence: 'Ongoing — check their site for current class dates',
    summary: 'Food safety and preservation, home safety, and family/community wellness classes.',
    details: [
      'Teaches food safety and preservation (canning, safe storage) along with family, health, and 4-H youth programs.',
      'Programs are led by local Extension agents and are generally free or low-cost.',
      'Located at Southside K-8 School, 13509 Rocket Boys Drive, War, WV 24892.',
    ],
    contactPhone: '6812252107',
    linkUrl: 'https://extension.wvu.edu/mcdowell',
    linkLabel: 'extension.wvu.edu/mcdowell',
  },
];
