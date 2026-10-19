/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ASSETS } from './config/assets';
import {
  ASTANA_LOCATION_PRESETS,
  AstanaPOI,
  LocationPreset,
  WalkScenario,
} from './data/astanaPois';
import {
  ASTANA_STORIES,
  AstanaStoryItem,
  INITIAL_POI_REVIEWS,
  POIReviewItem,
} from './data/admitlyContent';
import { loadStoredPOIs } from './services/poiService';
import { useAstanaMedia } from './services/photoService';
import {
  executeFullRAGPipeline,
  RAGPipelineResult,
  runDeterministicRetrieval,
  ScoredPOICandidate,
} from './services/ragEngine';
import {
  HomeAssistantView,
  HACKATHON_SCENARIOS,
} from './components/HomeAssistantView';
import { RouteMapView } from './components/RouteMapView';
import { ARVisionCameraView } from './components/ARVisionCameraView';
import { VideosAndReviewsView } from './components/VideosAndReviewsView';
import { AudioWalksView } from './components/AudioWalksView';
import { GroupAndEventsView } from './components/GroupAndEventsView';
import { SystemRAGDashboard } from './components/SystemRAGDashboard';
import { OnboardingModal } from './components/OnboardingModal';
import { StoryReelsModal } from './components/StoryReelsModal';
import {
  Compass,
  Map,
  Camera,
  Film,
  Headphones,
  Users,
  Settings2,
  Sparkles,
  Trophy,
  MessageCircle,
} from 'lucide-react';

export type ActiveTab =
  | 'home'
  | 'map'
  | 'camera'
  | 'videos'
  | 'audio'
  | 'group'
  | 'system';

