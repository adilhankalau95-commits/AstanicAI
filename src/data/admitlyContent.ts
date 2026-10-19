import { AstanaPOI } from './astanaPois';
import { VERIFIED_ASTANA_REAL_PHOTOS } from '../services/photoService';

export interface AstanaStoryItem {
  id: string;
  badgeTitle: string;
  subtitleXp: string;
  durationSec: number;
  xpReward: number;
  poiId: string;
  thumbPhoto: string;
  ringGradient: string;
  headline: string;
  shortCaption: string;
  voiceScript: string;
  themeColor: string;
}

export interface POIReviewItem {
  id: string;
  poiId: string;
  author: string;
  role: string;
  avatarBg: string;
  rating: number;
  tag: '🔥 Топ вайб' | '🔌 Есть розетки' | '📸 Инстаграмно' | '👶 С детьми';
  comment: string;
  timeAgo: string;
  photoUrl?: string;
}

export interface AudioTourChapter {
  id: string;
  timecode: string;
  durationMin: number;
  poiId: string;
  title: string;
  shortSubtitle: string;
  photoUrl: string;
  voiceHistoryScript: string;
}

export interface AudioWalkTour {
  id: string;
  title: string;
  subtitle: string;
  totalMinutes: number;
  distanceKm: string;
  xpReward: number;
  coverPhoto: string;
  badge: string;
  chapters: AudioTourChapter[];
}

export interface AstanaEventItem {
  id: string;
  title: string;
  timeToday: string;
  category: string;
  poiId: string;
  venueName: string;
  priceBadge: string;
  photoUrl: string;
  xpReward: number;
}

export const ASTANA_STORIES: AstanaStoryItem[] = [
  {
    id: 'story-rooftops',
    badgeTitle: 'Топ-3 крыши у Экспо',
    subtitleXp: '15с · +30 XP',
    durationSec: 15,
    xpReward: 30,
    poiId: 'poi-hilton-rooftop',
    thumbPhoto: VERIFIED_ASTANA_REAL_PHOTOS['poi-hilton-rooftop'],
    ringGradient: 'from-orange-500 via-amber-500 to-rose-500',
    headline: 'Cloud 9 Rooftop · 16 этаж Hilton',
    shortCaption: 'Панорама на светящуюся Сферу Нур Алем в 300 метрах!',
    voiceScript:
      'Салем! На 16 этаже Хилтон Астана открывается лучший вечерний вид на сферу Нур Алем. Жми кнопку маршрута и забирай 50 XP!',
    themeColor: '#F97316',
  },
  {
    id: 'story-coffee',
    badgeTitle: 'Кофейни с розетками',
    subtitleXp: '15с · +30 XP',
    durationSec: 15,
    xpReward: 30,
    poiId: 'poi-marrone-rosso-expo',
    thumbPhoto: VERIFIED_ASTANA_REAL_PHOTOS['poi-marrone-rosso-expo'],
    ringGradient: 'from-blue-500 via-sky-400 to-indigo-500',
    headline: 'Marrone Rosso & Starbucks Reserve',
    shortCaption: 'Розетки 220V у каждого стола и Wi-Fi 50 Мбит/с.',
    voiceScript:
      'Ищешь где поработать с ноутбуком? В Марроне Россо у Экспо розетки у каждого дивана и свежая обжарка!',
    themeColor: '#2563EB',
  },
  {
    id: 'story-night',
    badgeTitle: 'Ночная Астана: вайб',
    subtitleXp: '15с · +30 XP',
    durationSec: 15,
    xpReward: 30,
    poiId: 'poi-baiterek',
    thumbPhoto: VERIFIED_ASTANA_REAL_PHOTOS['poi-baiterek'],
    ringGradient: 'from-purple-500 via-indigo-500 to-pink-500',
    headline: 'Бульвар Нуржол и Байтерек 97м',
    shortCaption: 'Ночная иллюминация, поющие фонтаны и живой джаз.',
    voiceScript:
      'После заката бульвар Нуржол и золотой шар Байтерека превращаются в световую галерею под открытым небом!',
    themeColor: '#7C3AED',
  },
  {
    id: 'story-kids',
    badgeTitle: 'Интерактивы с детьми',
    subtitleXp: '15с · +30 XP',
    durationSec: 15,
    xpReward: 30,
    poiId: 'poi-nur-alem',
    thumbPhoto: VERIFIED_ASTANA_REAL_PHOTOS['poi-nur-alem'],
    ringGradient: 'from-emerald-500 via-teal-400 to-cyan-500',
    headline: '8 этажей науки в Сфере Нур Алем',
    shortCaption: 'Широкие пандусы, лифты и шоу роботов для детей.',
    voiceScript:
      'Едешь с ребёнком? Внутри сферы Нур Алем 8 этажей интерактивных игр с энергией ветра, солнца и космоса!',
    themeColor: '#10B981',
  },
  {
    id: 'story-layover',
    badgeTitle: 'Турист: 2ч до вылета',
    subtitleXp: '15с · +30 XP',
    durationSec: 15,
    xpReward: 30,
    poiId: 'poi-grand-mosque',
    thumbPhoto: VERIFIED_ASTANA_REAL_PHOTOS['poi-grand-mosque'],
    ringGradient: 'from-amber-400 via-orange-500 to-yellow-500',
    headline: 'Смотровая минарета 130м по пути в NQZ',
    shortCaption: 'Ровно 12 минут на авто от аэропорта Астаны!',
    voiceScript:
      'Если до вылета 2 часа — загляни на смотровую площадку Главной мечети на высоте 130 метров прямо по трассе в аэропорт!',
    themeColor: '#D97706',
  },
];

