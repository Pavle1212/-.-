import React, { useEffect, useState } from 'react';
import { BIOGRAPHY_CHAPTERS } from '../data/gogebashviliData';
import { soundFX } from '../game/soundEffects';
import { AnimatedBiographyScene } from './AnimatedScenes';

interface BiographyStageProps {
  onComplete: () => void;
}

export const BiographyStage: React.FC<BiographyStageProps> = ({
  onComplete,
}) => {
  const [chapterIndex, setChapterIndex] = useState(0);

  const chapter = BIOGRAPHY_CHAPTERS[chapterIndex];
  const isFirst = chapterIndex === 0;
  const isLast = chapterIndex === BIOGRAPHY_CHAPTERS.length - 1;

  const goNext = () => {
    soundFX.playPageTurn();
    if (isLast) {
      onComplete();
    } else {
      setChapterIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (!isFirst) {
      soundFX.playPageTurn();
      setChapterIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 pt-24 pb-10 sm:px-10">
      <div className="grid w-full grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        {/* Left: Animated 2D Storybook Scene per Chapter */}
        <aside className="flex flex-col overflow-hidden rounded-2xl border border-[#D4A34A]/25 bg-[#1A2029] lg:col-span-5">
          <div className="relative aspect-[4/5] w-full flex-1 overflow-hidden bg-[#151A22]">
            <AnimatedBiographyScene chapterIndex={chapterIndex} />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#1A2029] via-[#1A2029]/60 to-transparent"
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-mono text-xs tabular-nums text-[#D4A34A]">
                1840 — 1912
              </p>
              <h2
                className="mt-1 text-xl font-bold text-[#F4EFE4]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                იაკობ გოგებაშვილი
              </h2>
            </div>
          </div>

          <div className="border-t border-[#D4A34A]/15 px-5 py-4 text-sm text-[#C9C3B8]">
            <span className="text-[#8892A0]">{chapter.keyFactLabel}: </span>
            <span className="font-medium text-[#F4EFE4]">
              {chapter.keyFactValue}
            </span>
          </div>
        </aside>

        {/* Right: Chapter Prose & Navigation */}
        <section className="flex flex-col justify-between rounded-2xl border border-[#2C3440] bg-[#1A2029] p-6 sm:p-8 lg:col-span-7">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#9CA3AF]">
              <span className="text-[#D4A34A]">
                მოკლე ბიოგრაფია · თავი {chapterIndex + 1} /{' '}
                {BIOGRAPHY_CHAPTERS.length}
              </span>
              <span className="font-mono tabular-nums">{chapter.years}</span>
            </div>

            <h1
              className="mt-4 text-2xl font-bold leading-snug text-[#F4EFE4] sm:text-3xl"
              style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
            >
              {chapter.title}
            </h1>

            <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-[#E3DDD1] sm:text-[17px]">
              {chapter.summary}
            </p>

            <blockquote className="mt-7 rounded-xl border border-[#D4A34A]/25 bg-[#141921] p-5 text-sm italic leading-relaxed text-[#D4A34A] sm:text-base">
              {chapter.highlightQuote}
            </blockquote>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#2C3440] pt-6">
            <div className="flex items-center gap-2">
              {BIOGRAPHY_CHAPTERS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    soundFX.playPageTurn();
                    setChapterIndex(idx);
                  }}
                  aria-label={`თავი ${idx + 1}: ${item.title}`}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === chapterIndex
                      ? 'w-7 bg-[#D4A34A]'
                      : 'w-2.5 bg-[#3A4352] hover:bg-[#6E7785]'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goPrev}
                disabled={isFirst}
                className="min-h-[44px] rounded-xl border border-[#343E4D] bg-[#141921] px-4 py-2.5 text-sm font-medium text-[#D1CBC0] transition-colors hover:border-[#D4A34A]/60 hover:text-[#F4EFE4] disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap shrink-0"
              >
                წინა
              </button>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#D4A34A] px-5 py-2.5 text-sm font-semibold text-[#12161C] transition-colors hover:bg-[#E0B35E] whitespace-nowrap shrink-0"
              >
                <span>{isLast ? 'მოთხრობებზე გადასვლა' : 'შემდეგი თავი'}</span>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
