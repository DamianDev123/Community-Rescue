/**
 * Non-emergency community contacts and general disaster-readiness guides for
 * McDowell County, WV. All bundled with the app — no connection needed to read them.
 *
 * Contacts sourced from county/agency websites (Aug 2026); numbers can change —
 * verify periodically. For any life-threatening emergency, always call 911.
 */

export type ContactCategory = 'emergency-adjacent' | 'crisis' | 'utilities' | 'health';

export interface CommunityContact {
  id: string;
  name: string;
  /** Digits (or a short dial code like "511"), for use with tel: links. */
  phone: string;
  description: string;
  category: ContactCategory;
}

export const CONTACT_CATEGORY_LABEL: Record<ContactCategory, string> = {
  'emergency-adjacent': 'Law enforcement & dispatch',
  crisis: 'Crisis & mental health',
  health: 'Health',
  utilities: 'Utilities & roads',
};

export const COMMUNITY_CONTACTS: CommunityContact[] = [
  {
    id: 'sheriff-non-emergency',
    name: "McDowell County Sheriff's Office (non-emergency)",
    phone: '3044368523',
    description: 'General assistance and non-emergency reports. For anything urgent, call 911 instead.',
    category: 'emergency-adjacent',
  },
  {
    id: 'wv-state-police-welch',
    name: 'West Virginia State Police — Welch Detachment',
    phone: '3044362101',
    description: 'Non-emergency and roadside help. For a crash or road emergency, call 911.',
    category: 'emergency-adjacent',
  },
  {
    id: 'crisis-988',
    name: '988 Suicide & Crisis Lifeline',
    phone: '988',
    description: 'Call or text 988 anytime — free, confidential support for a mental health, substance use, or suicide crisis.',
    category: 'crisis',
  },
  {
    id: 'help4wv',
    name: 'HELP4WV',
    phone: '18444357498',
    description: '24/7 call, chat, or text line for addiction or mental health crises statewide — can also connect you with a Mobile Crisis Response Team.',
    category: 'crisis',
  },
  {
    id: 'poison-control',
    name: 'Poison Control',
    phone: '18002221222',
    description: '24/7 free, confidential guidance for any poisoning or medication question.',
    category: 'health',
  },
  {
    id: 'mcdowell-health-department',
    name: 'McDowell County Health Department',
    phone: '3044482174',
    description: '7292 Black Diamond Hwy, Wilcoe. Immunizations, WIC, family planning, general public health. Mon–Fri 8am–5pm.',
    category: 'health',
  },
  {
    id: 'appalachian-power-outage',
    name: 'Appalachian Power — report a power outage',
    phone: '18009564237',
    description: '24/7 outage hotline. You can also report and track outages online or through the Appalachian Power app.',
    category: 'utilities',
  },
  {
    id: 'wv-511',
    name: 'WV 511 — road conditions & closures',
    phone: '511',
    description: 'Real-time road closures, construction, and travel conditions statewide (1-855-699-8511 from outside WV).',
    category: 'utilities',
  },
  {
    id: 'red-cross',
    name: 'American Red Cross (Central Appalachia Region)',
    phone: '18007332767',
    description: 'Disaster relief, shelter information, and emergency assistance, 24/7 (1-800-RED-CROSS).',
    category: 'utilities',
  },
];

export interface PrepGuide {
  id: string;
  title: string;
  summary: string;
  steps: string[];
}

