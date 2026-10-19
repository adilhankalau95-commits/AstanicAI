import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ASTANA_LIVE_EVENTS_TODAY,
  AstanaEventItem,
} from '../data/admitlyContent';
import { AstanaPOI, INITIAL_ASTANA_POIS } from '../data/astanaPois';
import { getFallbackPhotoForPOI } from '../services/photoService';
import {
  Users,
  Calendar,
  MapPin,
  Sparkles,
  CheckCircle2,
  Plus,
  Clock,
} from 'lucide-react';

interface GroupAndEventsViewProps {
  onBuildRouteToPoi: (poi: AstanaPOI, xpBonus: number) => void;
  onAwardXp: (amount: number, reason: string) => void;
}

interface ParticipantProfile {
  id: string;
  name: string;
  avatarColor: string;
  tag: string;
  label: string;
}

const INTEREST_OPTIONS = [
  { tag: 'sockets', label: '☕ Кофе и розетки' },
  { tag: 'tourist_must', label: '📸 Архитектура и фото' },
  { tag: 'kids_friendly', label: '👶 Интерактивы с детьми' },
  { tag: 'indoor', label: '🏛️ Крытый променад' },
  { tag: 'night_activity', label: '🌙 Вечерний лаунж' },
  { tag: 'wheelchair_accessible', label: '♿ Безбарьерная среда' },
];

