import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { motion } from 'motion/react';
import { LocationPreset } from '../data/astanaPois';
import { POIReviewItem } from '../data/admitlyContent';
import { RAGPipelineResult, ScoredPOICandidate } from '../services/ragEngine';
import { getFallbackPhotoForPOI, resolvePhotoForPOI } from '../services/photoService';
import { calculateDistanceMeters } from '../utils/ragMath';
import { AdmitlyPOICard } from './AdmitlyPOICard';
import {
  Navigation,
  Clock,
  Footprints,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';

interface RouteMapViewProps {
  selectedPreset: LocationPreset;
  ragResult: RAGPipelineResult;
  durationMinutes: number;
  allReviews: POIReviewItem[];
  onAddReview: (
    poiId: string,
    tag: POIReviewItem['tag'],
    comment: string
  ) => void;
  onAwardXp: (amount: number, reason: string) => void;
}

/**
 * Orders route candidates sequentially using Nearest-Neighbor from user's start point
 * so the polyline Я -> 1 -> 2 -> 3 is smooth and never self-intersects.
 */
function sortCandidatesIntoSequentialRoute(
  startLat: number,
  startLon: number,
  candidates: ScoredPOICandidate[]
): ScoredPOICandidate[] {
  const remaining = [...candidates];
  const ordered: ScoredPOICandidate[] = [];
  let curLat = startLat;
  let curLon = startLon;

  while (remaining.length > 0) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = calculateDistanceMeters(
        curLat,
        curLon,
        remaining[i].poi.lat,
        remaining[i].poi.lon
      );
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    const next = remaining.splice(bestIdx, 1)[0];
    ordered.push(next);
    curLat = next.poi.lat;
    curLon = next.poi.lon;
  }

  return ordered;
}

