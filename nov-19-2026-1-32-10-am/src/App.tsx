import { useCallback, useEffect, useRef, useState } from 'react';
import { BiographyStage } from './components/BiographyStage';
import { DedaenaHymnPlayer } from './components/DedaenaHymnPlayer';
import { GameHud } from './components/GameHud';
import { PauseModal, VictoryModal } from './components/GameModals';
import { GraveFinaleStage } from './components/GraveFinaleStage';
import { MazeStage } from './components/MazeStage';
import { MonumentTitleScreen } from './components/MonumentTitleScreen';
import { QuizStage } from './components/QuizStage';
import { StoriesStage } from './components/StoriesStage';
import { QUIZ_QUESTIONS } from './data/gogebashviliData';
import { GOGEBASHVILI_STORIES } from './data/gogebashviliStoriesData';
import {
  GameStage,
  RunStats,
  ShellState,
  shouldAutostart,
} from './game/gameState';
import { soundFX } from './game/soundEffects';

const TOTAL_STORY_BLANKS = GOGEBASHVILI_STORIES.reduce(
  (sum, s) => sum + s.blanks.length,
  0
);

const INITIAL_STATS: RunStats = {
  storyBlanksFixed: 0,
  storyBlanksTotal: TOTAL_STORY_BLANKS,
  quizCorrect: 0,
  quizTotal: QUIZ_QUESTIONS.length,
  mazeLettersCollected: 0,
  mazeLettersTotal: 4,
  mazeSteps: 0,
  elapsedSeconds: 0,
};

