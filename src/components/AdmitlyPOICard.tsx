import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ScoredPOICandidate } from '../services/ragEngine';
import { getFallbackPhotoForPOI } from '../services/photoService';
import {
  getReviewsForPOI,
  getThreeColoredWidgetsForPOI,
  POIReviewItem,
} from '../data/admitlyContent';
import { AstanaAtmosphericVideo } from './AstanaAtmosphericVideo';
import {
  Play,
  Square,
  Star,
  Navigation,
  Plus,
  CheckCircle2,
  Rocket,
  Settings2,
  X,
} from 'lucide-react';

interface AdmitlyPOICardProps {
  candidate: ScoredPOICandidate;
  index: number;
  allReviews: POIReviewItem[];
  onAddReview: (
    poiId: string,
    tag: POIReviewItem['tag'],
    comment: string
  ) => void;
  onStartRouteToPOI: (candidate: ScoredPOICandidate) => void;
}

const TAG_LABELS: Record<string, string> = {
  wifi: '⚡ Wi-Fi',
  sockets: '🔌 Розетки',
  kids_friendly: '👶 С детьми',
  wheelchair_accessible: '♿ Пандусы',
  indoor: '🏛️ В помещении',
  night_activity: '🌙 Вечерний вайб',
  tourist_must: '📸 Топ вид',
  quiet: '🤫 Тихий зал',
};

