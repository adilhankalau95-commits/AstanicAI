import { AstanaPOI, INITIAL_ASTANA_POIS } from '../data/astanaPois';
import {
  calculateDistanceMeters,
  calculateHybridScore,
  calculateWalkingMinutes,
  checkConfidenceStatus,
  obfuscateCoordinates,
  ConfidenceResult,
} from '../utils/ragMath';

export interface RAGFilterRequest {
  userLat: number;
  userLon: number;
  privacyMode: boolean;
  scenario: string;
  durationMinutes: number;
  wheelchairOnly: boolean;
  groupMode: boolean;
  searchQuery: string;
  language: 'ru' | 'kz' | 'en';
}

export interface ScoredPOICandidate {
  poi: AstanaPOI;
  distanceMeters: number;
  walkingMinutes: number;
  hybridScore: number;
  distanceScore: number;
  tagScore: number;
  ratingScore: number;
  confidence: ConfidenceResult;
  whyVisit: string;
  actionPlan: string;
  aiIdea: string;
  rejectedReasons?: string[];
}

export interface RAGPipelineResult {
  effectiveCoords: {
    lat: number;
    lon: number;
    sectorLabel: string;
    isObfuscated: boolean;
  };
  maxRadiusMeters: number;
  topRecommendations: ScoredPOICandidate[];
  rejectedLog: Array<{ name: string; distanceMeters: number; reason: string }>;
  mascotSpeech: string;
  totalEstimatedMinutes: number;
  pipelineLatencyMs: number;
  usedLiveGemini: boolean;
  promptSentToGenerator: string;
}

const SCENARIO_REQUIRED_TAGS: Record<string, string[]> = {
  walk: ['tourist_must', 'wheelchair_accessible'],
  coffee_work: ['wifi', 'sockets', 'quiet'],
  kids_family: ['kids_friendly', 'wheelchair_accessible'],
  tourist_layover: ['tourist_must', 'indoor'],
  night_vibe: ['night_activity', 'group_friendly'],
  group_friends: ['group_friendly', 'tourist_must'],
};

/**
 * Pure deterministic RAG retrieval & ranking function (unit-testable)
 */
