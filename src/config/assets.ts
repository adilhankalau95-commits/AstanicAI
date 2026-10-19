/**
 * Единый конфигурационный файл 3D-ассетов Astanik AI
 * Содержит высокодетализированные 3D-рендеры персонажа Астаника, 3D-пинов, огоньков,
 * 4-конечных искр и 3D-глиняных иконок категорий без белых квадратных рамок (прозрачный фон).
 */

const svgToDataUrl = (svg: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;

// 1. MASCOT_IDLE: Главный 3D-персонаж Астаник на светящемся подиуме (прозрачный фон, без белых рамок)
export const MASCOT_IDLE = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420" fill="none">
  <defs>
    <radialGradient id="podiumGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.55"/>
      <stop offset="70%" stop-color="#BAE6FD" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="podiumTop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#E0F2FE"/>
    </linearGradient>
    <linearGradient id="podiumSide" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#BAE6FD"/>
      <stop offset="50%" stop-color="#F0F9FF"/>
      <stop offset="100%" stop-color="#7DD3FC"/>
    </linearGradient>
    <radialGradient id="body3D" cx="35%" cy="25%" r="70%">
      <stop offset="0%" stop-color="#BFDBFE"/>
      <stop offset="35%" stop-color="#60A5FA"/>
      <stop offset="80%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </radialGradient>
    <radialGradient id="ear3D" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#BAE6FD"/>
      <stop offset="60%" stop-color="#60A5FA"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </radialGradient>
    <radialGradient id="cheekGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FDA4AF" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#FDA4AF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="mouthGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#881337"/>
      <stop offset="100%" stop-color="#FB7185"/>
    </linearGradient>
  </defs>

  <ellipse cx="210" cy="368" rx="165" ry="38" fill="url(#podiumGlow)"/>
  <path d="M75 338 L75 358 C75 376 345 376 345 358 L345 338 Z" fill="url(#podiumSide)"/>
  <ellipse cx="210" cy="338" rx="135" ry="24" fill="url(#podiumTop)" stroke="#FFFFFF" stroke-width="3"/>
  <ellipse cx="210" cy="342" rx="85" ry="12" fill="#0284C7" fill-opacity="0.18"/>

  <ellipse cx="168" cy="322" rx="26" ry="20" fill="url(#ear3D)"/>
  <ellipse cx="252" cy="322" rx="26" ry="20" fill="url(#ear3D)"/>

  <circle cx="135" cy="112" r="30" fill="url(#ear3D)"/>
  <circle cx="285" cy="112" r="30" fill="url(#ear3D)"/>
  <ellipse cx="205" cy="92" rx="12" ry="18" transform="rotate(-12 205 92)" fill="url(#ear3D)"/>
  <ellipse cx="220" cy="95" rx="10" ry="15" transform="rotate(15 220 95)" fill="url(#ear3D)"/>

  <ellipse cx="88" cy="225" rx="28" ry="20" transform="rotate(-25 88 225)" fill="url(#ear3D)"/>
  <ellipse cx="332" cy="215" rx="28" ry="20" transform="rotate(30 332 215)" fill="url(#ear3D)"/>

  <ellipse cx="210" cy="215" rx="118" ry="108" fill="url(#body3D)"/>
  <ellipse cx="175" cy="142" rx="58" ry="25" transform="rotate(-12 175 142)" fill="#FFFFFF" fill-opacity="0.32"/>

  <circle cx="128" cy="228" r="24" fill="url(#cheekGlow)"/>
  <circle cx="292" cy="228" r="24" fill="url(#cheekGlow)"/>

  <ellipse cx="160" cy="196" rx="24" ry="27" fill="#0F172A"/>
  <ellipse cx="160" cy="196" rx="21" ry="24" fill="#1E293B"/>
  <circle cx="151" cy="185" r="8.5" fill="#FFFFFF"/>
  <circle cx="168" cy="206" r="4" fill="#38BDF8"/>

  <ellipse cx="260" cy="196" rx="24" ry="27" fill="#0F172A"/>
  <ellipse cx="260" cy="196" rx="21" ry="24" fill="#1E293B"/>
  <circle cx="251" cy="185" r="8.5" fill="#FFFFFF"/>
  <circle cx="268" cy="206" r="4" fill="#38BDF8"/>

  <path d="M188 214 Q210 218 232 214 C234 236 224 246 210 246 C196 246 186 236 188 214 Z" fill="url(#mouthGrad)"/>
  <path d="M196 232 Q210 225 224 232 C222 241 216 245 210 245 C204 245 198 241 196 232 Z" fill="#FDA4AF"/>
</svg>
`);

// 2. MASCOT_CAMERA: Персонаж с объективом/лупой (для режима AR-камеры)
export const MASCOT_CAMERA = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420" fill="none">
  <defs>
    <radialGradient id="camBody3D" cx="35%" cy="25%" r="70%">
      <stop offset="0%" stop-color="#BAE6FD"/>
      <stop offset="40%" stop-color="#60A5FA"/>
      <stop offset="85%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#1E40AF"/>
    </radialGradient>
    <radialGradient id="lensGlass" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#E0F2FE" stop-opacity="0.55"/>
      <stop offset="70%" stop-color="#38BDF8" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#0284C7" stop-opacity="0.8"/>
    </radialGradient>
  </defs>

  <ellipse cx="210" cy="360" rx="115" ry="22" fill="#0284C7" fill-opacity="0.18"/>
  <ellipse cx="168" cy="332" rx="25" ry="18" fill="url(#camBody3D)"/>
  <ellipse cx="252" cy="332" rx="25" ry="18" fill="url(#camBody3D)"/>

  <circle cx="135" cy="115" r="28" fill="url(#camBody3D)"/>
  <circle cx="285" cy="115" r="28" fill="url(#camBody3D)"/>

  <ellipse cx="210" cy="225" rx="116" ry="106" fill="url(#camBody3D)"/>
  <ellipse cx="172" cy="150" rx="52" ry="22" transform="rotate(-12 172 150)" fill="#FFFFFF" fill-opacity="0.28"/>

  <ellipse cx="158" cy="204" rx="22" ry="25" fill="#0F172A"/>
  <circle cx="150" cy="194" r="8" fill="#FFFFFF"/>
  <circle cx="166" cy="212" r="3.5" fill="#38BDF8"/>

  <ellipse cx="268" cy="200" rx="30" ry="33" fill="#0F172A"/>
  <circle cx="256" cy="186" r="11" fill="#FFFFFF"/>
  <circle cx="278" cy="212" r="5" fill="#38BDF8"/>

  <ellipse cx="208" cy="236" rx="13" ry="16" fill="#881337"/>
  <ellipse cx="208" cy="242" rx="9" ry="8" fill="#FB7185"/>

  <ellipse cx="138" cy="252" rx="24" ry="18" transform="rotate(-35 138 252)" fill="url(#camBody3D)"/>

  <rect x="292" y="255" width="24" height="68" rx="12" transform="rotate(-16 292 255)" fill="#E2E8F0" stroke="#38BDF8" stroke-width="3"/>
  <circle cx="306" cy="274" r="5" fill="#38BDF8"/>

  <circle cx="272" cy="198" r="64" fill="url(#lensGlass)" stroke="#E0F2FE" stroke-width="10"/>
  <circle cx="272" cy="198" r="64" stroke="#38BDF8" stroke-width="3" stroke-dasharray="18 10"/>
  <path d="M242 178 V168 H252 M292 168 H302 V178 M302 218 V228 H292 M252 228 H242 V218" stroke="#7DD3FC" stroke-width="4" stroke-linecap="round"/>

  <ellipse cx="322" cy="268" rx="24" ry="18" transform="rotate(15 322 268)" fill="url(#camBody3D)"/>
</svg>
`);

