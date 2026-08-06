/**
 * Medical, dental, pharmacy, and veterinary facilities in and around McDowell County, WV.
 *
 * Sourced from facility websites and public directories (Aug 2026). Phone numbers,
 * hours, and addresses can change — verify periodically. This list is not exhaustive
 * (it does not include every private practice) and is not a substitute for calling 911.
 */

export type FacilityType = 'hospital' | 'urgent_care' | 'clinic' | 'pharmacy' | 'dentist' | 'veterinary';

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  address: string;
  /** Digits only, e.g. "3044368461", for use with tel: links. */
  phone: string;
  latitude: number;
  longitude: number;
  hours?: string;
  notes?: string;
}

export const EMERGENCY_PHONE = '911';
export const POISON_CONTROL_PHONE = '18002221222';
export const POISON_CONTROL_LABEL = 'Poison Control: 1-800-222-1222';

/** Centered on McDowell County, WV; zoom is wide enough to show the whole county. */
export const COUNTY_REGION = {
  latitude: 37.383,
  longitude: -81.658,
  zoom: 10,
};

export const FACILITIES: Facility[] = [
  {
    id: 'welch-community-hospital',
    name: 'Welch Community Hospital',
    type: 'hospital',
    address: '454 McDowell St, Welch, WV 24801',
    phone: '3044368461',
    latitude: 37.4389489,
    longitude: -81.5883849,
    hours: 'Emergency Department open 24/7',
    notes: "McDowell County's only acute-care hospital, with a physician-staffed ER.",
  },
  {
    id: 'tug-river-health-welch',
    name: 'Tug River Health Association – Welch',
    type: 'clinic',
    address: '959 Mount View High School Rd, Welch, WV 24801',
    phone: '3044364798',
    latitude: 37.4104742,
    longitude: -81.5550104,
    notes: 'Walk-in care, pediatrics, women\'s health, and addiction treatment. Also runs clinics in Gary, Northfork, Pineville, and Bradshaw.',
  },
  {
    id: 'tug-river-riverview-bradshaw',
    name: 'Tug River Health Association – Riverview Center (Bradshaw)',
    type: 'urgent_care',
    address: '556 Mountaineer Hwy, Bradshaw, WV 24817',
    phone: '3049677682',
    latitude: 37.3515533,
    longitude: -81.8007269,
    notes: 'Closest walk-in option for the western side of the county (War/Iaeger area).',
  },
  {
    id: 'rite-aid-welch',
    name: 'Rite Aid Pharmacy',
    type: 'pharmacy',
    address: '781 Virginia Ave, Welch, WV 24801',
    phone: '3044366360',
    latitude: 37.4346939,
    longitude: -81.5768582,
  },
  {
    id: 'byron-hubert-dds',
    name: 'Byron Hubert, DDS',
    type: 'dentist',
    address: '19 Bank St, Welch, WV 24801',
    phone: '3044368093',
    latitude: 37.4321248,
    longitude: -81.5843413,
    notes: 'For a dental emergency outside office hours (facial swelling, uncontrolled bleeding), go to the ER.',
  },
  {
    id: 'mcdowell-county-humane-society',
    name: 'McDowell County Humane Society',
    type: 'veterinary',
    address: 'US Route 52, Welch, WV 24801',
    phone: '3044362185',
    latitude: 37.4328886,
    longitude: -81.5844357,
    notes: 'No-kill shelter and animal control. Location is approximate — call ahead.',
  },
];

export const FACILITY_TYPE_LABEL: Record<FacilityType, string> = {
  hospital: 'Hospital · 24/7 ER',
  urgent_care: 'Urgent care',
  clinic: 'Clinic',
  pharmacy: 'Pharmacy',
  dentist: 'Dentist',
  veterinary: 'Veterinary / animal control',
};