export const GroupAndEventsView: React.FC<GroupAndEventsViewProps> = ({
  onBuildRouteToPoi,
  onAwardXp,
}) => {
  const [participants, setParticipants] = useState<ParticipantProfile[]>([
    {
      id: 'p1',
      name: 'Диас (Ты)',
      avatarColor: 'bg-orange-500',
      tag: 'sockets',
      label: '☕ Кофе и розетки',
    },
    {
      id: 'p2',
      name: 'Айгерим',
      avatarColor: 'bg-blue-600',
      tag: 'tourist_must',
      label: '📸 Архитектура и фото',
    },
    {
      id: 'p3',
      name: 'Санжар',
      avatarColor: 'bg-emerald-600',
      tag: 'indoor',
      label: '🏛️ Крытый променад',
    },
  ]);

  const [eventFilter, setEventFilter] = useState<string>('ALL');

  const updateParticipantPreference = (
    participantId: string,
    newTag: string,
    newLabel: string
  ) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId ? { ...p, tag: newTag, label: newLabel } : p
      )
    );
    onAwardXp(15, 'Обновлены интересы группы (+15 XP) 👥');
  };

  const addFourthFriend = () => {
    if (participants.length >= 4) return;
    setParticipants((prev) => [
      ...prev,
      {
        id: 'p4',
        name: 'Мадина',
        avatarColor: 'bg-purple-600',
        tag: 'kids_friendly',
        label: '👶 Интерактивы с детьми',
      },
    ]);
    onAwardXp(25, 'Друг добавлен в совместную прогулку (+25 XP) 🎉');
  };

  // Compute Top-2 Compromise POIs that satisfy the highest percentage of participant tags
  const groupRecommendations = useMemo(() => {
    const requiredTags = participants.map((p) => p.tag);
    const scored = INITIAL_ASTANA_POIS.map((poi) => {
      let matchedCount = 0;
      for (const t of requiredTags) {
        if (poi.tags.includes(t)) {
          matchedCount += 1;
        }
      }
      const matchPercent = Math.min(
        99,
        Math.round(68 + (matchedCount / requiredTags.length) * 30)
      );
      return {
        poi,
        matchPercent,
        matchedCount,
      };
    });

    return scored
      .sort(
        (a, b) =>
          b.matchPercent - a.matchPercent || b.poi.rating - a.poi.rating
      )
      .slice(0, 2);
  }, [participants]);

  const filteredEvents: AstanaEventItem[] =
    eventFilter === 'ALL'
      ? ASTANA_LIVE_EVENTS_TODAY
      : ASTANA_LIVE_EVENTS_TODAY.filter((ev) => ev.category === eventFilter);

  return (
    <div className="space-y-6">
      {/* 1. GROUP WALK CONSENSUS BUILDER (Stretch Goal: Совместные прогулки) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 block">
                👥 СОВМЕСТНАЯ ПРОГУЛКА С ДРУЗЬЯМИ · GROUP CONSENSUS
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Подбор компромиссного маршрута по интересам компании
              </h2>
            </div>
          </div>

          {participants.length < 4 && (
            <button
              type="button"
              onClick={addFourthFriend}
              className="px-3.5 py-2 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Добавить друга (+25 XP)</span>
            </button>
          )}
        </div>

        {/* Participant Preference Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {participants.map((person) => (
            <div
              key={person.id}
              className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-8 h-8 rounded-full ${person.avatarColor} text-white text-xs font-extrabold flex items-center justify-center`}
                  >
                    {person.name[0]}
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">
                    {person.name}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                  Участник
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {INTEREST_OPTIONS.map((opt) => {
                  const active = person.tag === opt.tag;
                  return (
                    <button
                      key={opt.tag}
                      type="button"
                      onClick={() =>
                        updateParticipantPreference(
                          person.id,
                          opt.tag,
                          opt.label
                        )
                      }
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                        active
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Top-2 Group Compromise Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
          {groupRecommendations.map((item, idx) => {
            const photoUrl = getFallbackPhotoForPOI(item.poi);
            return (
              <div
                key={item.poi.id}
                className="rounded-3xl overflow-hidden border border-orange-200/80 bg-gradient-to-br from-orange-50/60 via-white to-amber-50/40 p-4 flex flex-col sm:flex-row items-center gap-4"
              >
                <img
                  src={photoUrl}
                  alt={item.poi.name}
                  referrerPolicy="no-referrer"
                  className="w-full sm:w-36 h-36 rounded-2xl object-cover shrink-0 border border-white shadow-sm"
                />

                <div className="flex-1 min-w-0 space-y-2.5 w-full">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Мэтч компании: {item.matchPercent}%</span>
                    </span>
                    <span className="text-xs font-extrabold text-orange-600">
                      #{idx + 1} Выбор группы
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 truncate">
                    {item.poi.name.split('(')[0].trim()}
                  </h3>

                  <p className="text-xs font-semibold text-slate-600 line-clamp-1">
                    Подходит всем {participants.length} участникам · ⭐{' '}
                    {item.poi.rating} · {item.poi.openingHours || '10:00–22:00'}
                  </p>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => onBuildRouteToPoi(item.poi, 80)}
                    className="w-full min-h-[42px] px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    <span>📍 Построить общий маршрут (+80 XP)</span>
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. LIVE ASTANA EVENTS TODAY (Афиша событий Астаны на сегодня) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 block">
                🎟️ ЖИВАЯ АФИША АСТАНЫ НА СЕГОДНЯ (+40 XP)
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                События, концерты и световые шоу по пути твоей прогулки
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              'ALL',
              'Световое шоу',
              'Живая музыка',
              'Кофе & Комьюнити',
              'Семья и Дети',
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setEventFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                  eventFilter === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'Все события' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((ev) => {
            const poi =
              INITIAL_ASTANA_POIS.find((p) => p.id === ev.poiId) ||
              INITIAL_ASTANA_POIS[0];

            return (
              <div
                key={ev.id}
                className="rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-50/60 flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <img
                      src={ev.photoUrl}
                      alt={ev.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-orange-500 text-white text-[11px] font-extrabold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{ev.timeToday}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white/90 text-slate-900 text-[11px] font-extrabold">
                        {ev.priceBadge}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[11px] font-extrabold text-amber-300">
                        {ev.category} · 📍 {ev.venueName}
                      </span>
                      <h4 className="text-sm font-extrabold leading-snug line-clamp-2 mt-0.5">
                        {ev.title}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="p-3.5">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => onBuildRouteToPoi(poi, ev.xpReward)}
                    className="w-full min-h-[42px] rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Включить в прогулку (+{ev.xpReward} XP)</span>
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
