import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ASSETS } from '../config/assets';
import { AstanaPOI, INITIAL_ASTANA_POIS } from '../data/astanaPois';
import {
  getFallbackPhotoForPOI,
  resolvePhotoForPOI,
} from '../services/photoService';
import { AstanaAtmosphericVideo } from './AstanaAtmosphericVideo';
import {
  Camera,
  Upload,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Sparkles,
  Compass,
  Navigation,
  MapPin,
  CheckCircle2,
  Coffee,
  Landmark,
} from 'lucide-react';

interface ARVisionCameraViewProps {
  onSelectDestinationOnMap: (poi: AstanaPOI) => void;
  onAwardXp: (amount: number, reason: string) => void;
}

interface DemoCameraPreset {
  id: string;
  shortLabel: string;
  poiId: string;
  heading: string;
  shortFact: string;
  architectAndYear: string;
  coffeeArrow: string;
  voiceHistoryScript: string;
}

const DEMO_CAMERA_TARGETS: DemoCameraPreset[] = [
  {
    id: 'demo-nuralem',
    shortLabel: '🌐 Сфера Нур Алем',
    poiId: 'poi-nur-alem',
    heading: 'СВ 42° · Экспо-2017',
    shortFact: 'Единственная полная сфера в мире диаметром 80м и высотой 100м',
    architectAndYear: 'Adrian Smith + Gordon Gill · 2017 год · 8 этажей',
    coffeeArrow: '↗️ 180м направо → Marrone Rosso (Розетки 220V и раф)',
    voiceHistoryScript:
      'Перед вами сфера Нур Алем — архитектурный символ ЭКСПО-2017, созданный чикагским бюро Эдриана Смита. Это единственное в мире здание в форме полной сферы диаметром 80 метров и высотой 100 метров! Внутри расположены 8 этажей интерактивного музея энергии будущего, а в ста восьмидесяти метрах справа вас ждёт горячий кофе и розетки в Марроне Россо.',
  },
  {
    id: 'demo-baiterek',
    shortLabel: '🗼 Монумент Байтерек',
    poiId: 'poi-baiterek',
    heading: 'В 88° · Бульвар Нуржол',
    shortFact: 'Высота 97м символизирует 1997 год переноса столицы в Астану',
    architectAndYear: 'Акмурза Рустембеков & Норман Фостер · 2002 год',
    coffeeArrow: '➡️ 140м прямо → Пекарня Көктем (Быстрый Wi-Fi)',
    voiceHistoryScript:
      'Вы навели камеру на монумент Астана-Байтерек! Его высота ровно 97 метров в честь 1997 года, когда Астана стала новой столицей Казахстана. Венчает башню золотой шар диаметром 22 метра из итальянского стекла-хамелеона, символизирующий яйцо мифической птицы Самрук на вершине Древа жизни. А в ста сорока метрах на бульваре Нуржол можно согреться в пекарне Көктем!',
  },
  {
    id: 'demo-mega',
    shortLabel: '🛍️ Mega Silk Way',
    poiId: 'poi-mega-silkway',
    heading: 'З 265° · Кабанбай батыра, 62',
    shortFact: 'Крытый сити-променад длиной 500м с климат-контролем +22°C',
    architectAndYear: 'Chapman Taylor (Великобритания) · 2017 год',
    coffeeArrow: '⬆️ 60м у входа → Starbucks Reserve (Длинный стол с розетками)',
    voiceHistoryScript:
      'Перед вами торгово-развлекательный променад Мега Силк Вэй, спроектированный британским бюро Чепмен Тейлор! Его крытые стеклянные бульвары длиной полкилометра защищают от степного ветра и сохраняют комфортные плюс двадцать два градуса круглый год. Прямо у главного входа работает Старбакс Резерв с розетками для ноутбука.',
  },
  {
    id: 'demo-khanshatyr',
    shortLabel: '⛺ Хан Шатыр',
    poiId: 'poi-khan-shatyr',
    heading: 'СЗ 315° · Ось Нуржол',
    shortFact: 'Крупнейший в мире эко-шатёр высотой 150м из ETFE-полимера',
    architectAndYear: 'Фостер и Партнёры (Норман Фостер) · 2010 год',
    coffeeArrow: '↖️ 110м налево → Кофейная терраса под куполом (2 этаж)',
    voiceHistoryScript:
      'В объективе — гигантский шатёр Хан Шатыр, построенный британским архитектором лордом Норманом Фостером! Трёхногая стальная мачта держит на высоте 150 метров прозрачное покрытие из фторполимера, которое пропускает солнечный свет и сохраняет тропическое лето с песчаным пляжем даже в тридцатиградусный мороз.',
  },
];

