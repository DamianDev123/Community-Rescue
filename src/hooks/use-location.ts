import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

import type { Coordinates } from '@/lib/geo';

export type LocationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'error';

interface UseLocationResult {
  coords: Coordinates | null;
  status: LocationStatus;
  refresh: () => void;
}

/**
 * Reports the device's current position. Works without a network connection —
 * GPS itself needs no internet, and a cached last-known fix is used first so the
 * screen has something to show instantly.
 */
export function useLocation(): UseLocationResult {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [nonce, setNonce] = useState(0);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setStatus('requesting');
      const { status: permission } = await Location.requestForegroundPermissionsAsync();
      if (cancelled) return;
      if (permission !== 'granted') {
        setStatus('denied');
        return;
      }

      const cached = await Location.getLastKnownPositionAsync({ maxAge: 5 * 60 * 1000 });
      if (cached && !cancelled) {
        setCoords({ latitude: cached.coords.latitude, longitude: cached.coords.longitude });
        setStatus('granted');
      }

      try {
        const fresh = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!cancelled) {
          setCoords({ latitude: fresh.coords.latitude, longitude: fresh.coords.longitude });
          setStatus('granted');
        }
      } catch {
        if (!cancelled && !cached) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [nonce]);

  return { coords, status, refresh };
}
