import React, { useEffect, useRef, useState, useCallback } from 'react';
import { loadYandexMaps } from '../../utils/yandexMapsLoader';
import { getClustererOptions } from '../../utils/clusterIcons';
import { toYandexCoords } from '../../utils/formatters';
import { ObjectItem } from '../../types/object';
import { MapControls } from './MapControls';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

// Default initial focus: European part of Russia
const DEFAULT_CENTER: [number, number] = [55.75, 42.0];
const DEFAULT_ZOOM = 5;
const DEFAULT_API_KEY = '4435c9da-a1d3-436e-8391-c68f5dbc85f7';

interface YandexMapProps {
  objects: ObjectItem[];
  selectedObject: ObjectItem | null;
  onSelectObject: (object: ObjectItem | null) => void;
}

export const YandexMap: React.FC<YandexMapProps> = ({
  objects,
  selectedObject,
  onSelectObject,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const clustererRef = useRef<any>(null);
  const placemarksMapRef = useRef<Map<string, any>>(new Map());

  // Keep latest objects in ref for synchronous access during async initialization
  const objectsRef = useRef<ObjectItem[]>(objects);
  objectsRef.current = objects;

  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Placemark rendering subroutine
  const updatePlacemarks = useCallback(
    (itemsToRender: ObjectItem[]) => {
      if (!mapInstanceRef.current || !clustererRef.current || !window.ymaps) {
        return;
      }

      const ymaps = window.ymaps;
      const clusterer = clustererRef.current;
      clusterer.removeAll();
      placemarksMapRef.current.clear();

      const placemarkCollection: any[] = [];

      itemsToRender.forEach((item) => {
        const yandexCoords = toYandexCoords(item.coordinates);

        const placemark = new ymaps.Placemark(
          yandexCoords,
          {
            balloonContent: '',
            hintContent: `<strong>${item.name}</strong><br/>${item.city}, ${item.address}`,
            objectId: item.id,
          },
          {
            iconLayout: 'default#image',
            iconImageHref: '/marker.png',
            iconImageSize: [36, 48],
            iconImageOffset: [-18, -48],
            hideIconOnBalloonOpen: false,
            openBalloonOnClick: false,
            cursor: 'pointer',
          }
        );

        placemark.events.add('click', (e: any) => {
          e.preventDefault();
          onSelectObject(item);

          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo(yandexCoords, {
              duration: 600,
              flying: true,
              checkZoomRange: true,
            });
          }
        });

        placemarksMapRef.current.set(item.id, placemark);
        placemarkCollection.push(placemark);
      });

      clusterer.add(placemarkCollection);
    },
    [onSelectObject]
  );

  // Initialize Map
  const initMap = useCallback(async () => {
    if (!containerRef.current) return;
    setIsLoading(true);
    setLoadError(null);

    try {
      const apiKey = (import.meta.env.VITE_YANDEX_MAPS_API_KEY as string) || DEFAULT_API_KEY;
      const ymaps = await loadYandexMaps(apiKey);

      if (!containerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }

      // Create map instance focused on European part of Russia
      const map = new ymaps.Map(
        containerRef.current,
        {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          controls: [],
          behaviors: ['drag', 'pinchZoom', 'dblClickZoom', 'multiTouch'],
        },
        {
          searchControlProvider: 'yandex#search',
          suppressMapOpenBlock: true,
        }
      );

      map.behaviors.enable('scrollZoom');

      // Clusterer with solid non-transparent blue circles
      const clustererOpts = getClustererOptions(ymaps);
      const clusterer = new ymaps.Clusterer(clustererOpts);

      map.geoObjects.add(clusterer);

      map.events.add('click', (e: any) => {
        if (e.get('target') === map) {
          onSelectObject(null);
        }
      });

      mapInstanceRef.current = map;
      clustererRef.current = clusterer;
      setIsMapReady(true);
      setIsLoading(false);

      // CRITICAL: Immediately populate all points on initial load!
      updatePlacemarks(objectsRef.current);
    } catch (err: any) {
      console.error('Yandex Maps initialization failed:', err);
      setLoadError(err?.message || 'Не удалось инициализировать карту');
      setIsLoading(false);
    }
  }, [onSelectObject, updatePlacemarks]);

  useEffect(() => {
    initMap();

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy();
        } catch (e) {
          // ignore
        }
        mapInstanceRef.current = null;
      }
    };
  }, [initMap]);

  // Update placemarks whenever objects array changes (e.g., after filter change)
  useEffect(() => {
    if (isMapReady) {
      updatePlacemarks(objects);
    }
  }, [objects, isMapReady, updatePlacemarks]);

  // Handle selected object changes (e.g. pan to it)
  useEffect(() => {
    if (selectedObject && mapInstanceRef.current) {
      const yCoords = toYandexCoords(selectedObject.coordinates);
      mapInstanceRef.current.panTo(yCoords, {
        duration: 500,
        flying: true,
      });
    }
  }, [selectedObject]);

  // Control handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      const current = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(Math.min(current + 1, 19), { duration: 300 });
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      const current = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(Math.max(current - 1, 3), { duration: 300 });
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(DEFAULT_CENTER, DEFAULT_ZOOM, {
        duration: 700,
        timingFunction: 'ease-in-out',
      });
      onSelectObject(null);
    }
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) {
      alert('Геолокация не поддерживается вашим браузером');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter([latitude, longitude], 12, {
            duration: 800,
          });
        }
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-100 overflow-hidden">
      {/* Map Container */}
      <div
        ref={containerRef}
        className="w-full h-full absolute inset-0 select-none"
        id="yandex-map-container"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100/80 backdrop-blur-xs flex flex-col items-center justify-center z-10">
          <Loader2 className="w-10 h-10 text-sky-600 animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-800">
            Загрузка карты и объектов SCHTANDART...
          </p>
          <span className="text-xs text-slate-500 mt-1">
            Инициализация геокластеров
          </span>
        </div>
      )}

      {/* Error Overlay with Retry */}
      {loadError && (
        <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 text-center z-20">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Ошибка загрузки карты
          </h3>
          <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
            {loadError}
          </p>
          <button
            type="button"
            onClick={initMap}
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Повторить попытку</span>
          </button>
        </div>
      )}

      {/* Interactive Map Controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onLocateUser={handleLocateUser}
        isLocating={isLocating}
      />
    </div>
  );
};
