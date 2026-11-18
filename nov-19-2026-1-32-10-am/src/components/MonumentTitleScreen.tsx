import React from 'react';
import { AnimatedMonumentScene } from './AnimatedScenes';

interface MonumentTitleScreenProps {
  onStart: () => void;
}

export const MonumentTitleScreen: React.FC<MonumentTitleScreenProps> = ({
  onStart,
}) => {
  return (
    <main className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden px-6 py-8 sm:px-10 lg:px-16">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(circle at 68% 42%, rgba(212, 163, 74, 0.12) 0%, rgba(18, 22, 28, 0) 58%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto my-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left Column: Georgian Heritage Title Lockup */}
        <section className="flex flex-col items-start lg:col-span-5">
          <svg
            viewBox="0 0 72 48"
            className="mb-6 h-11 w-16 text-[#D4A34A]"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M36 42C24 42 15 36 8 38V11C15 9 24 14 36 16C48 14 57 9 64 11V38C57 36 48 42 36 42Z"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path d="M36 16V42" stroke="currentColor" strokeWidth="2" />
            <circle cx="36" cy="8" r="3" fill="currentColor" />
            <path
              d="M21 23H29M21 29H27M43 23H51M45 29H51"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>

          <p className="mb-3 text-sm font-medium tracking-wide text-[#D4A34A]">
            სასწავლებელი 2D თავგადასავალი
          </p>

          <h1
            className="text-4xl font-bold leading-tight text-[#F4EFE4] sm:text-5xl lg:text-[3.25rem]"
            style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
          >
            დედაენის გზა
          </h1>

          <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-[#C9C3B8] sm:text-lg">
            შეეხე დედაენის ანიმაციურ ძეგლს, გაეცანი იაკობ გოგებაშვილის
            ცხოვრებას, აღადგინე მისი მოთხრობები, გაიარე ქვიზი და მთაწმინდის
            2D ლაბირინთით მიაგენი უკვდავ „აი-იას“.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#9CA3AF] sm:text-sm">
            <span>ძეგლი</span>
            <span aria-hidden="true">·</span>
            <span>ბიოგრაფია</span>
            <span aria-hidden="true">·</span>
            <span>მოთხრობები</span>
            <span aria-hidden="true">·</span>
            <span>ქვიზი</span>
            <span aria-hidden="true">·</span>
            <span>ლაბირინთი</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#B89BFF]">აი-ია</span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              data-start="true"
              onClick={onStart}
              className="inline-flex min-h-[48px] items-center gap-3 rounded-xl bg-[#D4A34A] px-6 py-3 text-base font-semibold text-[#12161C] shadow-lg transition-transform duration-150 hover:scale-[1.02] hover:bg-[#E0B35E] active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <span>დააწკაპუნე ძეგლზე დასაწყებად</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </section>

        {/* Right Column: Interactive Animated 2D Dedaena Monument Centerpiece */}
        <section className="flex flex-col items-center lg:col-span-7">
          <button
            type="button"
            onClick={onStart}
            aria-label="დედაენის ძეგლი — დააწკაპუნე თამაშის დასაწყებად"
            className="group relative w-full overflow-hidden rounded-2xl border border-[#D4A34A]/35 bg-[#1A2029] text-left shadow-2xl transition-transform duration-200 hover:-translate-y-1 hover:border-[#D4A34A]"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#181E26]">
              <AnimatedMonumentScene />

              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#12161C]/90 via-[#12161C]/40 to-transparent"
                aria-hidden="true"
              />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                <div>
                  <p className="text-xs font-medium text-[#D4A34A]">
                    თბილისი · დედაენის ბაღი
                  </p>
                  <h2
                    className="mt-1 text-xl font-bold text-[#F4EFE4] sm:text-2xl"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    დედაენის ძეგლი
                  </h2>
                </div>
                <span className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#D4A34A]/60 bg-[#12161C]/90 px-4 py-2 text-sm font-semibold text-[#D4A34A] transition-colors group-hover:bg-[#D4A34A] group-hover:text-[#12161C] whitespace-nowrap shrink-0">
                  <span>დააწკაპუნე ძეგლზე</span>
                </span>
              </div>
            </div>
          </button>
        </section>
      </div>

      <footer className="relative z-10 mx-auto mt-8 w-full max-w-6xl text-center text-xs text-[#8892A0]">
        დაწკაპუნება ძეგლზე ან Enter / Space — დაწყება · WASD / ისრები — მოძრაობა ლაბირინთში · M — მუსიკა · Esc — პაუზა
      </footer>
    </main>
  );
};
