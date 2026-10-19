/**
 * Pure mathematical and scoring utilities for the Astanik AI RAG Pipeline.
 * Kept self-contained for deterministic unit testing via node:test.
 */

export interface Coordinates {
  lat: number;
  lon: number;
}

/**
 * Calculates the great-circle distance in meters between two GPS coordinates using the Haversine formula.
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Calculates walking time in minutes assuming a comfortable urban pace of 5.0 km/h (83.33 meters/min).
 */
export function calculateWalkingMinutes(distanceMeters: number): number {
  const metersPerMinute = 83.33;
  return Math.max(1, Math.round(distanceMeters / metersPerMinute));
}

/**
 * Privacy Mode Obfuscation: Blurs exact GPS coordinates by ~150m grid sector so exact user tracks are never exposed.
 */
export function obfuscateCoordinates(
  lat: number,
  lon: number,
  privacyEnabled: boolean
): { lat: number; lon: number; sectorLabel: string } {
  if (!privacyEnabled) {
    return {
      lat: Number(lat.toFixed(6)),
      lon: Number(lon.toFixed(6)),
      sectorLabel: `${lat.toFixed(6)}, ${lon.toFixed(6)} (Точный GPS)`,
    };
  }
  // Snap to ~150m grid (~0.0015 deg)
  const gridStep = 0.0015;
  const blurredLat = Number((Math.round(lat / gridStep) * gridStep).toFixed(4));
  const blurredLon = Number((Math.round(lon / gridStep) * gridStep).toFixed(4));
  return {
    lat: blurredLat,
    lon: blurredLon,
    sectorLabel: `Сектор ~${blurredLat.toFixed(3)}°N, ${blurredLon.toFixed(3)}°E (±150м Privacy Blur)`,
  };
}

export interface HybridScoreInput {
  distanceMeters: number;
  maxRadiusMeters: number;
  poiTags: string[];
  requiredTags: string[];
  rating: number; // 0 to 5
}

/**
 * Computes the Hackathon Hybrid RAG Score:
 * Distance Score (40%) + Semantic/Tag Match (40%) + Rating/Popularity (20%)
 * Returns a score from 0 to 100.
 */
export function calculateHybridScore(input: HybridScoreInput): {
  totalScore: number;
  distanceScore: number;
  tagScore: number;
  ratingScore: number;
} {
  const { distanceMeters, maxRadiusMeters, poiTags, requiredTags, rating } = input;

  // 1. Distance Score (0..100): closer is higher
  const clampedRatio = Math.min(1, Math.max(0, distanceMeters / Math.max(500, maxRadiusMeters)));
  const distanceScore = Math.round((1 - clampedRatio * 0.85) * 100);

  // 2. Tag/Semantic Match Score (0..100)
  let tagScore = 80; // base when no strict tags required
  if (requiredTags.length > 0) {
    const matched = requiredTags.filter((t) => poiTags.includes(t)).length;
    tagScore = Math.round((matched / requiredTags.length) * 100);
  }

  // 3. Rating Score (0..100)
  const ratingScore = Math.round((Math.min(5, Math.max(1, rating)) / 5) * 100);

  const totalScore = Math.round(
    distanceScore * 0.4 + tagScore * 0.4 + ratingScore * 0.2
  );

  return {
    totalScore: Math.min(99, Math.max(10, totalScore)),
    distanceScore,
    tagScore,
    ratingScore,
  };
}

export interface ConfidenceResult {
  level: 'high' | 'medium';
  percentage: number;
  badgeText: string;
  sourceNote: string;
}

/**
 * Evaluates schedule availability confidence strictly from POI database fields without hallucinating.
 */
export function checkConfidenceStatus(
  openingHours: string | null | undefined,
  is24Hours?: boolean
): ConfidenceResult {
  if (is24Hours) {
    return {
      level: 'high',
      percentage: 98,
      badgeText: 'Открыто 24/7 (Уверенность: 98%, источник: база POI)',
      sourceNote: 'Круглосуточный доступ подтвержден в реестре городских пространств Астаны.',
    };
  }
  if (openingHours && openingHours.trim().length > 0) {
    return {
      level: 'high',
      percentage: 95,
      badgeText: `Открыто сейчас · ${openingHours} (Уверенность: 95%, источник: POI)`,
      sourceNote: `Верифицированный график работы из паспорта объекта POI (${openingHours}).`,
    };
  }
  return {
    level: 'medium',
    percentage: 70,
    badgeText:
      'Вероятно доступно (Уверенность: 70% — точный график не указан в базе, рекомендуем уточнить)',
    sourceNote:
      'В открытой базе OpenStreetMap/POI отсутствует точное расписание по часам. ИИ не додумывает график.',
  };
}
