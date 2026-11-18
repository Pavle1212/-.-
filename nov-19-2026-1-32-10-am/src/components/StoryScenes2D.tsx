import React from 'react';
import { StoryBlank, StorySceneData } from '../data/gogebashviliStoriesData';

interface AnimatedStorySceneProps {
  story: StorySceneData;
  discoveredClues: Record<string, boolean>;
  fixedBlanks: Record<string, string>;
  restored: boolean;
  onDiscoverClue: (blankId: string) => void;
}

export const AnimatedStoryScene: React.FC<AnimatedStorySceneProps> = ({
  story,
  discoveredClues,
  fixedBlanks,
  restored,
  onDiscoverClue,
}) => {
  const uid = React.useId().replace(/:/g, '');

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#131B29]">
      <svg
        viewBox="0 0 560 400"
        className="h-full w-full select-none"
        role="img"
        aria-label={`ილუსტრირებული 2D სცენა: ${story.title}`}
      >
        {story.slug === 'iavnana' && (
          /* Story 1: "იავნანამ რა ჰქნა?" — Kakhetian Courtyard, Cradle, Pomegranate & Mother's Lullaby */
          <g>
            <defs>
              <linearGradient id={`iavSky_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={restored ? '#1E324F' : '#162033'} />
                <stop offset="100%" stopColor={restored ? '#3C5470' : '#26344B'} />
              </linearGradient>
            </defs>
            <rect width="560" height="400" fill={`url(#iavSky_${uid})`} />

            {/* Warm Sunset / Moon & Kakheti Foothills */}
            <circle cx="468" cy="72" r={restored ? 36 : 28} fill="#F3C96B" opacity={restored ? 0.34 : 0.18} />
            <circle cx="468" cy="72" r="22" fill="#FDE68A" opacity="0.9" />
            <path d="M0 245 Q130 185 270 220 T560 205 L560 305 L0 305 Z" fill="#1C2E36" />
            <path d="M0 278 Q280 250 560 278 L560 400 L0 400 Z" fill="#274E3B" />

            {/* Traditional Georgian House Balcony & Pergola */}
            <rect x="28" y="138" width="170" height="156" rx="4" fill="#B58E63" stroke="#6E4E2E" strokeWidth="2.5" />
            <polygon points="14,142 113,82 212,142" fill="#7D3228" stroke="#4D1C16" strokeWidth="2.5" />
            <rect x="34" y="182" width="158" height="12" fill="#634026" />
            {/* Carved Wooden Balcony Pillars */}
            {[48, 86, 128, 168].map((px) => (
              <line key={px} x1={px} y1="142" x2={px} y2="294" stroke="#5E3A20" strokeWidth="5" />
            ))}
            <rect x="78" y="218" width="54" height="76" rx="4" fill="#462A17" />
            <rect x="142" y="210" width="32" height="32" rx="3" fill="#FDE68A" opacity="0.72" />

            {/* Pomegranate Tree & Hanging Blossoms */}
            <g transform="translate(310, 268)">
              <rect x="-10" y="-130" width="20" height="145" rx="5" fill="#593B25" />
              <g className="animate-sway">
                <circle cx="-26" cy="-148" r="38" fill="#2A5E3E" />
                <circle cx="24" cy="-142" r="34" fill="#326D49" />
                <circle cx="0" cy="-174" r="40" fill="#2D6644" />
                <circle cx="-18" cy="-136" r="6" fill="#E11D48" />
                <circle cx="20" cy="-152" r="5.5" fill="#E11D48" />
                <circle cx="6" cy="-128" r="5" fill="#F43F5E" />
              </g>
            </g>

            {/* Vine Trellis Right */}
            <g transform="translate(442, 168)">
              <path d="M-40 130 L-40 0 L80 0" fill="none" stroke="#684326" strokeWidth="6" />
              <ellipse cx="0" cy="4" rx="54" ry="20" fill="#2E6B47" />
              <circle cx="-12" cy="18" r="5" fill="#7C3AED" />
              <circle cx="-4" cy="23" r="5" fill="#8B5CF6" />
              <circle cx="28" cy="16" r="5" fill="#7C3AED" />
            </g>

            {/* Wooden Georgian Cradle ("აკვანი") & Mother / Little Keto */}
            <g transform="translate(154, 308)">
              <path d="M-38 22 Q0 32 38 22" fill="none" stroke="#6E4427" strokeWidth="4.5" />
              <rect x="-34" y="-8" width="68" height="28" rx="6" fill="#8C5935" stroke="#4D2E18" strokeWidth="2" />
              <rect x="-26" y="-4" width="52" height="16" rx="3" fill="#B91C1C" opacity="0.82" />
              <circle cx="-14" cy="-6" r="8.5" fill="#F5CFB0" />
            </g>

            {/* Mother in Traditional Georgian Dress Singing */}
            <g transform="translate(244, 286)">
              <path d="M-20 56 L-12 0 L12 0 L22 56 Z" fill="#6D28D9" stroke="#C4B5FD" strokeWidth="1.5" />
              <path d="M-7 0 L7 0 L4 34 L-4 34 Z" fill="#F8F5EE" />
              <circle cx="0" cy="-16" r="13" fill="#F3CBB0" />
              <path d="M-14 -16 Q0 -36 14 -16 Q16 -2 10 8 L-10 8 Q-16 -2 -14 -16 Z" fill="#2A1F1D" />
              <path d="M-15 -14 Q0 -38 15 -14" fill="none" stroke="#F4EFE4" strokeWidth="3.5" />
              <circle cx="-4.5" cy="-17" r="1.5" fill="#1F1A18" />
              <circle cx="4.5" cy="-17" r="1.5" fill="#1F1A18" />
              <path d="M-3 -10 Q0 -8 3 -10" fill="none" stroke="#7F1D1D" strokeWidth="1.3" />
            </g>

            {/* Golden Lullaby Notes (Intensify as Blanks Are Fixed) */}
            {(restored || Object.keys(fixedBlanks).length > 0) && (
              <g fill="#FDE047" opacity={restored ? 0.95 : 0.55}>
                <text x="195" y="218" fontSize="22" className="animate-float-slow">♪</text>
                <text x="235" y="182" fontSize="20" className="animate-float-slow">♫</text>
                <text x="275" y="210" fontSize="18" className="animate-float-slow">♪</text>
              </g>
            )}
          </g>
        )}

        {story.slug === 'erekle' && (
          /* Story 2: "ერეკლე მეფე და ინგილო ქალი" — Stone Bridge, River, King Erekle & Ingilo Girl */
          <g>
            <defs>
              <linearGradient id={`ereSky_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={restored ? '#1A3454' : '#182438'} />
                <stop offset="100%" stopColor={restored ? '#466D8F' : '#2C415C'} />
              </linearGradient>
              <linearGradient id={`river_${uid}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1D4E6B" />
                <stop offset="50%" stopColor="#2B6F94" />
                <stop offset="100%" stopColor="#1D4E6B" />
              </linearGradient>
            </defs>
            <rect width="560" height="400" fill={`url(#ereSky_${uid})`} />

            {/* Caucasus Mountains & Alazani Fortress */}
            <polygon points="20,230 135,105 250,230" fill="#2A394C" />
            <polygon points="105,138 135,105 165,138 148,146 135,132 120,146" fill="#E5EBF2" opacity="0.82" />
            <polygon points="340,230 455,112 560,230" fill="#233245" />
            <circle cx="486" cy="76" r={restored ? 38 : 24} fill="#FDE047" opacity={restored ? 0.35 : 0.16} />
            <circle cx="486" cy="76" r="20" fill="#FDE68A" />

            {/* Distant Stone Tower */}
            <g transform="translate(295, 132)">
              <rect x="-18" y="0" width="36" height="92" fill="#647080" stroke="#3F4854" strokeWidth="1.5" />
              <rect x="-22" y="-10" width="12" height="10" fill="#647080" />
              <rect x="-4" y="-10" width="12" height="10" fill="#647080" />
              <rect x="14" y="-10" width="10" height="10" fill="#647080" />
            </g>

            {/* River & Arched Georgian Stone Bridge */}
            <path d="M0 245 Q280 220 560 245 L560 400 L0 400 Z" fill="#29523D" />
            <path d="M0 295 Q280 272 560 305 L560 365 Q280 335 0 360 Z" fill={`url(#river_${uid})`} />
            <path d="M60 286 Q200 226 340 286 L340 310 Q200 258 60 310 Z" fill="#7D8796" stroke="#47505E" strokeWidth="2" />
            <path d="M72 276 Q200 218 328 276" fill="none" stroke="#9AA4B3" strokeWidth="4" />

            {/* King Erekle II on Chestnut Horse */}
            <g transform="translate(178, 232)">
              {/* Horse */}
              <ellipse cx="0" cy="14" rx="34" ry="16" fill="#6E3B23" />
              <path d="M20 6 Q34 -14 42 -8 L36 10 Z" fill="#6E3B23" />
              <line x1="-22" y1="26" x2="-24" y2="54" stroke="#532B19" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="-8" y1="26" x2="-6" y2="54" stroke="#532B19" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="14" y1="26" x2="18" y2="54" stroke="#532B19" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="26" y1="26" x2="32" y2="50" stroke="#532B19" strokeWidth="5.5" strokeLinecap="round" />
              {/* King Chokha & Papakha Crown */}
              <path d="M-12 -18 L12 -18 L16 14 L-16 14 Z" fill="#8B1E24" stroke="#F3C96B" strokeWidth="1.4" />
              <circle cx="0" cy="-30" r="11" fill="#F2C8AA" />
              <path d="M-10 -24 Q0 -16 10 -24" fill="#3B312E" />
              <rect x="-12" y="-44" width="24" height="11" rx="3" fill="#2A2422" />
              <path d="M-6 -44 L0 -50 L6 -44" fill="#F3C96B" />
            </g>

            {/* Brave Ingilo Girl on Riverbank */}
            <g transform="translate(420, 272)">
              <path d="M-16 54 L-10 2 L10 2 L16 54 Z" fill="#2563EB" stroke="#93C5FD" strokeWidth="1.4" />
              <rect x="-10" y="2" width="20" height="22" rx="3" fill="#B91C1C" />
              <circle cx="0" cy="-12" r="11.5" fill="#F5D0B5" />
              <path d="M-12 -14 Q0 -28 12 -14" fill="#2D221E" />
              <circle cx="-4" cy="-12" r="1.5" fill="#1F1A18" />
              <circle cx="4" cy="-12" r="1.5" fill="#1F1A18" />
              <path d="M-3 -7 Q0 -5 3 -7" fill="none" stroke="#991B1B" strokeWidth="1.2" />
              {/* Woven Basket */}
              <polygon points="-24,24 -10,24 -12,38 -22,38" fill="#C28E42" stroke="#78350F" strokeWidth="1.2" />
            </g>

            {restored && (
              <g fill="#FDE047" opacity="0.85">
                <circle cx="310" cy="242" r="3" />
                <circle cx="348" cy="236" r="2.5" />
                <circle cx="386" cy="248" r="3" />
              </g>
            )}
          </g>
        )}

        {story.slug === 'friends' && (
          /* Story 3: "ორი ამხანაგი" — Deep Oak Forest, Friend on Branch, Friend on Mossy Ground & Bear */
          <g>
            <defs>
              <linearGradient id={`forSky_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={restored ? '#182C2B' : '#121E22'} />
                <stop offset="100%" stopColor={restored ? '#2B4C3E' : '#1D332D'} />
              </linearGradient>
            </defs>
            <rect width="560" height="400" fill={`url(#forSky_${uid})`} />

            {/* Forest Depth Silhouettes */}
            {[45, 165, 315, 470, 520].map((tx, i) => (
              <g key={i} transform={`translate(${tx}, 235)`} opacity="0.55">
                <rect x="-8" y="-130" width="16" height="150" fill="#2A1D16" />
                <circle cx="0" cy="-142" r="42" fill="#193B2C" />
              </g>
            ))}

            <path d="M0 268 Q280 242 560 272 L560 400 L0 400 Z" fill="#224635" />
            <path d="M120 330 Q280 305 490 345 L490 385 Q280 355 120 375 Z" fill="#4E4234" opacity="0.55" />

            {/* Tall Oak Tree Left With Climbing Friend */}
            <g transform="translate(132, 275)">
              <rect x="-18" y="-210" width="36" height="235" rx="6" fill="#5A3924" />
              <path d="M10 -132 Q64 -158 106 -142" fill="none" stroke="#5A3924" strokeWidth="14" strokeLinecap="round" />
              <circle cx="-22" cy="-212" r="64" fill="#26573D" />
              <circle cx="38" cy="-205" r="56" fill="#2D6648" />
              <circle cx="12" cy="-242" r="58" fill="#327351" />
              {/* Boy Perched on Branch */}
              <g transform="translate(68, -158)">
                <rect x="-8" y="-12" width="16" height="22" rx="4" fill="#2C5282" />
                <circle cx="0" cy="-21" r="8.5" fill="#F2C8AA" />
                <path d="M-8 -23 Q0 -32 8 -23" fill="#2B211E" />
                <line x1="-6" y1="10" x2="-9" y2="24" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
                <line x1="6" y1="10" x2="9" y2="24" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
              </g>
            </g>

            {/* Second Friend Lying Calmly on Forest Clearing */}
            <g transform="translate(274, 326)">
              <rect x="-32" y="-6" width="52" height="14" rx="6" fill="#8B2626" />
              <circle cx="28" cy="-2" r="9.5" fill="#F4CBB0" />
              <path d="M26 -11 Q35 -10 37 2" fill="#2D221E" />
              <line x1="-30" y1="-2" x2="-46" y2="2" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
            </g>

            {/* Large Georgian Forest Bear */}
            <g transform="translate(415, 294)">
              <ellipse cx="0" cy="4" rx="46" ry="28" fill="#5D3A24" stroke="#3D2415" strokeWidth="2" />
              <circle cx="-42" cy="-6" r="20" fill="#5D3A24" stroke="#3D2415" strokeWidth="2" />
              <circle cx="-50" cy="-22" r="7" fill="#5D3A24" />
              <circle cx="-32" cy="-24" r="7" fill="#5D3A24" />
              <ellipse cx="-54" cy="-2" rx="10" ry="7.5" fill="#85583B" />
              <circle cx="-61" cy="-4" r="3" fill="#1F1612" />
              <circle cx="-46" cy="-11" r="2.2" fill="#1F1612" />
              <rect x="-26" y="24" width="14" height="22" rx="5" fill="#4A2E1C" />
              <rect x="-4" y="24" width="14" height="22" rx="5" fill="#4A2E1C" />
              <rect x="20" y="24" width="14" height="22" rx="5" fill="#4A2E1C" />
            </g>

            {/* Golden Forest Fireflies When Restored */}
            {restored && (
              <g fill="#FDE047">
                {[
                  [210, 180],
                  [295, 165],
                  [350, 210],
                  [245, 240],
                  [450, 175],
                ].map(([fx, fy], idx) => (
                  <circle key={idx} cx={fx} cy={fy} r="3.2" className="animate-pulse" />
                ))}
              </g>
            )}
          </g>
        )}
      </svg>

      {/* Interactive Collectible Manuscript Scraps Inside the 2D Scene */}
      {story.blanks.map((blank: StoryBlank, idx: number) => {
        const isFound = Boolean(discoveredClues[blank.blankId]);
        const isFixed = Boolean(fixedBlanks[blank.blankId]);

        return (
          <button
            key={blank.blankId}
            type="button"
            onClick={() => onDiscoverClue(blank.blankId)}
            aria-label={`${isFound ? 'ნაპოვნია' : 'იპოვე'} ნაგლეჯი ${idx + 1}: ${blank.clueTitle}`}
            style={{
              left: `${blank.clueX}%`,
              top: `${blank.clueY}%`,
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border px-2.5 py-1.5 text-xs font-semibold shadow-lg transition-colors duration-200 ${
              isFixed
                ? 'border-[#34D399]/70 bg-[#122620]/90 text-[#6EE7B7]'
                : isFound
                  ? 'border-[#D4A34A]/80 bg-[#1A2029]/90 text-[#F3C96B]'
                  : 'border-[#FDE68A] bg-[#2D2212]/95 text-[#FEF08A] hover:bg-[#3F2E16]'
            }`}
          >
            {isFixed ? (
              <span>✓ {idx + 1}</span>
            ) : isFound ? (
              <span>ნაპოვნი #{idx + 1}</span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <span className="animate-pulse">✦</span>
                <span>ნაგლეჯი {idx + 1}</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
