import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ASSETS } from '../config/assets';
import {
  ASTANA_LOCATION_PRESETS,
  LocationPreset,
  WalkScenario,
} from '../data/astanaPois';
import {
  ASTANA_STORIES,
  AstanaStoryItem,
  POIReviewItem,
} from '../data/admitlyContent';
import { RAGPipelineResult, ScoredPOICandidate } from '../services/ragEngine';
import { AdmitlyPOICard } from './AdmitlyPOICard';
import {
  Sparkles,
  Camera,
  Map,
  MapPin,
  Clock,
  Headphones,
} from 'lucide-react';

interface HomeAssistantViewProps {
  userName: string;
  streakDays: number;
  selectedPreset: LocationPreset;
  onSelectPreset: (preset: LocationPreset) => void;
  scenario: WalkScenario;
  setScenario: (s: WalkScenario) => void;
  durationMinutes: number;
  setDurationMinutes: (m: number) => void;
  privacyMode: boolean;
  setPrivacyMode: (p: boolean) => void;
  ragResult: RAGPipelineResult;
  allReviews: POIReviewItem[];
  onAddReview: (
    poiId: string,
    tag: POIReviewItem['tag'],
    comment: string
  ) => void;
  onAwardXp: (amount: number, reason: string) => void;
  onOpenStory: (story: AstanaStoryItem) => void;
  onNavigateTab: (
    tab: 'map' | 'camera' | 'videos' | 'audio' | 'group' | 'system'
  ) => void;
  onStartRouteToPOI: (cand: ScoredPOICandidate) => void;
  onApplyHackathonCase: (caseIndex: number) => void;
}

export const HACKATHON_SCENARIOS = [
  {
    id: 1,
    shortPill: '🛍️ Прогулка у Mega Silk Way',
    title: 'Я возле Mega Silk Way, хочу прогуляться 30–60 минут',
    presetId: 'mega',
    scenario: 'walk' as WalkScenario,
    duration: 45,
    query: 'прогуляться возле Mega Silk Way и Сферы',
  },
  {
    id: 2,
    shortPill: '☕ Кофе + розетка рядом',
    title: 'Хочу тихое место с кофе и розеткой недалеко от меня',
    presetId: 'expo',
    scenario: 'coffee_work' as WalkScenario,
    duration: 60,
    query: 'тихое место с кофе и розеткой',
  },
  {
    id: 3,
    shortPill: '👶 С ребёнком (интерактивы)',
    title: 'Еду с ребёнком — где рядом детские площадки или музей с интерактивами?',
    presetId: 'expo',
    scenario: 'kids_family' as WalkScenario,
    duration: 90,
    query: 'детские площадки и музей с интерактивами',
  },
  {
    id: 4,
    shortPill: '✈️ Турист: 2ч до вылета',
    title: 'Я турист, у меня 2 часа перед вылетом: что посмотреть поблизости?',
    presetId: 'airport_layover',
    scenario: 'tourist_layover' as WalkScenario,
    duration: 120,
    query: 'турист 2 часа перед вылетом главные места',
  },
  {
    id: 5,
    shortPill: '🌙 Ночной вайб на 2 часа',
    title: 'Ищу необычную ночная активность на пару часов',
    presetId: 'expo',
    scenario: 'night_vibe' as WalkScenario,
    duration: 120,
    query: 'необычная ночная активность панорама',
  },
];