export default function App() {
  // Automatically sync real Astana landmark photos from Wikipedia PageImages API + Wikimedia Commons
  useAstanaMedia();

  // Always open fullscreen 3-step Admitly Onboarding on first entry (unless ?autostart=1)
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') return false;
      const completed = sessionStorage.getItem('astanik_admitly_onboarded');
      if (completed === 'true') return false;
    }
    return true;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [userName, setUserName] = useState<string>('Диас');
  const [streakDays] = useState<number>(7);
  const [xp, setXp] = useState<number>(1450);
  const [xpToast, setXpToast] = useState<string | null>(null);

  const [privacyMode, setPrivacyMode] = useState<boolean>(true);
  const [wheelchairOnly, setWheelchairOnly] = useState<boolean>(false);

  const [pois, setPois] = useState<AstanaPOI[]>(() => loadStoredPOIs());
  const [allReviews, setAllReviews] =
    useState<POIReviewItem[]>(INITIAL_POI_REVIEWS);
  const [activeStory, setActiveStory] = useState<AstanaStoryItem | null>(null);

  const [selectedPreset, setSelectedPreset] = useState<LocationPreset>(
    ASTANA_LOCATION_PRESETS[0]
  );
  const [scenario, setScenario] = useState<WalkScenario>('walk');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [useLiveGemini, setUseLiveGemini] = useState<boolean>(false);

  // Level calculation (every 290 XP = 1 Level, starting at Lvl 5 for 1450 XP)
  const level = Math.max(5, Math.floor(xp / 290));

  const handleAwardXp = (amount: number, reason: string) => {
    setXp((prev) => prev + amount);
    setXpToast(reason);
    setTimeout(() => {
      setXpToast((current) => (current === reason ? null : current));
    }, 2400);
  };

  // Compute initial synchronous RAG state
  const [ragResult, setRagResult] = useState<RAGPipelineResult>(() => {
    const initial = runDeterministicRetrieval(
      {
        userLat: ASTANA_LOCATION_PRESETS[0].lat,
        userLon: ASTANA_LOCATION_PRESETS[0].lon,
        privacyMode: true,
        scenario: 'walk',
        durationMinutes: 45,
        wheelchairOnly: false,
        groupMode: false,
        searchQuery: '',
        language: 'ru',
      },
      loadStoredPOIs()
    );
    return {
      ...initial,
      pipelineLatencyMs: 14,
      usedLiveGemini: false,
    };
  });

  // Re-run RAG pipeline whenever parameters change
  useEffect(() => {
    let cancelled = false;
    executeFullRAGPipeline(
      {
        userLat: selectedPreset.lat,
        userLon: selectedPreset.lon,
        privacyMode,
        scenario,
        durationMinutes,
        wheelchairOnly,
        groupMode: false,
        searchQuery,
        language: 'ru',
      },
      pois,
      useLiveGemini
    ).then((res) => {
      if (!cancelled) {
        setRagResult(res);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [
    selectedPreset,
    privacyMode,
    scenario,
    durationMinutes,
    wheelchairOnly,
    searchQuery,
    pois,
    useLiveGemini,
  ]);

  const handleApplyHackathonCase = (caseIndex: number) => {
    const chosen = HACKATHON_SCENARIOS[caseIndex];
    if (!chosen) return;
    const preset =
      ASTANA_LOCATION_PRESETS.find((p) => p.id === chosen.presetId) ||
      ASTANA_LOCATION_PRESETS[0];
    setSelectedPreset(preset);
    setScenario(chosen.scenario);
    setDurationMinutes(chosen.duration);
    setSearchQuery(chosen.query);
    setWheelchairOnly(chosen.scenario === 'kids_family');
    handleAwardXp(20, `Сценарий «${chosen.shortPill}» (+20 XP)`);
  };

  const handleAddReview = (
    poiId: string,
    tag: POIReviewItem['tag'],
    comment: string
  ) => {
    const newItem: POIReviewItem = {
      id: `rev-${Date.now()}`,
      poiId,
      author: `${userName || 'Диас'} · Исследователь`,
      role: `Lvl ${level}`,
      avatarBg: 'bg-orange-500',
      rating: 5.0,
      tag,
      comment,
      timeAgo: 'Только что',
    };
    setAllReviews((prev) => [newItem, ...prev]);
    handleAwardXp(50, 'Новый отзыв опубликован (+50 XP) ⭐');
  };

  const handleStartRouteToCandidate = (cand: ScoredPOICandidate) => {
    setSearchQuery(cand.poi.name.split('(')[0].trim());
    handleAwardXp(
      25,
      `Маршрут к «${cand.poi.name.split('(')[0].trim()}» (+25 XP)`
    );
    setActiveTab('map');
  };

  const handleBuildRouteToPoi = (poi: AstanaPOI, xpBonus = 50) => {
    setSearchQuery(poi.name.split('(')[0].trim());
    setActiveStory(null);
    handleAwardXp(xpBonus, `Маршрут построен (+${xpBonus} XP) 📍`);
    setActiveTab('map');
  };

  const storyPoi = activeStory
    ? pois.find((p) => p.id === activeStory.poiId) || pois[0]
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 pb-20 md:pb-12">
      {/* Floating XP Reward Toast */}
      <AnimatePresence>
        {xpToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }}
            className="fixed top-16 right-4 z-50 px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-extrabold shadow-lg flex items-center gap-1.5 pointer-events-none"
          >
            <Sparkles className="w-4 h-4" />
            <span>{xpToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. GAMIFIED TOP BAR (Clean Apple Maps + Admitly AI Style) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Left: Logo with Icon in Blue Rounded Square */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 shrink-0 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-xs">
              A
            </div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
              Astanik <span className="text-blue-600">AI</span>
            </span>
          </button>

          {/* Right: Gamified Pills in One Row */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {/* Orange Streak Pill */}
            <div className="px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap shrink-0">
              <img
                src={ASSETS.ICON_FLAME_STREAK}
                alt="Стрик"
                className="w-4 h-4 object-contain"
              />
              <span>🔥 {streakDays} дней в Астане</span>
            </div>

            {/* Blue-Purple XP Pill */}
            <div
              data-testid="header-xp-pill"
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-2xs tabular-nums"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>
                🏆 {xp.toLocaleString('ru-RU')} XP · Lvl {level} Исследователь
              </span>
            </div>

            {/* Gold Video-Route Pill */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => {
                setActiveStory(ASTANA_STORIES[0]);
                handleAwardXp(30, 'Открыт видео-маршрут +30 XP 🎬');
              }}
              className="hidden sm:flex px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-xs font-extrabold items-center gap-1.5 whitespace-nowrap shrink-0 shadow-2xs cursor-pointer"
            >
              <span>🎬 Видео-маршрут</span>
            </motion.button>

            {/* Dark Quick Start Button (Opens 3-Step Onboarding) */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowOnboarding(true)}
              className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>✨ Быстрый старт</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* 2. MINIMALIST PILL TABS CONTAINER */}
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 pt-4">
        <nav
          aria-label="Навигация Astanik AI"
          className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-1.5 overflow-x-auto no-scrollbar"
        >
          {(
            [
              { id: 'home', label: '🧭 Главная', icon: Compass },
              { id: 'map', label: '🗺️ Живая Карта', icon: Map },
              { id: 'camera', label: '📷 Живая Камера', icon: Camera },
              { id: 'videos', label: '🎬 Видео и Отзывы', icon: Film },
              { id: 'audio', label: '🎧 Аудио-прогулки', icon: Headphones },
              { id: 'group', label: '👥 Группы и Афиша', icon: Users },
              { id: 'system', label: '⚙️ О системе', icon: Settings2 },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[125px] min-h-[42px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-4 pb-8">
        {activeTab === 'home' && (
          <HomeAssistantView
            userName={userName}
            streakDays={streakDays}
            selectedPreset={selectedPreset}
            onSelectPreset={setSelectedPreset}
            scenario={scenario}
            setScenario={setScenario}
            durationMinutes={durationMinutes}
            setDurationMinutes={setDurationMinutes}
            privacyMode={privacyMode}
            setPrivacyMode={setPrivacyMode}
            ragResult={ragResult}
            allReviews={allReviews}
            onAddReview={handleAddReview}
            onAwardXp={handleAwardXp}
            onOpenStory={(story) => {
              setActiveStory(story);
              handleAwardXp(
                story.xpReward,
                `Сторис «${story.badgeTitle}» +${story.xpReward} XP`
              );
            }}
            onNavigateTab={setActiveTab}
            onStartRouteToPOI={handleStartRouteToCandidate}
            onApplyHackathonCase={handleApplyHackathonCase}
          />
        )}

        {activeTab === 'map' && (
          <RouteMapView
            selectedPreset={selectedPreset}
            ragResult={ragResult}
            durationMinutes={durationMinutes}
            allReviews={allReviews}
            onAddReview={handleAddReview}
            onAwardXp={handleAwardXp}
          />
        )}

        {activeTab === 'camera' && (
          <ARVisionCameraView
            onSelectDestinationOnMap={(poi) => handleBuildRouteToPoi(poi, 50)}
            onAwardXp={handleAwardXp}
          />
        )}

        {activeTab === 'videos' && (
          <VideosAndReviewsView
            allReviews={allReviews}
            onAddReview={handleAddReview}
            onOpenStory={(story) => {
              setActiveStory(story);
              handleAwardXp(
                story.xpReward,
                `Просмотр Reels +${story.xpReward} XP`
              );
            }}
            onBuildRouteToPoi={handleBuildRouteToPoi}
          />
        )}

        {activeTab === 'audio' && (
          <AudioWalksView
            onBuildRouteToPoi={handleBuildRouteToPoi}
            onAwardXp={handleAwardXp}
          />
        )}

        {activeTab === 'group' && (
          <GroupAndEventsView
            onBuildRouteToPoi={handleBuildRouteToPoi}
            onAwardXp={handleAwardXp}
          />
        )}

        {activeTab === 'system' && (
          <SystemRAGDashboard
            pois={pois}
            onUpdatePois={setPois}
            ragResult={ragResult}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            useLiveGemini={useLiveGemini}
            setUseLiveGemini={setUseLiveGemini}
            onApplyHackathonCase={handleApplyHackathonCase}
            onAddPoiToRoute={handleStartRouteToCandidate}
            onAwardXp={handleAwardXp}
          />
        )}
      </main>

      {/* 4. FLOATING ONLINE GUIDE WIDGET (Bottom-Right Corner) */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.94 }}
        type="button"
        onClick={() => {
          setActiveTab('system');
          handleAwardXp(15, 'Открыт ИИ-Гид онлайн (+15 XP)');
        }}
        className="fixed bottom-4 right-4 z-40 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl border border-white/15 flex items-center gap-2.5 cursor-pointer"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <MessageCircle className="w-4 h-4 text-orange-400" />
        <span className="text-xs font-extrabold">Гид онлайн</span>
      </motion.button>

      {/* 5. FULLSCREEN VERTICAL STORY REELS MODAL */}
      <StoryReelsModal
        story={activeStory}
        poi={storyPoi}
        onClose={() => setActiveStory(null)}
        onBuildRouteHere={handleBuildRouteToPoi}
      />

      {/* 6. 3-STEP ADMITLY ONBOARDING WIZARD MODAL */}
      {showOnboarding && (
        <OnboardingModal
          userName={userName}
          setUserName={setUserName}
          selectedPreset={selectedPreset}
          onSelectPreset={setSelectedPreset}
          scenario={scenario}
          setScenario={setScenario}
          durationMinutes={durationMinutes}
          setDurationMinutes={setDurationMinutes}
          privacyMode={privacyMode}
          setPrivacyMode={setPrivacyMode}
          wheelchairOnly={wheelchairOnly}
          setWheelchairOnly={setWheelchairOnly}
          onComplete={(earnedXp) => {
            sessionStorage.setItem('astanik_admitly_onboarded', 'true');
            setShowOnboarding(false);
            handleAwardXp(earnedXp, `Быстрый старт пройден (+${earnedXp} XP) 🎉`);
          }}
        />
      )}
    </div>
  );
}