export const INITIAL_POI_REVIEWS: POIReviewItem[] = [
  {
    id: 'rev-1',
    poiId: 'poi-nur-alem',
    author: 'Айгерим К.',
    role: 'Житель Астаны',
    avatarBg: 'bg-orange-500',
    rating: 5.0,
    tag: '📸 Инстаграмно',
    comment: 'Стеклянный мост на 8 этаже Сферы — просто космос! 🔥',
    timeAgo: '15 мин назад',
    photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-nur-alem'],
  },
  {
    id: 'rev-2',
    poiId: 'poi-nur-alem',
    author: 'Данияр М.',
    role: 'С семьёй',
    avatarBg: 'bg-blue-600',
    rating: 4.9,
    tag: '👶 С детьми',
    comment: 'С ребёнком залипли на 1.5 часа на интерактивных этажах 👍',
    timeAgo: '1 час назад',
    photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-expo-park'],
  },
  {
    id: 'rev-3',
    poiId: 'poi-marrone-rosso-expo',
    author: 'Алихан Т.',
    role: 'IT-архитектор',
    avatarBg: 'bg-emerald-600',
    rating: 4.9,
    tag: '🔌 Есть розетки',
    comment: 'Лучший фильтр-кофе у Экспо, розетки прямо у диванчиков ⚡',
    timeAgo: '30 мин назад',
    photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-marrone-rosso-expo'],
  },
  {
    id: 'rev-4',
    poiId: 'poi-starbucks-kabanbay',
    author: 'Мадина С.',
    role: 'Продуктовый дизайнер',
    avatarBg: 'bg-purple-600',
    rating: 4.8,
    tag: '🔌 Есть розетки',
    comment: 'Длинный стол с розетками и панорама на парк Экспо 💻',
    timeAgo: '2 часа назад',
    photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-starbucks-kabanbay'],
  },
  {
    id: 'rev-5',
    poiId: 'poi-hilton-rooftop',
    author: 'Тимур Б.',
    role: 'Гость столицы',
    avatarBg: 'bg-rose-600',
    rating: 5.0,
    tag: '🔥 Топ вайб',
    comment: 'Ночной вид с 16 этажа на лазерное шоу Сферы — 10 из 10!',
    timeAgo: 'Вчера',
    photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-hilton-rooftop'],
  },
  {
    id: 'rev-6',
    poiId: 'poi-baiterek',
    author: 'Еркежан Н.',
    role: 'Гид по Астане',
    avatarBg: 'bg-amber-500',
    rating: 4.9,
    tag: '📸 Инстаграмно',
    comment: 'Вся ось бульвара Нуржол и Акорда как на ладони с 97м ✨',
    timeAgo: '3 часа назад',
    photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-baiterek'],
  },
  {
    id: 'rev-7',
    poiId: 'poi-mega-silkway',
    author: 'Санжар О.',
    role: 'Местный эксперт',
    avatarBg: 'bg-indigo-600',
    rating: 4.8,
    tag: '🔥 Топ вайб',
    comment: 'Тепло в любую погоду, широкие галереи и топ-кофейни ☕',
    timeAgo: '45 мин назад',
    photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-mega-silkway'],
  },
];