// 3. MASCOT_THINKING: Персонаж с пином карты (для состояния поиска RAG и карты)
export const MASCOT_THINKING = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420" fill="none">
  <defs>
    <radialGradient id="thinkBody" cx="35%" cy="25%" r="70%">
      <stop offset="0%" stop-color="#BAE6FD"/>
      <stop offset="45%" stop-color="#60A5FA"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </radialGradient>
    <linearGradient id="pinGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
  </defs>

  <ellipse cx="175" cy="365" rx="95" ry="18" fill="#0284C7" fill-opacity="0.18"/>
  <ellipse cx="142" cy="340" rx="22" ry="16" fill="url(#thinkBody)"/>
  <ellipse cx="208" cy="340" rx="22" ry="16" fill="url(#thinkBody)"/>

  <ellipse cx="175" cy="240" rx="96" ry="98" fill="url(#thinkBody)"/>

  <ellipse cx="145" cy="205" rx="16" ry="20" transform="rotate(-10 145 205)" fill="#0F172A"/>
  <circle cx="150" cy="197" r="6" fill="#FFFFFF"/>

  <ellipse cx="212" cy="198" rx="16" ry="20" transform="rotate(-10 212 198)" fill="#0F172A"/>
  <circle cx="217" cy="190" r="6" fill="#FFFFFF"/>

  <path d="M174 226 Q184 220 192 228" stroke="#0F172A" stroke-width="5" stroke-linecap="round"/>

  <ellipse cx="86" cy="260" rx="22" ry="16" transform="rotate(35 86 260)" fill="url(#thinkBody)"/>
  <ellipse cx="202" cy="252" rx="26" ry="16" transform="rotate(-55 202 252)" fill="url(#thinkBody)"/>

  <ellipse cx="315" cy="215" rx="36" ry="8" fill="#38BDF8" fill-opacity="0.28"/>
  <path d="M315 75 C282 75 256 101 256 134 C256 172 315 205 315 205 C315 205 374 172 374 134 C374 101 348 75 315 75 Z" fill="url(#pinGrad)"/>
  <circle cx="315" cy="132" r="22" fill="#FFFFFF"/>
  <path d="M245 92 L258 102 M385 92 L372 102 M235 135 L248 135 M395 135 L382 135" stroke="#38BDF8" stroke-width="6" stroke-linecap="round"/>
