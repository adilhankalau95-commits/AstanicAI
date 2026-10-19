import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AstanaPOI, INITIAL_ASTANA_POIS } from '../data/astanaPois';
import {
  ASTANA_STORIES,
  AstanaStoryItem,
  POIReviewItem,
} from '../data/admitlyContent';
import { getFallbackPhotoForPOI, resolvePhotoForPOI } from '../services/photoService';
import { AstanaAtmosphericVideo } from './AstanaAtmosphericVideo';
import {
  Play,
  Volume2,
  MapPin,
  Star,
  Plus,
  Sparkles,
  MessageSquareHeart,
} from 'lucide-react';

interface VideosAndReviewsViewProps {
  allReviews: POIReviewItem[];
  onAddReview: (
    poiId: string,
    tag: POIReviewItem['tag'],
    comment: string
  ) => void;
  onOpenStory: (story: AstanaStoryItem) => void;
  onBuildRouteToPoi: (poi: AstanaPOI, xpBonus: number) => void;
}

export const VideosAndReviewsView: React.FC<VideosAndReviewsViewProps> = ({
  allReviews,
  onAddReview,
  onOpenStory,
  onBuildRouteToPoi,
}) => {
  const [photoMap, setPhotoMap] = useState<Record<string, string>>({});
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('ALL');
  const [newPoiId, setNewPoiId] = useState<string>(INITIAL_ASTANA_POIS[0].id);
  const [newTag, setNewTag] = useState<POIReviewItem['tag']>('🔥 Топ вайб');
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    async function loadPhotos() {
      const updates: Record<string, string> = {};
      for (const s of ASTANA_STORIES) {
        const poi =
          INITIAL_ASTANA_POIS.find((p) => p.id === s.poiId) ||
          INITIAL_ASTANA_POIS[0];
        updates[poi.id] = getFallbackPhotoForPOI(poi);
        const res = await resolvePhotoForPOI(poi);
        updates[poi.id] = res.url;
      }
      if (!cancelled) setPhotoMap((prev) => ({ ...prev, ...updates }));
    }
    loadPhotos();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredReviews =
    selectedTagFilter === 'ALL'
      ? allReviews
      : allReviews.filter((r) => r.tag === selectedTagFilter);

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    const commentText =
      newComment.trim() ||
      `Супер локация в Астане (${newTag}), советую посетить! 🔥`;
    onAddReview(newPoiId, newTag, commentText);
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Video Reels Showcase Grid */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-orange-100 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 block">
              🎬 КОРОТКИЕ ВИДЕО-ОБЗОРЫ АСТАНЫ (+30 XP)
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Живые атмосферные Reels с озвучкой Астаника
            </h2>
          </div>

          <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-extrabold">
            5 видео-сторис · 15 сек
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {ASTANA_STORIES.map((story) => {
            const poi =
              INITIAL_ASTANA_POIS.find((p) => p.id === story.poiId) ||
              INITIAL_ASTANA_POIS[0];
            const imgUrl = photoMap[poi.id] || getFallbackPhotoForPOI(poi);

            return (
              <div
                key={story.id}
                className="relative h-72 rounded-3xl overflow-hidden bg-slate-900 border border-orange-200/70 shadow-sm flex flex-col justify-between group"
              >
                <AstanaAtmosphericVideo
                  poiId={poi.id}
                  photoUrl={imgUrl}
                  accentColor={story.themeColor}
                  className="absolute inset-0 w-full h-full"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

                <div className="relative z-20 p-3 flex items-center justify-between gap-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-extrabold">
                    +{story.xpReward} XP
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenStory(story)}
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-sm cursor-pointer"
                    aria-label={`Открыть сторис ${story.badgeTitle}`}
                  >
                    <Play className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                  </button>
                </div>

                <div className="relative z-20 p-3.5 space-y-2 text-white">
                  <div className="text-xs font-extrabold leading-tight">
                    {story.headline}
                  </div>
                  <p className="text-[11px] text-orange-200 font-semibold line-clamp-1">
                    {story.shortCaption}
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => onOpenStory(story)}
                      className="py-1.5 px-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Reels</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onBuildRouteToPoi(poi, 50)}
                      className="py-1.5 px-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Маршрут</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Verified Community Reviews Wall + 1-Click Add Review Form (+50 XP) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left (4 cols): Quick Add Review Form */}
        <form
          onSubmit={handleCreateReview}
          className="lg:col-span-4 bg-gradient-to-br from-orange-50/90 via-white to-amber-50/60 rounded-3xl p-5 border border-orange-200/80 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
              <MessageSquareHeart className="w-4 h-4" />
              <span>ОСТАВИТЬ ОТЗЫВ (+50 XP)</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-extrabold">
              +50 XP
            </span>
          </div>

          <div>
            <label
              htmlFor="review-poi-select"
              className="block text-[11px] font-extrabold text-slate-600 mb-1.5"
            >
              Выбери локацию в Астане:
            </label>
            <select
              id="review-poi-select"
              value={newPoiId}
              onChange={(e) => setNewPoiId(e.target.value)}
              className="w-full min-h-[42px] px-3 py-2 rounded-2xl bg-white border border-orange-200 text-xs font-extrabold text-slate-900"
            >
              {INITIAL_ASTANA_POIS.slice(0, 8).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name.split('(')[0].trim()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="block text-[11px] font-extrabold text-slate-600 mb-1.5">
              Тег атмосферы:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  '🔥 Топ вайб',
                  '🔌 Есть розетки',
                  '📸 Инстаграмно',
                  '👶 С детьми',
                ] as POIReviewItem['tag'][]
              ).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setNewTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold cursor-pointer ${
                    newTag === tag
                      ? 'bg-orange-500 text-white shadow-2xs'
                      : 'bg-white border border-orange-200 text-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="review-short-input"
              className="block text-[11px] font-extrabold text-slate-600 mb-1.5"
            >
              Короткий инсайт (1 строка):
            </label>
            <input
              id="review-short-input"
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Например: Отличный раф и вид на Сферу! 🔥"
              className="w-full min-h-[42px] px-3.5 py-2 rounded-2xl bg-white border border-orange-200 text-xs font-semibold text-slate-900"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="w-full min-h-[46px] rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/25 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Опубликовать отзыв (+50 XP)</span>
            <Sparkles className="w-3.5 h-3.5" />
          </motion.button>
        </form>

        {/* Right (8 cols): Live Filterable Reviews Grid */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 border border-orange-100 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              ⭐ Живая лента отзывов жителей ({filteredReviews.length})
            </h3>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {[
                'ALL',
                '🔥 Топ вайб',
                '🔌 Есть розетки',
                '📸 Инстаграмно',
                '👶 С детьми',
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTagFilter(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                    selectedTagFilter === tag
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tag === 'ALL' ? 'Все' : tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredReviews.map((rev) => {
              const poi = INITIAL_ASTANA_POIS.find((p) => p.id === rev.poiId);
              return (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-8 h-8 rounded-full ${rev.avatarBg} text-white text-xs font-extrabold flex items-center justify-center shrink-0`}
                        >
                          {rev.author[0]}
                        </span>
                        <div>
                          <div className="text-xs font-extrabold text-slate-900">
                            {rev.author}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {rev.role} · {rev.timeAgo}
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        {rev.rating.toFixed(1)}
                      </span>
                    </div>

                    <p className="text-xs font-extrabold text-slate-800 leading-snug">
                      «{rev.comment}»
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                    <span className="font-extrabold text-orange-600 truncate">
                      📍 {poi?.name.split('(')[0].trim() || 'Экспо-2017'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 font-bold text-slate-700">
                      {rev.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
