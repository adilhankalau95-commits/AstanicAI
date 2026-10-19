import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ASTANA_AUDIO_TOURS,
  AudioTourChapter,
  AudioWalkTour,
} from '../data/admitlyContent';
import { AstanaPOI, INITIAL_ASTANA_POIS } from '../data/astanaPois';
import {
  Headphones,
  Play,
  Pause,
  SkipForward,
  Volume2,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { ASSETS } from '../config/assets';

interface AudioWalksViewProps {
  onBuildRouteToPoi: (poi: AstanaPOI, xpBonus: number) => void;
  onAwardXp: (amount: number, reason: string) => void;
}

export const AudioWalksView: React.FC<AudioWalksViewProps> = ({
  onBuildRouteToPoi,
  onAwardXp,
}) => {
  const [selectedTour, setSelectedTour] = useState<AudioWalkTour>(
    ASTANA_AUDIO_TOURS[0]
  );
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.05);
  const [completedChapters, setCompletedChapters] = useState<
    Record<string, boolean>
  >({});

  const currentChapter: AudioTourChapter =
    selectedTour.chapters[activeChapterIndex] || selectedTour.chapters[0];

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playChapterVoice = (
    chapter: AudioTourChapter,
    rate = speechRate
  ) => {
    if (!('speechSynthesis' in window)) {
      setIsPlaying(true);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(chapter.voiceHistoryScript);
      utter.lang = 'ru-RU';
      utter.rate = rate;
      utter.onstart = () => setIsPlaying(true);
      utter.onend = () => {
        setIsPlaying(false);
        setCompletedChapters((prev) => ({ ...prev, [chapter.id]: true }));
        onAwardXp(35, `Прослушана глава «${chapter.title.slice(0, 22)}...» (+35 XP)`);
      };
      utter.onerror = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utter);
    } catch {
      setIsPlaying(false);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      playChapterVoice(currentChapter);
    }
  };

  const handleSelectChapter = (idx: number) => {
    setActiveChapterIndex(idx);
    const ch = selectedTour.chapters[idx];
    if (ch) {
      playChapterVoice(ch);
    }
  };

  const handleNextChapter = () => {
    const nextIdx = (activeChapterIndex + 1) % selectedTour.chapters.length;
    handleSelectChapter(nextIdx);
  };

  const handleSelectTour = (tour: AudioWalkTour) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setSelectedTour(tour);
    setActiveChapterIndex(0);
  };

  const handleStartFullTourOnMap = () => {
    const poi =
      INITIAL_ASTANA_POIS.find((p) => p.id === currentChapter.poiId) ||
      INITIAL_ASTANA_POIS[0];
    onBuildRouteToPoi(poi, selectedTour.xpReward);
  };

  return (
    <div className="space-y-6">
      {/* 1. Tour Selection Cards (3 Curated Astana Audio Walks) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ASTANA_AUDIO_TOURS.map((tour) => {
          const active = tour.id === selectedTour.id;
          return (
            <motion.button
              key={tour.id}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handleSelectTour(tour)}
              className={`text-left rounded-3xl overflow-hidden border transition-all cursor-pointer flex flex-col justify-between ${
                active
                  ? 'bg-white border-orange-400 ring-2 ring-orange-400/30 shadow-md'
                  : 'bg-white border-slate-200/80 hover:border-orange-200 shadow-2xs'
              }`}
            >
              <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                <img
                  src={tour.coverPhoto}
                  alt={tour.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-orange-500 text-white text-[11px] font-extrabold">
                    {tour.badge}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-amber-300 text-[11px] font-extrabold">
                    +{tour.xpReward} XP
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-sm sm:text-base font-extrabold leading-tight">
                    {tour.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between gap-2 text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  {tour.totalMinutes} мин · {tour.distanceKm}
                </span>
                <span className="text-orange-600 font-extrabold">
                  {tour.chapters.length} аудио-главы →
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* 2. Active Audio Player & Chapters Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left (7 cols): Interactive Voice History Player */}
        <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl flex flex-col justify-between space-y-5 relative overflow-hidden">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-orange-400">
                  🎧 ИИ-АУДИОГИД АСТАНИКА · ГОЛОСОВАЯ ИСТОРИЯ
                </div>
                <div className="text-sm sm:text-base font-extrabold text-white">
                  {selectedTour.title}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextRate = speechRate === 1.05 ? 1.25 : 1.05;
                setSpeechRate(nextRate);
                if (isPlaying) {
                  playChapterVoice(currentChapter, nextRate);
                }
              }}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-extrabold text-amber-300 cursor-pointer"
            >
              Скорость: {speechRate === 1.05 ? '1.0x' : '1.25x'}
            </button>
          </div>

          {/* Current Chapter Visual Banner */}
          <div className="relative z-10 rounded-2xl overflow-hidden border border-white/15 bg-slate-950/60 grid grid-cols-1 sm:grid-cols-12">
            <div className="sm:col-span-5 h-44 sm:h-auto relative">
              <img
                src={currentChapter.photoUrl}
                alt={currentChapter.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-slate-950/85 text-orange-300 text-[11px] font-mono font-bold">
                Таймкод {currentChapter.timecode}
              </span>
            </div>

            <div className="sm:col-span-7 p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider">
                  Остановка {activeChapterIndex + 1} из{' '}
                  {selectedTour.chapters.length}
                </span>
                <h4 className="text-base font-extrabold text-white leading-snug">
                  {currentChapter.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  «{currentChapter.voiceHistoryScript}»
                </p>
              </div>

              {/* Animated Equalizer & Mascot */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <img
                    src={ASSETS.MASCOT_IDLE}
                    alt="Астаник"
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-xs font-extrabold text-orange-300">
                    {isPlaying
                      ? '🔊 Читаю историю вслух...'
                      : 'Готов озвучить главу'}
                  </span>
                </div>

                <div className="flex items-end gap-1 h-5">
                  {[0, 1, 2, 3, 4].map((bar) => (
                    <motion.span
                      key={bar}
                      animate={
                        isPlaying
                          ? { height: ['25%', '100%', '40%', '90%', '30%'] }
                          : { height: '25%' }
                      }
                      transition={{
                        duration: 0.7,
                        repeat: Infinity,
                        delay: bar * 0.1,
                      }}
                      className="w-1 bg-orange-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Player Controls Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2.5">
              <motion.button
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={handleTogglePlay}
                data-testid="audio-tour-play-btn"
                className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Пауза озвучки</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Слушать историю голосом (+35 XP)</span>
                  </>
                )}
              </motion.button>

              <button
                type="button"
                onClick={handleNextChapter}
                aria-label="Следующая глава"
                className="min-h-[48px] px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
                <span>Дальше</span>
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={handleStartFullTourOnMap}
              className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-white text-slate-900 hover:bg-orange-50 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>На карту (+{selectedTour.xpReward} XP)</span>
            </motion.button>
          </div>
        </div>

        {/* Right (5 cols): Chapter Timecodes & Checkpoints */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
                📍 ТАЙМКОДЫ И ОСТАНОВКИ МАРШРУТА
              </span>
              <span className="text-xs font-bold text-slate-500">
                {selectedTour.distanceKm} пешком
              </span>
            </div>

            <div className="space-y-2.5">
              {selectedTour.chapters.map((ch, idx) => {
                const isCurrent = idx === activeChapterIndex;
                const isDone = Boolean(completedChapters[ch.id]);
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => handleSelectChapter(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                      isCurrent
                        ? 'bg-orange-50/90 border-orange-300 shadow-2xs'
                        : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200/70'
                    }`}
                  >
                    <img
                      src={ch.photoUrl}
                      alt={ch.title}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white shadow-2xs"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-mono font-extrabold text-orange-600">
                          {ch.timecode} · {ch.durationMin} мин
                        </span>
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </div>
                      <div className="text-xs font-extrabold text-slate-900 truncate mt-0.5">
                        {ch.title}
                      </div>
                      <div className="text-[11px] text-slate-600 truncate">
                        {ch.shortSubtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between gap-2">
            <div className="text-xs font-extrabold text-emerald-950">
              ✨ Нажми на любую главу для мгновенной озвучки истории!
            </div>
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};