</svg>
`);

// 4. MASCOT_JUMP: Прыгающий радостный Астаник с поднятыми лапками (для клика +10 XP)
export const MASCOT_JUMP = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420" fill="none">
  <defs>
    <radialGradient id="jumpBody" cx="35%" cy="25%" r="70%">
      <stop offset="0%" stop-color="#BAE6FD"/>
      <stop offset="40%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </radialGradient>
  </defs>
  <ellipse cx="210" cy="380" rx="75" ry="14" fill="#38BDF8" fill-opacity="0.22"/>
  <circle cx="140" cy="95" r="26" fill="url(#jumpBody)"/>
  <circle cx="280" cy="95" r="26" fill="url(#jumpBody)"/>
  <ellipse cx="92" cy="155" rx="28" ry="19" transform="rotate(35 92 155)" fill="url(#jumpBody)"/>
  <ellipse cx="328" cy="155" rx="28" ry="19" transform="rotate(-35 328 155)" fill="url(#jumpBody)"/>
  <ellipse cx="210" cy="200" rx="112" ry="104" fill="url(#jumpBody)"/>
  <ellipse cx="165" cy="305" rx="24" ry="18" transform="rotate(15 165 305)" fill="url(#jumpBody)"/>
  <ellipse cx="255" cy="305" rx="24" ry="18" transform="rotate(-15 255 305)" fill="url(#jumpBody)"/>
  <path d="M142 182 Q160 162 178 182" stroke="#0F172A" stroke-width="8" stroke-linecap="round"/>
  <path d="M242 182 Q260 162 278 182" stroke="#0F172A" stroke-width="8" stroke-linecap="round"/>
  <circle cx="128" cy="202" r="20" fill="#FDA4AF" fill-opacity="0.65"/>
  <circle cx="292" cy="202" r="20" fill="#FDA4AF" fill-opacity="0.65"/>
  <path d="M185 198 Q210 204 235 198 C236 226 224 238 210 238 C196 238 184 226 185 198 Z" fill="#881337"/>
  <ellipse cx="210" cy="226" rx="16" ry="10" fill="#FB7185"/>
</svg>
`);

// 5. ICON_FLAME_STREAK: 3D-иконка огонька для счетчика активности в шапке
export const ICON_FLAME_STREAK = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="flameOuter" x1="32" y1="6" x2="32" y2="58" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FBBF24"/>
      <stop offset="50%" stop-color="#F97316"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </linearGradient>
    <linearGradient id="flameInner" x1="32" y1="24" x2="32" y2="56" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
  </defs>
  <path d="M34 6 C34 6 49 19 49 35 C49 47 40 57 32 57 C24 57 15 47 15 35 C15 26 21 19 21 19 C21 19 20 26 25 27 C23 18 34 6 34 6 Z" fill="url(#flameOuter)"/>
  <path d="M32 26 C32 26 41 34 41 42 C41 49 37 54 32 54 C27 54 23 49 23 42 C23 34 32 26 32 26 Z" fill="url(#flameInner)"/>
</svg>
`);

// 6. ICON_SPARKLES: 3D-четырехконечные звездочки и искры вокруг персонажа
export const ICON_SPARKLES = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="sparkleGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FBBF24"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#38BDF8"/>
    </linearGradient>
  </defs>
  <path d="M32 4 Q35 28 58 32 Q35 36 32 60 Q29 36 6 32 Q29 28 32 4 Z" fill="url(#sparkleGrad)"/>
</svg>
`);

