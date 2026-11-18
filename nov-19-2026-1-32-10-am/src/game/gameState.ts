export type ShellState = 'title' | 'playing' | 'paused' | 'gameover';
export type GameStage =
  | 'monument'
  | 'biography'
  | 'stories'
  | 'quiz'
  | 'maze'
  | 'grave';

export interface RunStats {
  storyBlanksFixed: number;
  storyBlanksTotal: number;
  quizCorrect: number;
  quizTotal: number;
  mazeLettersCollected: number;
  mazeLettersTotal: number;
  mazeSteps: number;
  elapsedSeconds: number;
}

export function formatElapsedTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function getMasteryTitle(stats: RunStats): string {
  const quizRatio = stats.quizTotal > 0 ? stats.quizCorrect / stats.quizTotal : 0;
  const letterRatio =
    stats.mazeLettersTotal > 0
      ? stats.mazeLettersCollected / stats.mazeLettersTotal
      : 0;
  const storyRatio =
    stats.storyBlanksTotal > 0
      ? stats.storyBlanksFixed / stats.storyBlanksTotal
      : 1;

  if (quizRatio === 1 && letterRatio === 1 && storyRatio === 1) {
    return 'დედაენის საპატიო მცველი';
  }
  if (quizRatio >= 0.8 && storyRatio >= 0.8) {
    return 'ქართული სიტყვის ერთგული მოწაფე';
  }
  return 'მთაწმინდის გზის გამგრძელებელი';
}

export function shouldAutostart(search: string): boolean {
  const params = new URLSearchParams(search);
  return params.get('autostart') === '1';
}

export function getStageOrderIndex(stage: GameStage): number {
  const order: GameStage[] = [
    'monument',
    'biography',
    'stories',
    'quiz',
    'maze',
    'grave',
  ];
  return order.indexOf(stage);
}
