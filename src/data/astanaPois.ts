export type Language = 'ru' | 'kz' | 'en';

export type WalkScenario =
  | 'walk'
  | 'coffee_work'
  | 'kids_family'
  | 'tourist_layover'
  | 'night_vibe'
  | 'group_friends';

export type POICategory =
  | 'Досуг и Музей'
  | 'Кофейня и Коворкинг'
  | 'Парк и Прогулка'
  | 'Смотровая и Архитектура'
  | 'Семья и Дети'
  | 'Ночная локация и Гастро';

export interface AstanaPOI {
  id: string;
  name: string;
  nameKz?: string;
  nameEn?: string;
  category: POICategory;
  lat: number;
  lon: number;
  address: string;
  rating: number;
  reviewsCount: number;
  openingHours: string | null; // null means schedule is not verified in POI DB -> 70% confidence warning
  is24Hours?: boolean;
  priceLevel: 'Бесплатно' | 'Средний чек' | 'Премиум';
  tags: string[]; // 'wifi', 'sockets', 'kids_friendly', 'wheelchair_accessible', 'night_activity', 'indoor', 'tourist_must', 'group_friendly', 'quiet'
  poiFacts: string; // Factual data strictly from POI database
  defaultWhyVisit: string;
  defaultActionPlan: string;
  defaultAiIdea: string;
  wikiTitle?: string;
  source: 'Seed Smart City DB' | 'OpenStreetMap Overpass';
}

export interface LocationPreset {
  id: string;
  label: string;
  shortLabel: string;
  lat: number;
  lon: number;
  description: string;
}

export const ASTANA_LOCATION_PRESETS: LocationPreset[] = [
  {
    id: 'expo',
    label: 'У Сферы Нур Алем (Экспо-2017)',
    shortLabel: 'Экспо-2017',
    lat: 51.0892,
    lon: 71.4158,
    description: 'Деловой и инновационный кластер левого берега',
  },
  {
    id: 'mega',
    label: 'Возле ТРЦ Mega Silk Way',
    shortLabel: 'Mega Silk Way',
    lat: 51.0898,
    lon: 71.4075,
    description: 'Пересечение пр. Кабанбай батыра и ул. Рыскулова',
  },
  {
    id: 'baiterek',
    label: 'Монумент Байтерек (Водно-зелёный бульвар)',
    shortLabel: 'У Байтерека',
    lat: 51.1283,
    lon: 71.4305,
    description: 'Сердце бульвара Нуржол и министерств',
  },
  {
    id: 'airport_layover',
    label: 'Турист (2 часа до вылета · Въезд с аэропорта)',
    shortLabel: 'До вылета (2ч)',
    lat: 51.0855,
    lon: 71.4215,
    description: 'Быстрый доступ по пр. Кабанбай батыра к аэропорту NQZ (15 мин на авто)',
  },
  {
    id: 'embankment',
    label: 'Набережная реки Ишим и Арбат',
    shortLabel: 'Набережная',
    lat: 51.1582,
    lon: 71.4295,
    description: 'Прогулочная зона вдоль реки Есиль и Атырауского моста',
  },
];

