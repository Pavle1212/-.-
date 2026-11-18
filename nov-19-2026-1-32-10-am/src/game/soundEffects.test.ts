import test from 'node:test';
import assert from 'node:assert/strict';
import { soundFX } from './soundEffects';

test('music lifecycle plays folk initially, switches to hymn in maze, and stops on game completion', () => {
  soundFX.stopMusic();
  assert.equal(soundFX.isMusicActive(), false);
  assert.equal(soundFX.getCurrentTrack(), 'folk');

  // Start game -> folk theme
  soundFX.startMusic('folk');
  assert.equal(soundFX.isMusicActive(), true);
  assert.equal(soundFX.getCurrentTrack(), 'folk');

  // Enter maze -> switches to "ჰიმნი დედაენას"
  soundFX.setMusicTrack('hymn');
  assert.equal(soundFX.isMusicActive(), true);
  assert.equal(soundFX.getCurrentTrack(), 'hymn');

  // Pause & resume preserves active hymn track
  soundFX.pauseMusic();
  assert.equal(soundFX.getCurrentTrack(), 'hymn');
  soundFX.resumeMusic();
  assert.equal(soundFX.isMusicActive(), true);
  assert.equal(soundFX.getCurrentTrack(), 'hymn');

  // Complete game -> stops music cleanly and resets track
  soundFX.stopMusic();
  assert.equal(soundFX.isMusicActive(), false);
  assert.equal(soundFX.getCurrentTrack(), 'folk');
});
