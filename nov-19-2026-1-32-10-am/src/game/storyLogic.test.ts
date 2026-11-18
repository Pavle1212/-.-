import test from 'node:test';
import assert from 'node:assert/strict';
import { GOGEBASHVILI_STORIES } from '../data/gogebashviliStoriesData';
import {
  advanceToStory,
  attemptFixBlank,
  createStoryStageState,
  discoverSceneClue,
  getStoryTotals,
  isCurrentStoryComplete,
} from './storyLogic';

test('GOGEBASHVILI_STORIES includes 3 stories each containing missing words and a missing sentence', () => {
  assert.equal(GOGEBASHVILI_STORIES.length, 3);
  for (const story of GOGEBASHVILI_STORIES) {
    const words = story.blanks.filter((b) => b.kind === 'word');
    const sentences = story.blanks.filter((b) => b.kind === 'sentence');
    assert.ok(words.length >= 2, `Story ${story.title} needs >= 2 missing words`);
    assert.ok(sentences.length >= 1, `Story ${story.title} needs >= 1 missing sentence`);
    for (const blank of story.blanks) {
      assert.ok(
        story.choices.some((c) => c.text === blank.correctText),
        `Missing correct choice for ${blank.blankId}`
      );
    }
  }
});

test('discoverSceneClue marks clue discovered and updates active blank when needed', () => {
  const initial = createStoryStageState(GOGEBASHVILI_STORIES);
  const afterClue = discoverSceneClue(initial, 'iav-2');
  assert.equal(afterClue.progressByStory[1].discoveredClues['iav-2'], true);
  assert.equal(afterClue.lastFeedback.type, 'clue');
});

test('attemptFixBlank rejects wrong answers, increments mistakes, and accepts right fixes', () => {
  let state = createStoryStageState(GOGEBASHVILI_STORIES);

  const wrongResult = attemptFixBlank(state, 'iav-1', 'ქარიშხალი');
  assert.equal(wrongResult.isCorrect, false);
  assert.equal(wrongResult.nextState.mistakes, 1);
  assert.equal(wrongResult.nextState.lastFeedback.type, 'wrong');

  state = wrongResult.nextState;
  for (const blank of GOGEBASHVILI_STORIES[0].blanks) {
    const res = attemptFixBlank(state, blank.blankId, blank.correctText);
    assert.equal(res.isCorrect, true);
    state = res.nextState;
  }

  assert.equal(isCurrentStoryComplete(state), true);
  const totals = getStoryTotals(state);
  assert.equal(totals.fixedCount, 3);
  assert.equal(totals.totalBlanks, 9);

  const nextStoryState = advanceToStory(state, 1);
  assert.equal(nextStoryState.currentStoryIndex, 1);
  assert.equal(isCurrentStoryComplete(nextStoryState), false);
});
