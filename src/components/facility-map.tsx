import { useEffect, useRef } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import {
  Camera,
  LogManager,
  Map,
  Marker,
  UserLocation,
  type CameraRef,
  type LngLat,
} from '@maplibre/maplibre-react-native';

import { SemanticColors } from '@/constants/theme';
import { COUNTY_REGION, FACILITIES, type Facility, type FacilityType } from '@/data/facilities';

/** Free, open vector tiles from OpenFreeMap — no API key or account required. */
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

/**
 * Some source geometry in the "liberty" style's line layers (roads, boundaries) is
 * slightly malformed — MapLibre just skips that segment and keeps rendering fine,
 * but logs a warning every time. It's noise, not a bug in this app, so silence
 * just that one known-benign message and leave everything else logging normally.
 */
LogManager.onLog((event) => event.level === 'warn' && event.message.includes('Invalid geometry'));

const MARKER_COLOR: Record<Facility['type'], string> = {
  hospital: SemanticColors.danger,
  urgent_care: SemanticColors.warning,
  clinic: SemanticColors.info,
  pharmacy: SemanticColors.success,
  dentist: SemanticColors.teal,
  veterinary: SemanticColors.violet,
};

interface FacilityMapProps {
  selectedId: string | null;
  onSelectFacility: (facility: Facility) => void;
  /** When set, only markers of this type are shown. */
  typeFilter?: FacilityType | null;
  style?: StyleProp<ViewStyle>;
}

/**
 * Map of medical facilities in McDowell County, built on MapLibre + OpenFreeMap —
 * open-source and free, with no Google Maps API key needed. Markers are drawn from
 * data bundled with the app, so they always show up even with no signal — only the
 * base map imagery itself needs a connection (or previously cached tiles) to render.
 */
export function FacilityMap({ selectedId, onSelectFacility, typeFilter, style }: FacilityMapProps) {
  const cameraRef = useRef<CameraRef>(null);
  const facilities = typeFilter ? FACILITIES.filter((facility) => facility.type === typeFilter) : FACILITIES;

  useEffect(() => {
    if (!selectedId) return;
    const facility = FACILITIES.find((item) => item.id === selectedId);
    if (!facility) return;
    cameraRef.current?.flyTo({
      center: [facility.longitude, facility.latitude],
      zoom: 13.5,
      duration: 450,
    });
  }, [selectedId]);

  return (
    <Map mapStyle={MAP_STYLE} style={[styles.map, style]}>
      <Camera
        ref={cameraRef}
        initialViewState={{
          center: [COUNTY_REGION.longitude, COUNTY_REGION.latitude] as LngLat,
          zoom: COUNTY_REGION.zoom,
        }}
      />
      <UserLocation />
      {facilities.map((facility) => (
        <Marker
          key={facility.id}
          id={facility.id}
          lngLat={[facility.longitude, facility.latitude]}
          onPress={() => onSelectFacility(facility)}>
          <View
            style={[
              styles.pin,
              {
                backgroundColor: MARKER_COLOR[facility.type],
                opacity: selectedId && selectedId !== facility.id ? 0.6 : 1,
              },
            ]}
          />
        </Marker>
      ))}
    </Map>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 280,
  },
  pin: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