export default function App() {
  const autostart =
    typeof window !== 'undefined' && shouldAutostart(window.location.search);

  const [shellState, setShellState] = useState<ShellState>(
    autostart ? 'playing' : 'title'
  );
  const [stage, setStage] = useState<GameStage>(
    autostart ? 'biography' : 'monument'
  );
  const [runId, setRunId] = useState(1);
  const [muted, setMuted] = useState(false);
  const [hymnFallback, setHymnFallback] = useState(false);
  const [stats, setStats] = useState<RunStats>(INITIAL_STATS);
  const elapsedRef = useRef(0);

  const hymnActive =
    (shellState === 'playing' || shellState === 'paused') &&
    (stage === 'maze' || stage === 'grave');

  // Sync document.body.dataset.state and stage music track ("ჰიმნი დედაენას" 4g_Swkil_PQ from Maze through Dedaena story frame)
  useEffect(() => {
    document.body.dataset.state = shellState;
    if (hymnActive) {
      if (hymnFallback) {
        soundFX.setMusicTrack('hymn');
      } else {
        soundFX.pauseMusic();
      }
      document.body.dataset.music = 'hymn';
    } else {
      document.body.dataset.music = soundFX.isMusicActive()
        ? soundFX.getCurrentTrack()
        : 'stopped';
    }
  }, [shellState, stage, hymnActive, hymnFallback]);

  // Track play duration only during active 'playing' state
  useEffect(() => {
    if (shellState !== 'playing') return;
    const interval = window.setInterval(() => {
      elapsedRef.current += 1;
    }, 1000);
    return () => window.clearInterval(interval);
  }, [shellState]);

  const startGame = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    soundFX.playBellChime();
    setHymnFallback(false);
    soundFX.startMusic('folk');
    elapsedRef.current = 0;
    setStats(INITIAL_STATS);
    setRunId((r) => r + 1);
    setStage('biography');
    setShellState('playing');
    document.body.dataset.state = 'playing';
  }, []);

  const returnToMonument = useCallback(() => {
    soundFX.stopMusic();
    setHymnFallback(false);
    elapsedRef.current = 0;
    setStats(INITIAL_STATS);
    setStage('monument');
    setShellState('title');
    document.body.dataset.state = 'title';
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      soundFX.setMuted(next);
      return next;
    });
  }, []);

  const togglePause = useCallback(() => {
    setShellState((prev) => {
      if (prev === 'playing') {
        soundFX.pauseMusic();
        return 'paused';
      }
      if (prev === 'paused') {
        if (!hymnActive || hymnFallback) {
          soundFX.resumeMusic();
        }
        return 'playing';
      }
      return prev;
    });
  }, [hymnActive, hymnFallback]);

  const handleHymnFallback = useCallback(() => {
    setHymnFallback(true);
    if (shellState === 'playing' && (stage === 'maze' || stage === 'grave')) {
      soundFX.setMusicTrack('hymn');
    }
  }, [shellState, stage]);

  // Global keyboard shortcuts (Title Enter/Space, Pause Esc/P, Mute M)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (shellState === 'title' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        startGame();
        return;
      }

      if (
        (e.key === 'Escape' || e.key.toLowerCase() === 'p') &&
        (shellState === 'playing' || shellState === 'paused')
      ) {
        e.preventDefault();
        togglePause();
        return;
      }

      if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [shellState, startGame, togglePause, toggleMute]);

  const handleBiographyComplete = useCallback(() => {
    setStage('stories');
  }, []);

  const handleStoryProgress = useCallback(
    (fixedCount: number, totalCount: number) => {
      setStats((prev) => ({
        ...prev,
        storyBlanksFixed: fixedCount,
        storyBlanksTotal: totalCount,
      }));
    },
    []
  );

  const handleStoriesComplete = useCallback(
    (fixedCount: number, totalCount: number) => {
      setStats((prev) => ({
        ...prev,
        storyBlanksFixed: fixedCount,
        storyBlanksTotal: totalCount,
      }));
      setStage('quiz');
    },
    []
  );

  const handleQuizComplete = useCallback((correctCount: number) => {
    setStats((prev) => ({
      ...prev,
      quizCorrect: correctCount,
    }));
    soundFX.pauseMusic();
    setStage('maze');
  }, []);

  const handleMazeComplete = useCallback(
    (lettersCollected: number, steps: number) => {
      setStats((prev) => ({
        ...prev,
        mazeLettersCollected: lettersCollected,
        mazeSteps: steps,
      }));
      setStage('grave');
    },
    []
  );

  const handleFinaleComplete = useCallback(() => {
    soundFX.stopMusic();
    setStats((prev) => ({
      ...prev,
      elapsedSeconds: elapsedRef.current,
    }));
    setShellState('gameover');
    document.body.dataset.state = 'gameover';
  }, []);

  return (
    <div className="georgian-heritage-bg min-h-screen w-full text-[#F4EFE4]">
      {shellState === 'title' || stage === 'monument' ? (
        <MonumentTitleScreen onStart={startGame} />
      ) : (
        <>
          <GameHud
            stage={stage}
            storyBlanksFixed={stats.storyBlanksFixed}
            storyBlanksTotal={stats.storyBlanksTotal}
            quizCorrect={stats.quizCorrect}
            quizTotal={stats.quizTotal}
            mazeLettersCollected={stats.mazeLettersCollected}
            mazeLettersTotal={stats.mazeLettersTotal}
            muted={muted}
            onToggleMute={toggleMute}
            onPause={togglePause}
          />

          {stage === 'biography' && (
            <BiographyStage
              key={`bio-${runId}`}
              onComplete={handleBiographyComplete}
            />
          )}

          {stage === 'stories' && (
            <StoriesStage
              key={`stories-${runId}`}
              onProgressChange={handleStoryProgress}
              onComplete={handleStoriesComplete}
            />
          )}

          {stage === 'quiz' && (
            <QuizStage
              key={`quiz-${runId}`}
              onComplete={handleQuizComplete}
            />
          )}

          {stage === 'maze' && (
            <MazeStage
              key={`maze-${runId}`}
              paused={shellState !== 'playing'}
              onComplete={handleMazeComplete}
            />
          )}

          {stage === 'grave' && (
            <GraveFinaleStage
              key={`grave-${runId}`}
              onFinish={handleFinaleComplete}
            />
          )}
        </>
      )}

      {shellState === 'paused' && (
        <PauseModal
          onResume={togglePause}
          onRestart={startGame}
          onReturnTitle={returnToMonument}
        />
      )}

      {shellState === 'gameover' && (
        <VictoryModal
          stats={stats}
          onPlayAgain={startGame}
          onReturnTitle={returnToMonument}
        />
      )}
      <DedaenaHymnPlayer
        active={hymnActive}
        paused={shellState !== 'playing'}
        muted={muted}
        onFallbackNeeded={handleHymnFallback}
      />
    </div>
  );
}