export const PREP_GUIDES: PrepGuide[] = [
  {
    id: 'power-outage',
    title: 'If the power goes out',
    summary: 'What to check first, and how to keep food and medication safe.',
    steps: [
      "Check breakers/fuses first, then check for a wider outage — a neighbor with power, or call Appalachian Power's outage line.",
      'Keep refrigerator and freezer doors closed as much as possible — a full freezer stays cold about 48 hours, a fridge about 4 hours.',
      'Use flashlights or battery lanterns instead of candles when possible to avoid fire risk.',
      'If you use a generator, run it outside only, at least 20 feet from windows/doors/vents — never in a garage, basement, or enclosed space (see the carbon monoxide first-aid entry).',
      'Unplug sensitive electronics to protect them from a power surge when service returns.',
      'Check on elderly or medically vulnerable neighbors, especially anyone relying on powered medical equipment (oxygen concentrators, etc.).',
    ],
  },
  {
    id: 'flood-storm-prep',
    title: 'Before a flood or major storm',
    summary: 'Quick prep checklist for creek/river flooding and heavy storms.',
    steps: [
      'Know your flood risk — low-lying hollows and anywhere near the Tug Fork or a creek can flood fast in heavy rain.',
      'Charge phones and battery packs, and fill vehicles with gas before a storm arrives.',
      'Move vehicles and valuables to higher ground if flooding is possible.',
      'Have a battery or hand-crank radio for updates if cell service or power goes down — signal is already spotty in many hollows.',
      'Never drive around barricades onto a flooded road — see the flood/swift water safety guide for what to do if you encounter one.',
      "If told to evacuate, go — don't wait to see how bad it gets. Check the county Office of Emergency Management page/social media and 511 for road status.",
    ],
  },
  {
    id: 'winter-storm-prep',
    title: 'Winter storm / ice storm prep',
    summary: "Roads in the mountains ice over fast — prep before you're stuck.",
    steps: [
      'Stock a few days of food, water, and any needed medication before a forecasted ice or snow event — mountain roads can stay hazardous for days, especially on steep hollow roads that get plowed last.',
      "Keep a car emergency kit: blanket, flashlight, extra warm clothes, snacks, water, and a phone charger, in case you're stranded.",
      'Let faucets drip during extreme cold to help prevent frozen/burst pipes, and know where your main water shutoff is in case one bursts anyway.',
      'If you lose heat, close off unused rooms and stay in one warm space together; never use a stove/oven for heat.',
      'Watch for hypothermia and frostbite in anyone who has to be outside — see the hypothermia/frostbite first-aid entry.',
    ],
  },
  {
    id: 'go-bag',
    title: 'Build a go-bag / emergency kit',
    summary: 'One bag per person, ready to grab in under a minute.',
    steps: [
      'Water (one gallon per person per day, aim for 3 days) and non-perishable food.',
      'Any prescription medications, a spare phone charger/battery pack, flashlight, and a first-aid kit.',
      'Copies of important documents (ID, insurance, medical info) in a waterproof bag or saved as photos on your phone.',
      'Cash in small bills — card readers may not work without power.',
      'Weather-appropriate clothing, sturdy shoes, and a whistle to signal for help if needed.',
      'For pets: food, water, leash/carrier, and vaccination records.',
      'Keep the bag somewhere you can grab it fast, and check/refresh it twice a year.',
    ],
  },
  {
    id: 'boil-water-advisory',
    title: "If there's a boil-water advisory",
    summary: 'How to make tap water safe when a water system issues an advisory.',
    steps: [
      'Bring water to a rolling boil for at least 1 minute, then let it cool before use.',
      "If you can't boil water, use bottled water, or treat it with unscented household bleach — usually about 1/8 teaspoon (8 drops) per gallon of clear water, stirred and left to sit 30 minutes.",
      'Use boiled or treated water for drinking, cooking, brushing teeth, making ice, and washing produce.',
      "It's usually fine to shower/bathe with the water as long as you avoid swallowing it — check the specific advisory for any exceptions.",
      'Watch for updates from your water provider on when the advisory is lifted before going back to normal use.',
    ],
  },
  {
    id: 'wildfire-smoke',
    title: 'Wildfire smoke & poor air quality',
    summary: 'Limit outdoor exposure and keep indoor air cleaner.',
    steps: [
      "Check air quality reports if smoke is affecting the area, and limit time outdoors when it's poor — especially for kids, older adults, and anyone with asthma or heart/lung conditions.",
      'Keep windows and doors closed, and run an air conditioner or air purifier on recirculate if you have one.',
      "A well-fitting N95 mask helps if you must be outside for a while in smoky conditions — cloth masks don't filter smoke particles well.",
      'Avoid adding to indoor air pollution — skip frying food, burning candles, or vacuuming during heavy smoke.',
      "Seek medical care for trouble breathing, chest pain, or symptoms that don't improve when you get to cleaner air — see the asthma-attack first-aid entry if it triggers an attack.",
    ],
  },
  {
    id: 'road-washout',
    title: 'If a road is washed out or blocked',
    summary: 'Steep, narrow hollow roads can stay impassable for a while after a storm — plan around it.',
    steps: [
      'Never drive around a barricade or through water/debris covering the road — depth and road damage underneath are often impossible to judge.',
      "Check 511 or the county's social media/website for current closures before heading out.",
      "If you're cut off and need medical help, call 911 — dispatchers can coordinate access even when normal routes are blocked.",
      "Report a hazard (downed tree, washed-out road, downed line) to the Sheriff's non-emergency line so crews know about it.",
      "If you're isolated for a while, ration supplies and check on neighbors — remote hollows can take longer to reach after major damage.",
    ],
  },
  {
    id: 'finding-shelter',
    title: 'Finding an emergency shelter',
    summary: "Shelter locations open based on the specific event — here's where to check.",
    steps: [
      "This app doesn't list specific shelters, because they open and close based on the specific storm or emergency — always check current sources instead of assuming a location is open.",
      'Check the McDowell County government website and its official social media for shelter announcements during an active emergency.',
      'Call or check the American Red Cross (Central Appalachia Region) for open shelters — they operate storm shelters across the region.',
      'Dial 211 for a live operator who can direct you to open shelters, food, and other emergency resources statewide.',
      "If you have no way to reach a shelter, call 911 or the Sheriff's non-emergency line to ask about transport options during a declared emergency.",
    ],
  },
  {
    id: 'family-communication-plan',
    title: 'Family emergency communication plan',
    summary: 'Decide this before an emergency, not during one.',
    steps: [
      "Pick an out-of-area contact everyone can call or text if local lines are jammed — it's often easier to get a call out of the area than within it.",
      "Agree on two meeting spots: one right outside your home, and one outside your neighborhood in case you can't return home.",
      "Text instead of call when networks are congested — texts often get through when calls won't, especially given how spotty cell coverage already is in parts of the county.",
      'Make sure kids and anyone who needs it can recite or carries a card with key phone numbers.',
      "Keep a paper copy of important phone numbers — don't rely only on your phone's contacts if it's lost, dead, or damaged.",
    ],
  },
];
