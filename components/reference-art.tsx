"use client";

import { useId } from "react";

/** 首页装饰图形使用同一组紫蓝材质，避免线性图标与课程封面混用。 */
export function CategoryArtwork({ index }: { index: number }) {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-${name})`;

  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-face`} x1="16" y1="14" x2="49" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D0C8FF" />
          <stop offset=".42" stopColor="#9891FF" />
          <stop offset="1" stopColor="#6869E9" />
        </linearGradient>
        <linearGradient id={`${id}-light`} x1="15" y1="18" x2="46" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0EDFF" />
          <stop offset=".47" stopColor="#BEB7FF" />
          <stop offset="1" stopColor="#91ABFA" />
        </linearGradient>
        <linearGradient id={`${id}-side`} x1="31" y1="17" x2="46" y2="51" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8F86FA" />
          <stop offset="1" stopColor="#5C61DC" />
        </linearGradient>
        <radialGradient id={`${id}-globe`} cx=".32" cy=".2" r=".86">
          <stop stopColor="#E1DCFF" />
          <stop offset=".5" stopColor="#A09AFF" />
          <stop offset=".83" stopColor="#7771ED" />
          <stop offset="1" stopColor="#A4B4FF" />
        </radialGradient>
        <radialGradient id={`${id}-lens`} cx=".34" cy=".24" r=".83">
          <stop stopColor="#C0CAFF" />
          <stop offset=".57" stopColor="#7C7CEE" />
          <stop offset="1" stopColor="#555BCD" />
        </radialGradient>
        <filter id={`${id}-shadow`} x="-60%" y="-200%" width="220%" height="500%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>
      <ellipse cx="32" cy="51" rx="17" ry="2.5" fill="#7778C8" opacity=".16" filter={paint("shadow")} />

      {index === 0 && (
        <g>
          <rect x="14" y="17" width="39" height="31" rx="6" fill={paint("side")} />
          <rect x="11" y="15" width="39" height="31" rx="6" fill={paint("face")} />
          <rect x="12" y="16" width="37" height="29" rx="5" stroke="#DCD7FF" strokeOpacity=".65" />
          <circle cx="30.5" cy="30.5" r="9.5" fill="#F0EDFF" />
          <circle cx="30.5" cy="30.5" r="6.5" fill={paint("light")} />
          {[20, 29, 38].map((y) => (
            <g key={y} fill="#EAE7FF">
              <rect x="15" y={y} width="3" height="4" rx="1" />
              <rect x="43" y={y} width="3" height="4" rx="1" />
            </g>
          ))}
          <path d="M15 17H45" stroke="white" strokeOpacity=".7" strokeLinecap="round" />
        </g>
      )}

      {index === 1 && (
        <g>
          <path d="M25 12H38L41 19H21L25 12Z" fill={paint("light")} />
          <rect x="13" y="20" width="40" height="30" rx="7" fill={paint("side")} />
          <rect x="10" y="18" width="40" height="30" rx="7" fill={paint("face")} />
          <rect x="11" y="19" width="38" height="28" rx="6" stroke="#DED9FF" strokeOpacity=".75" />
          <circle cx="31" cy="32.5" r="10.5" fill="#ECE9FF" />
          <circle cx="31" cy="32.5" r="7.3" fill={paint("lens")} />
          <path d="M27 28C29 26 32 26 34 27" stroke="#D2D8FF" strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="43" cy="24" r="1.9" fill="#F3F0FF" />
          <path d="M15 20H22" stroke="white" strokeOpacity=".7" strokeLinecap="round" />
        </g>
      )}

      {index === 2 && (
        <g>
          <path d="M23 37L26 49C27 52 33 50 33 47L31 36L23 37Z" fill={paint("side")} />
          <path d="M26 34L43 44C46 46 52 43 51 40L48 26L26 34Z" fill={paint("light")} />
          <path d="M18 22L42 15L48 33L24 43L18 22Z" fill={paint("face")} />
          <ellipse cx="21" cy="32" rx="9" ry="14.5" transform="rotate(25 21 32)" fill={paint("globe")} />
          <path d="M16 30L19 26L23 29L25 23" stroke="#E9E7FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="44" cy="23" rx="4.5" ry="10" transform="rotate(-18 44 23)" fill={paint("side")} />
          <path d="M33 16L39 14" stroke="#E5DEFF" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M38 46L49 46" stroke="#BDC7FF" strokeWidth="5" strokeLinecap="round" />
        </g>
      )}

      {index === 3 && (
        <g>
          <path d="M18 15L42 12V47L19 50C15 50 13 47 13 44V20C13 17 15 15 18 15Z" fill={paint("light")} />
          <path d="M20 15L45 12C48 12 49 13 49 16V43C49 45 48 46 45 46L20 49V15Z" fill={paint("side")} />
          <path d="M21 14L43 12C45 12 46 13 46 15V43L21 46V14Z" fill={paint("face")} />
          <path d="M17 20V43C17 46 19 47 22 47L42 45V49L22 51C16 51 13 48 13 44" fill="#D8D9FF" />
          <path d="M17 46C18 48 21 49 25 48L41 47" stroke="#F6F5FF" strokeWidth="1.4" />
          <path d="M30 23L35 21L37 25L40 25L39 30L35 31L33 35L30 32L27 32L28 28L27 25L30 23Z" fill="#F1EFFF" />
          <path d="M23 16L40 14" stroke="white" strokeOpacity=".65" strokeLinecap="round" />
        </g>
      )}

      {index === 4 && (
        <g>
          <path d="M32 11L50 22L32 33L14 22L32 11Z" fill={paint("light")} />
          <path d="M14 22L32 33V53L14 42V22Z" fill={paint("face")} />
          <path d="M50 22L32 33V53L50 42V22Z" fill={paint("side")} />
          <path d="M16 22L32 32L48 22M32 33V51" stroke="#C3BEFF" strokeOpacity=".65" strokeWidth="1.2" />
          <path d="M16 21L32 12L48 21" stroke="#EBE5FF" strokeOpacity=".8" strokeWidth="1.2" />
          <path d="M17 25V40L29 47V34L17 25Z" fill="#D8D5FF" opacity=".13" />
        </g>
      )}

      {index === 5 && (
        <g>
          <path d="M15 34V29C15 6 49 6 49 29V35" stroke={paint("side")} strokeWidth="5" strokeLinecap="round" />
          <path d="M13 34V28C13 7 47 7 47 28V34" stroke={paint("light")} strokeWidth="5" strokeLinecap="round" />
          <path d="M15 23C19 9 40 9 44 23" stroke="#E8E3FF" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="12" y="30" width="10" height="19" rx="5" transform="rotate(-12 12 30)" fill={paint("side")} />
          <rect x="9" y="30" width="9" height="19" rx="4.5" transform="rotate(-12 9 30)" fill={paint("face")} />
          <rect x="43" y="28" width="10" height="20" rx="5" transform="rotate(12 43 28)" fill={paint("side")} />
          <rect x="39" y="29" width="10" height="20" rx="5" transform="rotate(12 39 29)" fill={paint("face")} />
          <path d="M13 34L14 41M42 34L41 41" stroke="#C7C4FF" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}

      {index === 6 && (
        <g>
          <circle cx="32" cy="31" r="21" fill={paint("globe")} />
          <path d="M15 23C19 13 35 9 45 18" stroke="#E7E1FF" strokeOpacity=".7" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M45 46C48 43 50 39 51 35" stroke="#C4CDFF" strokeOpacity=".6" strokeWidth="1.6" strokeLinecap="round" />
          <text x="32" y="35" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="700" letterSpacing="-.5">AIGC</text>
          <path d="M26 14C18 18 16 24 17 32" stroke="#F3EFFF" strokeOpacity=".14" strokeWidth="5" strokeLinecap="round" />
        </g>
      )}

      {index === 7 && (
        <g>
          {[[13, 12], [35, 12], [13, 34], [35, 34]].map(([x, y], i) => (
            <g key={i}>
              <rect x={x + 1.5} y={y + 2} width="17" height="17" rx="6" fill={paint("side")} opacity=".7" />
              <rect x={x} y={y} width="17" height="17" rx="6" fill={paint(i === 1 || i === 2 ? "light" : "face")} />
              <path d={`M${x + 3} ${y + 5}C${x + 3} ${y + 2} ${x + 6} ${y + 1.5} ${x + 9} ${y + 2}`} stroke="#E8E2FF" strokeOpacity=".65" strokeLinecap="round" />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

export function PathArtwork({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} viewBox="0 0 200 125" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-ribbon`} x1="47" y1="43" x2="132" y2="92" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CDDBFF" stopOpacity=".6" />
          <stop offset=".36" stopColor="#95A5F6" />
          <stop offset=".62" stopColor="#D1D3FF" />
          <stop offset="1" stopColor="#AAA5F4" />
        </linearGradient>
        <linearGradient id={`${id}-arrow`} x1="124" y1="26" x2="156" y2="91" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9AE0FB" />
          <stop offset=".4" stopColor="#ADC7FF" />
          <stop offset="1" stopColor="#A4A0ED" />
        </linearGradient>
        <linearGradient id={`${id}-edge`} x1="141" y1="31" x2="122" y2="105" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B9DEE" />
          <stop offset="1" stopColor="#D1D0F9" />
        </linearGradient>
        <filter id={`${id}-blur`}><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <path d="M27 92L111 111L182 91M51 78L137 99M75 68L161 90M57 105L124 78M91 112L159 85" stroke="#C7CCE9" strokeOpacity=".32" />
      <ellipse cx="105" cy="96" rx="49" ry="8" fill="#B5B9F0" opacity=".32" filter={`url(#${id}-blur)`} />
      <path d="M111 61C81 48 45 50 43 65C41 78 66 92 97 99L103 84C80 79 59 69 62 63C66 56 88 60 103 66L111 61Z" fill={`url(#${id}-ribbon)`} />
      <path d="M44 62C52 51 85 53 108 62" stroke="#E6ECFF" strokeWidth="1.5" />
      <path d="M63 63C58 69 79 79 103 84L97 99C120 109 146 87 158 59L170 64L160 25L130 47L140 51C131 76 116 88 102 84L97 99C121 111 149 89 163 61L174 65L163 24L160 25" fill={`url(#${id}-edge)`} />
      <path d="M97 99C120 108 146 87 158 59L170 64L160 25L130 47L140 51C131 76 116 88 102 84L97 99Z" fill={`url(#${id}-arrow)`} />
      <path d="M99 98C120 105 143 87 156 56L168 61M131 47L160 26" stroke="#EDF3FF" strokeOpacity=".72" strokeWidth="1.3" />
      <path d="M43 65C45 80 68 92 97 99" stroke="#B5BEF7" strokeOpacity=".75" strokeWidth="1.1" />
    </svg>
  );
}

export function GlassRibbon({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} viewBox="0 0 220 280" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-glass`} x1="42" y1="45" x2="169" y2="169" gradientUnits="userSpaceOnUse">
          <stop stopColor="#88E2F6" stopOpacity=".72" />
          <stop offset=".36" stopColor="#C7DFFF" stopOpacity=".37" />
          <stop offset=".67" stopColor="#9195F3" stopOpacity=".78" />
          <stop offset="1" stopColor="#D0ECFF" stopOpacity=".56" />
        </linearGradient>
        <linearGradient id={`${id}-bottom`} x1="45" y1="116" x2="164" y2="237" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BACBFF" stopOpacity=".6" />
          <stop offset=".65" stopColor="#E9EEFF" stopOpacity=".3" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity=".8" />
        </linearGradient>
      </defs>
      <g transform="rotate(-16 104 139)">
        <path d="M40 123C27 143 34 168 61 183C99 204 155 196 176 165L179 194C159 226 99 232 58 209C29 193 21 166 35 145L40 123Z" fill={`url(#${id}-bottom)`} />
        <path d="M34 152C22 172 32 194 59 209C99 231 158 225 178 194" stroke="white" strokeOpacity=".72" strokeWidth="2" />
        <path d="M43 72C19 102 36 138 76 148C112 157 150 145 168 120L172 155C152 181 108 192 70 177C30 162 17 129 33 103L43 72Z" fill={`url(#${id}-glass)`} />
        <path d="M40 83C21 111 36 138 76 148C113 158 151 145 168 120" stroke="#B3D7FE" strokeWidth="2" />
        <path d="M43 72C67 43 122 43 151 67C169 82 177 103 168 120C154 147 103 160 68 144C111 153 151 133 157 112C162 92 146 74 123 69C94 60 64 67 53 83C38 104 52 125 74 133C44 126 29 101 43 72Z" fill={`url(#${id}-glass)`} />
        <path d="M44 73C64 47 114 40 146 63C168 79 175 101 168 118M52 83C69 61 102 61 126 69" stroke="#E7F5FF" strokeOpacity=".9" strokeWidth="1.6" />
        <path d="M154 73C169 94 169 108 160 123" stroke="#81C8F3" strokeOpacity=".55" strokeWidth="3" />
      </g>
    </svg>
  );
}

export function GlassCrystal({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} viewBox="0 0 145 240" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-facet`} x1="28" y1="36" x2="114" y2="205" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DDE8FF" stopOpacity=".16" />
          <stop offset=".54" stopColor="#C3CEFF" stopOpacity=".36" />
          <stop offset="1" stopColor="#ADD7FF" stopOpacity=".64" />
        </linearGradient>
        <linearGradient id={`${id}-light`} x1="88" y1="13" x2="49" y2="199" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBFCFF" stopOpacity=".2" />
          <stop offset="1" stopColor="#EBF3FF" stopOpacity=".85" />
        </linearGradient>
      </defs>
      <path d="M78 12L127 145L83 222L30 179L78 12Z" fill={`url(#${id}-facet)`} />
      <path d="M78 12L83 166L30 179L78 12Z" fill={`url(#${id}-light)`} />
      <path d="M78 12L127 145L83 166L78 12Z" fill="#E1E5FF" fillOpacity=".27" />
      <path d="M30 179L83 166V222L30 179Z" fill="#CCE0FF" fillOpacity=".28" />
      <path d="M83 166L127 145L83 222V166Z" fill="#ACCBFF" fillOpacity=".26" />
      <path d="M78 12L127 145L83 222L30 179L78 12ZM78 12L83 166M30 179L83 166L127 145M83 166V222" stroke="#C8DBFB" strokeOpacity=".55" strokeWidth="1.3" />
      <path d="M77 19L35 177L82 216" stroke="#FDFEFF" strokeOpacity=".8" strokeWidth="1.5" />
    </svg>
  );
}
