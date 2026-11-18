import React, { useEffect, useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/gogebashviliData';
import { soundFX } from '../game/soundEffects';
import { AnimatedQuizCompanion } from './AnimatedScenes';

interface QuizStageProps {
  onComplete: (correctCount: number) => void;
}

export const QuizStage: React.FC<QuizStageProps> = ({ onComplete }) => {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQ = QUIZ_QUESTIONS[questionIdx];
  const hasAnswered = selectedOption !== null;
  const isCorrect = selectedOption === currentQ.correctIndex;
  const isLast = questionIdx === QUIZ_QUESTIONS.length - 1;

  const companionMood: 'idle' | 'happy' | 'encourage' = !hasAnswered
    ? 'idle'
    : isCorrect
      ? 'happy'
      : 'encourage';

  const handleSelect = (optionIdx: number) => {
    if (hasAnswered) return;
    setSelectedOption(optionIdx);
    const right = optionIdx === currentQ.correctIndex;
    soundFX.playQuizAnswer(right);
    if (right) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (!hasAnswered) return;
    if (isLast) {
      onComplete(correctCount);
    } else {
      setQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!hasAnswered && ['1', '2', '3', '4'].includes(e.key)) {
        const idx = Number(e.key) - 1;
        if (idx >= 0 && idx < currentQ.options.length) {
          e.preventDefault();
          handleSelect(idx);
        }
      } else if (hasAnswered && e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 pt-24 pb-10">
      <section className="w-full rounded-2xl border border-[#2C3440] bg-[#1A2029] p-6 shadow-xl sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#9CA3AF]">
              <span className="text-[#D4A34A]">
                ცოდნის ქვიზი · კითხვა {questionIdx + 1} / {QUIZ_QUESTIONS.length}
              </span>
              <span className="font-mono tabular-nums">
                სწორი პასუხები: {correctCount}
              </span>
            </div>

            <h1
              className="mt-3 text-xl font-bold leading-snug text-[#F4EFE4] sm:text-2xl"
              style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
            >
              {currentQ.question}
            </h1>
          </div>

          <AnimatedQuizCompanion mood={companionMood} />
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {currentQ.options.map((optionText, idx) => {
            const isSelected = selectedOption === idx;
            const isRightAnswer = idx === currentQ.correctIndex;

            let cardStyle =
              'border-[#2F3846] bg-[#141921] text-[#E6E0D4] hover:border-[#D4A34A]/65 hover:bg-[#1E2530]';
            let statusBadge: string | null = null;

            if (hasAnswered) {
              if (isRightAnswer) {
                cardStyle =
                  'border-[#34D399]/70 bg-[#132922] text-[#ECFDF5]';
                statusBadge = '✓ სწორია';
              } else if (isSelected) {
                cardStyle =
                  'border-[#F87171]/70 bg-[#2C181C] text-[#FEF2F2]';
                statusBadge = '✕ არასწორია';
              } else {
                cardStyle = 'border-[#252C37] bg-[#13171E] text-[#7D8593]';
              }
            }

            return (
              <button
                key={optionText}
                type="button"
                disabled={hasAnswered}
                onClick={() => handleSelect(idx)}
                className={`flex min-h-[52px] w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors sm:text-base ${cardStyle}`}
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono text-xs tabular-nums text-[#D4A34A]">
                    {idx + 1}.
                  </span>
                  <span>{optionText}</span>
                </span>
                {statusBadge && (
                  <span className="text-xs font-semibold whitespace-nowrap shrink-0">
                    {statusBadge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div
            role="status"
            className={`mt-6 rounded-xl border p-4 text-sm leading-relaxed ${
              isCorrect
                ? 'border-[#34D399]/40 bg-[#122620] text-[#D1FAE5]'
                : 'border-[#D4A34A]/40 bg-[#231F17] text-[#FDE68A]'
            }`}
          >
            <p className="font-semibold">
              {isCorrect ? '✓ შესანიშნავია!' : 'შენიშვნა:'}
            </p>
            <p className="mt-1 text-[#EAE5DB]">{currentQ.explanation}</p>
          </div>
        )}

        <div className="mt-7 flex items-center justify-between gap-4 border-t border-[#2C3440] pt-5">
          <span className="text-xs text-[#8892A0]">
            აირჩიე პასუხი ან დააჭირე 1–4 კლავიშს
          </span>
          <button
            type="button"
            disabled={!hasAnswered}
            onClick={handleNext}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#D4A34A] px-5 py-2.5 text-sm font-semibold text-[#12161C] transition-colors hover:bg-[#E0B35E] disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap shrink-0"
          >
            <span>
              {isLast ? 'მთაწმინდის ლაბირინთში შესვლა' : 'შემდეგი კითხვა'}
            </span>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </section>
    </main>
  );
};