// 7. ICON_MAP_PIN: 3D-пин для карты маршрута (изумрудно-голубой 3D-рендер с волнами)
export const ICON_MAP_PIN = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none">
  <defs>
    <linearGradient id="pin3D" x1="16" y1="10" x2="80" y2="82" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="50%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#3B82F6"/>
    </linearGradient>
  </defs>
  <ellipse cx="48" cy="84" rx="34" ry="8" stroke="#38BDF8" stroke-opacity="0.45" stroke-width="2.5"/>
  <ellipse cx="48" cy="84" rx="22" ry="5" stroke="#0284C7" stroke-opacity="0.65" stroke-width="2.5"/>
  <path d="M48 10 C28 10 14 25 14 44 C14 64 48 84 48 84 C48 84 82 64 82 44 C82 25 68 10 48 10 Z" fill="url(#pin3D)" stroke="#FFFFFF" stroke-width="3"/>
  <circle cx="48" cy="43" r="17" fill="#FFFFFF"/>
  <circle cx="48" cy="43" r="8" fill="#38BDF8"/>
</svg>
`);

// 8. 4 Глиняные 3D-иконки из загруженного пользователем набора (Кофе с молнией, Коляска, Ночной полумесяц, Самолет)
export const ICON_3D_COFFEE = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none">
  <rect x="8" y="8" width="80" height="80" rx="22" fill="#BAE6FD"/>
  <circle cx="48" cy="48" r="32" fill="#7DD3FC"/>
  <path d="M28 40 H62 V54 C62 64 54 70 45 70 C36 70 28 64 28 54 Z" fill="#FDA4AF"/>
  <path d="M62 44 H68 C72 44 72 56 68 56 H62" stroke="#FDA4AF" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="45" cy="40" rx="17" ry="5" fill="#FDE047"/>
  <path d="M46 47 L40 56 H46 L44 64 L52 54 H46 Z" fill="#FACC15"/>
  <path d="M45 22 Q49 27 45 32" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
</svg>
`);

export const ICON_3D_STROLLER = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none">
  <rect x="8" y="8" width="80" height="80" rx="22" fill="#FBCFE8"/>
  <circle cx="48" cy="48" r="32" fill="#F9A8D4"/>
  <path d="M28 48 H64 L58 64 H34 Z" fill="#60A5FA"/>
  <path d="M28 48 C28 32 46 30 46 48 Z" fill="#FEF08A"/>
  <path d="M64 48 L70 38 H74" stroke="#60A5FA" stroke-width="5" stroke-linecap="round"/>
  <circle cx="38" cy="68" r="6" fill="#FACC15" stroke="#FEF08A" stroke-width="3"/>
  <circle cx="56" cy="68" r="6" fill="#FACC15" stroke="#FEF08A" stroke-width="3"/>
</svg>
`);

export const ICON_3D_NIGHT = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none">
  <rect x="8" y="8" width="80" height="80" rx="22" fill="#DDD6FE"/>
  <circle cx="48" cy="48" r="32" fill="#C4B5FD"/>
  <path d="M54 26 C38 28 30 46 40 60 C48 70 62 68 68 60 C56 62 48 52 50 40 C51 34 54 26 54 26 Z" fill="#FEF08A"/>
  <circle cx="62" cy="36" r="4" fill="#FEF08A"/>
  <ellipse cx="34" cy="64" rx="12" ry="6" fill="#FFFFFF"/>
</svg>
`);

export const ICON_3D_PLANE = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none">
  <rect x="8" y="8" width="80" height="80" rx="22" fill="#FEF08A"/>
  <circle cx="48" cy="48" r="32" fill="#FDE047"/>
  <path d="M24 50 L70 42 C74 41 76 46 72 49 L28 58 Z" fill="#6EE7B7"/>
  <path d="M44 46 L36 30 L48 32 L56 45 Z" fill="#A7F3D0"/>
  <path d="M46 53 L38 68 L50 66 L56 51 Z" fill="#34D399"/>
</svg>
`);

export const ASSETS = {
  MASCOT_IDLE,
  MASCOT_CAMERA,
  MASCOT_THINKING,
  MASCOT_JUMP,
  ICON_FLAME_STREAK,
  ICON_SPARKLES,
  ICON_MAP_PIN,
  ICON_3D_COFFEE,
  ICON_3D_STROLLER,
  ICON_3D_NIGHT,
  ICON_3D_PLANE,
};
