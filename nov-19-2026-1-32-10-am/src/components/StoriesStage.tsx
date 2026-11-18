import React, { useState } from 'react';
import { GOGEBASHVILI_STORIES } from '../data/gogebashviliStoriesData';
import { soundFX } from '../game/soundEffects';
import {
  advanceToStory,
  attemptFixBlank,
  createStoryStageState,
  discoverSceneClue,
  getStoryTotals,
  isCurrentStoryComplete,
  selectActiveBlank,
} from '../game/storyLogic';
import { AnimatedStoryScene } from './StoryScenes2D';

interface StoriesStageProps {
  onProgressChange?: (fixedCount: number, totalCount: number) => void;
  onComplete: (fixedCount: number, totalCount: number) => void;
}

export const StoriesStage: React.FC<StoriesStageProps> = ({
  onProgressChange,
  onComplete,
}) => {
  const [state, setState] = useState(() =>
    createStoryStageState(GOGEBASHVILI_STORIES)
  );

  const story = state.stories[state.currentStoryIndex];
  const progress = state.progressByStory[story.id];
  const discoveredCount = Object.keys(progress.discoveredClues).length;
  const fixedCountInStory = Object.keys(progress.fixedBlanks).length;
  const storyComplete = isCurrentStoryComplete(state);
  const isLastStory = state.currentStoryIndex === state.stories.length - 1;

  const activeBlank = story.blanks.find((b) => b.blankId === state.activeBlankId);

  const handleDiscoverClue = (blankId: string) => {
    const alreadyFound = Boolean(progress.discoveredClues[blankId]);
    if (!alreadyFound) {
      soundFX.playCollectLetter();
    } else {
      soundFX.playPageTurn();
    }
    setState((prev) => discoverSceneClue(prev, blankId));
  };

  const handleSelectBlank = (blankId: string) => {
    if (progress.fixedBlanks[blankId]) return;
    soundFX.playPageTurn();
    setState((prev) => selectActiveBlank(prev, blankId));
  };

  const handleTryChoice = (choiceText: string) => {
    if (!state.activeBlankId || storyComplete) return;
    const result = attemptFixBlank(state, state.activeBlankId, choiceText);
    soundFX.playQuizAnswer(result.isCorrect);
    setState(result.nextState);
    if (result.isCorrect && onProgressChange) {
      const totals = getStoryTotals(result.nextState);
      onProgressChange(totals.fixedCount, totals.totalBlanks);
    }
  };

  const handleNext = () => {
    soundFX.playPageTurn();
    if (isLastStory) {
      const totals = getStoryTotals(state);
      onComplete(totals.fixedCount, totals.totalBlanks);
    } else {
      setState((prev) => advanceToStory(prev, prev.currentStoryIndex + 1));
    }
  };

  const wordChoices = story.choices.filter((c) => c.kind === 'word');
  const sentenceChoices = story.choices.filter((c) => c.kind === 'sentence');

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 pt-20 pb-6 sm:px-10">
      <div className="grid w-full grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        {/* Left Column: Interactive 2D Story World + Collectible Clues */}
        <section className="flex flex-col justify-between rounded-2xl border border-[#D4A34A]/30 bg-[#1A2029] p-4 sm:p-5 lg:col-span-6">
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
              <span className="text-[#D4A34A]">
                მოთხრობის სცენა {state.currentStoryIndex + 1} /{' '}
                {state.stories.length}
              </span>
              <span className="font-mono tabular-nums text-[#C9C3B8]">
                ნაპოვნი ნაგლეჯები: {discoveredCount}/{story.blanks.length}
              </span>
            </div>

            <AnimatedStoryScene
              story={story}
              discoveredClues={progress.discoveredClues}
              fixedBlanks={progress.fixedBlanks}
              restored={storyComplete}
              onDiscoverClue={handleDiscoverClue}
            />
          </div>

          <div className="mt-4 rounded-xl border border-[#2C3440] bg-[#141921] p-4">
            {storyComplete ? (
              <div>
                <p className="text-xs font-semibold text-[#34D399]">
                  ✓ მოთხრობა სრულად აღდგენილია
                </p>
                <p className="mt-1.5 text-sm italic leading-relaxed text-[#F3C96B]">
                  {story.moral}
                </p>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-[#C9C3B8]">
                {story.instruction}
              </p>
            )}
          </div>
        </section>

        {/* Right Column: Story Text with Missing Words/Sentences & Correction Tray */}
        <section className="flex flex-col justify-between rounded-2xl border border-[#2C3440] bg-[#1A2029] p-6 sm:p-7 lg:col-span-6">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#9CA3AF]">
              <span className="font-medium text-[#D4A34A]">
                {story.sourceWork}
              </span>
              <span className="font-mono tabular-nums">
                გასწორებული: {fixedCountInStory}/{story.blanks.length}
              </span>
            </div>

            <h1
              className="mt-2 text-2xl font-bold text-[#F4EFE4] sm:text-3xl"
              style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
            >
              {story.title}
            </h1>

            {/* Story Manuscript with Interactive Missing Slots */}
            <div
              className="mt-4 rounded-xl border border-[#D4A34A]/25 bg-[#141921] p-4 text-base leading-[1.85] text-[#EAE5DB] sm:p-5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {story.segments.map((seg, idx) => {
                if (seg.type === 'text') {
                  return <span key={idx}>{seg.value}</span>;
                }

                const blank = story.blanks.find(
                  (b) => b.blankId === seg.blankId
                );
                if (!blank) return null;

                const fixedVal = progress.fixedBlanks[blank.blankId];
                const isActive = state.activeBlankId === blank.blankId;
                const isClueFound = Boolean(
                  progress.discoveredClues[blank.blankId]
                );

                if (fixedVal) {
                  return (
                    <span
                      key={blank.blankId}
                      className="box-decoration-clone mx-1 inline rounded-md border border-[#34D399]/40 bg-[#122620] px-2 py-0.5 font-semibold text-[#6EE7B7]"
                    >
                      {fixedVal}
                    </span>
                  );
                }

                return (
                  <button
                    key={blank.blankId}
                    type="button"
                    onClick={() => handleSelectBlank(blank.blankId)}
                    className={`mx-1 inline-flex items-center rounded-lg border px-2.5 py-0.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'border-[#D4A34A] bg-[#2D2212] text-[#FDE68A]'
                        : isClueFound
                          ? 'border-[#A78BFA]/70 bg-[#231D35] text-[#DDD6FE] hover:border-[#D4A34A]'
                          : 'border-dashed border-[#6E7785] bg-[#1B222D] text-[#9CA3AF] hover:border-[#D4A34A]'
                    }`}
                  >
                    {blank.kind === 'sentence'
                      ? '[ გამოტოვებული წინადადება ? ]'
                      : '[ გამოტოვებული სიტყვა ? ]'}
                  </button>
                );
              })}
            </div>

            {/* Feedback Banner */}
            <div
              role="status"
              className={`mt-4 rounded-xl border px-4 py-2.5 text-sm ${
                state.lastFeedback.type === 'correct'
                  ? 'border-[#34D399]/45 bg-[#122620] text-[#D1FAE5]'
                  : state.lastFeedback.type === 'wrong'
                    ? 'border-[#F87171]/50 bg-[#2C181C] text-[#FECACA]'
                    : state.lastFeedback.type === 'clue'
                      ? 'border-[#A78BFA]/50 bg-[#211B33] text-[#DDD6FE]'
                      : 'border-[#2C3440] bg-[#141921] text-[#C9C3B8]'
              }`}
            >
              {state.lastFeedback.message}
            </div>

            {/* Word & Sentence Correction Choices */}
            {!storyComplete && (
              <div className="mt-3.5 space-y-3">
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                    გამოტოვებული სიტყვები
                    {activeBlank?.kind === 'word' && (
                      <span className="ml-2 text-[#D4A34A]">
                        · აირჩიე სწორი სიტყვა
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {wordChoices.map((choice) => {
                      const alreadyPlaced = Object.values(
                        progress.fixedBlanks
                      ).includes(choice.text);
                      return (
                        <button
                          key={choice.choiceId}
                          type="button"
                          disabled={alreadyPlaced || !state.activeBlankId}
                          onClick={() => handleTryChoice(choice.text)}
                          className={`min-h-[38px] rounded-xl border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                            alreadyPlaced
                              ? 'border-[#34D399]/40 bg-[#122620] text-[#6EE7B7] opacity-65'
                              : activeBlank?.kind === 'word'
                                ? 'border-[#D4A34A]/50 bg-[#141921] text-[#F4EFE4] hover:border-[#D4A34A] hover:bg-[#242C38]'
                                : 'border-[#2C3440] bg-[#141921] text-[#8892A0] hover:border-[#D4A34A]/40'
                          }`}
                        >
                          {choice.text}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                    გამოტოვებული წინადადებები
                    {activeBlank?.kind === 'sentence' && (
                      <span className="ml-2 text-[#D4A34A]">
                        · აირჩიე სწორი წინადადება
                      </span>
                    )}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {sentenceChoices.map((choice) => {
                      const alreadyPlaced = Object.values(
                        progress.fixedBlanks
                      ).includes(choice.text);
                      return (
                        <button
                          key={choice.choiceId}
                          type="button"
                          disabled={alreadyPlaced || !state.activeBlankId}
                          onClick={() => handleTryChoice(choice.text)}
                          className={`min-h-[40px] w-full rounded-xl border px-3.5 py-2 text-left text-sm leading-snug transition-colors ${
                            alreadyPlaced
                              ? 'border-[#34D399]/40 bg-[#122620] text-[#6EE7B7] opacity-65'
                              : activeBlank?.kind === 'sentence'
                                ? 'border-[#D4A34A]/50 bg-[#141921] text-[#F4EFE4] hover:border-[#D4A34A] hover:bg-[#242C38]'
                                : 'border-[#2C3440] bg-[#141921] text-[#8892A0] hover:border-[#D4A34A]/40'
                          }`}
                        >
                          {choice.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#2C3440] pt-4">
            <div className="flex items-center gap-2">
              {state.stories.map((item, idx) => {
                const prog = state.progressByStory[item.id];
                const done =
                  prog &&
                  item.blanks.every((b) => Boolean(prog.fixedBlanks[b.blankId]));
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      soundFX.playPageTurn();
                      setState((prev) => advanceToStory(prev, idx));
                    }}
                    aria-label={`მოთხრობა ${idx + 1}: ${item.title}`}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === state.currentStoryIndex
                        ? 'w-7 bg-[#D4A34A]'
                        : done
                          ? 'w-2.5 bg-[#34D399]'
                          : 'w-2.5 bg-[#3A4352] hover:bg-[#6E7785]'
                    }`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              disabled={!storyComplete}
              onClick={handleNext}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#D4A34A] px-5 py-2.5 text-sm font-semibold text-[#12161C] transition-colors hover:bg-[#E0B35E] disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap shrink-0"
            >
              <span>
                {isLastStory ? 'გადასვლა ქვიზზე' : 'შემდეგი მოთხრობა'}
              </span>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};