export const ASTANA_AUDIO_TOURS: AudioWalkTour[] = [
  {
    id: 'tour-nurzhol',
    title: 'Футуристический бульвар Нуржол за 40 минут',
    subtitle: 'От золотого шара Байтерека до гигантского шатра Нормана Фостера',
    totalMinutes: 40,
    distanceKm: '2.1 км',
    xpReward: 120,
    coverPhoto: VERIFIED_ASTANA_REAL_PHOTOS['poi-baiterek'],
    badge: '🔥 Хит прогулок',
    chapters: [
      {
        id: 'ch-1',
        timecode: '00:00',
        durationMin: 12,
        poiId: 'poi-baiterek',
        title: '01. Монумент Байтерек (Легенда о птице Самрук)',
        shortSubtitle: 'Высота 97 метров в честь 1997 года переноса столицы',
        photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-baiterek'],
        voiceHistoryScript:
          'Остановка первая: Монумент Байтерек! Его высота ровно 97 метров — символ 1997 года, когда Астана стала столицей. Золотой шар диаметром 22 метра из хамелеон-стекла олицетворяет золотое яйцо мифической птицы Самрук на вершине Древа жизни.',
      },
      {
        id: 'ch-2',
        timecode: '12:00',
        durationMin: 10,
        poiId: 'poi-koktem-bakery',
        title: '02. Кофейная пауза на Водно-зелёном бульваре',
        shortSubtitle: 'Уютная пекарня «Көктем» и панорамные пешеходные мосты',
        photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-koktem-bakery'],
        voiceHistoryScript:
          'Остановка вторая: Водно-зелёный бульвар Нуржол, спроектированный знаменитым японским архитектором Кисе Курокавой в концепции симбиоза города и природы. Сверните на 10 минут в пекарню Көктем за горячим рафом!',
      },
      {
        id: 'ch-3',
        timecode: '22:00',
        durationMin: 18,
        poiId: 'poi-khan-shatyr',
        title: '03. ТРЦ «Хан Шатыр» (Эко-шатёр 150 метров)',
        shortSubtitle: 'Крупнейшее шатровое сооружение в мире из ETFE-полимера',
        photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-khan-shatyr'],
        voiceHistoryScript:
          'Остановка третья: Хан Шатыр, творение британского лорда Нормана Фостера! Под стальным шпилем высотой 150 метров натянут прозрачный купол из фторполимера, сохраняющий тропическое лето и настоящий песчаный пляж на верхнем уровне даже в минус тридцать!',
      },
    ],
  },
  {
    id: 'tour-expo-botanic',
    title: 'Тайны Сферы Экспо и Ботанического сада',
    subtitle: 'Архитектура будущего Эдриана Смита и тропическая оранжерея',
    totalMinutes: 55,
    distanceKm: '2.6 км',
    xpReward: 150,
    coverPhoto: VERIFIED_ASTANA_REAL_PHOTOS['poi-nur-alem'],
    badge: '⚡ Инновации & Парк',
    chapters: [
      {
        id: 'ch-expo-1',
        timecode: '00:00',
        durationMin: 20,
        poiId: 'poi-nur-alem',
        title: '01. Сфера «Нур Алем» (Дизайн бюро Adrian Smith + Gordon Gill)',
        shortSubtitle: 'Единственная полная сфера в мире диаметром 80 метров',
        photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-nur-alem'],
        voiceHistoryScript:
          'Перед вами Сфера Нур Алем, созданная чикагским бюро Эдриана Смита — автора Бурдж-Халифы! Каждая из двух тысяч восьмисот изогнутых стеклянных панелей уникальна, а на вершине встроены бесшумные ветрогенераторы и солнечные батареи.',
      },
      {
        id: 'ch-expo-2',
        timecode: '20:00',
        durationMin: 15,
        poiId: 'poi-marrone-rosso-expo',
        title: '02. Спешелти-обжарка в Marrone Rosso & Mega Silk Way',
        shortSubtitle: 'Тёплый переход и свежеобжаренный фильтр-кофе',
        photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-marrone-rosso-expo'],
        voiceHistoryScript:
          'Через западную эспланаду Экспо мы переходим к крылу Мега Силк Вэй. Здесь в кофейне собственной обжарки Марроне Россо можно согреться и зарядить гаджеты перед прогулкой по парку.',
      },
      {
        id: 'ch-expo-3',
        timecode: '35:00',
        durationMin: 20,
        poiId: 'poi-botanical-garden',
        title: '03. Стеклянные купола Ботанического сада Астаны',
        shortSubtitle: 'Пальмы, редкие кактусы и зеркальный пруд',
        photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-botanical-garden'],
        voiceHistoryScript:
          'Финал маршрута — Ботанический сад площадью 89 гектаров. Внутри двух стеклянных климатических оранжерей высажены десятки видов тропических пальм, фикусов и коллекция мексиканских суккулентов!',
      },
    ],
  },
  {
    id: 'tour-ishim-evening',
    title: 'Вечерняя набережная Ишима и Атырауский мост',
    subtitle: 'Параметрическая архитектура «Моста-рыбы» и огни реки Есиль',
    totalMinutes: 35,
    distanceKm: '1.8 км',
    xpReward: 100,
    coverPhoto: VERIFIED_ASTANA_REAL_PHOTOS['poi-ishim-embankment'],
    badge: '🌙 Вечерний вайб',
    chapters: [
      {
        id: 'ch-ishim-1',
        timecode: '00:00',
        durationMin: 15,
        poiId: 'poi-atyrau-bridge',
        title: '01. Атырауский пешеходный мост (Бионический чешуйчатый купол)',
        shortSubtitle: '2 450 алюминиевых лепестков в форме каспийского осетра',
        photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-atyrau-bridge'],
        voiceHistoryScript:
          'Мы начинаем на Атырауском мосту! Его белоснежная параметрическая оболочка состоит из двух тысяч четырехсот пятидесяти алюминиевых лепестков, повторяющих узор чешуи каспийского осетра.',
      },
      {
        id: 'ch-ishim-2',
        timecode: '15:00',
        durationMin: 20,
        poiId: 'poi-ishim-embankment',
        title: '02. Променад вдоль реки Ишим (Есиль)',
        shortSubtitle: 'Уличные музыканты, кофейные корнеры и причал теплоходов',
        photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-ishim-embankment'],
        voiceHistoryScript:
          'Спускаемся на пешеходную набережную реки Есиль. Вечером здесь зажигается художественная подсветка мостов, играют уличные джаз-бэнды и открываются уютные террасы у воды.',
      },
    ],
  },
];

