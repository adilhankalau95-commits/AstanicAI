import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AstanaStoryItem } from '../data/admitlyContent';
import { AstanaPOI } from '../data/astanaPois';
import { getFallbackPhotoForPOI, resolvePhotoForPOI } from '../services/photoService';
import { AstanaAtmosphericVideo } from './AstanaAtmosphericVideo';
import { X, Volume2, VolumeX, MapPin, Sparkles } from 'lucide-react';
import { ASSETS } from '../config/assets';

interface StoryReelsModalProps {
  story: AstanaStoryItem | null;
  poi: AstanaPOI | undefined;
  onClose: () => void;
  onBuildRouteHere: (poi: AstanaPOI, xpBonus: number) => void;
}

export const StoryReelsModal: React.FC<StoryReelsModalProps> = ({
  story,
  poi,
  onClose,
  onBuildRouteHere,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [muted, setMuted] = useState<boolean>(false);

  useEffect(() => {
    if (!story || !poi) return;
    setPhotoUrl(getFallbackPhotoForPOI(poi));
    resolvePhotoForPOI(poi).then((res) => setPhotoUrl(res.url));

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 300);

    // Speak voiceover automatically
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(story.voiceScript);
        utter.lang = 'ru-RU';
        utter.rate = 1.05;
        window.speechSynthesis.speak(utter);
      } catch {
        // ignore speech errors
      }
    }

    return () => {
      clearInterval(interval);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [story, poi]);

  if (!story || !poi) return null;

  const toggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if ('speechSynthesis' in window) {
      if (nextMuted) {
        window.speechSynthesis.cancel();
      } else {
        const utter = new SpeechSynthesisUtterance(story.voiceScript);
        utter.lang = 'ru-RU';
        window.speechSynthesis.speak(utter);
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={story.headline}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-[390px] h-[680px] max-h-[90vh] rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-white/15 flex flex-col justify-between"
      >
        {/* Background Fullscreen Vertical Video */}
        <AstanaAtmosphericVideo
          poiId={poi.id}
          photoUrl={photoUrl || getFallbackPhotoForPOI(poi)}
          accentColor={story.themeColor}
          className="absolute inset-0 w-full h-full"
        />

        {/* Top Reels Progress Bar & Header */}
        <div className="relative z-20 p-4 space-y-3 bg-gradient-to-b from-black/75 via-black/30 to-transparent">
          <div className="w-full h-1.5 bg-white/25 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-amber-300 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-white p-1 shadow-md">
                <img
                  src={ASSETS.MASCOT_IDLE}
                  alt="Астаник"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-white">
                <div className="text-xs font-extrabold flex items-center gap-1.5">
                  <span>{story.badgeTitle}</span>
                  <span className="px-2 py-0.5 rounded-full bg-orange-500 text-[10px] font-extrabold">
                    +{story.xpReward} XP
                  </span>
                </div>
                <div className="text-[11px] text-white/80">
                  Астаник Reels · 15 сек инсайт
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleSound}
                aria-label="Переключить звук сторис"
                className="w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center cursor-pointer"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть видео-сторис"
                className="w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Caption & CTA */}
        <div className="relative z-20 p-5 space-y-3.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <div className="flex items-end gap-3">
            <motion.img
              src={ASSETS.MASCOT_JUMP}
              alt="Астаник"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 object-contain drop-shadow-lg shrink-0"
            />
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-white">
              <div className="text-sm font-extrabold leading-tight">
                {story.headline}
              </div>
              <p className="text-xs text-orange-200 font-semibold mt-1">
                {story.shortCaption}
              </p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => onBuildRouteHere(poi, 50)}
            className="w-full min-h-[48px] rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>📍 Построить маршрут сюда (+50 XP)</span>
            <Sparkles className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