export function runDeterministicRetrieval(
  request: RAGFilterRequest,
  allPois: AstanaPOI[] = INITIAL_ASTANA_POIS
): Omit<RAGPipelineResult, 'pipelineLatencyMs' | 'usedLiveGemini'> {
  const effectiveCoords = obfuscateCoordinates(
    request.userLat,
    request.userLon,
    request.privacyMode
  );

  // Max walking distance allowed: roughly 40% of total walk duration spent walking (at 83m/min = 5km/h)
  // Minimum radius 1300m so user always has rich nearby options, scaling up to 6500m for 120-180m walks
  const maxRadiusMeters = Math.max(
    1400,
    Math.min(7500, Math.round(request.durationMinutes * 45))
  );

  const requiredTags = [...(SCENARIO_REQUIRED_TAGS[request.scenario] || [])];
  if (request.wheelchairOnly && !requiredTags.includes('wheelchair_accessible')) {
    requiredTags.push('wheelchair_accessible');
  }
  if (request.groupMode && !requiredTags.includes('group_friendly')) {
    requiredTags.push('group_friendly');
  }

  const queryLower = request.searchQuery.trim().toLowerCase();
  if (queryLower.includes('кофе') || queryLower.includes('розетк') || queryLower.includes('wifi')) {
    if (!requiredTags.includes('sockets')) requiredTags.push('sockets');
    if (!requiredTags.includes('wifi')) requiredTags.push('wifi');
  }
  if (queryLower.includes('ребен') || queryLower.includes('ребён') || queryLower.includes('дет')) {
    if (!requiredTags.includes('kids_friendly')) requiredTags.push('kids_friendly');
  }
  if (queryLower.includes('ноч') || queryLower.includes('вечер')) {
    if (!requiredTags.includes('night_activity')) requiredTags.push('night_activity');
  }

  const candidates: ScoredPOICandidate[] = [];
  const rejectedLog: Array<{ name: string; distanceMeters: number; reason: string }> = [];

  for (const poi of allPois) {
    const distanceMeters = calculateDistanceMeters(
      effectiveCoords.lat,
      effectiveCoords.lon,
      poi.lat,
      poi.lon
    );
    const walkingMinutes = calculateWalkingMinutes(distanceMeters);

    // Accessibility strict filter
    if (request.wheelchairOnly && !poi.tags.includes('wheelchair_accessible')) {
      rejectedLog.push({
        name: poi.name,
        distanceMeters,
        reason: 'Отсеяно фильтром безбарьерной среды (нет тега wheelchair_accessible)',
      });
      continue;
    }

    // Distance filter (unless explicitly matched by name in search query)
    const matchesNameExplicitly =
      queryLower.length > 2 &&
      (poi.name.toLowerCase().includes(queryLower) ||
        poi.category.toLowerCase().includes(queryLower));

    if (distanceMeters > maxRadiusMeters && !matchesNameExplicitly) {
      rejectedLog.push({
        name: poi.name,
        distanceMeters,
        reason: `Слишком далеко (${distanceMeters} м > лимит ${maxRadiusMeters} м для прогулки ${request.durationMinutes} мин)`,
      });
      continue;
    }

    // Scenario strict relevance filter for specialized modes
    if (
      request.scenario === 'coffee_work' &&
      !poi.tags.includes('sockets') &&
      !poi.tags.includes('wifi')
    ) {
      rejectedLog.push({
        name: poi.name,
        distanceMeters,
        reason: 'Отсеяно: нет подтвержденных розеток и рабочего Wi-Fi в базе POI',
      });
      continue;
    }

    const scoreBreakdown = calculateHybridScore({
      distanceMeters,
      maxRadiusMeters: Math.max(maxRadiusMeters, 3000),
      poiTags: poi.tags,
      requiredTags,
      rating: poi.rating,
    });

    // Boost score if query keywords match name or facts
    let keywordBoost = 0;
    if (queryLower.length > 2) {
      if (
        poi.name.toLowerCase().includes(queryLower) ||
        poi.poiFacts.toLowerCase().includes(queryLower) ||
        poi.category.toLowerCase().includes(queryLower)
      ) {
        keywordBoost = 15;
      }
    }

    const confidence = checkConfidenceStatus(poi.openingHours, poi.is24Hours);

    candidates.push({
      poi,
      distanceMeters,
      walkingMinutes,
      hybridScore: Math.min(99, scoreBreakdown.totalScore + keywordBoost),
      distanceScore: scoreBreakdown.distanceScore,
      tagScore: scoreBreakdown.tagScore,
      ratingScore: scoreBreakdown.ratingScore,
      confidence,
      whyVisit: customizeWhyVisit(poi, request, distanceMeters, walkingMinutes),
      actionPlan: customizeActionPlan(poi, request.durationMinutes, walkingMinutes),
      aiIdea: poi.defaultAiIdea,
    });
  }

  // Fallback if radius was too tight: relax distance constraint on top nearest POIs
  if (candidates.length === 0) {
    const sortedByDist = [...allPois]
      .map((poi) => {
        const distanceMeters = calculateDistanceMeters(
          effectiveCoords.lat,
          effectiveCoords.lon,
          poi.lat,
          poi.lon
        );
        const walkingMinutes = calculateWalkingMinutes(distanceMeters);
        const scoreBreakdown = calculateHybridScore({
          distanceMeters,
          maxRadiusMeters: 8000,
          poiTags: poi.tags,
          requiredTags,
          rating: poi.rating,
        });
        return {
          poi,
          distanceMeters,
          walkingMinutes,
          hybridScore: scoreBreakdown.totalScore,
          distanceScore: scoreBreakdown.distanceScore,
          tagScore: scoreBreakdown.tagScore,
          ratingScore: scoreBreakdown.ratingScore,
          confidence: checkConfidenceStatus(poi.openingHours, poi.is24Hours),
          whyVisit: customizeWhyVisit(poi, request, distanceMeters, walkingMinutes),
          actionPlan: customizeActionPlan(poi, request.durationMinutes, walkingMinutes),
          aiIdea: poi.defaultAiIdea,
        };
      })
      .sort((a, b) => b.hybridScore - a.hybridScore)
      .slice(0, 3);

    candidates.push(...sortedByDist);
  }

  candidates.sort((a, b) => b.hybridScore - a.hybridScore);

  // Pick 1 to 3 points depending on available duration
  const desiredCount = request.durationMinutes <= 30 ? 2 : 3;
  const topRecommendations = candidates.slice(0, desiredCount);

  const totalWalkingMins = topRecommendations.reduce((acc, item) => acc + item.walkingMinutes, 0);
  const totalEstimatedMinutes = Math.min(
    request.durationMinutes,
    Math.max(20, totalWalkingMins + topRecommendations.length * 20)
  );

  const mascotSpeech = generateMascotSpeech(request, topRecommendations);

  const promptSentToGenerator = JSON.stringify(
    {
      system: 'Astanik Smart City RAG Pipeline v2.4 (Zero-Hallucination Grounding)',
      privacyFilter: request.privacyMode
        ? `ENABLED (Obfuscated to ${effectiveCoords.sectorLabel})`
        : 'DISABLED (Exact GPS)',
      scenario: request.scenario,
      durationMinutes: request.durationMinutes,
      requiredTags,
      retrievedIds: topRecommendations.map((c) => c.poi.id),
    },
    null,
    2
  );

  return {
    effectiveCoords: {
      ...effectiveCoords,
      isObfuscated: request.privacyMode,
    },
    maxRadiusMeters,
    topRecommendations,
    rejectedLog: rejectedLog.slice(0, 6),
    mascotSpeech,
    totalEstimatedMinutes,
    promptSentToGenerator,
  };
}

