import React from 'react';

/* Reusable Detailed 2D Portrait Figure: Matched to Uploaded Historical Portrait of Iakob Gogebashvili */
const DetailedIakobFigure: React.FC<{
  spiritMode?: boolean;
  holdingBook?: boolean;
}> = ({ spiritMode = false, holdingBook = false }) => {
  const uid = React.useId().replace(/:/g, '');
  const skinId = `iakobSkin_${uid}`;
  const coatId = `iakobCoat_${uid}`;
  const beardId = `iakobBeard_${uid}`;
  const hairId = `iakobHair_${uid}`;

  return (
    <g opacity={spiritMode ? 0.95 : 1}>
      <defs>
        <linearGradient id={skinId} x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#F4CCB0" />
          <stop offset="60%" stopColor="#DFAD8B" />
          <stop offset="100%" stopColor="#C18968" />
        </linearGradient>
        {/* Iconic Light Warm-Stone / Sand Double-Breasted Suit from Uploaded Photo */}
        <linearGradient id={coatId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={spiritMode ? '#E6DEC8' : '#DDD2BE'} />
          <stop offset="60%" stopColor={spiritMode ? '#CFC4AC' : '#C7B9A2'} />
          <stop offset="100%" stopColor={spiritMode ? '#B2A48B' : '#A89880'} />
        </linearGradient>
        <linearGradient id={beardId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E2927" />
          <stop offset="55%" stopColor="#464343" />
          <stop offset="100%" stopColor="#7C8087" />
        </linearGradient>
        <linearGradient id={hairId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6D6A68" />
          <stop offset="55%" stopColor="#3B3533" />
          <stop offset="100%" stopColor="#262120" />
        </linearGradient>
      </defs>

      {/* Shoulders & Double-Breasted Light Stone Suit Jacket */}
      <path
        d="M-68 118 C-66 64 -43 40 -17 34 L17 34 C43 40 66 64 68 118 Z"
        fill={`url(#${coatId})`}
        stroke={spiritMode ? '#F3C96B' : '#8D7F6B'}
        strokeWidth="2"
      />
      {/* Left-Over-Right Double-Breasted Seam & Subtle Sleeve Creases */}
      <line x1="20" y1="68" x2="18" y2="118" stroke="#9B8C76" strokeWidth="1.4" opacity="0.7" />
      <path d="M-54 88 Q-44 62 -32 48" fill="none" stroke="#B0A18A" strokeWidth="1.8" opacity="0.65" />
      <path d="M54 88 Q44 62 32 48" fill="none" stroke="#9E8F79" strokeWidth="1.8" opacity="0.65" />
      {/* Breast Pocket Line */}
      <line x1="26" y1="74" x2="48" y2="69" stroke="#968771" strokeWidth="1.5" />

      {/* Crisp White Standing Collar & Light Cream Silk Cravat */}
      <polygon
        points="-14,33 14,33 10,49 0,58 -10,49"
        fill="#F8F5EE"
        stroke="#D4CCB9"
        strokeWidth="0.9"
      />
      <ellipse cx="0" cy="46" rx="5" ry="4" fill="#EFE8DA" stroke="#C9BFA9" strokeWidth="0.8" />
      <polygon points="-4,49 4,49 5,58 -5,58" fill="#E6DEC8" />

      {/* Wide Peaked Double-Breasted Jacket Lapels */}
      <polygon
        points="-17,34 0,68 -24,62 -36,46"
        fill="#D6C9B4"
        stroke="#9B8C76"
        strokeWidth="1.1"
      />
      <polygon
        points="17,34 0,68 25,62 36,46"
        fill="#CFC2AC"
        stroke="#9B8C76"
        strokeWidth="1.1"
      />

      {/* Four Dark Horn Buttons in Classic 2x2 Double-Breasted Layout */}
      {[
        [-14, 72],
        [14, 72],
        [-13, 98],
        [15, 98],
      ].map(([bx, by], i) => (
        <g key={i} transform={`translate(${bx}, ${by})`}>
          <circle cx="0" cy="0" r="3.4" fill="#3B2F28" stroke="#241C17" strokeWidth="0.8" />
          <circle cx="-0.9" cy="-0.6" r="0.6" fill="#7D6B5D" />
          <circle cx="0.9" cy="0.6" r="0.6" fill="#7D6B5D" />
        </g>
      ))}

      {/* Neck */}
      <rect x="-11" y="21" width="22" height="17" rx="5" fill="#C78E6D" />

      {/* Ears with Natural Outer Rim & Inner Detail */}
      <ellipse cx="-24" cy="2" rx="4.5" ry="8.5" fill="#D49C7B" />
      <path d="M-24.5 -3 Q-26.5 2 -23.5 6" fill="none" stroke="#AA7153" strokeWidth="1.2" />
      <ellipse cx="24" cy="2" rx="4.5" ry="8.5" fill="#D49C7B" />
      <path d="M24.5 -3 Q26.5 2 23.5 6" fill="none" stroke="#AA7153" strokeWidth="1.2" />

      {/* Head Silhouette (Solid Square-Oval Proportions Matching Photo) */}
      <path
        d="M-22 -16 C-22 -42 22 -42 22 -16 C23 -5 23 6 21 15 C19 26 9 33 0 33 C-9 33 -19 26 -21 15 C-23 6 -23 -5 -22 -16 Z"
        fill={`url(#${skinId})`}
      />

      {/* Full Short-Cropped Brushed-Up Salt-and-Pepper Hair with Iconic Widow's Peak V-Dip */}
      <path
        d="M-22.5 -10 C-24 -32 -15 -43 0 -43 C15 -43 24 -32 22.5 -10 C21 -18 19 -24 15 -26 C9 -28 3 -25 0 -19.5 C-3 -25 -9 -28 -15 -26 C-19 -24 -21 -18 -22.5 -10 Z"
        fill={`url(#${hairId})`}
      />
      {/* Subtle Short Silver-Grey Temple Sideburns & Brushed-Up Crown Texture */}
      <path
        d="M-22.5 -11 L-22 2 L-20 2 L-20 -12 Z M22.5 -11 L22 2 L20 2 L20 -12 Z"
        fill="#7E8287"
      />
      <path
        d="M-12 -39 L-11 -29 M-6 -41 L-5 -28 M0 -41.5 L0 -26 M6 -41 L5 -28 M12 -39 L11 -29"
        stroke="#BFC3C9"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Horizontal Forehead Crease & Temple Shading */}
      <path
        d="M-12 -14.5 Q0 -16 12 -14.5"
        fill="none"
        stroke="#B67C5D"
        strokeWidth="1"
        opacity="0.52"
      />

      {/* Calm, Deep-Set Slightly Hooded Eyes & Natural Salt-and-Pepper Brows */}
      <path
        d="M-16.5 -9.5 Q-10 -12 -3.5 -8.8"
        fill="none"
        stroke="#463E3B"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path
        d="M3.5 -8.8 Q10 -12 16.5 -9.5"
        fill="none"
        stroke="#463E3B"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path
        d="M-1.5 -10.5 L-1 -7.5 M1.5 -10.5 L1 -7.5"
        fill="none"
        stroke="#AC7455"
        strokeWidth="0.95"
        opacity="0.55"
      />
      <ellipse cx="-10" cy="-4.5" rx="3.9" ry="1.8" fill="#F9F5EE" />
      <ellipse cx="10" cy="-4.5" rx="3.9" ry="1.8" fill="#F9F5EE" />
      {/* Upper Hooded Eyelid Shadow */}
      <path d="M-14.2 -5.5 Q-10 -7.5 -5.8 -5.2" fill="none" stroke="#9B6447" strokeWidth="1.2" />
      <path d="M5.8 -5.2 Q10 -7.5 14.2 -5.5" fill="none" stroke="#9B6447" strokeWidth="1.2" />
      <circle cx="-10" cy="-4.5" r="1.85" fill="#2A1F1C" />
      <circle cx="10" cy="-4.5" r="1.85" fill="#2A1F1C" />
      <circle cx="-10.5" cy="-5" r="0.5" fill="#FFFFFF" opacity="0.82" />
      <circle cx="9.5" cy="-5" r="0.5" fill="#FFFFFF" opacity="0.82" />
      <path
        d="M-13 -1.8 Q-10 0 -7 -1.8 M7 -1.8 Q10 0 13 -1.8"
        fill="none"
        stroke="#B3795B"
        strokeWidth="0.9"
        opacity="0.5"
      />

      {/* Straight, Solid Georgian Nose with Natural Side Shadow */}
      <path
        d="M0 -7.5 L-1.6 5.5 C-3 7.8 -4.2 8.8 -2.4 9.8 L2.4 9.8 C4.2 8.8 3 7.8 1.6 5.5"
        fill="#D59D7D"
        stroke="#A86E50"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <line x1="0" y1="-5.5" x2="0" y2="5.8" stroke="#F8D8BE" strokeWidth="1.2" opacity="0.62" />

      {/* Neatly Trimmed Close-Cropped Full Salt-and-Pepper Beard Following Jawline */}
      <path
        d="M-22 1 C-24 19 -17 38 0 41 C17 38 24 19 22 1 C19 10 14 15 9 15 C4.5 15 2.5 13.5 0 13.5 C-2.5 13.5 -4.5 15 -9 15 C-14 15 -19 10 -22 1 Z"
        fill={`url(#${beardId})`}
      />
      {/* Natural Cropped Beard Salt-and-Pepper Lock Texture */}
      <path
        d="M-14 19 Q-12 29 -8.5 36 M-5 21 Q-4 32 -2.5 38 M5 21 Q4 32 2.5 38 M14 19 Q12 29 8.5 36"
        fill="none"
        stroke="#A4ABB6"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.62"
      />

      {/* Full Bushy Salt-and-Pepper Mustache Blending Into Cropped Beard */}
      <path
        d="M-18 13.5 C-12 7 -3.8 8.2 0 11 C3.8 8.2 12 7 18 13.5 C15 19.5 8 18 0 15.8 C-8 18 -15 19.5 -18 13.5 Z"
        fill="#332E2C"
      />
      <path
        d="M-13 12.2 Q-6 10.4 -1 12.6 M1 12.6 Q6 10.4 13 12.2"
        fill="none"
        stroke="#9A9FA8"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.72"
      />
      {/* Subtle Closed Mouth Line */}
      <path
        d="M-4.5 17.5 Q0 18.8 4.5 17.5"
        fill="none"
        stroke="#221C1A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Optional Held Dedaena Book */}
      {holdingBook && (
        <g transform="translate(-54, 74)">
          <g className="animate-float-slow">
            <rect
              x="-26"
              y="-20"
              width="52"
              height="40"
              rx="5"
              fill="#8B2626"
              stroke="#F3C96B"
              strokeWidth="2.5"
            />
            <rect
              x="-20"
              y="-14"
              width="40"
              height="28"
              rx="2"
              fill="none"
              stroke="#F3C96B"
              strokeWidth="1"
              opacity="0.75"
            />
            <text
              x="0"
              y="4"
              textAnchor="middle"
              fill="#F3C96B"
              fontSize="11"
              fontWeight="700"
              fontFamily="Noto Serif Georgian, serif"
            >
              დედა ენა
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

/* Reusable Detailed 2D Video-Game Protagonist (Young Georgian Traveler) */
const DetailedTravelerFigure: React.FC<{
  pointingRight?: boolean;
}> = ({ pointingRight = false }) => {
  const uid = React.useId().replace(/:/g, '');
  const coatId = `travCoat_${uid}`;
  return (
    <g>
      <defs>
        <linearGradient id={coatId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B597C" />
          <stop offset="100%" stopColor="#203247" />
        </linearGradient>
      </defs>
      {/* Ground Shadow */}
      <ellipse cx="0" cy="78" rx="23" ry="6" fill="#0B1117" opacity="0.48" />
      {/* Boots & Trousers with Laces */}
      <rect x="-12" y="42" width="10" height="30" rx="4" fill="#1F242D" />
      <rect x="2" y="42" width="10" height="30" rx="4" fill="#1F242D" />
      <path d="M-15 70 L-1 70 L-1 77 L-17 77 Q-18 72 -15 70 Z" fill="#4A2E20" stroke="#2D1B12" strokeWidth="0.9" />
      <path d="M1 70 L15 70 Q18 72 17 77 L1 77 Z" fill="#4A2E20" stroke="#2D1B12" strokeWidth="0.9" />

      {/* Layered Georgian Coat, Collar & Satchel Strap */}
      <path
        d="M-21 4 C-21 -4 21 -4 21 4 L24 49 L-24 49 Z"
        fill={`url(#${coatId})`}
        stroke="#182433"
        strokeWidth="1.5"
      />
      <polygon points="-7,-1 7,-1 0,14" fill="#F4EFE4" />
      <polygon points="-14,-1 -4,12 -18,16" fill="#2A405C" />
      <polygon points="14,-1 4,12 18,16" fill="#2A405C" />
      <line x1="-14" y1="0" x2="18" y2="44" stroke="#9C6644" strokeWidth="4.2" />
      <rect x="1" y="21" width="6" height="6" rx="1" fill="#D4A34A" />
      <rect x="-20" y="29" width="40" height="5" rx="2" fill="#6F472B" />

      {/* Back Arm Holding Glowing Brass Lantern */}
      <path
        d="M-18 6 L-27 30"
        stroke="#2B425E"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="-27" cy="34" r="4" fill="#E8B99B" />
      <g transform="translate(-27, 46)">
        <circle cx="0" cy="4" r="14" fill="#FBBF24" opacity="0.26" />
        <rect x="-5" y="-4" width="10" height="14" rx="2" fill="#FDE68A" stroke="#8C6223" strokeWidth="1.8" />
        <polygon points="-6,-4 6,-4 0,-9" fill="#5E4623" />
      </g>

      {/* Front Arm (Pointing at Violet or Resting) */}
      <path
        d={pointingRight ? 'M16 8 L58 24' : 'M16 8 L25 32'}
        stroke="#355070"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx={pointingRight ? 61 : 26} cy={pointingRight ? 25 : 34} r="4.2" fill="#E8B99B" />

      {/* Head, Ears & Expressive Facial Features */}
      <rect x="-6" y="-8" width="12" height="12" rx="4" fill="#D5A081" />
      <ellipse cx="-15" cy="-14" rx="3" ry="5" fill="#DDA989" />
      <ellipse cx="15" cy="-14" rx="3" ry="5" fill="#DDA989" />
      <path
        d="M-15 -26 C-15 -38 15 -38 15 -26 L14 -12 C13 -2 6 3 0 3 C-6 3 -13 -2 -14 -12 Z"
        fill="#F2C6A8"
      />
      {/* Hair & Traditional Peaked Cap */}
      <path d="M-16 -26 C-17 -41 16 -41 17 -26 L21 -23 L-16 -23 Z" fill="#232B38" />
      <rect x="-16" y="-27" width="32" height="4" rx="2" fill="#D4A34A" />
      {/* Brows, Whites of Eyes, Irises, Nose & Warm Smile */}
      <path d="M-9 -20 Q-5 -22 -1 -20 M3 -20 Q7 -22 10 -20" fill="none" stroke="#2D231F" strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="-5" cy="-15.5" rx="3" ry="2" fill="#FFFDF9" />
      <ellipse cx="6" cy="-15.5" rx="3" ry="2" fill="#FFFDF9" />
      <circle cx="-4.7" cy="-15.5" r="1.5" fill="#231B18" />
      <circle cx="6.3" cy="-15.5" r="1.5" fill="#231B18" />
      <path d="M1 -15 L2 -10 L0 -9" fill="none" stroke="#BD8364" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M-2 -5 Q3 -3 7 -6" fill="none" stroke="#9E5E44" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
};

/* 1. Authentic Animated 2D Dedaena Monument Matching User's Tbilisi Photo */
export const AnimatedMonumentScene: React.FC = () => {
  return (
    <svg
      viewBox="0 0 640 480"
      className="h-full w-full select-none"
      role="img"
      aria-label="ანიმაციური 2D ილუსტრაცია: დედაენის ძეგლი თბილისში"
    >
      <defs>
        <linearGradient id="skyMonument" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B506B" />
          <stop offset="52%" stopColor="#657B96" />
          <stop offset="100%" stopColor="#B8C4D4" />
        </linearGradient>
        <radialGradient id="monumentSunGlow" cx="50%" cy="46%" r="48%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.34" />
          <stop offset="60%" stopColor="#E2E8F0" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#3B506B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="plazaStone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B28379" />
          <stop offset="100%" stopColor="#755049" />
        </linearGradient>
        <linearGradient id="bronzeDark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3D3C37" />
          <stop offset="45%" stopColor="#5B5549" />
          <stop offset="100%" stopColor="#2B2B28" />
        </linearGradient>
        <linearGradient id="bronzePatina" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#585347" />
          <stop offset="72%" stopColor="#3E403A" />
          <stop offset="100%" stopColor="#2C4A42" />
        </linearGradient>
        <linearGradient id="bronzeRibbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C705E" />
          <stop offset="48%" stopColor="#4F4941" />
          <stop offset="100%" stopColor="#2E2D29" />
        </linearGradient>
      </defs>

      {/* Atmospheric Tbilisi Park Sky & Soft Daylight Halo Behind Sculpture */}
      <rect width="640" height="480" fill="url(#skyMonument)" />
      <rect width="640" height="480" fill="url(#monumentSunGlow)" />

      {/* Soft Drifting Clouds */}
      <g className="animate-cloud-drift" opacity="0.82">
        <path
          d="M52 86c0-13 11-23 24-23 7 0 13 3 17 7 5-10 15-16 28-16 17 0 31 13 31 29H52z"
          fill="#F1F5F9"
          opacity="0.48"
        />
        <path
          d="M440 72c0-11 10-20 22-20 6 0 11 2 15 6 5-8 13-13 23-13 15 0 26 11 26 25h-86z"
          fill="#F1F5F9"
          opacity="0.42"
        />
      </g>

      {/* Distant Tbilisi Horizon, Old Town Trees & Tiny Golden Cathedral Dome on Left (as in photo) */}
      <path d="M0 308 Q160 284 320 302 T640 292 L640 365 L0 365 Z" fill="#3B4F4A" opacity="0.72" />
      <g transform="translate(52, 286)" opacity="0.95">
        <rect x="-8" y="6" width="16" height="14" fill="#E2E8F0" />
        <polygon points="-7,6 0,-7 7,6" fill="#EAB308" />
        <line x1="0" y1="-7" x2="0" y2="-11" stroke="#FDE047" strokeWidth="1.2" />
      </g>

      {/* Park Lawn, Pathway & Trimmed Green Hedges */}
      <rect x="0" y="324" width="640" height="156" fill="#2A4435" />
      <path d="M0 336 Q135 322 225 344 L0 360 Z" fill="#1F392A" />
      <path d="M640 334 Q505 320 415 344 L640 360 Z" fill="#1F392A" />

      {/* Park Trees: Left Cypress & Bare/Early-Spring Trees, Right Tall Dark Pines */}
      <g className="animate-sway">
        <path d="M84 334 L96 244 L108 334 Z" fill="#1D382B" />
        <rect x="130" y="256" width="7" height="78" fill="#46382E" />
        <path d="M133 272 L118 250 M133 266 L150 245" stroke="#46382E" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="134" cy="248" rx="28" ry="22" fill="#5D7D62" opacity="0.55" />
      </g>
      <g className="animate-sway" style={{ animationDelay: '-1.8s' }}>
        <rect x="514" y="198" width="9" height="138" fill="#302721" />
        <rect x="556" y="186" width="10" height="150" fill="#302721" />
        <ellipse cx="518" cy="196" rx="38" ry="22" fill="#1C392C" />
        <ellipse cx="560" cy="182" rx="44" ry="25" fill="#173125" />
        <ellipse cx="540" cy="222" rx="36" ry="18" fill="#214333" />
      </g>

      {/* Wide Circular Reddish-Granite Stepped Plaza (Fully Visible Above Card Caption) */}
      <g transform="translate(320, 382)">
        <ellipse cx="0" cy="18" rx="260" ry="40" fill="#583A35" />
        <ellipse cx="0" cy="4" rx="250" ry="37" fill="url(#plazaStone)" stroke="#C89C92" strokeWidth="1.2" />
        {/* Radial Granite Seam Lines */}
        <path d="M-190 4 L-48 4 M48 4 L190 4 M-130 -18 L-34 0 M130 -18 L34 0" stroke="#8E6259" strokeWidth="1" opacity="0.45" />
        {/* Front Straight Step Cutout (matching photo) */}
        <rect x="-184" y="20" width="368" height="12" rx="2" fill="#896057" stroke="#BA8E84" strokeWidth="1" />
        <rect x="-196" y="31" width="392" height="11" rx="2" fill="#63423D" />
      </g>

      {/* THE DEDAENA MONUMENT (Matched to Tbilisi Reference Photo) */}
      <g transform="translate(320, 376) scale(0.95)">
        {/* Left V-Angled Layered Book-Slab Pillar */}
        <g>
          <polygon points="-58,0 -92,-242 -78,-248 -46,0" fill="#3E3C37" stroke="#5A554A" strokeWidth="0.8" />
          <polygon points="-48,0 -78,-260 -62,-264 -34,0" fill="#4E4940" stroke="#6E6658" strokeWidth="0.9" />
          <polygon points="-38,0 -62,-276 -26,-276 -14,0" fill="url(#bronzePatina)" stroke="#827868" strokeWidth="1.2" />
          {/* Rounded Upper Book-Page Tops & Carved Circular Medallion Indent */}
          <ellipse cx="-69" cy="-260" rx="9" ry="7" fill="#625B4E" />
          <ellipse cx="-44" cy="-276" rx="18" ry="8" fill="#70685A" />
          <circle cx="-54" cy="-108" r="7" fill="#2A2B27" opacity="0.7" />
          {/* Inner Vertical Page Spine Shadow */}
          <polygon points="-26,-276 -19,-274 -9,0 -14,0" fill="#222320" />
          <line x1="-22" y1="-266" x2="-11" y2="-10" stroke="#9B907E" strokeWidth="0.9" opacity="0.55" />
        </g>

        {/* Right V-Angled Layered Book-Slab Pillar */}
        <g>
          <polygon points="58,0 92,-242 78,-248 46,0" fill="#34332E" stroke="#504B42" strokeWidth="0.8" />
          <polygon points="48,0 78,-260 62,-264 34,0" fill="#454139" stroke="#625B4E" strokeWidth="0.9" />
          <polygon points="38,0 62,-276 26,-276 14,0" fill="url(#bronzePatina)" stroke="#7A7061" strokeWidth="1.2" />
          <ellipse cx="69" cy="-260" rx="9" ry="7" fill="#544E43" />
          <ellipse cx="44" cy="-276" rx="18" ry="8" fill="#635B4E" />
          <circle cx="54" cy="-108" r="7" fill="#262723" opacity="0.7" />
          <polygon points="26,-276 19,-274 9,0 14,0" fill="#1F201D" />
          <line x1="22" y1="-266" x2="11" y2="-10" stroke="#8C8271" strokeWidth="0.9" opacity="0.45" />
        </g>

        {/* Top Flowing 3D S-Curved Bronze Ribbon Crown */}
        <g>
          {/* Back Shaded Fold of the Sweeping Ribbon */}
          <path
            d="M-66 -278 C-76 -318 -38 -336 -16 -320 L-4 -320 C-36 -312 -52 -292 -42 -278 Z"
            fill="#272622"
          />
          <path
            d="M66 -278 C76 -318 38 -336 16 -320 L4 -320 C36 -312 52 -292 42 -278 Z"
            fill="#242320"
          />
          {/* Front Sculpted Bronze Ribbon */}
          <path
            d="M-68 -276 C-78 -314 -42 -334 -18 -318 C-6 -310 -8 -342 0 -354 C8 -342 6 -310 18 -318 C42 -334 78 -314 68 -276 C58 -260 32 -254 20 -268 C38 -274 52 -286 46 -302 C38 -314 14 -304 0 -318 C-14 -304 -38 -314 -46 -302 C-52 -286 -38 -274 -20 -268 C-32 -254 -58 -260 -68 -276 Z"
            fill="url(#bronzeRibbon)"
            stroke="#948772"
            strokeWidth="1.5"
          />
          {/* Central Top Finial Ridge */}
          <path
            d="M-7 -350 L0 -364 L7 -350 L5 -316 L-5 -316 Z"
            fill="#665D4E"
            stroke="#9A8D78"
            strokeWidth="1.1"
          />
        </g>

        {/* Hanging Swinging Bronze Bell Under Crown Peak */}
        <g transform="translate(0, -318)">
          <g className="animate-bell-swing">
            <line x1="0" y1="0" x2="0" y2="18" stroke="#ABA08C" strokeWidth="2.5" strokeDasharray="3 2" />
            <path
              d="M-9 36 C-9 22 -5 18 0 18 C5 18 9 22 9 36 L14 43 L-14 43 Z"
              fill="#635848"
              stroke="#A39580"
              strokeWidth="1.4"
            />
            <ellipse cx="0" cy="43" rx="14" ry="3.5" fill="#2E2A24" />
            <circle cx="0" cy="44" r="2.8" fill="#C4B297" />
            <line x1="0" y1="44" x2="-11" y2="155" stroke="#E2E8F0" strokeWidth="1" opacity="0.62" />
          </g>
        </g>

        {/* Central Suspended Bronze Youth Figure Sitting Cleanly Between Upper V-Pillars */}
        <g transform="translate(0, -184)">
          <g className="animate-float-slow">
            {/* Sculpted Left Raised Arm Reaching Pillar */}
            <path
              d="M-11 -22 Q-24 -28 -33 -46"
              fill="none"
              stroke="#524C41"
              strokeWidth="7.5"
              strokeLinecap="round"
            />
            <path
              d="M-33 -46 L-37 -55 M-33 -46 L-33 -56 M-33 -46 L-29 -55"
              stroke="#7A7060"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Sculpted Right Raised Arm Reaching Pillar */}
            <path
              d="M11 -22 Q24 -28 33 -46"
              fill="none"
              stroke="#524C41"
              strokeWidth="7.5"
              strokeLinecap="round"
            />
            <path
              d="M33 -46 L29 -55 M33 -46 L33 -56 M33 -46 L37 -55"
              stroke="#7A7060"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Tilted Head Looking Upward Toward the Bell */}
            <ellipse cx="0" cy="-35" rx="9" ry="10.2" fill="#5E5649" stroke="#8C8170" strokeWidth="1" />
            <path d="M-8.5 -37 C-9 -47 8 -49 10 -39 C5 -41 -4 -41 -8.5 -37 Z" fill="#3B3730" />

            {/* Sculpted Tunic Torso & Billowing Swirling Waist Drapery (distinctive in photo) */}
            <path
              d="M-12 -25 L12 -25 L11 4 L21 17 Q0 24 -20 17 L-11 4 Z"
              fill="url(#bronzeDark)"
              stroke="#857B6B"
              strokeWidth="1.2"
            />
            <path
              d="M-15 3 Q-4 11 16 1 M-17 10 Q0 17 18 9"
              fill="none"
              stroke="#9C907D"
              strokeWidth="2"
              opacity="0.85"
            />

            {/* Suspended Sculpted Legs, Rolled Tunic Cuffs & Bare Feet */}
            <path
              d="M-7 19 L-9 48 L-12 56 M7 19 L9 48 L12 56"
              fill="none"
              stroke="#4B463C"
              strokeWidth="6.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polygon points="-12,42 -5,42 -4,47 -13,47" fill="#3D3931" />
            <polygon points="5,42 12,42 13,47 4,47" fill="#3D3931" />
          </g>
        </g>
      </g>

      {/* Subtle Floating Georgian Letters Around Monument */}
      <g transform="translate(140, 140)">
        <g className="animate-float-slow">
          <circle cx="0" cy="0" r="18" fill="#18202C" opacity="0.88" stroke="#D4A34A" strokeWidth="1.5" />
          <text x="0" y="7" textAnchor="middle" fill="#F3C96B" fontSize="18" fontWeight="700" fontFamily="Noto Serif Georgian, serif">
            ა
          </text>
        </g>
      </g>
      <g transform="translate(500, 134)">
        <g className="animate-float-slow" style={{ animationDelay: '-1.6s' }}>
          <circle cx="0" cy="0" r="18" fill="#18202C" opacity="0.88" stroke="#A78BFA" strokeWidth="1.5" />
          <text x="0" y="7" textAnchor="middle" fill="#DDD6FE" fontSize="18" fontWeight="700" fontFamily="Noto Serif Georgian, serif">
            ია
          </text>
        </g>
      </g>
    </svg>
  );
};

/* 2. Realistic 2D Video-Game Storybook Illustrations for Biography */
export const AnimatedBiographyScene: React.FC<{ chapterIndex: number }> = ({
  chapterIndex,
}) => {
  return (
    <svg
      viewBox="0 0 420 500"
      className="h-full w-full select-none"
      role="img"
      aria-label={`ბიოგრაფიის ილუსტრაცია — თავი ${chapterIndex + 1}`}
    >
      {chapterIndex === 0 && (
        /* Chapter 1: Young Iakob in Variani Village — Lush Handcrafted Georgian Countryside */
        <g>
          <defs>
            <linearGradient id="varianiSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E354E" />
              <stop offset="65%" stopColor="#35587A" />
              <stop offset="100%" stopColor="#8CA4A8" />
            </linearGradient>
          </defs>
          <rect width="420" height="500" fill="url(#varianiSky)" />

          {/* Morning Sun & Warm Aura */}
          <circle cx="344" cy="88" r="56" fill="#F6C86E" opacity="0.16" />
          <circle cx="344" cy="88" r="32" fill="#F8D27C" opacity="0.92" />

          {/* Drifting Clouds */}
          <g className="animate-cloud-drift">
            <path d="M44 92c0-10 9-18 19-18 5 0 9 2 13 5 4-7 12-12 21-12 13 0 24 10 24 23H44z" fill="#E2EDF7" opacity="0.48" />
          </g>

          {/* Distant Kartli / Caucasus Mountain Peaks */}
          <polygon points="0,285 75,205 155,280 235,195 335,275 420,220 420,330 0,330" fill="#2A4259" />
          <polygon points="62,219 75,205 88,219 79,224 71,222" fill="#E2E8F0" opacity="0.65" />
          <polygon points="222,211 235,195 250,211 239,217 230,215" fill="#E2E8F0" opacity="0.65" />

          {/* Rolling Green Hills of Variani */}
          <path d="M0 302 Q130 248 265 288 T420 268 L420 500 L0 500 Z" fill="#264D3C" />
          <path d="M0 356 Q205 322 420 358 L420 500 L0 500 Z" fill="#2E614A" />

          {/* Traditional Kartli Village Stone House with Wooden Balcony on Hill */}
          <g transform="translate(295, 258)">
            <rect x="-46" y="14" width="92" height="54" rx="2" fill="#C9B99F" stroke="#786A56" strokeWidth="1.5" />
            <polygon points="-56,16 0,-18 56,16" fill="#8C3B2B" stroke="#5A2318" strokeWidth="1.5" />
            {/* Carved Wooden Balcony (აივანი) */}
            <rect x="-48" y="34" width="96" height="6" fill="#5D3E28" />
            <line x1="-38" y1="14" x2="-38" y2="34" stroke="#5D3E28" strokeWidth="3" />
            <line x1="0" y1="14" x2="0" y2="34" stroke="#5D3E28" strokeWidth="3" />
            <line x1="38" y1="14" x2="38" y2="34" stroke="#5D3E28" strokeWidth="3" />
            <rect x="-24" y="46" width="16" height="22" fill="#3E281A" />
            <rect x="12" y="20" width="14" height="12" fill="#FDE68A" opacity="0.8" />
          </g>

          {/* Mossy Dry-Stone Village Wall */}
          <g fill="#5C6473" stroke="#3D4450" strokeWidth="1">
            <rect x="0" y="352" width="44" height="26" rx="4" />
            <rect x="44" y="355" width="48" height="23" rx="4" />
            <rect x="92" y="352" width="46" height="26" rx="4" />
            <rect x="138" y="357" width="38" height="21" rx="4" />
          </g>

          {/* Detailed Layered Walnut Tree in Variani Courtyard */}
          <g className="animate-sway">
            <path d="M62 360 L66 205 L82 205 L88 360 Z" fill="#523422" />
            <path d="M74 245 L44 205 M76 232 L114 196" stroke="#523422" strokeWidth="7" strokeLinecap="round" />
            <ellipse cx="48" cy="186" rx="46" ry="38" fill="#2E6342" />
            <ellipse cx="104" cy="184" rx="46" ry="36" fill="#35704A" />
            <ellipse cx="76" cy="152" rx="52" ry="42" fill="#3F8256" />
            <ellipse cx="88" cy="144" rx="28" ry="22" fill="#549B6B" opacity="0.72" />
          </g>

          {/* Wild Purple Violets Beside the Path */}
          {[96, 134, 342].map((vx, i) => (
            <g key={i} transform={`translate(${vx}, 402)`}>
              <ellipse cx="-6" cy="4" rx="8" ry="4" fill="#1F4D37" />
              <circle cx="-4" cy="-2" r="4.5" fill="#A78BFA" />
              <circle cx="4" cy="-2" r="4.5" fill="#8B5CF6" />
              <circle cx="0" cy="-7" r="4.5" fill="#C4B5FD" />
              <circle cx="0" cy="-3" r="1.8" fill="#FDE047" />
            </g>
          ))}

          {/* Young Boy Iakob in Traditional Georgian Attire Reading Book */}
          <g transform="translate(245, 326)">
            <g className="animate-float-slow">
              <ellipse cx="0" cy="78" rx="22" ry="6" fill="#0B1117" opacity="0.45" />
              <rect x="-11" y="42" width="9" height="30" rx="4" fill="#1C2029" />
              <rect x="2" y="42" width="9" height="30" rx="4" fill="#1C2029" />
              <path d="M-14 70 L-1 70 L-1 77 L-16 77 Q-17 72 -14 70 Z" fill="#3B241A" />
              <path d="M1 70 L14 70 Q17 72 16 77 L1 77 Z" fill="#3B241A" />
              <path d="M-21 4 C-21 -4 21 -4 21 4 L25 50 L-25 50 Z" fill="#231D1C" stroke="#3E3330" strokeWidth="1.5" />
              <polygon points="-7,-1 7,-1 0,24" fill="#F4EFE4" />
              <rect x="-21" y="25" width="42" height="5" rx="2" fill="#8B2626" />
              <path d="M-19 8 L-22 32 M19 8 L22 32" stroke="#231D1C" strokeWidth="7.5" strokeLinecap="round" />
              <rect x="-6" y="-8" width="12" height="12" rx="4" fill="#D5A081" />
              <path d="M-15 -26 C-15 -38 15 -38 15 -26 L14 -11 C13 -1 6 4 0 4 C-6 4 -13 -1 -14 -11 Z" fill="#F0C5A7" />
              <path d="M-16 -24 C-17 -41 17 -41 16 -24 C11 -31 4 -30 0 -29 C-5 -30 -11 -31 -16 -24 Z" fill="#261F1E" />
              <path d="M-9 -19 L-3 -19 M3 -19 L9 -19" stroke="#261F1E" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="-5.5" cy="-15" r="1.8" fill="#261A17" />
              <circle cx="5.5" cy="-15" r="1.8" fill="#261A17" />
              <path d="M0 -15 L0.5 -9" stroke="#B97F60" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M-3 -5 Q0 -3 3 -5" fill="none" stroke="#9B5E47" strokeWidth="1.5" strokeLinecap="round" />
              <path
                d="M-24 24 Q-12 18 0 26 Q12 18 24 24 L24 44 Q12 38 0 46 Q-12 38 -24 44 Z"
                fill="#FDF6E3"
                stroke="#8B5A2B"
                strokeWidth="2"
              />
              <line x1="-18" y1="31" x2="-5" y2="31" stroke="#A68B6B" strokeWidth="1.3" />
              <line x1="-18" y1="36" x2="-7" y2="36" stroke="#A68B6B" strokeWidth="1.3" />
              <line x1="6" y1="31" x2="18" y2="31" stroke="#A68B6B" strokeWidth="1.3" />
              <line x1="6" y1="36" x2="16" y2="36" stroke="#A68B6B" strokeWidth="1.3" />
              <circle cx="-23" cy="33" r="4" fill="#E8B99B" />
              <circle cx="23" cy="33" r="4" fill="#E8B99B" />
            </g>
          </g>
        </g>
      )}

      {chapterIndex === 1 && (
        /* Chapter 2: Detailed Realistic Iakob at Desk Writing "აი ია" */
        <g>
          <defs>
            <radialGradient id="studyWarmLamp" cx="46%" cy="56%" r="54%">
              <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1D2430" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="420" height="500" fill="#1D2430" />
          <rect width="420" height="500" fill="url(#studyWarmLamp)" />

          {/* Library Bookshelf Backdrop */}
          <rect x="24" y="42" width="136" height="230" rx="6" fill="#2B211B" stroke="#4D372A" strokeWidth="4" />
          <rect x="34" y="64" width="116" height="44" fill="#1E1713" />
          <rect x="40" y="70" width="14" height="36" fill="#8B2626" />
          <rect x="57" y="74" width="12" height="32" fill="#355070" />
          <rect x="72" y="68" width="15" height="38" fill="#5C4033" />
          <rect x="91" y="72" width="13" height="34" fill="#2D5A43" />
          <rect x="108" y="69" width="14" height="37" fill="#7C532E" />
          <rect x="34" y="122" width="116" height="44" fill="#1E1713" />
          <rect x="42" y="128" width="16" height="36" fill="#5C4033" />
          <rect x="61" y="132" width="14" height="32" fill="#8B2626" />
          <rect x="78" y="126" width="14" height="38" fill="#4B5563" />
          <rect x="96" y="130" width="15" height="34" fill="#2D5A43" />
          <rect x="34" y="180" width="116" height="44" fill="#1E1713" />
          <rect x="44" y="186" width="15" height="36" fill="#2D5A43" />
          <rect x="62" y="190" width="16" height="32" fill="#355070" />
          <rect x="82" y="185" width="14" height="37" fill="#8B2626" />

          {/* Warm Window */}
          <rect x="260" y="48" width="124" height="148" rx="8" fill="#2E4466" stroke="#5A4230" strokeWidth="7" />
          <line x1="322" y1="48" x2="322" y2="196" stroke="#5A4230" strokeWidth="4" />
          <line x1="260" y1="122" x2="384" y2="122" stroke="#5A4230" strokeWidth="4" />
          <circle cx="348" cy="86" r="16" fill="#F6C86E" opacity="0.88" />

          {/* Realistic 2D Iakob Gogebashvili Portrait Figure */}
          <g transform="translate(210, 232)">
            <DetailedIakobFigure />
          </g>

          {/* Mahogany Desk */}
          <rect x="24" y="348" width="372" height="152" rx="8" fill="#593822" />
          <rect x="24" y="348" width="372" height="16" rx="4" fill="#784E32" />

          {/* Brass Inkwell & Feather Quill */}
          <g transform="translate(76, 336)">
            <rect x="-10" y="0" width="20" height="14" rx="3" fill="#B5893A" stroke="#F3C96B" strokeWidth="1" />
            <path d="M2 2 Q16 -24 28 -32 Q22 -14 4 2 Z" fill="#F5F1E8" opacity="0.92" />
          </g>

          {/* Open Dedaena Primer */}
          <g transform="translate(175, 322)">
            <g className="animate-float-slow">
              <path d="M-72 0 Q-36 -12 0 4 Q36 -12 72 0 L72 52 Q36 40 0 56 Q-36 40 -72 52 Z" fill="#FDF6E3" stroke="#8B2626" strokeWidth="3.5" />
              <line x1="0" y1="4" x2="0" y2="56" stroke="#C28E42" strokeWidth="2.5" />
              <text x="-35" y="32" textAnchor="middle" fill="#6D28D9" fontSize="18" fontWeight="700" fontFamily="Noto Serif Georgian, serif">აი</text>
              <text x="35" y="32" textAnchor="middle" fill="#6D28D9" fontSize="18" fontWeight="700" fontFamily="Noto Serif Georgian, serif">ია</text>
            </g>
          </g>

          {/* Violet in Terracotta Pot */}
          <g transform="translate(332, 316)">
            <polygon points="-18,16 18,16 13,48 -13,48" fill="#B6603F" />
            <ellipse cx="-10" cy="4" rx="12" ry="6" fill="#2E6346" />
            <ellipse cx="10" cy="4" rx="12" ry="6" fill="#3B7A57" />
            <circle cx="-6" cy="-8" r="7.5" fill="#A78BFA" />
            <circle cx="8" cy="-9" r="7.5" fill="#8B5CF6" />
            <circle cx="1" cy="-16" r="7.5" fill="#C4B5FD" />
            <circle cx="1" cy="-10" r="3" fill="#FDE047" />
          </g>
        </g>
      )}

      {chapterIndex === 2 && (
        /* Chapter 3: Iakob Teaching in Georgian Schoolyard & Heritage Letters */
        <g>
          <defs>
            <linearGradient id="schoolSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1B2A40" />
              <stop offset="100%" stopColor="#2F4663" />
            </linearGradient>
          </defs>
          <rect width="420" height="500" fill="url(#schoolSky)" />
          <path d="M0 325 Q140 278 280 315 T420 295 L420 500 L0 500 Z" fill="#274A39" />
          <path d="M0 375 Q210 342 420 375 L420 500 L0 500 Z" fill="#315C47" />

          {/* Carved Georgian Schoolhouse Arch & Leafy Courtyard Branch */}
          <path d="M0 190 L55 190 L55 340 L0 340 Z" fill="#3C4654" opacity="0.55" />
          <rect x="6" y="210" width="38" height="20" rx="2" fill="#2B3340" opacity="0.65" />
          <g className="animate-sway">
            <ellipse cx="42" cy="54" rx="58" ry="30" fill="#28543C" opacity="0.85" />
            <ellipse cx="96" cy="42" rx="44" ry="22" fill="#32694B" opacity="0.78" />
          </g>

          {[
            { ch: 'ა', x: 82, y: 112, color: '#F3C96B', d: '0s' },
            { ch: 'ბ', x: 168, y: 78, color: '#A78BFA', d: '-1s' },
            { ch: 'გ', x: 266, y: 102, color: '#6EE7B7', d: '-2s' },
            { ch: 'დ', x: 348, y: 148, color: '#F9A8D4', d: '-0.6s' },
          ].map((l) => (
            <g key={l.ch} transform={`translate(${l.x}, ${l.y})`}>
              <g className="animate-float-slow" style={{ animationDelay: l.d }}>
                <circle cx="0" cy="0" r="24" fill="#182232" stroke={l.color} strokeWidth="2.2" />
                <circle cx="0" cy="0" r="19" fill="none" stroke={l.color} strokeWidth="0.8" opacity="0.45" />
                <text x="0" y="7" textAnchor="middle" fill={l.color} fontSize="20" fontWeight="700" fontFamily="Noto Serif Georgian, serif">
                  {l.ch}
                </text>
              </g>
            </g>
          ))}

          <g transform="translate(152, 260) scale(0.9)">
            <DetailedIakobFigure />
          </g>
          {/* Wooden Georgian Schoolhouse Lectern / Desk Covering Waist Naturally */}
          <g transform="translate(152, 344)">
            <rect x="-66" y="18" width="132" height="58" rx="4" fill="#634028" stroke="#3D2616" strokeWidth="2" />
            <rect x="-74" y="4" width="148" height="16" rx="4" fill="#7D5233" stroke="#472D1B" strokeWidth="2" />
            <rect x="-56" y="28" width="112" height="38" rx="2" fill="none" stroke="#8C5D3B" strokeWidth="1.5" opacity="0.55" />
            {/* Open Slate / Dedaena Primer on Lectern */}
            <polygon points="-38,6 10,-6 18,12 -30,22" fill="#FDF6E3" stroke="#8B2626" strokeWidth="2" />
            <text x="-12" y="11" textAnchor="middle" fill="#6D28D9" fontSize="9.5" fontWeight="700" fontFamily="Noto Serif Georgian, serif">
              აი-ია
            </text>
            {/* Brass Inkwell */}
            <rect x="30" y="-4" width="14" height="10" rx="2" fill="#D4A34A" stroke="#78350F" strokeWidth="1.2" />
          </g>
          <g transform="translate(292, 318)">
            <DetailedTravelerFigure />
          </g>
        </g>
      )}

      {chapterIndex === 3 && (
        /* Chapter 4: Mtatsminda Starry Night, Tbilisi Valley & Eternal Dedaena */
        <g>
          <rect width="420" height="500" fill="#121A2A" />
          {[
            [68, 72],
            [140, 48],
            [260, 62],
            [350, 88],
            [310, 145],
            [95, 152],
            [215, 36],
            [42, 134],
          ].map(([cx, cy], idx) => (
            <circle key={idx} cx={cx} cy={cy} r="2.1" fill="#FDE68A" opacity="0.85" />
          ))}

          <path d="M0 325 Q160 225 290 270 L420 315 L420 500 L0 500 Z" fill="#1B2838" />
          {/* Warm Distant Tbilisi Evening Lights Along Kura Valley */}
          {[56, 84, 118, 154, 268, 304, 342, 378].map((lx, i) => (
            <circle key={i} cx={lx} cy={312 + (i % 3) * 7} r="1.9" fill="#FBBF24" opacity="0.65" />
          ))}
          <path d="M0 375 Q210 340 420 375 L420 500 L0 500 Z" fill="#213E33" />

          <g transform="translate(210, 195)">
            <g className="animate-float-slow">
              <circle cx="0" cy="0" r="74" fill="#D4A34A" opacity="0.16" />
              <rect x="-42" y="-52" width="84" height="104" rx="10" fill="#8C2D2D" stroke="#F3C96B" strokeWidth="3" />
              <rect x="-32" y="-42" width="64" height="84" rx="5" fill="none" stroke="#F3C96B" strokeWidth="1.5" opacity="0.75" />
              <polygon points="16,52 24,52 24,68 20,62 16,68" fill="#D4A34A" />
              <text x="0" y="-4" textAnchor="middle" fill="#F3C96B" fontSize="16" fontWeight="700" fontFamily="Noto Serif Georgian, serif">
                დედა
              </text>
              <text x="0" y="22" textAnchor="middle" fill="#F3C96B" fontSize="16" fontWeight="700" fontFamily="Noto Serif Georgian, serif">
                ენა
              </text>
            </g>
          </g>

          {[140, 210, 280].map((vx, idx) => (
            <g key={idx} transform={`translate(${vx}, 402)`}>
              <ellipse cx="-10" cy="4" rx="9" ry="5" fill="#1F513B" />
              <ellipse cx="10" cy="4" rx="9" ry="5" fill="#2A6B4D" />
              <circle cx="-6" cy="0" r="6" fill="#A78BFA" />
              <circle cx="6" cy="0" r="6" fill="#8B5CF6" />
              <circle cx="0" cy="-8" r="6" fill="#C4B5FD" />
              <circle cx="0" cy="-2" r="2.8" fill="#FDE047" />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
};

/* 3. Quiz Scholar Companion (Detailed 2D Game Portrait Badge) */
export const AnimatedQuizCompanion: React.FC<{
  mood: 'idle' | 'happy' | 'encourage';
}> = ({ mood }) => {
  return (
    <div
      className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-[#D4A34A]/35 bg-[#141921] p-1 ${
        mood === 'happy' ? 'animate-hop-cheer' : 'animate-float-slow'
      }`}
    >
      <svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden="true">
        <g transform="translate(48, 50) scale(0.68)">
          <DetailedIakobFigure />
        </g>
        {mood === 'happy' && (
          <g fill="#FDE047">
            <circle cx="14" cy="18" r="3" />
            <circle cx="82" cy="18" r="3" />
            <circle cx="48" cy="10" r="2.5" />
          </g>
        )}
      </svg>
    </div>
  );
};

/* 4. Realistic 2D Video-Game Mtatsminda Grave Cut-Scene */
export const AnimatedGraveScene: React.FC<{
  step: 'point_violet' | 'say_ai_ia' | 'spirit_rises' | 'dedaena_gift' | 'dedaena_story';
  onVioletClick?: () => void;
}> = ({ step, onVioletClick }) => {
  const showSpirit =
    step === 'spirit_rises' || step === 'dedaena_gift' || step === 'dedaena_story';

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#131B29]">
      <svg
        viewBox="0 0 640 400"
        className="h-full w-full select-none"
        role="img"
        aria-label="ანიმაციური 2D ვიდეო-თამაშის სცენა მთაწმინდაზე: იაკობის საფლავი, ია და სულის გამოჩენა"
      >
        <defs>
          <linearGradient id="mtNight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#101726" />
            <stop offset="68%" stopColor="#222E46" />
            <stop offset="100%" stopColor="#3B425E" />
          </linearGradient>
          <radialGradient id="spiritHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.54" />
            <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="640" height="400" fill="url(#mtNight)" />
        {[
          [60, 55],
          [145, 42],
          [240, 70],
          [370, 38],
          [490, 62],
          [575, 48],
          [530, 112],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill="#FEF08A" opacity="0.82" />
        ))}

        <path d="M0 250 Q180 185 360 225 T640 205 L640 320 L0 320 Z" fill="#1B2434" />
        {[120, 150, 195, 225, 250, 480, 515, 550].map((lx, idx) => (
          <circle key={idx} cx={lx} cy={255 + (idx % 3) * 8} r="2" fill="#FBBF24" opacity="0.65" />
        ))}

        {/* Mtatsminda Terrace */}
        <path d="M0 285 Q320 255 640 285 L640 400 L0 400 Z" fill="#1F3B2F" />

        <g className="animate-sway">
          <path d="M58 295 L82 142 L106 295 Z" fill="#152C23" />
          <path d="M532 292 L556 132 L580 292 Z" fill="#152C23" />
        </g>

        {/* Stone Lantern */}
        <g transform="translate(514, 264)">
          <rect x="-8" y="22" width="16" height="32" rx="3" fill="#4B5563" />
          <rect x="-10" y="0" width="20" height="24" rx="4" fill="#FDE68A" stroke="#78350F" strokeWidth="2.5" />
          <circle cx="0" cy="12" r="30" fill="#FBBF24" opacity="0.24" />
        </g>

        {/* Iakob Gogebashvili's Textured Carved Stone Grave with Georgian Cross Relief */}
        <g transform="translate(390, 292)">
          <rect x="-82" y="26" width="164" height="22" rx="4" fill="#5D6675" stroke="#3D4450" strokeWidth="1.2" />
          <line x1="-42" y1="26" x2="-42" y2="48" stroke="#424A57" strokeWidth="1.2" />
          <line x1="42" y1="26" x2="42" y2="48" stroke="#424A57" strokeWidth="1.2" />
          <rect x="-66" y="8" width="132" height="20" rx="3" fill="#747E8F" stroke="#4A5260" strokeWidth="1.2" />
          <rect x="-15" y="-92" width="30" height="102" rx="3" fill="#8B95A6" stroke="#525B69" strokeWidth="1.6" />
          <rect x="-39" y="-72" width="78" height="24" rx="3" fill="#8B95A6" stroke="#525B69" strokeWidth="1.6" />
          <circle cx="0" cy="-60" r="9.5" fill="none" stroke="#525B69" strokeWidth="1.6" />
          <path d="M-5 -60 L5 -60 M0 -65 L0 -55" stroke="#D4A34A" strokeWidth="1.6" opacity="0.85" />
          <line x1="-15" y1="-28" x2="15" y2="-28" stroke="#646E80" strokeWidth="1" />
        </g>

        {/* Blooming Purple Violet ("ია") on the Grave */}
        <g
          transform="translate(390, 326)"
          className={onVioletClick ? 'cursor-pointer' : ''}
          onClick={onVioletClick}
        >
          <circle cx="0" cy="-12" r="28" fill="#A78BFA" opacity={step === 'point_violet' ? 0.36 : 0.2} />
          <ellipse cx="-14" cy="-2" rx="13" ry="7" fill="#34D399" transform="rotate(-18 -14 -2)" />
          <ellipse cx="14" cy="-2" rx="13" ry="7" fill="#10B981" transform="rotate(18 14 -2)" />
          <line x1="0" y1="2" x2="0" y2="-16" stroke="#34D399" strokeWidth="3" />
          <circle cx="-9" cy="-18" r="8" fill="#A78BFA" />
          <circle cx="9" cy="-18" r="8" fill="#8B5CF6" />
          <circle cx="-6" cy="-28" r="8" fill="#C4B5FD" />
          <circle cx="6" cy="-28" r="8" fill="#A78BFA" />
          <circle cx="0" cy="-12" r="7" fill="#7C3AED" />
          <circle cx="0" cy="-20" r="3.5" fill="#FDE047" />
        </g>

        {/* Realistic 2D Traveler Protagonist Standing Beside Grave */}
        <g transform="translate(222, 272)">
          <DetailedTravelerFigure
            pointingRight={step === 'point_violet' || step === 'say_ai_ia'}
          />
        </g>

        {/* "აი-ია!" Speech Bubble */}
        {step === 'say_ai_ia' && (
          <g transform="translate(222, 185)">
            <g className="animate-spirit-rise">
              <rect x="-64" y="-32" width="128" height="52" rx="18" fill="#FFFDF7" stroke="#8B5CF6" strokeWidth="3" />
              <polygon points="-10,20 8,20 -2,36" fill="#FFFDF7" />
              <text x="0" y="2" textAnchor="middle" fill="#5B21B6" fontSize="24" fontWeight="700" fontFamily="Noto Serif Georgian, serif">
                აი-ია!
              </text>
            </g>
          </g>
        )}

        {/* Rising Dignified Realistic 2D Spirit of Iakob Gogebashvili */}
        {showSpirit && (
          <g transform="translate(390, 128)">
            <g className="animate-spirit-rise">
              <circle cx="0" cy="18" r="96" fill="url(#spiritHalo)" />
              <g transform="scale(0.88)">
                <DetailedIakobFigure
                  spiritMode
                  holdingBook={step === 'dedaena_gift' || step === 'dedaena_story'}
                />
              </g>
            </g>
          </g>
        )}
      </svg>

      {step === 'point_violet' && onVioletClick && (
        <button
          type="button"
          onClick={onVioletClick}
          aria-label="მიანიშნე თითი საფლავზე ამოსულ იაზე"
          className="animate-float-slow absolute bottom-[16%] left-[61%] -translate-x-1/2 rounded-xl border border-[#A78BFA] bg-[#12161C]/92 px-3 py-1.5 text-xs font-semibold text-[#DDD6FE] shadow-lg transition-transform hover:scale-105"
        >
          მიანიშნე იას ↓
        </button>
      )}
    </div>
  );
};

/* 5. Illustrated "Dedaena" Gift Book */
export const AnimatedDedaenaBook: React.FC = () => {
  return (
    <svg
      viewBox="0 0 320 220"
      className="h-full w-full select-none"
      role="img"
      aria-label="ილუსტრაცია: იაკობ გოგებაშვილის წიგნი დედა ენა იასთან ერთად"
    >
      <rect width="320" height="220" rx="12" fill="#1B222D" />
      <circle cx="160" cy="110" r="82" fill="#D4A34A" opacity="0.12" />
      <rect x="0" y="162" width="320" height="58" fill="#5C3D26" />
      <g transform="translate(150, 102)">
        <g className="animate-float-slow">
          <rect x="-56" y="-66" width="112" height="132" rx="10" fill="#8B2626" stroke="#F3C96B" strokeWidth="3.5" />
          <rect x="-44" y="-54" width="88" height="108" rx="4" fill="none" stroke="#F3C96B" strokeWidth="1.5" opacity="0.8" />
          <text x="0" y="-10" textAnchor="middle" fill="#F3C96B" fontSize="20" fontWeight="700" fontFamily="Noto Serif Georgian, serif">
            დედა
          </text>
          <text x="0" y="18" textAnchor="middle" fill="#F3C96B" fontSize="20" fontWeight="700" fontFamily="Noto Serif Georgian, serif">
            ენა
          </text>
          <text x="0" y="44" textAnchor="middle" fill="#FDE68A" fontSize="11" fontFamily="Noto Sans Georgian, sans-serif">
            1876
          </text>
        </g>
      </g>
      <g transform="translate(242, 166)">
        <ellipse cx="-10" cy="4" rx="10" ry="5" fill="#34D399" />
        <circle cx="-5" cy="-4" r="6.5" fill="#A78BFA" />
        <circle cx="6" cy="-4" r="6.5" fill="#8B5CF6" />
        <circle cx="0" cy="-11" r="6.5" fill="#C4B5FD" />
        <circle cx="0" cy="-5" r="2.8" fill="#FDE047" />
      </g>
    </svg>
  );
};