export const RouteMapView: React.FC<RouteMapViewProps> = ({
  selectedPreset,
  ragResult,
  durationMinutes,
  allReviews,
  onAddReview,
  onAwardXp,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [photoMap, setPhotoMap] = useState<Record<string, string>>({});
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  const [activeNavMode, setActiveNavMode] = useState<boolean>(false);

  // Geometrically ordered route points (Я -> 1 -> 2 -> 3)
  const orderedRoute = useMemo(
    () =>
      sortCandidatesIntoSequentialRoute(
        ragResult.effectiveCoords.lat,
        ragResult.effectiveCoords.lon,
        ragResult.topRecommendations
      ),
    [
      ragResult.effectiveCoords.lat,
      ragResult.effectiveCoords.lon,
      ragResult.topRecommendations,
    ]
  );

  const currentStepCandidate = orderedRoute[selectedStepIndex] || orderedRoute[0];

  // Load real Wikipedia photos for map pins & bottom card
  useEffect(() => {
    let cancelled = false;
    async function loadPhotos() {
      const nextMap: Record<string, string> = {};
      for (const item of orderedRoute) {
        nextMap[item.poi.id] = getFallbackPhotoForPOI(item.poi);
        const res = await resolvePhotoForPOI(item.poi);
        nextMap[item.poi.id] = res.url;
      }
      if (!cancelled) {
        setPhotoMap((prev) => ({ ...prev, ...nextMap }));
      }
    }
    loadPhotos();
    return () => {
      cancelled = true;
    };
  }, [orderedRoute]);

  // Initialize Leaflet map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [selectedPreset.lat, selectedPreset.lon],
      zoom: 14,
      zoomControl: true,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const group = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = group;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      layerGroupRef.current = null;
    };
  }, []);

  // Render clean sequential route polyline & photo pins
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    const startLatLng: [number, number] = [
      ragResult.effectiveCoords.lat,
      ragResult.effectiveCoords.lon,
    ];

    // 1. Soft walking radius circle
    L.circle(startLatLng, {
      radius: Math.min(ragResult.maxRadiusMeters, 2200),
      color: '#F97316',
      weight: 1.5,
      fillColor: '#FFEDD5',
      fillOpacity: 0.22,
      dashArray: '6 6',
    }).addTo(group);

    // 2. User Start Marker ("Я")
    const userIcon = L.divIcon({
      className: 'custom-user-pin',
      html: `<div style="width:34px;height:34px;border-radius:9999px;background:linear-gradient(135deg,#2563EB,#4F46E5);border:3px solid #FFFFFF;box-shadow:0 6px 14px rgba(37,99,235,0.4);display:flex;align-items:center;justify-content:center;color:#FFFFFF;font-weight:800;font-size:12px;">Я</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    L.marker(startLatLng, { icon: userIcon })
      .bindPopup(
        `<strong>Старт: ${selectedPreset.shortLabel}</strong><br/><span style="font-size:11px;color:#059669;">${ragResult.effectiveCoords.sectorLabel}</span>`
      )
      .addTo(group);

    // 3. Sequential Route Coordinates (Я -> 1 -> 2 -> 3)
    const routePoints: [number, number][] = [startLatLng];

    orderedRoute.forEach((cand, index) => {
      const pt: [number, number] = [cand.poi.lat, cand.poi.lon];
      routePoints.push(pt);

      const thumbUrl = photoMap[cand.poi.id] || getFallbackPhotoForPOI(cand.poi);
      const isSelected = index === selectedStepIndex;
      const borderColor = isSelected ? '#F97316' : '#FFFFFF';

      const poiIcon = L.divIcon({
        className: 'custom-poi-photo-pin',
        html: `
          <div style="position:relative;width:52px;height:58px;display:flex;flex-direction:column;align-items:center;">
            <div style="width:46px;height:46px;border-radius:14px;overflow:hidden;border:3px solid ${borderColor};background:#0F172A;box-shadow:0 8px 18px rgba(15,23,42,0.32);">
              <img src="${thumbUrl}" alt="" style="width:100%;height:100%;object-fit:cover;" />
            </div>
            <span style="position:absolute;top:-6px;right:-2px;background:linear-gradient(135deg,#F97316,#F59E0B);color:#FFFFFF;font-size:11px;font-weight:800;width:22px;height:22px;border-radius:999px;border:2px solid #FFFFFF;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.25);">
              ${index + 1}
            </span>
          </div>
        `,
        iconSize: [52, 58],
        iconAnchor: [26, 48],
      });

      const marker = L.marker(pt, { icon: poiIcon }).addTo(group);
      marker.on('click', () => {
        setSelectedStepIndex(index);
      });
    });

    // 4. Smooth Sequential Polyline (Outer glow + inner dashed line)
    if (routePoints.length > 1) {
      L.polyline(routePoints, {
        color: '#FDBA74',
        weight: 8,
        opacity: 0.45,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(group);

      L.polyline(routePoints, {
        color: '#EA580C',
        weight: 4,
        opacity: 0.95,
        dashArray: '10 8',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(group);

      const bounds = L.latLngBounds(routePoints);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else {
      map.setView(startLatLng, 14);
    }
  }, [orderedRoute, photoMap, ragResult, selectedPreset, selectedStepIndex]);

  const handleFocusStep = (idx: number) => {
    setSelectedStepIndex(idx);
    const target = orderedRoute[idx];
    if (target && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([target.poi.lat, target.poi.lon], 16, {
        duration: 0.75,
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Compact Visual Step Chain Header (Я -> 1 -> 2 -> 3) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-extrabold whitespace-nowrap shrink-0">
            📍 Я: {selectedPreset.shortLabel}
          </span>

          {orderedRoute.map((cand, idx) => {
            const active = idx === selectedStepIndex;
            return (
              <React.Fragment key={cand.poi.id}>
                <ArrowRight className="w-4 h-4 text-orange-400 shrink-0" />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleFocusStep(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                      : 'bg-orange-50/70 hover:bg-orange-100 text-slate-800 border border-orange-200/80'
                  }`}
                >
                  <span>#{idx + 1}</span>
                  <span>{cand.poi.name.split('(')[0].trim()}</span>
                  <span className="opacity-80 font-mono">({cand.walkingMinutes}м)</span>
                </motion.button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-xs font-mono font-extrabold tabular-nums text-slate-700 bg-orange-50/60 px-3.5 py-2 rounded-2xl border border-orange-200/60 shrink-0">
          <span className="flex items-center gap-1">
            <Footprints className="w-3.5 h-3.5 text-orange-500" />
            {orderedRoute.reduce((s, c) => s + c.distanceMeters, 0)} м
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />~
            {ragResult.totalEstimatedMinutes || durationMinutes} мин
          </span>
        </div>
      </div>

      {/* 2. Fullscreen-Style Interactive Map + Bottom Floating Step Card */}
      <div className="relative rounded-3xl overflow-hidden border border-orange-200/80 shadow-md bg-white">
        <div
          ref={mapContainerRef}
          data-testid="astana-leaflet-map"
          className="w-full h-[380px] sm:h-[440px] z-10"
        />

        {/* Floating Bottom Step Card Over Map */}
        {currentStepCandidate && (
          <div className="relative z-20 bg-white/95 backdrop-blur-md border-t border-orange-100 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <img
                src={
                  photoMap[currentStepCandidate.poi.id] ||
                  getFallbackPhotoForPOI(currentStepCandidate.poi)
                }
                alt={currentStepCandidate.poi.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-400 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-extrabold">
                    ШАГ {selectedStepIndex + 1} ИЗ {orderedRoute.length}
                  </span>
                  <span className="text-xs font-mono font-extrabold text-emerald-600">
                    🚶 {currentStepCandidate.distanceMeters} м ·{' '}
                    {currentStepCandidate.walkingMinutes} мин
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 truncate mt-0.5">
                  {currentStepCandidate.poi.name.split('(')[0].trim()}
                </h3>
                <p className="text-xs text-slate-600 font-medium truncate">
                  📍 {currentStepCandidate.poi.address} · ⭐{' '}
                  {currentStepCandidate.poi.rating}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              {activeNavMode ? (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="px-3.5 py-2.5 rounded-2xl bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ведение активно (+25 XP)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveNavMode(false)}
                    className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setActiveNavMode(true);
                    onAwardXp(25, 'Старт пешего маршрута +25 XP');
                    handleFocusStep(selectedStepIndex);
                  }}
                  className="w-full sm:w-auto min-h-[46px] px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>В путь (+25 XP)</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Visual Route Cards Grid (Strictly Admitly AI 3-Widget Format) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {orderedRoute.map((cand, idx) => (
          <AdmitlyPOICard
            key={cand.poi.id}
            candidate={cand}
            index={idx}
            allReviews={allReviews}
            onAddReview={onAddReview}
            onStartRouteToPOI={() => {
              setSelectedStepIndex(idx);
              setActiveNavMode(true);
              onAwardXp(25, `Маршрут к точке #${idx + 1} (+25 XP)`);
              handleFocusStep(idx);
            }}
          />
        ))}
      </div>
    </div>
  );
};