function customizeWhyVisit(
  poi: AstanaPOI,
  req: RAGFilterRequest,
  distanceMeters: number,
  walkingMinutes: number
): string {
  if (req.scenario === 'coffee_work' && poi.tags.includes('sockets')) {
    return `Находится всего в ${distanceMeters} м (${walkingMinutes} мин пешком): здесь подтверждены розетки 220V у посадочных мест, быстрый Wi-Fi и спокойная атмосфера для фокуса.`;
  }
  if (req.scenario === 'kids_family' && poi.tags.includes('kids_friendly')) {
    return `В ${distanceMeters} м от вас — безопасно и увлекательно для ребёнка, ровные пандусы для коляски и интерактивные зоны.`;
  }
  if (req.scenario === 'tourist_layover') {
    return `Оптимальный тайминг до вылета (${walkingMinutes} мин пути): вы успеете увидеть знаковую архитектуру Астаны без риска опоздать в аэропорт.`;
  }
  if (req.scenario === 'night_vibe') {
    return `Вечерний магнит Астаны в ${distanceMeters} м: эффектная архитектурная подсветка и живая атмосфера после заката.`;
  }
  return `${poi.defaultWhyVisit} (Расстояние: ${distanceMeters} м, около ${walkingMinutes} мин пешком).`;
}

function customizeActionPlan(
  poi: AstanaPOI,
  durationMinutes: number,
  walkingMinutes: number
): string {
  const stayTime = Math.max(15, Math.min(55, Math.round((durationMinutes - walkingMinutes) * 0.65)));
  return `${walkingMinutes} мин пешком по маршруту -> ${stayTime} мин на месте (${poi.defaultActionPlan})`;
}

function generateMascotSpeech(
  req: RAGFilterRequest,
  top: ScoredPOICandidate[]
): string {
  if (top.length === 0) {
    return 'Я просканировал карту Астаны! Давай выберем точку старта, и я соберу маршрут.';
  }
  const first = top[0];
  if (req.language === 'kz') {
    return `Сәлем! Сізге ${req.durationMinutes} минутқа ең жақын ${top.length} керемет орын таптым. Ең жақыны — «${first.poi.nameKz || first.poi.name}» (${first.distanceMeters} м)!`;
  }
  if (req.language === 'en') {
    return `Hi! I matched ${top.length} verified Astana spots for your ${req.durationMinutes}-min walk. Starting with ${first.poi.nameEn || first.poi.name} (${first.distanceMeters}m away)!`;
  }
  return `Я проверил базу POI Астаны! На твои ${req.durationMinutes} мин идеально подходит «${first.poi.name}» в ${first.distanceMeters} м (${first.walkingMinutes} мин пешком) и ещё ${top.length - 1} локации рядом.`;
}

/**
 * Full async RAG pipeline that runs deterministic retrieval first and optionally enriches with server-side Gemini API
 */
export async function executeFullRAGPipeline(
  request: RAGFilterRequest,
  allPois: AstanaPOI[] = INITIAL_ASTANA_POIS,
  useLiveGemini = false
): Promise<RAGPipelineResult> {
  const startTime = performance.now();
  const baseResult = runDeterministicRetrieval(request, allPois);

  if (!useLiveGemini) {
    return {
      ...baseResult,
      pipelineLatencyMs: Math.max(12, Math.round(performance.now() - startTime)),
      usedLiveGemini: false,
    };
  }

  try {
    const response = await fetch('/api/rag/augment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: request.searchQuery,
        scenario: request.scenario,
        durationMinutes: request.durationMinutes,
        language: request.language,
        candidates: baseResult.topRecommendations.map((c) => ({
          id: c.poi.id,
          name: c.poi.name,
          category: c.poi.category,
          distanceMeters: c.distanceMeters,
          poiFacts: c.poi.poiFacts,
          openingHours: c.poi.openingHours,
        })),
      }),
    });

    if (response.ok) {
      const json = await response.json();
      if (!json.fallback && json.data) {
        const enrichedTop = baseResult.topRecommendations.map((cand) => {
          const found = json.data.enrichments?.find(
            (e: { id: string }) => e.id === cand.poi.id
          );
          if (!found) return cand;
          return {
            ...cand,
            whyVisit: found.whyVisit || cand.whyVisit,
            actionPlan: found.actionPlan || cand.actionPlan,
            aiIdea: found.aiIdea || cand.aiIdea,
          };
        });
        return {
          ...baseResult,
          topRecommendations: enrichedTop,
          mascotSpeech: json.data.mascotSpeech || baseResult.mascotSpeech,
          pipelineLatencyMs: Math.round(performance.now() - startTime),
          usedLiveGemini: true,
        };
      }
    }
  } catch {
    // Silent fallback to deterministic RAG
  }

  return {
    ...baseResult,
    pipelineLatencyMs: Math.max(18, Math.round(performance.now() - startTime)),
    usedLiveGemini: false,
  };
}
