import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ASSETS } from '../config/assets';
import {
  ASTANA_LOCATION_PRESETS,
  LocationPreset,
  WalkScenario,
} from '../data/astanaPois';
import { obfuscateCoordinates } from '../utils/ragMath';
import { ArrowRight, Check, Shield, Sparkles } from 'lucide-react';

interface OnboardingModalProps {
  userName: string;
  setUserName: (name: string) => void;
  selectedPreset: LocationPreset;
  onSelectPreset: (preset: LocationPreset) => void;
  scenario: WalkScenario;
  setScenario: (s: WalkScenario) => void;
  durationMinutes: number;
  setDurationMinutes: (m: number) => void;
  privacyMode: boolean;
  setPrivacyMode: (p: boolean) => void;
  wheelchairOnly: boolean;
  setWheelchairOnly: (w: boolean) => void;
  onComplete: (earnedXp: number) => void;
}

const LOCATION_CARDS = [
  { id: 'expo', icon: '🌐', title: 'Экспо-2017', sub: 'Сфера Нур Алем' },
  { id: 'mega', icon: '🛍️', title: 'Mega Silk Way', sub: 'Променад и кофе' },
  { id: 'baiterek', icon: '🗼', title: 'Байтерек', sub: 'Бульвар Нуржол' },
  { id: 'airport_layover', icon: '✈️', title: 'Аэропорт (2ч)', sub: 'До вылета' },
];