export const HomeAssistantView: React.FC<HomeAssistantViewProps> = ({
  userName,
  selectedPreset,
  onSelectPreset,
  durationMinutes,
  setDurationMinutes,
  ragResult,
  allReviews,
  onAddReview,
  onAwardXp,
  onOpenStory,
  onNavigateTab,
  onStartRouteToPOI,
  onApplyHackathonCase,
}) => {
  const [mascotJumping, setMascotJumping] = useState(false);
  const [sparkleBurst, setSparkleBurst] = useState(0);

  const handleMascotClick = () => {
    setMascotJumping(true);
    setSparkleBurst((prev) => prev + 1);
    onAwardXp(10, 'Прыжок Астаника +10 XP ✨');
    setTimeout(() => setMascotJumping(false), 750);
  };

  return (
    <div className="space-y-5">
      {/* 1. STORIES BAR WITH REAL ASTANA PHOTOGRAPHS */}
      <div className="flex flex-col md:flex-row md:items-center gap-3.5 bg-white rounded-3xl p-3.5 sm:px-5 border border-slate-200/80 shadow-2xs">
        <div className="shrink-0 pr-3 md:border-r border-slate-200">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600">
            📱 СТОРИС АСТАНЫ
          </div>
          <div className="text-xs font-extrabold text-slate-900">
            Живые видео · +30 XP
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
          {ASTANA_STORIES.map((story) => (
            <motion.button
              key={story.id}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => onOpenStory(story)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50/80 hover:bg-orange-50/60 border border-slate-200/90 hover:border-orange-300 transition-all shrink-0 cursor-pointer group"
            >
              <div
                className={`w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr ${story.ringGradient} shrink-0`}
              >
                <img
                  src={story.thumbPhoto}
                  alt={story.badgeTitle}
                  className="w-full h-full object-cover rounded-full border-2 border-white"
                />
              </div>
              <div className="text-left pr-1">
                <div className="text-xs font-extrabold text-slate-900 group-hover:text-orange-600 whitespace-nowrap">
                  {story.badgeTitle}
                </div>
                <div className="text-[11px] font-bold text-emerald-600 whitespace-nowrap">
                  ▶️ {story.subtitleXp}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 2. COMPACT SINGLE-LINE HERO BLOCK (Minimalist Apple Maps / Admitly AI Style) */}
      <div className="bg-gradient-to-br from-orange-50/70 via-white to-sky-50/60 border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
          {/* Left: Mascot + Greeting */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="relative shrink-0 flex flex-col items-center">
              <motion.div
                onClick={handleMascotClick}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white shadow-sm border border-orange-100 flex items-center justify-center p-2 cursor-pointer select-none"
              >
                <motion.img
                  src={ASSETS.ICON_SPARKLES}
                  alt=""
                  animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                  className="w-5 h-5 absolute top-2 right-2 pointer-events-none"
                />
                {sparkleBurst > 0 && (
                  <motion.div
                    key={sparkleBurst}
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 1.7, opacity: 0 }}
                    transition={{ duration: 0.55 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <span className="text-[11px] font-extrabold bg-orange-500 text-white px-2 py-0.5 rounded-full">
                      +10 XP! ✨
                    </span>
                  </motion.div>
                )}
                <motion.img
                  src={mascotJumping ? ASSETS.MASCOT_JUMP : ASSETS.MASCOT_IDLE}
                  alt="Астаник"
                  animate={
                    mascotJumping
                      ? { y: [0, -18, 0], scale: [1, 1.1, 1] }
                      : { y: [0, -6, 0] }
                  }
                  transition={{
                    duration: mascotJumping ? 0.45 : 2.8,
                    repeat: mascotJumping ? 0 : Infinity,
                  }}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-sm"
                />
              </motion.div>
              <button
                type="button"
                onClick={handleMascotClick}
                className="-mt-2.5 relative z-10 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-extrabold shadow-xs cursor-pointer"
              >
                Нажми (+10 XP) ✨
              </button>
            </div>

            <div className="space-y-2 max-w-xl">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const idx = ASTANA_LOCATION_PRESETS.findIndex(
                      (p) => p.id === selectedPreset.id
                    );
                    const next =
                      ASTANA_LOCATION_PRESETS[
                        (idx + 1) % ASTANA_LOCATION_PRESETS.length
                      ];
                    onSelectPreset(next);
                  }}
                  className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-extrabold flex items-center gap-1 hover:border-orange-300 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>Точка: {selectedPreset.shortLabel} ↻</span>
                </button>
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold">
                  Погода в Астане +18°C
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Салем, {userName}! Куда прогуляемся за{' '}
                <span className="text-orange-600">{durationMinutes} минут</span>?
              </h1>

              <p
                data-testid="mascot-speech"
                className="text-xs sm:text-sm text-slate-600 font-semibold"
              >
                Подобрал {ragResult.topRecommendations.length} проверенных места в пешей доступности — выбирай маршрут или наведи камеру!
              </p>
            </div>
          </div>

          {/* Right: 3 Clean Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-2.5 w-full lg:w-auto shrink-0">
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => {
                onAwardXp(25, 'Открыта Живая Карта +25 XP');
                onNavigateTab('map');
              }}
              className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 cursor-pointer whitespace-nowrap"
            >
              <Map className="w-4 h-4 shrink-0" />
              <span>🗺️ Маршрут на карте</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => {
                onAwardXp(150, 'Запущена Живая Камера +150 XP');
                onNavigateTab('camera');
              }}
              className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer whitespace-nowrap"
            >
              <Camera className="w-4 h-4 shrink-0" />
              <span>📷 Живая Камера (+150 XP)</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => {
                onAwardXp(40, 'Аудио-экскурсии Астаны +40 XP');
                onNavigateTab('audio');
              }}
              className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Headphones className="w-4 h-4 text-amber-400 shrink-0" />
              <span>🎧 Аудио-прогулки</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* 3. MOOD & SCENARIO FILTER PILLS */}
      <div className="bg-white rounded-3xl p-3.5 sm:px-5 border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Сценарий:
          </span>
          {HACKATHON_SCENARIOS.map((item, idx) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => onApplyHackathonCase(idx)}
              className="px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-orange-500 hover:text-white border border-slate-200/90 text-slate-800 text-xs font-extrabold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {item.shortPill}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Clock className="w-4 h-4 text-orange-500" />
          {[30, 45, 60, 120].map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => setDurationMinutes(mins)}
              className={`px-2.5 py-1 rounded-full text-xs font-extrabold tabular-nums cursor-pointer ${
                durationMinutes === mins
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mins}м
            </button>
          ))}
        </div>
      </div>

      {/* 4. JUICY POI CARDS GRID WITH REAL ASTANA PHOTOGRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {ragResult.topRecommendations.map((cand, idx) => (
          <AdmitlyPOICard
            key={cand.poi.id}
            candidate={cand}
            index={idx}
            allReviews={allReviews}
            onAddReview={onAddReview}
            onStartRouteToPOI={onStartRouteToPOI}
          />
        ))}
      </div>
    </div>
  );
};
