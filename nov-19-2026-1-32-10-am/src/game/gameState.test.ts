import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatElapsedTime,
  getMasteryTitle,
  shouldAutostart,
  getStageOrderIndex,
} from './gameState';

test('formatElapsedTime formats seconds as MM:SS', () => {
  assert.equal(formatElapsedTime(0), '00:00');
  assert.equal(formatElapsedTime(65), '01:05');
  assert.equal(formatElapsedTime(125.7), '02:06');
  assert.equal(formatElapsedTime(-5), '00:00');
});

test('getMasteryTitle returns appropriate Georgian rank based on quiz, stories, and letters', () => {
  assert.equal(
    getMasteryTitle({
      storyBlanksFixed: 9,
      storyBlanksTotal: 9,
      quizCorrect: 5,
      quizTotal: 5,
      mazeLettersCollected: 4,
      mazeLettersTotal: 4,
      mazeSteps: 40,
      elapsedSeconds: 90,
    }),
    'დედაენის საპატიო მცველი'
  );

  assert.equal(
    getMasteryTitle({
      storyBlanksFixed: 9,
      storyBlanksTotal: 9,
      quizCorrect: 4,
      quizTotal: 5,
      mazeLettersCollected: 2,
      mazeLettersTotal: 4,
      mazeSteps: 50,
      elapsedSeconds: 120,
    }),
    'ქართული სიტყვის ერთგული მოწაფე'
  );

  assert.equal(
    getMasteryTitle({
      storyBlanksFixed: 4,
      storyBlanksTotal: 9,
      quizCorrect: 2,
      quizTotal: 5,
      mazeLettersCollected: 1,
      mazeLettersTotal: 4,
      mazeSteps: 60,
      elapsedSeconds: 150,
    }),
    'მთაწმინდის გზის გამგრძელებელი'
  );
});

test('shouldAutostart parses ?autostart=1 accurately', () => {
  assert.equal(shouldAutostart('?autostart=1'), true);
  assert.equal(shouldAutostart('?foo=bar&autostart=1'), true);
  assert.equal(shouldAutostart('?autostart=0'), false);
  assert.equal(shouldAutostart(''), false);
});

test('getStageOrderIndex orders stages chronologically', () => {
  assert.equal(getStageOrderIndex('monument'), 0);
  assert.equal(getStageOrderIndex('biography'), 1);
  assert.equal(getStageOrderIndex('stories'), 2);
  assert.equal(getStageOrderIndex('quiz'), 3);
  assert.equal(getStageOrderIndex('maze'), 4);
  assert.equal(getStageOrderIndex('grave'), 5);
});
