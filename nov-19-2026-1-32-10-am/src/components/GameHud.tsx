import React from 'react';
import { GameStage, getStageOrderIndex } from '../game/gameState';

interface GameHudProps {
  stage: GameStage;
  storyBlanksFixed: number;
  storyBlanksTotal: number;
  quizCorrect: number;
  quizTotal: number;
  mazeLettersCollected: number;
  mazeLettersTotal: number;
  muted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
}

const STAGE_STEPS: { id: GameStage; label: string }[] = [
  { id: 'biography', label: 'ბიოგრაფია' },
  { id: 'stories', label: 'მოთხრობები' },
  { id: 'quiz', label: 'ქვიზი' },
  { id: 'maze', label: 'ლაბირინთი' },
  { id: 'grave', label: 'საფლავი' },
];

export const GameHud: React.FC<GameHudProps> = ({
  stage,
  storyBlanksFixed,
  storyBlanksTotal,
  quizCorrect,
  quizTotal,
  mazeLettersCollected,
  mazeLettersTotal,
  muted,
  onToggleMute,
  onPause,
}) => {
  const currentIdx = getStageOrderIndex(stage);

  return (
    <div className="fixed inset-x-0 top-0 z-30 pointer-events-none px-4 pt-3 sm:px-6">
      <div
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-xl border border-[#D4A34A]/25 px-4 py-2.5 shadow-lg"
        style={{ backgroundColor: 'rgba(20, 25, 33, 0.94)' }}
      >
        {/* Left: Heritage stage progression (no pills, clean unboxed text with separators) */}
        <div className="flex items-center gap-2 overflow-x-auto pointer-events-auto">
          <span
            className="hidden sm:inline font-semibold text-sm text-[#D4A34A] whitespace-nowrap shrink-0"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            დედაენის გზა
          </span>
          <span className="hidden sm:inline text-[#6E7785]" aria-hidden="true">
            ·
          </span>
          <ol className="flex items-center gap-2 text-xs sm:text-sm" aria-label="თამაშის ეტაპები">
            {STAGE_STEPS.map((step, index) => {
              const stepIdx = getStageOrderIndex(step.id);
              const isActive = step.id === stage;
              const isDone = currentIdx > stepIdx;
              return (
                <React.Fragment key={step.id}>
                  {index > 0 && (
                    <span className="text-[#525B69]" aria-hidden="true">
                      /
                    </span>
                  )}
                  <li
                    className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'font-semibold text-[#D4A34A]'
                        : isDone
                          ? 'text-[#B9C2CF]'
                          : 'text-[#6E7785]'
                    }`}
                  >
                    <span className="font-mono tabular-nums text-xs">
                      {isDone ? '✓' : `${index + 1}.`}
                    </span>
                    <span>{step.label}</span>
                  </li>
                </React.Fragment>
              );
            })}
          </ol>
        </div>

        {/* Right: Tabular metrics + square SVG utility controls */}
        <div className="flex items-center gap-3 shrink-0 pointer-events-auto">
          <div className="hidden md:flex items-center gap-3 text-xs text-[#C6BFB2] font-mono tabular-nums">
            <span>
              მოთხრობა: {storyBlanksFixed}/{storyBlanksTotal}
            </span>
            <span className="text-[#525B69]" aria-hidden="true">
              ·
            </span>
            <span>
              ქვიზი: {quizCorrect}/{quizTotal}
            </span>
            <span className="text-[#525B69]" aria-hidden="true">
              ·
            </span>
            <span>
              ასოები: {mazeLettersCollected}/{mazeLettersTotal}
            </span>
          </div>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleMute();
            }}
            aria-label={muted ? 'ხმის ჩართვა [M]' : 'ხმის გამორთვა [M]'}
            title={muted ? 'ხმის ჩართვა (M)' : 'ხმის გამორთვა (M)'}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D4A34A]/30 bg-[#1C222B] text-[#F4EFE4] transition-colors hover:border-[#D4A34A] hover:text-[#D4A34A]"
          >
            {muted ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinejoin="round" />
                <path d="M22 9l-6 6M16 9l6 6" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinejoin="round" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" strokeLinecap="round" />
              </svg>
            )}
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onPause();
            }}
            aria-label="პაუზა [Esc]"
            title="პაუზა (Esc / P)"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D4A34A]/30 bg-[#1C222B] text-[#F4EFE4] transition-colors hover:border-[#D4A34A] hover:text-[#D4A34A]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