const VIBE_CARDS: Array<{
  id: WalkScenario;
  icon: string;
  imgAsset?: string;
  title: string;
  duration: number;
}> = [
  {
    id: 'coffee_work',
    icon: '☕',
    imgAsset: ASSETS.ICON_3D_COFFEE,
    title: 'Кофе + розетка',
    duration: 60,
  },
  {
    id: 'kids_family',
    icon: '👶',
    imgAsset: ASSETS.ICON_3D_STROLLER,
    title: 'С ребёнком',
    duration: 90,
  },
  {
    id: 'night_vibe',
    icon: '🌙',
    imgAsset: ASSETS.ICON_3D_NIGHT,
    title: 'Ночной вайб',
    duration: 120,
  },
  {
    id: 'walk',
    icon: '🚶',
    imgAsset: ASSETS.ICON_3D_PLANE,
    title: 'Прогулка 45м',
    duration: 45,
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  userName,
  setUserName,
  selectedPreset,
  onSelectPreset,
  scenario,
  setScenario,
  durationMinutes,
  setDurationMinutes,
  privacyMode,
  setPrivacyMode,
  wheelchairOnly,
  setWheelchairOnly,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const progressPercent = step === 1 ? 33 : step === 2 ? 66 : 100;
  const blurred = obfuscateCoordinates(selectedPreset.lat, selectedPreset.lon, privacyMode);

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    } else {
      if (!userName.trim()) setUserName('Диас');
      onComplete(50);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admitly-onboarding-title"
      className="fixed inset-0 z-50 bg-[#FAF7F2] overflow-y-auto flex flex-col"
    >
      {/* Top Admitly-Style Header with Moving Mascot Progress Bar & Skip Button */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-orange-100 px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
            A
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            Astanik <span className="text-blue-600">AI</span>
          </span>
        </div>

        {/* Progress Bar with Riding 3D Mascot */}
        <div className="relative flex-1 max-w-md mx-auto h-3 bg-orange-100 rounded-full">
          <motion.div
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35 }}
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
          />
          <motion.img
            src={ASSETS.MASCOT_IDLE}
            alt="Астаник на прогресс-баре"
            animate={{ left: `calc(${progressPercent}% - 22px)` }}
            transition={{ duration: 0.35 }}
            className="w-11 h-11 object-contain absolute -top-4 drop-shadow-md pointer-events-none"
          />
        </div>

        <button
          type="button"
          onClick={() => onComplete(25)}
          className="text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>Пропустить</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Centered Admitly Wizard Content */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-8 space-y-5">
        {/* Top Mascot Question Card (Strictly 1 short sentence like Admitly AI) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-orange-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-5">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-b from-orange-50 to-sky-50 border border-orange-100 flex items-center justify-center p-2 shrink-0 relative">
            <motion.img
              src={ASSETS.ICON_SPARKLES}
              alt=""
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-5 h-5 absolute top-1.5 right-1.5"
            />
            <motion.img
              src={step === 2 ? ASSETS.MASCOT_THINKING : ASSETS.MASCOT_IDLE}
              alt="3D Астаник"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.6, repeat: Infinity }}
              className="w-full h-full object-contain drop-shadow-sm"
            />
          </div>

          <div className="text-center sm:text-left">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600">
              ШАГ {step} ИЗ 3 · УМНЫЙ ИИ-ГИД АСТАНИК (+50 XP)
            </div>
            <h1
              id="admitly-onboarding-title"
              className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-1 leading-snug"
            >
              {step === 1 &&
                'Салем! Где ты сейчас в Астане и какое настроение?'}
              {step === 2 &&
                'Сколько минут гуляем и нужны ли особые условия?'}
              {step === 3 &&
                'Включим защиту геопозиции Privacy ±150м перед стартом?'}
            </h1>
          </div>
        </div>

        {/* STEP 1: Name + 8 Minimalist Cards (2 Rows of 4 Cards: Locations & Vibe) */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-orange-100 shadow-xs space-y-5">
            <div>
              <label
                htmlFor="onboard-name"
                className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2"
              >
                ТВОЁ ИМЯ
              </label>
              <input
                id="onboard-name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Диас"
                className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl border border-orange-200 bg-orange-50/20 text-base font-bold text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2.5">
                ВЫБЕРИ ТОЧКУ СТАРТА И НАСТРОЕНИЕ (8 КАРТОЧЕК · +25 XP)
              </div>

              {/* Row 1: 4 Astana Locations */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {LOCATION_CARDS.map((loc) => {
                  const active = selectedPreset.id === loc.id;
                  return (
                    <motion.button
                      key={loc.id}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={() => {
                        const found = ASTANA_LOCATION_PRESETS.find(
                          (p) => p.id === loc.id
                        );
                        if (found) onSelectPreset(found);
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        active
                          ? 'border-orange-500 bg-orange-50/70 shadow-xs'
                          : 'border-slate-200/80 bg-white hover:border-orange-200'
                      }`}
                    >
                      <div className="text-2xl mb-1.5">{loc.icon}</div>
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                        {loc.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {loc.sub}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Row 2: 4 Walk Vibes with user's 3D icons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {VIBE_CARDS.map((vibe) => {
                  const active = scenario === vibe.id;
                  return (
                    <motion.button
                      key={vibe.id}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={() => {
                        setScenario(vibe.id);
                        setDurationMinutes(vibe.duration);
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        active
                          ? 'border-orange-500 bg-orange-50/70 shadow-xs'
                          : 'border-slate-200/80 bg-white hover:border-orange-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        {vibe.imgAsset ? (
                          <img
                            src={vibe.imgAsset}
                            alt={vibe.title}
                            className="w-8 h-8 object-contain rounded-lg"
                          />
                        ) : (
                          <span className="text-2xl">{vibe.icon}</span>
                        )}
                        <span className="text-[10px] font-extrabold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                          {vibe.duration}м
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                        {vibe.title}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Walk Duration & Accessibility */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-orange-100 shadow-xs space-y-5">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                СКОЛЬКО ВРЕМЕНИ НА ПРОГУЛКУ?
              </div>
              <div className="grid grid-cols-5 gap-2.5">
                {[15, 30, 45, 60, 120].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`min-h-[52px] rounded-2xl font-extrabold text-sm tabular-nums border-2 transition-all cursor-pointer ${
                      durationMinutes === mins
                        ? 'border-orange-500 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-orange-200'
                    }`}
                  >
                    {mins} мин
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setWheelchairOnly(!wheelchairOnly)}
                className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3 cursor-pointer ${
                  wheelchairOnly
                    ? 'border-orange-500 bg-orange-50/70'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <img
                  src={ASSETS.ICON_3D_STROLLER}
                  alt="Доступная среда"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <div className="text-sm font-extrabold text-slate-900">
                    ♿ С коляской / Пандусы
                  </div>
                  <div className="text-xs text-slate-500">
                    Только безбарьерные маршруты
                  </div>
                </div>
              </button>

              <div className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 flex items-center gap-3">
                <img
                  src={ASSETS.ICON_MAP_PIN}
                  alt="Радиус"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <div className="text-sm font-extrabold text-emerald-950">
                    Радиус: {(Math.max(1400, durationMinutes * 45) / 1000).toFixed(1)} км
                  </div>
                  <div className="text-xs text-emerald-700">
                    Подбор топ-3 мест без очередей
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Privacy Obfuscation (±150m) */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-orange-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center gap-3">
                <Shield className="w-7 h-7 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-sm font-extrabold text-slate-900">
                    🛡️ Privacy Mode: Размытие GPS (±150м)
                  </div>
                  <div className="text-xs text-slate-600">
                    Точные координаты скрыты, треки не хранятся
                  </div>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={privacyMode}
                onClick={() => setPrivacyMode(!privacyMode)}
                className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${
                  privacyMode ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-xs transition-transform ${
                    privacyMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono tabular-nums">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Исходный GPS:</span>
                <span className="text-slate-700 line-through">
                  {selectedPreset.lat.toFixed(6)}, {selectedPreset.lon.toFixed(6)}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-emerald-700 block text-[10px] font-sans font-bold">
                  Безопасный сектор RAG:
                </span>
                <span className="text-emerald-950 font-bold">
                  {blurred.lat.toFixed(4)}°N, {blurred.lon.toFixed(4)}°E
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Wizard Action Bar */}
        <div className="flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
              className="min-h-[50px] px-6 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 cursor-pointer"
            >
              ← Назад
            </button>
          ) : (
            <div />
          )}

          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={handleNext}
            className="min-h-[52px] px-8 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer"
          >
            {step < 3 ? (
              <>
                <span>Далее (Шаг {step + 1} из 3)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Открыть Астаник AI (+50 XP)</span>
                <Check className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