export const INITIAL_ASTANA_POIS: AstanaPOI[] = [
  {
    id: 'poi-nur-alem',
    name: 'Музей энергии будущего «Нур Алем» (Сфера Экспо)',
    nameKz: '«Нұр Әлем» болашақ энергиясы мұражайы',
    nameEn: 'Nur Alem Future Energy Museum (EXPO Sphere)',
    category: 'Досуг и Музей',
    lat: 51.0912,
    lon: 71.4192,
    address: 'пр. Мангилик Ел, 53/1 (территория EXPO)',
    rating: 4.9,
    reviewsCount: 4820,
    openingHours: '10:00–20:00',
    priceLevel: 'Средний чек',
    tags: [
      'kids_friendly',
      'wheelchair_accessible',
      'indoor',
      'tourist_must',
      'group_friendly',
      'interactive',
    ],
    poiFacts:
      'Единственное в мире полностью сферическое здание диаметром 80 метров и высотой 100 метров. 8 этажей интерактивных научных инсталляций (космос, солнце, ветер, кинетическая энергия) и прозрачный стеклянный мостик на 8 этаже.',
    defaultWhyVisit:
      'В пешей доступности от вас находится главная футуристическая доминанта Астаны, где тепло в любую погоду и интересно как взрослым, так и детям.',
    defaultActionPlan:
      '10 мин на прогулку по площади Экспо -> 35 мин на подъём на 8 этаж к стеклянному полу и спуск по интерактивным зонам -> 15 мин на фото у основания Сферы.',
    defaultAiIdea:
      'Начните осмотр сразу с 8-го этажа («Будущий Астана») на панорамном лифте и спускайтесь вниз по спирали — так вы сэкономите силы и протестируете симулятор ветра на 4 этаже без очередей.',
    wikiTitle: 'Нур_Алем',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-mega-silkway',
    name: 'Mega Silk Way (Атриум и гастро-променад)',
    nameKz: 'Mega Silk Way сауда-ойын-сауық орталығы',
    nameEn: 'Mega Silk Way Mall & Promenade',
    category: 'Досуг и Музей',
    lat: 51.0892,
    lon: 71.4078,
    address: 'пр. Кабанбай батыра, 62',
    rating: 4.8,
    reviewsCount: 9150,
    openingHours: '10:00–22:00',
    priceLevel: 'Бесплатно',
    tags: [
      'wifi',
      'sockets',
      'kids_friendly',
      'wheelchair_accessible',
      'indoor',
      'group_friendly',
      'night_activity',
    ],
    poiFacts:
      'Крупнейший крытый сити-променад длиной 500 метров под стеклянным куполом. Оснащен широкими пандусами, комнатами матери и ребенка, парком Happylon и десятками кофеен.',
    defaultWhyVisit:
      'Идеальный крытый маршрут на 30–60 минут в двух шагах от вашей точки: комфортный климат, широкие галереи и отличный выбор спешелти-кофе.',
    defaultActionPlan:
      '20 мин на неспешный променад вдоль арт-инсталляций 1 этажа -> 20 мин на кофе-паузу у панорамного купола -> 10 мин на смотровую галерею 2 этажа.',
    defaultAiIdea:
      'Обратите внимание на подвесные кинетические скульптуры под главным куполом у центрального входа — лучшее место для широкоугольного кадра.',
    wikiTitle: 'Хан_Шатыр',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-marrone-rosso-expo',
    name: 'Marrone Rosso Coffee & Roastery (Mega / EXPO)',
    nameKz: 'Marrone Rosso кофейнясы',
    nameEn: 'Marrone Rosso Specialty Coffee & Workspace',
    category: 'Кофейня и Коворкинг',
    lat: 51.0874,
    lon: 71.4108,
    address: 'пр. Кабанбай батыра, 62 (крыло у входа Сферы)',
    rating: 4.7,
    reviewsCount: 1120,
    openingHours: '08:00–23:00',
    priceLevel: 'Средний чек',
    tags: ['wifi', 'sockets', 'quiet', 'indoor', 'wheelchair_accessible'],
    poiFacts:
      'Просторная кофейня собственной обжарки с выделенной рабочей зоной вдоль мягких диванов, розетками 220V у каждого второго столика и стабильным Wi-Fi (50+ Мбит/с).',
    defaultWhyVisit:
      'Спокойная рабочая атмосфера без громкой музыки, быстрый интернет и удобные столы для ноутбука всего в 4 минутах ходьбы.',
    defaultActionPlan:
      '5 мин пешком до входа -> 40 мин фокусированной работы за столиком с розеткой под двойной фильтр-кофе -> 10 мин на десерт.',
    defaultAiIdea:
      'Занимайте угловой столик слева от барной стойки обжарки: там сразу 2 розетки и самое мягкое дневное освещение без бликов на экране ноутбука.',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-starbucks-kabanbay',
    name: 'Starbucks Reserve (Панорамный зал у Экспо)',
    nameKz: 'Starbucks Reserve кофейнясы',
    nameEn: 'Starbucks Reserve EXPO Plaza',
    category: 'Кофейня и Коворкинг',
    lat: 51.0916,
    lon: 71.4116,
    address: 'пр. Кабанбай батыра, 58Б',
    rating: 4.6,
    reviewsCount: 890,
    openingHours: '07:30–23:00',
    priceLevel: 'Средний чек',
    tags: ['wifi', 'sockets', 'quiet', 'indoor', 'wheelchair_accessible', 'tourist_must'],
    poiFacts:
      'Видовой зал с панорамным остеклением на парк Экспо, длинным комьюнити-столом со встроенными блоками розеток и USB-портами.',
    defaultWhyVisit:
      'Надёжная точка для созвона или перезарядки гаджетов с прямым видом на футуристический квартал Экспо.',
    defaultActionPlan:
      '7 мин на переход -> 35 мин на зарядку телефона/ноутбука за большим деревянным столом -> 10 мин на прогулку по аллее перед выходом.',
    defaultAiIdea:
      'Попросите бариста заварить кофе в пуровере и сядьте у восточного витража — отсюда открывается прямой ракурс на стеклянную Сферу.',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-expo-park',
    name: 'Парк ЭКСПО и Детская интерактивная площадка',
    nameKz: 'ЭКСПО саябағы және балалар алаңы',
    nameEn: 'EXPO Green Park & Kids Interactive Playground',
    category: 'Семья и Дети',
    lat: 51.0928,
    lon: 71.4158,
    address: 'ул. Туркестан / пр. Мангилик Ел (северный сектор EXPO)',
    rating: 4.8,
    reviewsCount: 1640,
    openingHours: '06:00–23:59',
    is24Hours: true,
    priceLevel: 'Бесплатно',
    tags: ['kids_friendly', 'wheelchair_accessible', 'group_friendly', 'tourist_must'],
    poiFacts:
      'Благоустроенный ландшафтный парк с безопасным прорезиненным покрытием, верёвочными лазалками, качелями-гнёздами и безбарьерными дорожками для детских колясок.',
    defaultWhyVisit:
      'Свежий воздух, отсутствие машин, безопасные игровые комплексы для детей и ровные дорожки в 300 метрах от вас.',
    defaultActionPlan:
      '10 мин на прогулку по зелёной аллее -> 25 мин активных игр на детской площадке -> 10 мин отдыха на скамейках с видом на Сферу.',
    defaultAiIdea:
      'Вечером здесь включается динамическая подсветка пешеходных арок, которая реагирует на движение — дети в восторге от световых догонялок.',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-hilton-rooftop',
    name: 'Cloud 9 Rooftop Lounge (Крыша Hilton Astana)',
    nameKz: 'Hilton Astana шатырындағы панорамалық терраса',
    nameEn: 'Cloud 9 Rooftop Bar at Hilton Astana',
    category: 'Ночная локация и Гастро',
    lat: 51.0872,
    lon: 71.4212,
    address: 'ул. Сауран, 46 (16 этаж Hilton Astana)',
    rating: 4.8,
    reviewsCount: 740,
    openingHours: '17:00–02:00',
    priceLevel: 'Премиум',
    tags: ['night_activity', 'indoor', 'wifi', 'group_friendly', 'tourist_must', 'wheelchair_accessible'],
    poiFacts:
      'Панорамный лаунж-бар на 16 этаже с видом с высоты птичьего полёта на ночную иллюминацию Сферы «Нур Алем» и проспекта Мангилик Ел.',
    defaultWhyVisit:
      'Лучшая вечерняя и ночная точка на левом берегу, чтобы увидеть световое шоу Сферы Экспо с высоты в камерной лаунж-атмосфере.',
    defaultActionPlan:
      '8 мин пешком до лобби Hilton -> подъём на скоростном лифте на 16 этаж -> 60 мин на авторские безалкогольные/коктейльные миксы у панорамного окна.',
    defaultAiIdea:
      'Приходите к 20:30 — ровно в это время включается полная медиа-проекция на куполе Нур Алем прямо напротив окон лаунжа.',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-congress-center',
    name: 'Конгресс-центр Астана (Astana Congress Center)',
    nameKz: 'Астана Конгресс-орталығы',
    nameEn: 'Astana Congress Center Architecture Plaza',
    category: 'Смотровая и Архитектура',
    lat: 51.0912,
    lon: 71.4142,
    address: 'ул. Гейдара Алиева, 12',
    rating: 4.7,
    reviewsCount: 620,
    openingHours: null, // Намеренно без точного графика для демонстрации янтарного бейджа Confidence 70%
    priceLevel: 'Бесплатно',
    tags: ['wheelchair_accessible', 'tourist_must', 'group_friendly', 'night_activity'],
    poiFacts:
      'Шедевр современной параметрической архитектуры с многоуровневыми стеклянными фасадами и открытой пешеходной эспланадой.',
    defaultWhyVisit:
      'Впечатляющая архитектурная геометрия для фотопрогулки без толп туристов в 5 минутах от площади Экспо.',
    defaultActionPlan:
      '15 мин на осмотр футуристического фасада -> 15 мин на прогулку по освещённому бульвару до Сферы.',
    defaultAiIdea:
      'Встаньте у зеркальной колоннады западного крыла — в ней одновременно отражаются и Сфера Нур Алем, и закатное небо.',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-botanical-garden',
    name: 'Ботанический сад Астаны и Оранжерея',
    nameKz: 'Астана ботаникалық бағы мен оранжереясы',
    nameEn: 'Astana Botanical Garden & Tropical Greenhouse',
    category: 'Парк и Прогулка',
    lat: 51.1045,
    lon: 71.4162,
    address: 'пр. Кабанбай батыра, 16 / ул. Туркестан',
    rating: 4.9,
    reviewsCount: 6320,
    openingHours: '06:00–23:00',
    priceLevel: 'Бесплатно',
    tags: [
      'kids_friendly',
      'wheelchair_accessible',
      'indoor',
      'tourist_must',
      'group_friendly',
    ],
    poiFacts:
      'Парк площадью 89 гектаров с искусственным водоёмом, фонтаном-шутихой, 11 км вело- и беговых дорожек и двумя закрытыми стеклянными оранжереями (тропики и суккуленты).',
    defaultWhyVisit:
      'Уникальное сочетание просторного парка для прогулки и тёплой тропической оранжереи с пальмами и кактусами.',
    defaultActionPlan:
      '20 мин прогулки от входа до центрального пруда с мостиком -> 35 мин внутри тропической и пустынной оранжереи -> 15 мин отдыха у фонтана.',
    defaultAiIdea:
      'Загляните во второй купол оранжереи с редкими мексиканскими кактусами — там поддерживается климат +26°C даже в ветреный день.',
    wikiTitle: 'Ботанический_сад_(Астана)',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-baiterek',
    name: 'Монумент «Астана-Байтерек» (Панорамная смотровая 97м)',
    nameKz: '«Астана-Бәйтерек» монументі',
    nameEn: 'Baiterek Tower Observation Deck',
    category: 'Смотровая и Архитектура',
    lat: 51.1283,
    lon: 71.4305,
    address: 'бульвар Нуржол, 14',
    rating: 4.9,
    reviewsCount: 14200,
    openingHours: '10:00–22:00',
    priceLevel: 'Средний чек',
    tags: [
      'kids_friendly',
      'wheelchair_accessible',
      'indoor',
      'tourist_must',
      'group_friendly',
      'night_activity',
    ],
    poiFacts:
      'Главный символ столицы высотой 105 метров (смотровая площадка внутри золотого шара «Хамелеон» на высоте 97 метров в честь 1997 года переноса столицы).',
    defaultWhyVisit:
      'Обязательная точка №1 для знакомства с панорамой левого берега Астаны с высоты 97 метров.',
    defaultActionPlan:
      '10 мин на фото у подножия на бульваре Нуржол -> 25 мин на подъём в стеклянном лифте и панорамный обзор 360° -> 15 мин в верхнем зале с глобусом.',
    defaultAiIdea:
      'Сравните вид из золотого шара в сторону резиденции Акорда и в сторону шатра Хан Шатыр — вы увидите идеальную градостроительную ось Кисе Курокавы.',
    wikiTitle: 'Байтерек_(монумент)',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-nurzhol-boulevard',
    name: 'Водно-зелёный бульвар Нуржол (Пешеходный променад)',
    nameKz: 'Нұржол сулы-жасыл бульвары',
    nameEn: 'Nurzhol Pedestrian Boulevard',
    category: 'Парк и Прогулка',
    lat: 51.1288,
    lon: 71.4252,
    address: 'бульвар Нуржол (от Акорды до Хан Шатыра)',
    rating: 4.8,
    reviewsCount: 5400,
    openingHours: '00:00–23:59',
    is24Hours: true,
    priceLevel: 'Бесплатно',
    tags: [
      'kids_friendly',
      'wheelchair_accessible',
      'tourist_must',
      'group_friendly',
      'night_activity',
    ],
    poiFacts:
      'Трёхуровневый пешеходный бульвар длиной 2.5 км, спроектированный архитектором Кисе Курокавой, с поющими фонтанами, бронзовыми скульптурами кочевников и цветочными аллеями.',
    defaultWhyVisit:
      'Полностью пешеходная артерия центра столицы с архитектурными ансамблями, лавочками и уличными кофейнями.',
    defaultActionPlan:
      '25 мин прогулки от Байтерека мимо поющих фонтанов -> 10 мин у бронзовых скульптур «Хранители» -> 10 мин на кофе навынос.',
    defaultAiIdea:
      'Найдите все 12 бронзовых скульптур тюркских персонажей вдоль центрального каскада фонтанов — отличный мини-квест для компании.',
    wikiTitle: 'Водно-зелёный_бульвар',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-koktem-cafe',
    name: 'Кофейня и пекарня «Көктем» (У Байтерека)',
    nameKz: '«Көктем» кофейнясы',
    nameEn: 'Koktem Artisan Cafe & Workspace',
    category: 'Кофейня и Коворкинг',
    lat: 51.1274,
    lon: 71.4288,
    address: 'ул. Достык, 13 (бульвар Нуржол)',
    rating: 4.8,
    reviewsCount: 1850,
    openingHours: '08:00–23:00',
    priceLevel: 'Средний чек',
    tags: ['wifi', 'sockets', 'quiet', 'indoor', 'wheelchair_accessible', 'kids_friendly'],
    poiFacts:
      'Уютное городское кафе с видом на Байтерек, высокоскоростным Wi-Fi, розетками у оконных посадочных мест и свежей ремесленной выпечкой.',
    defaultWhyVisit:
      'Тёплое и тихое место в самом центре бульвара Нуржол, где можно спокойно поработать с ноутбуком и выпить авторский чай с тары.',
    defaultActionPlan:
      '5 мин пешком от Байтерека -> 45 мин работы с ноутбуком у панорамного окна -> 10 мин на дегустацию круассана.',
    defaultAiIdea:
      'Попробуйте фирменный латте с солёной карамелью и займите посадку во втором зале — там тише всего в обеденные часы.',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-khan-shatyr',
    name: 'Хан Шатыр (Эко-аттракционы и крытый тропический курорт)',
    nameKz: '«Хан Шатыр» сауда-ойын-сауық орталығы',
    nameEn: 'Khan Shatyr Entertainment Center',
    category: 'Семья и Дети',
    lat: 51.1325,
    lon: 71.4037,
    address: 'пр. Туран, 37',
    rating: 4.8,
    reviewsCount: 11300,
    openingHours: '10:00–23:00',
    priceLevel: 'Средний чек',
    tags: [
      'kids_friendly',
      'wheelchair_accessible',
      'indoor',
      'tourist_must',
      'group_friendly',
      'night_activity',
      'wifi',
    ],
    poiFacts:
      'Крупнейшее в мире здание шатрового типа (высота шпиля 150 м, архитектор Норман Фостер). Под прозрачным куполом из ETFE-полимера расположены парк динозавров, монорельс и пляж с мальдивским песком.',
    defaultWhyVisit:
      'Архитектурное чудо Нормана Фостера с парком семейных аттракционов и смотровыми террасами под прозрачным куполом.',
    defaultActionPlan:
      '15 мин на осмотр гигантского атриума и подъём по спиральным террасам -> 30 мин в семейном парке развлечений Fame City -> 15 мин на фуд-корте.',
    defaultAiIdea:
      'Поднимитесь на 4 уровень атриума: отсюда видно конструкцию стальных вант шатра и панораму всего бульвара Нуржол.',
    wikiTitle: 'Хан_Шатыр',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-national-museum',
    name: 'Национальный музей Республики Казахстан',
    nameKz: 'Қазақстан Республикасының Ұлттық музейі',
    nameEn: 'National Museum of the Republic of Kazakhstan',
    category: 'Досуг и Музей',
    lat: 51.1185,
    lon: 71.4696,
    address: 'пр. Тауелсиздик, 54',
    rating: 4.9,
    reviewsCount: 5890,
    openingHours: '10:00–18:00',
    priceLevel: 'Средний чек',
    tags: [
      'kids_friendly',
      'wheelchair_accessible',
      'indoor',
      'tourist_must',
      'group_friendly',
    ],
    poiFacts:
      'Крупнейший музей Центральной Азии (74 000 кв. м). Хранит оригинал «Золотого человека» (Алтын Адам), зал древнего золота саков и мультимедийное шоу с парящим орлом под куполом.',
    defaultWhyVisit:
      'Главная культурно-историческая сокровищница Казахстана с интерактивными голограммами и просторными залами.',
    defaultActionPlan:
      '10 мин в главном атриуме на шоу парящего золотого орла -> 35 мин в Зале Золота и Зале Древней истории -> 15 мин в детской интерактивной зоне.',
    defaultAiIdea:
      'Сразу у входа уточните время запуска динамического купола с золотым орлом — шоу проходит каждые полчаса и длится 4 минуты.',
    wikiTitle: 'Национальный_музей_Республики_Казахстан',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-hazret-sultan',
    name: 'Соборная мечеть «Хазрет Султан» и площадь Независимости',
    nameKz: '«Әзірет Сұлтан» мешіті',
    nameEn: 'Hazret Sultan Mosque & Independence Square',
    category: 'Смотровая и Архитектура',
    lat: 51.1252,
    lon: 71.4721,
    address: 'пр. Кошкарбаева, 1/1',
    rating: 4.9,
    reviewsCount: 7400,
    openingHours: '06:00–22:00',
    priceLevel: 'Бесплатно',
    tags: ['wheelchair_accessible', 'tourist_must', 'group_friendly', 'night_activity'],
    poiFacts:
      'Белоснежный архитектурный комплекс в классическом исламском стиле с казахским орнаментом, четырьмя минаретами высотой 77 метров и величественной площадью с фонтанами.',
    defaultWhyVisit:
      'Потрясающий архитектурный ансамбль рядом с Дворцом мира и согласия, особенно живописный в предзакатные часы.',
    defaultActionPlan:
      '20 мин на прогулку по мраморной площади с фонтанами -> 20 мин на осмотр архитектуры и монумента «Қазақ Елі» рядом.',
    defaultAiIdea:
      'Лучшая точка для панорамного кадра всей площади — с верхних ступеней у подножия стелы «Қазақ Елі».',
    wikiTitle: 'Хазрет_Султан_(мечеть)',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-palace-peace',
    name: 'Дворец мира и согласия (Пирамида Нормана Фостера)',
    nameKz: 'Бейбітшілік және келісім сарайы (Пирамида)',
    nameEn: 'Palace of Peace and Reconciliation (The Pyramid)',
    category: 'Смотровая и Архитектура',
    lat: 51.1231,
    lon: 71.4636,
    address: 'пр. Тауелсиздик, 57',
    rating: 4.8,
    reviewsCount: 3900,
    openingHours: '10:00–19:00',
    priceLevel: 'Средний чек',
    tags: ['kids_friendly', 'wheelchair_accessible', 'indoor', 'tourist_must', 'group_friendly'],
    poiFacts:
      'Стеклянно-гранитная пирамида высотой 62 метра, где наклонные лифты движутся по диагонали вдоль рёбер здания к вершине с витражом стаи белых голубей работы Брайана Кларка.',
    defaultWhyVisit:
      'Необычный инженерный объект: вы прокатитесь на диагональном лифте прямо под стеклянный купол с витражными голубями.',
    defaultActionPlan:
      '15 мин прогулки по Президентскому парку вокруг Пирамиды -> 30 мин экскурсии внутри с подъёмом в зал «Бесік» под куполом.',
    defaultAiIdea:
      'Обойдите Пирамиду со стороны реки Ишим — там спускаются живописные каскадные террасы Президентского парка.',
    wikiTitle: 'Дворец_мира_и_согласия',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-grand-mosque',
    name: 'Главная Республиканская мечеть Астаны (Смотровая минарета)',
    nameKz: 'Астана қаласының Бас мешіті',
    nameEn: 'Astana Grand Mosque & Minaret Panorama',
    category: 'Смотровая и Архитектура',
    lat: 51.0732,
    lon: 71.4114,
    address: 'пр. Мангилик Ел, 65 (по дороге в аэропорт)',
    rating: 5.0,
    reviewsCount: 8900,
    openingHours: '07:00–22:00',
    priceLevel: 'Бесплатно',
    tags: [
      'wheelchair_accessible',
      'indoor',
      'tourist_must',
      'group_friendly',
      'night_activity',
    ],
    poiFacts:
      'Крупнейшая мечеть Центральной Азии с главным куполом высотой 83 метра и четырьмя минаретами по 130 метров. В одном из минаретов работает туристический лифт на открытую смотровую площадку.',
    defaultWhyVisit:
      'Находится прямо на пути между районом Экспо и международным аэропортом — идеально, если у вас есть 1.5–2 часа перед вылетом.',
    defaultActionPlan:
      '15 мин на внутренний двор с белой мраморной колоннадой -> 25 мин на главный зал с самым большим в мире ковром ручной работы -> 20 мин на подъём на минарет 130м.',
    defaultAiIdea:
      'Обязательно поднимитесь на лифте в левый туристический минарет: с высоты 130 метров видна вся степь, Сфера Экспо и взлетающие самолёты аэропорта.',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-ishim-embankment',
    name: 'Набережная реки Ишим и Атырауский пешеходный мост (Мост-рыба)',
    nameKz: 'Есіл өзенінің жағалауы және Атырау көпірі',
    nameEn: 'Ishim River Embankment & Atyrau Fish Bridge',
    category: 'Парк и Прогулка',
    lat: 51.1558,
    lon: 71.4285,
    address: 'мкр. Самал / Центральный парк',
    rating: 4.9,
    reviewsCount: 7800,
    openingHours: '00:00–23:59',
    is24Hours: true,
    priceLevel: 'Бесплатно',
    tags: [
      'kids_friendly',
      'wheelchair_accessible',
      'tourist_must',
      'group_friendly',
      'night_activity',
    ],
    poiFacts:
      'Любимый прогулочный маршрут горожан вдоль реки Есиль с бионическим пешеходным мостом «Атырау көпірі» из 2450 алюминиевых лепестков, напоминающих чешую осетра.',
    defaultWhyVisit:
      'Самая живая атмосфера города: уличные музыканты, речные кораблики, бионический мост и панорама обоих берегов.',
    defaultActionPlan:
      '15 мин на переход через Атырауский мост с фото внутри «чешуи» -> 25 мин прогулки вдоль воды к амфитеатру -> 15 мин на стрит-фуд и кофе.',
    defaultAiIdea:
      'Внутри Атырауского моста сделайте снимок вдоль велодорожки — геометрические треугольники крыши создают гипнотический световой туннель.',
    wikiTitle: 'Атырауский_мост',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-central-park-kids',
    name: 'Столичный Центральный парк и Семейная набережная',
    nameKz: 'Астана Орталық саябағы',
    nameEn: 'Astana Central Park & Family Zone',
    category: 'Семья и Дети',
    lat: 51.1535,
    lon: 71.4212,
    address: 'пр. Туран, 2/1',
    rating: 4.8,
    reviewsCount: 6100,
    openingHours: '06:00–23:59',
    is24Hours: true,
    priceLevel: 'Бесплатно',
    tags: ['kids_friendly', 'wheelchair_accessible', 'group_friendly'],
    poiFacts:
      'Огромный зелёный массив с колесом обозрения высотой 65 метров (с закрытыми кабинками с кондиционером и обогревом), верёвочным парком и тенистыми сосновыми аллеями.',
    defaultWhyVisit:
      'Лучшее место для семейного отдыха с детьми: закрытое всесезонное колесо обозрения, детские карусели и тенистые дорожки.',
    defaultActionPlan:
      '15 мин на круг на колесе обозрения (высота 65м) -> 25 мин на детских аттракционах и аллеях -> 15 мин в семейном кафе у пруда.',
    defaultAiIdea:
      'Кабинки колеса обозрения отапливаются и защищены от ветра — с верхней точки открывается лучший вид на изгиб реки Ишим.',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-espresso-bar-embankment',
    name: 'Sensilyo Coffee & Work Hub (Набережная / Самал)',
    nameKz: 'Sensilyo Coffee коворкинг-кофейнясы',
    nameEn: 'Sensilyo Specialty Coffee & Work Hub',
    category: 'Кофейня и Коворкинг',
    lat: 51.1574,
    lon: 71.4318,
    address: 'мкр. Самал, 11 (в 100м от набережной)',
    rating: 4.8,
    reviewsCount: 640,
    openingHours: null, // Вторая точка с неопределенным графиком для честной маркировки 70%
    priceLevel: 'Средний чек',
    tags: ['wifi', 'sockets', 'quiet', 'indoor', 'wheelchair_accessible'],
    poiFacts:
      'Камерная спешелти-кофейня на первой линии у набережной с длинным рабочим столом, розетками под каждым местом и альтернативным завариванием (V60, Aeropress).',
    defaultWhyVisit:
      'Тихая гавань прямо у шумной набережной: можно поработать за ноутбуком в тишине и сразу выйти к реке.',
    defaultActionPlan:
      '35 мин работы с ноутбуком за комьюнити-столом -> 15 мин прогулки со стаканчиком фильтр-кофе по набережной.',
    defaultAiIdea:
      'Попросите зерно эфиопской мытой обработки в воронке V60 — бариста подают его с карточкой вкусового профиля.',
    source: 'Seed Smart City DB',
  },
  {
    id: 'poi-jazz-night-bar',
    name: 'The Bus Music Pub & Night Art Space (Кургальжинское / Туран)',
    nameKz: 'Түнгі музыкалық арт-кеңістік',
    nameEn: 'Night Live Jazz & Art Lounge Astana',
    category: 'Ночная локация и Гастро',
    lat: 51.1482,
    lon: 71.4155,
    address: 'пр. Туран, 24',
    rating: 4.7,
    reviewsCount: 980,
    openingHours: '18:00–03:00',
    priceLevel: 'Средний чек',
    tags: ['night_activity', 'indoor', 'group_friendly', 'wifi'],
    poiFacts:
      'Вечернее культурно-музыкальное пространство с живыми джаз- и инди-концертами местных бэндов Астаны, настольными играми для компаний 3–5 человек и поздней кухней.',
    defaultWhyVisit:
      'Небанальная ночная активность с живой музыкой и дружелюбной атмосферой для компании друзей.',
    defaultActionPlan:
      '10 мин на размещение -> 50 мин живого лайв-сета -> 30 мин общения с компанией за авторскими закусками.',
    defaultAiIdea:
      'Для группы из 3–5 человек выбирайте полукруглые ложи на втором ярусе: оттуда отличный обзор сцены и комфортно разговаривать.',
    source: 'Seed Smart City DB',
  },
];
