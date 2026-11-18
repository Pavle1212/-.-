import React from 'react';
import {
  formatElapsedTime,
  getMasteryTitle,
  RunStats,
} from '../game/gameState';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onReturnTitle: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onReturnTitle,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgba(12, 15, 20, 0.88)' }}
    >
      <div className="w-full max-w-md rounded-2xl border border-[#D4A34A]/35 bg-[#1A2029] p-7 shadow-2xl">
        <p className="text-xs font-medium text-[#D4A34A]">თამაში შეჩერებულია</p>
        <h2
          id="pause-title"
          className="mt-2 text-2xl font-bold text-[#F4EFE4]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          პაუზა
        </h2>
        <p className="mt-2 text-sm text-[#B9C2CF]">
          შეგიძლია გააგრძელო მოგზაურობა ან თავიდან დაიწყო.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onResume}
            className="min-h-[46px] w-full rounded-xl bg-[#D4A34A] px-5 py-2.5 text-sm font-semibold text-[#12161C] transition-colors hover:bg-[#E0B35E]"
          >
            გაგრძელება
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="min-h-[46px] w-full rounded-xl border border-[#343E4D] bg-[#141921] px-5 py-2.5 text-sm font-medium text-[#F4EFE4] transition-colors hover:border-[#D4A34A]"
          >
            თავიდან დაწყება
          </button>
          <button
            type="button"
            onClick={onReturnTitle}
            className="min-h-[46px] w-full rounded-xl border border-[#343E4D] bg-[#141921] px-5 py-2.5 text-sm font-medium text-[#B9C2CF] transition-colors hover:border-[#D4A34A] hover:text-[#F4EFE4]"
          >
            დაბრუნება ძეგლთან
          </button>
        </div>
      </div>
    </div>
  );
};

interface VictoryModalProps {
  stats: RunStats;
  onPlayAgain: () => void;
  onReturnTitle: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  stats,
  onPlayAgain,
  onReturnTitle,
}) => {
  const rankTitle = getMasteryTitle(stats);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgba(12, 15, 20, 0.9)' }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-[#D4A34A]/45 bg-[#1A2029] p-7 shadow-2xl sm:p-8">
        <p className="text-xs font-semibold text-[#D4A34A]">
          დედაენა გადმოცემულია
        </p>
        <h2
          id="victory-title"
          className="mt-2 text-2xl font-bold text-[#F4EFE4] sm:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          გილოცავ! მოგზაურობა დასრულდა
        </h2>
        <p className="mt-2 text-sm text-[#C9C3B8]">
          მინიჭებული წოდება:{' '}
          <span className="font-semibold text-[#F3C96B]">{rankTitle}</span>
        </p>

        {/* 4 Tabular Mastery Metric Tiles */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-y border-[#2C3440] py-5 sm:grid-cols-4">
          <div className="rounded-xl border border-[#2C3440] bg-[#141921] p-3 text-center">
            <p className="text-xs text-[#8892A0]">მოთხრობები</p>
            <p className="mt-1 font-mono text-xl font-bold tabular-nums text-[#34D399]">
              {stats.storyBlanksFixed}/{stats.storyBlanksTotal}
            </p>
          </div>
          <div className="rounded-xl border border-[#2C3440] bg-[#141921] p-3 text-center">
            <p className="text-xs text-[#8892A0]">ქვიზი</p>
            <p className="mt-1 font-mono text-xl font-bold tabular-nums text-[#F4EFE4]">
              {stats.quizCorrect}/{stats.quizTotal}
            </p>
          </div>
          <div className="rounded-xl border border-[#2C3440] bg-[#141921] p-3 text-center">
            <p className="text-xs text-[#8892A0]">ასოები</p>
            <p className="mt-1 font-mono text-xl font-bold tabular-nums text-[#D4A34A]">
              {stats.mazeLettersCollected}/{stats.mazeLettersTotal}
            </p>
          </div>
          <div className="rounded-xl border border-[#2C3440] bg-[#141921] p-3 text-center">
            <p className="text-xs text-[#8892A0]">დრო</p>
            <p className="mt-1 font-mono text-xl font-bold tabular-nums text-[#F4EFE4]">
              {formatElapsedTime(stats.elapsedSeconds)}
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-[#D1CBC0]">
          „ენა ქართული — ჩვენი სული და მომავალია.“ მადლობა იაკობ გოგებაშვილის
          მემკვიდრეობის გაცოცხლებისთვის!
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            data-start="true"
            onClick={onPlayAgain}
            className="min-h-[46px] flex-1 rounded-xl bg-[#D4A34A] px-5 py-2.5 text-sm font-semibold text-[#12161C] transition-colors hover:bg-[#E0B35E] whitespace-nowrap"
          >
            თავიდან თამაში
          </button>
          <button
            type="button"
            onClick={onReturnTitle}
            className="min-h-[46px] rounded-xl border border-[#343E4D] bg-[#141921] px-5 py-2.5 text-sm font-medium text-[#D1CBC0] transition-colors hover:border-[#D4A34A] hover:text-[#F4EFE4] whitespace-nowrap"
          >
            ძეგლთან დაბრუნება
          </button>
        </div>
      </div>
    </div>
  );
};