export const ARVisionCameraView: React.FC<ARVisionCameraViewProps> = ({
  onSelectDestinationOnMap,
  onAwardXp,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedDemo, setSelectedDemo] = useState<DemoCameraPreset>(
    DEMO_CAMERA_TARGETS[0]
  );
  const [useLiveWebcam, setUseLiveWebcam] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [demoPhotoUrl, setDemoPhotoUrl] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [scannedPreset, setScannedPreset] = useState<DemoCameraPreset>(
    DEMO_CAMERA_TARGETS[0]
  );

  const matchedPoi =
    INITIAL_ASTANA_POIS.find((p) => p.id === selectedDemo.poiId) ||
    INITIAL_ASTANA_POIS[0];

  useEffect(() => {
    let cancelled = false;
    setDemoPhotoUrl(getFallbackPhotoForPOI(matchedPoi));
    resolvePhotoForPOI(matchedPoi).then((res) => {
      if (!cancelled) setDemoPhotoUrl(res.url);
    });
    return () => {
      cancelled = true;
    };
  }, [matchedPoi]);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (useLiveWebcam) {
      setWebcamError(null);
      setUploadedImageUrl(null);
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          activeStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setWebcamError(
            'Доступ к веб-камере не предоставлен браузером — активен живой панорамный поток Астаны'
          );
          setUseLiveWebcam(false);
        });
    } else if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [useLiveWebcam]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakOutLoud = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 1.03;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleScanLandmark = (presetToScan = selectedDemo) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedPreset(presetToScan);
      onAwardXp(
        150,
        `История места «${presetToScan.shortLabel}» открыта (+150 XP) 🎙️`
      );
      speakOutLoud(presetToScan.voiceHistoryScript);
    }, 550);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUseLiveWebcam(false);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : null;
      setUploadedImageUrl(dataUrl);

      // Match filename keywords if possible, or recognize current landmark
      const lower = file.name.toLowerCase();
      let matched = selectedDemo;
      if (lower.includes('baiterek') || lower.includes('байтерек')) {
        matched = DEMO_CAMERA_TARGETS[1];
      } else if (lower.includes('mega') || lower.includes('мега')) {
        matched = DEMO_CAMERA_TARGETS[2];
      } else if (lower.includes('khan') || lower.includes('шатыр')) {
        matched = DEMO_CAMERA_TARGETS[3];
      } else {
        matched = DEMO_CAMERA_TARGETS[0];
      }
      setSelectedDemo(matched);
      handleScanLandmark(matched);
    };
    reader.readAsDataURL(file);
  };

  const activeStoryPreset = scannedPreset || selectedDemo;

  return (
    <div className="space-y-5">
      {/* 1. Camera Mode Bar: 4 Real Landmark Views + Real WebRTC Camera + Upload Photo */}
      <div className="bg-white rounded-3xl p-3.5 sm:px-5 border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Выбор достопримечательности Астаны в видоискателе"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5"
        >
          {DEMO_CAMERA_TARGETS.map((demo) => {
            const active = selectedDemo.id === demo.id && !uploadedImageUrl;
            return (
              <motion.button
                key={demo.id}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  setUploadedImageUrl(null);
                  setSelectedDemo(demo);
                  setScannedPreset(demo);
                  speakOutLoud(demo.voiceHistoryScript);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-orange-50 text-slate-800 border border-slate-200/90'
                }`}
              >
                {demo.shortLabel}
              </motion.button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Real WebRTC Camera Button */}
          <button
            type="button"
            onClick={() => setUseLiveWebcam(!useLiveWebcam)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors ${
              useLiveWebcam
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{useLiveWebcam ? 'Камера ВКЛ' : 'Веб-камера'}</span>
          </button>

          {/* Upload Custom Photo Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Своё фото</span>
          </button>

          {/* Voice History Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !voiceEnabled;
              setVoiceEnabled(next);
              if (!next) stopSpeaking();
            }}
            aria-label="Переключить голосовую историю"
            className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer ${
              voiceEnabled
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {voiceEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-blue-600" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span>{voiceEnabled ? 'Голос ВКЛ' : 'Без звука'}</span>
          </button>
        </div>
      </div>

      {webcamError && (
        <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
          {webcamError}
        </div>
      )}

      {/* 2. Main Split View: Fullscreen Live Viewfinder + Voice History & 3-Block Recognition Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left (7 cols): Live Viewfinder with Real Astana Photography / Video / Webcam */}
        <div className="lg:col-span-7 relative rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-200/80 shadow-lg h-[450px] sm:h-[480px] flex flex-col justify-between">
          {useLiveWebcam ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : uploadedImageUrl ? (
            <img
              src={uploadedImageUrl}
              alt={uploadedFileName || 'Загруженное фото'}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <AstanaAtmosphericVideo
              poiId={matchedPoi.id}
              photoUrl={demoPhotoUrl || getFallbackPhotoForPOI(matchedPoi)}
              accentColor="#F97316"
              className="absolute inset-0 w-full h-full"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/85 pointer-events-none" />

          {/* Top HUD Pills */}
          <div className="relative z-20 p-4 flex items-center justify-between gap-2 text-white text-xs font-mono tabular-nums">
            <span className="px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/15 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>
                {matchedPoi.lat.toFixed(4)}°N, {matchedPoi.lon.toFixed(4)}°E
              </span>
            </span>

            <span className="px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/15 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>{selectedDemo.heading}</span>
            </span>
          </div>

          {/* Center Laser Reticle */}
          <div className="relative z-20 my-auto mx-auto w-68 h-44 border-2 border-orange-400/80 rounded-3xl flex flex-col items-center justify-center p-4 text-center backdrop-blur-[1px]">
            {isScanning && (
              <motion.div
                initial={{ y: -65 }}
                animate={{ y: 65 }}
                transition={{
                  duration: 0.55,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                className="w-full h-1.5 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 shadow-[0_0_20px_#F97316] rounded-full"
              />
            )}
            <span className="px-3.5 py-1.5 rounded-full bg-slate-950/85 text-orange-300 text-xs font-extrabold border border-orange-400/40">
              {isScanning
                ? '⚡ Распознаю архитектуру и запускаю аудио-гид...'
                : `🎯 В кадре: ${matchedPoi.name.split('(')[0].trim()}`}
            </span>
          </div>

          {/* Bottom Viewfinder Controls + 3D Mascot */}
          <div className="relative z-20 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/95 p-1.5 shadow-md shrink-0">
                <motion.img
                  src={ASSETS.MASCOT_CAMERA}
                  alt="Астаник Камера"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-white">
                <div className="text-xs font-extrabold text-orange-300">
                  {isSpeaking
                    ? '🔊 Рассказываю историю здания...'
                    : '📷 Умный объектив Астаника'}
                </div>
                <div className="text-sm font-extrabold leading-tight">
                  Наведи на здание — расскажу историю вслух!
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => handleScanLandmark(selectedDemo)}
              data-testid="ar-scan-btn"
              className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Распознать и озвучить (+150 XP)</span>
            </motion.button>
          </div>
        </div>

        {/* Right (5 cols): Interactive Voice History Player + 3 Colored Blocks */}
        <div
          data-testid="ar-recognition-card"
          className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                ✅ Здание определено · +150 XP
              </span>
              <span className="text-xs font-extrabold text-slate-500">
                ⭐ {matchedPoi.rating}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
              {matchedPoi.name.split('(')[0].trim()}
            </h3>

            {/* Interactive Audio Story Player Box */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-400">
                    🎙️ ГОЛОСОВАЯ ИСТОРИЯ МЕСТА
                  </span>
                </div>

                {/* Equalizer Bars */}
                <div className="flex items-end gap-1 h-4">
                  {[0, 1, 2, 3].map((b) => (
                    <motion.span
                      key={b}
                      animate={
                        isSpeaking
                          ? { height: ['30%', '100%', '40%', '90%'] }
                          : { height: '30%' }
                      }
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: b * 0.1,
                      }}
                      className="w-1 bg-orange-400 rounded-full"
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                «{activeStoryPreset.voiceHistoryScript}»
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    isSpeaking
                      ? stopSpeaking()
                      : speakOutLoud(activeStoryPreset.voiceHistoryScript)
                  }
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSpeaking ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Пауза озвучки</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Слушать историю вслух</span>
                    </>
                  )}
                </button>

                {isSpeaking && (
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    aria-label="Остановить озвучку"
                    className="py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Стоп</span>
                  </button>
                )}
              </div>
            </div>

            {/* 🟧 Orange Block: Architect & Year */}
            <div className="p-3 rounded-2xl bg-orange-50/80 border border-orange-200/70 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0">
                <Landmark className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-orange-700">
                  АРХИТЕКТОР И ОТКРЫТИЕ
                </div>
                <div className="text-xs font-extrabold text-slate-900 truncate">
                  {activeStoryPreset.architectAndYear}
                </div>
              </div>
            </div>

            {/* 🟩 Green Block: Key Architectural Fact */}
            <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                  ГЛАВНЫЙ ФАКТ О ЗДАНИИ
                </div>
                <div className="text-xs font-extrabold text-emerald-950 truncate">
                  {activeStoryPreset.shortFact}
                </div>
              </div>
            </div>

            {/* 🟦 Blue Block: Next Coffee & Socket Direction Arrow */}
            <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200/70 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Coffee className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">
                  КУДА ПОВЕРНУТЬ ЗА КОФЕ И РОЗЕТКОЙ
                </div>
                <div className="text-xs font-extrabold text-blue-950 truncate">
                  {activeStoryPreset.coffeeArrow}
                </div>
              </div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => {
              onAwardXp(50, 'Построен маршрут из Камеры +50 XP 📍');
              onSelectDestinationOnMap(matchedPoi);
            }}
            className="w-full min-h-[46px] rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-orange-400" />
            <span>📍 Построить маршрут сюда (+50 XP)</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