export const ASTANA_LIVE_EVENTS_TODAY: AstanaEventItem[] = [
  {
    id: 'ev-1',
    title: 'Световое и лазерное проекционное шоу на куполе «Нур Алем»',
    timeToday: 'Сегодня · 20:30',
    category: 'Световое шоу',
    poiId: 'poi-nur-alem',
    venueName: 'Площадь ЭКСПО-2017',
    priceBadge: 'Бесплатно',
    photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-nur-alem'],
    xpReward: 40,
  },
  {
    id: 'ev-2',
    title: 'Sunset Jazz & Lounge Session на 16 этаже Cloud 9',
    timeToday: 'Сегодня · 19:30',
    category: 'Живая музыка',
    poiId: 'poi-hilton-rooftop',
    venueName: 'Hilton Astana Rooftop',
    priceBadge: 'Свободный вход',
    photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-hilton-rooftop'],
    xpReward: 40,
  },
  {
    id: 'ev-3',
    title: 'Открытый каппинг эфиопской обжарки и пуровер-мастер-класс',
    timeToday: 'Сегодня · 17:00',
    category: 'Кофе & Комьюнити',
    poiId: 'poi-marrone-rosso-expo',
    venueName: 'Marrone Rosso EXPO',
    priceBadge: 'Бесплатно',
    photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-marrone-rosso-expo'],
    xpReward: 40,
  },
  {
    id: 'ev-4',
    title: 'Интерактивное шоу роботов и катушки Тесла для детей',
    timeToday: 'Сегодня · 16:00',
    category: 'Семья и Дети',
    poiId: 'poi-nur-alem',
    venueName: 'Сфера Нур Алем (6 этаж)',
    priceBadge: 'По билету музея',
    photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-expo-park'],
    xpReward: 40,
  },
  {
    id: 'ev-5',
    title: 'Вечерняя экскурсия по тропической оранжерее под подсветкой',
    timeToday: 'Сегодня · 18:30',
    category: 'Природа & Парк',
    poiId: 'poi-botanical-garden',
    venueName: 'Ботанический сад Астаны',
    priceBadge: 'Средний чек',
    photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-botanical-garden'],
    xpReward: 40,
  },
  {
    id: 'ev-6',
    title: 'Симфонический концерт музыки кино в «Астана Опера»',
    timeToday: 'Сегодня · 19:00',
    category: 'Искусство',
    poiId: 'poi-astana-opera',
    venueName: 'Большой зал Астана Опера',
    priceBadge: 'Премиум',
    photoUrl: VERIFIED_ASTANA_REAL_PHOTOS['poi-astana-opera'],
    xpReward: 40,
  },
];