export const AdmitlyPOICard: React.FC<AdmitlyPOICardProps> = ({
  candidate,
  index,
  allReviews,
  onAddReview,
  onStartRouteToPOI,
}) => {
  const { poi, distanceMeters, walkingMinutes, hybridScore } = candidate;
  const photoUrl = getFallbackPhotoForPOI(poi);

  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] =
    useState<POIReviewItem['tag']>('🔥 Топ вайб');
  const [customComment, setCustomComment] = useState<string>('');
  const [showRagModal, setShowRagModal] = useState<boolean>(false);

  const widgets = getThreeColoredWidgetsForPOI(
    poi,
    distanceMeters,
    walkingMinutes,
    hybridScore
  );
  const reviews = getReviewsForPOI(poi.id, allReviews);

  const handleQuickReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text =
      customComment.trim() ||
      `Классное место (${selectedTag}), рекомендую к прогулке! 🔥`;
    onAddReview(poi.id, selectedTag, text);
    setCustomComment('');
    setShowReviewForm(false);
  };

  return (
    <div
      data-testid={`poi-card-${index}`}
      className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* 1. Real HD Photograph or Live Video Player */}
        <div className="relative h-52 bg-slate-900 overflow-hidden">
          {isPlayingVideo ? (
            <AstanaAtmosphericVideo
              poiId={poi.id}
              photoUrl={photoUrl}
              className="w-full h-full"
            />
          ) : (
            <img
              src={photoUrl}
              alt={poi.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent pointer-events-none" />

          {/* Top Floating Pills: Walking Time + Schedule Status */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-20">
            <span className="px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-xs font-extrabold tabular-nums">
              🚶 {walkingMinutes} мин ({distanceMeters} м)
            </span>

            <span
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold backdrop-blur-md ${
                widgets.greenPoiFact.isHighConfidence
                  ? 'bg-emerald-500/95 text-white'
                  : 'bg-amber-400/95 text-slate-950'
              }`}
            >
              {widgets.greenPoiFact.statusBadge}
            </span>
          </div>

          {/* Bottom Title + Rating + ▶️ Видео Button */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 z-20">
            <div className="text-white min-w-0">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span>⭐ {poi.rating}</span>
                <span>·</span>
                <span className="truncate">{poi.category}</span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold leading-tight line-clamp-1">
                {poi.name.split('(')[0].trim()}
              </h3>
            </div>

            <motion.button
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={() => setIsPlayingVideo(!isPlayingVideo)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer shrink-0 ${
                isPlayingVideo
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/95 hover:bg-white text-slate-900'
              }`}
            >
              {isPlayingVideo ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Стоп</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                  <span>Видео</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* 2. Clean Minimalist Feature Tags */}
        <div className="px-4 pt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {poi.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold whitespace-nowrap"
            >
              {TAG_LABELS[t] || t}
            </span>
          ))}
          <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[11px] font-extrabold whitespace-nowrap">
            {poi.priceLevel}
          </span>
        </div>

        {/* 3. Three Colored Mini-Blocks (Admitly AI Style) */}
        <div className="p-4 space-y-2">
          <div className="p-2.5 rounded-2xl bg-orange-50/75 border border-orange-200/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 tabular-nums">
              {widgets.orangeVibe.score}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-orange-700">
                ПОЧЕМУ СЮДА
              </div>
              <div className="text-xs font-extrabold text-slate-900 truncate">
                {widgets.orangeVibe.text}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-emerald-50/75 border border-emerald-200/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                ФАКТ О МЕСТЕ
              </div>
              <div className="text-xs font-extrabold text-emerald-950 truncate">
                {widgets.greenPoiFact.text}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-blue-50/75 border border-blue-200/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Rocket className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">
                ЧТО СДЕЛАТЬ
              </div>
              <div className="text-xs font-extrabold text-blue-950 truncate">
                {widgets.blueAiPlan.text}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Resident Reviews Carousel */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              Отзывы жителей ({reviews.length})
            </span>
            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-[11px] font-extrabold text-orange-600 hover:text-orange-700 flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Отзыв (+50 XP)</span>
            </button>
          </div>

          {showReviewForm ? (
            <form
              onSubmit={handleQuickReviewSubmit}
              className="p-3 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-2"
            >
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    '🔥 Топ вайб',
                    '🔌 Есть розетки',
                    '📸 Инстаграмно',
                  ] as POIReviewItem['tag'][]
                ).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTag(t)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer ${
                      selectedTag === t
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={customComment}
                  onChange={(e) => setCustomComment(e.target.value)}
                  placeholder="Коротко: как тебе место?"
                  className="flex-1 px-2.5 py-1.5 rounded-xl bg-white border border-orange-200 text-xs font-medium"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-extrabold cursor-pointer"
                >
                  +50 XP
                </button>
              </div>
            </form>
          ) : (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="min-w-[215px] max-w-[235px] p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 shrink-0"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-5 h-5 rounded-full ${rev.avatarBg} text-white text-[10px] font-extrabold flex items-center justify-center`}
                      >
                        {rev.author[0]}
                      </span>
                      <span className="text-[11px] font-extrabold text-slate-900 truncate">
                        {rev.author}
                      </span>
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-600 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {rev.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-medium line-clamp-1">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Clean Route Action + Subtle "Под капотом RAG" Modal Trigger */}
      <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={() => onStartRouteToPOI(candidate)}
          className="flex-1 min-h-[42px] rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 text-orange-400" />
          <span>В маршрут (+25 XP)</span>
        </motion.button>

        <button
          type="button"
          onClick={() => setShowRagModal(true)}
          title="Под капотом RAG"
          className="min-h-[42px] px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>⚙️</span>
        </button>
      </div>

      {/* Hidden-by-default Modal for Technical RAG Logs */}
      {showRagModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-5 border border-slate-200 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
                ⚙️ Под капотом RAG · Лог ранжирования
              </span>
              <button
                type="button"
                onClick={() => setShowRagModal(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm font-extrabold text-slate-900">
              {poi.name}
            </div>
            <pre className="p-3.5 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto">
              {JSON.stringify(
                {
                  id: poi.id,
                  source: poi.source,
                  distanceMeters,
                  walkingMinutes,
                  hybridScore: `${hybridScore}%`,
                  openingHoursConfidence: poi.openingHours ? '95%' : '70%',
                  coordinates: [poi.lat, poi.lon],
                  tags: poi.tags,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
