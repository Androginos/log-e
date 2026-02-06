import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type RoutePoint = {
  lat: number;
  lng: number;
  city: string;
  country: string;
};

export type TrackingItem = {
  id: string;
  code: string;
  origin: RoutePoint;
  destination: RoutePoint;
  status: string;
  progress: number; // 0-100
};

const EXAMPLE_TRACKING_ITEMS: TrackingItem[] = [
  {
    id: '1',
    code: 'LOG-TR-IST-BER-001',
    origin: { lat: 41.0082, lng: 28.9784, city: 'İstanbul', country: 'Türkiye' },
    destination: { lat: 52.52, lng: 13.405, city: 'Berlin', country: 'Almanya' },
    status: 'Yolda',
    progress: 65,
  },
  {
    id: '2',
    code: 'LOG-TR-ANK-PAR-002',
    origin: { lat: 39.9334, lng: 32.8597, city: 'Ankara', country: 'Türkiye' },
    destination: { lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'Fransa' },
    status: 'Hazırlanıyor',
    progress: 15,
  },
  {
    id: '3',
    code: 'LOG-TR-IZM-ROM-003',
    origin: { lat: 38.4192, lng: 27.1287, city: 'İzmir', country: 'Türkiye' },
    destination: { lat: 41.9028, lng: 12.4964, city: 'Roma', country: 'İtalya' },
    status: 'Yolda',
    progress: 80,
  },
];

type TrackingContextValue = {
  isTrackingMode: boolean;
  trackingItems: TrackingItem[];
  activeTrackingId: string | null;
  enterTrackingMode: (code?: string) => void;
  exitTrackingMode: () => void;
  selectTracking: (id: string) => void;
  addTrackingFromSearch: (code: string) => void;
  activeRoute: { origin: RoutePoint; destination: RoutePoint; progress: number } | null;
};

const TrackingContext = createContext<TrackingContextValue | null>(null);

export function TrackingProvider({ children }: { children: ReactNode }) {
  const [isTrackingMode, setIsTrackingMode] = useState(false);
  const [trackingItems] = useState<TrackingItem[]>(EXAMPLE_TRACKING_ITEMS);
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);

  const enterTrackingMode = useCallback((code?: string) => {
    setIsTrackingMode(true);
    if (code) {
      const found = EXAMPLE_TRACKING_ITEMS.find(
        (t) => t.code.toLowerCase().includes(code.toLowerCase())
      );
      if (found) {
        setActiveTrackingId(found.id);
      } else {
        setActiveTrackingId(EXAMPLE_TRACKING_ITEMS[0]?.id ?? null);
      }
    } else {
      setActiveTrackingId(EXAMPLE_TRACKING_ITEMS[0]?.id ?? null);
    }
  }, []);

  const exitTrackingMode = useCallback(() => {
    setIsTrackingMode(false);
    setActiveTrackingId(null);
  }, []);

  const selectTracking = useCallback((id: string) => {
    setActiveTrackingId(id);
  }, []);

  const addTrackingFromSearch = useCallback((code: string) => {
    if (!code.trim()) return;
    enterTrackingMode(code);
  }, [enterTrackingMode]);

  const activeItem = activeTrackingId
    ? trackingItems.find((t) => t.id === activeTrackingId)
    : null;

  const activeRoute = activeItem
    ? {
        origin: activeItem.origin,
        destination: activeItem.destination,
        progress: activeItem.progress,
      }
    : null;

  return (
    <TrackingContext.Provider
      value={{
        isTrackingMode,
        trackingItems,
        activeTrackingId,
        enterTrackingMode,
        exitTrackingMode,
        selectTracking,
        addTrackingFromSearch,
        activeRoute,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  const ctx = useContext(TrackingContext);
  if (!ctx) throw new Error('useTracking must be used within TrackingProvider');
  return ctx;
}