export function getThreeColoredWidgetsForPOI(
  poi: AstanaPOI,
  distanceMeters: number,
  walkingMinutes: number,
  hybridScore: number
): {
  orangeVibe: { score: string; label: string; text: string };
  greenPoiFact: { statusBadge: string; isHighConfidence: boolean; text: string };
  blueAiPlan: { label: string; text: string };
} {
  const hasSockets = poi.tags.includes('sockets');
  const hasKids = poi.tags.includes('kids_friendly');
  const isNight = poi.tags.includes('night_activity');

  let vibeShort = 'Топ локация в пешем радиусе';
  if (hasSockets) vibeShort = 'Тихий зал, быстрый Wi-Fi';
  else if (hasKids) vibeShort = 'Интерактивы, пандусы и комфорт';
  else if (isNight) vibeShort = 'Панорамная подсветка и лаунж';

  const isHighConfidence = Boolean(poi.openingHours || poi.is24Hours);
  const statusBadge = isHighConfidence
    ? `✅ Открыто · ${poi.openingHours || '24/7'}`
    : '⚠️ Уточнить график';

  let factShort = `${distanceMeters} м · ${walkingMinutes} мин пешком`;
  if (hasSockets) factShort = `${distanceMeters} м · Розетки 220V у столов`;
  else if (poi.id === 'poi-nur-alem')
    factShort = `${distanceMeters} м · Сфера 100м (8 этажей)`;
  else if (poi.id === 'poi-baiterek')
    factShort = `${distanceMeters} м · Панорама 97 метров`;

  let aiShort = '30 мин осмотр + фото-поинт';
  if (hasSockets) aiShort = '35 мин работа + фильтр-кофе';
  else if (hasKids) aiShort = '40 мин интерактив + отдых';
  else if (isNight) aiShort = '45 мин закат + авторский раф';

  return {
    orangeVibe: {
      score: `${hybridScore}%`,
      label: 'МЭТЧ ВАЙБА',
      text: vibeShort,
    },
    greenPoiFact: {
      statusBadge,
      isHighConfidence,
      text: factShort,
    },
    blueAiPlan: {
      label: 'ПЛАН ОТ ИИ',
      text: aiShort,
    },
  };
}

export function getReviewsForPOI(
  poiId: string,
  allReviews: POIReviewItem[]
): POIReviewItem[] {
  const direct = allReviews.filter((r) => r.poiId === poiId);
  if (direct.length >= 2) return direct;
  return [...direct, ...allReviews.slice(0, 2)];
}
