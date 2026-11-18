import { StorySceneData } from '../data/gogebashviliStoriesData';

export interface StoryProgress {
  discoveredClues: Record<string, boolean>;
  fixedBlanks: Record<string, string>;
}

export interface StoryStageState {
  stories: StorySceneData[];
  currentStoryIndex: number;
  activeBlankId: string;
  progressByStory: Record<number, StoryProgress>;
  mistakes: number;
  lastFeedback: {
    type: 'idle' | 'clue' | 'correct' | 'wrong';
    message: string;
  };
}

export function createStoryStageState(stories: StorySceneData[]): StoryStageState {
  const progressByStory: Record<number, StoryProgress> = {};
  for (const story of stories) {
    progressByStory[story.id] = {
      discoveredClues: {},
      fixedBlanks: {},
    };
  }

  return {
    stories,
    currentStoryIndex: 0,
    activeBlankId: stories[0]?.blanks[0]?.blankId ?? '',
    progressByStory,
    mistakes: 0,
    lastFeedback: {
      type: 'idle',
      message: 'იპოვე სცენაში მანათობელი ნაგლეჯები ან აირჩიე გამოტოვებული ადგილი.',
    },
  };
}

export function discoverSceneClue(
  state: StoryStageState,
  blankId: string
): StoryStageState {
  const story = state.stories[state.currentStoryIndex];
  if (!story) return state;

  const currentProgress = state.progressByStory[story.id] ?? {
    discoveredClues: {},
    fixedBlanks: {},
  };

  if (currentProgress.discoveredClues[blankId]) {
    return state;
  }

  const clue = story.blanks.find((b) => b.blankId === blankId);
  const nextActiveBlank =
    currentProgress.fixedBlanks[state.activeBlankId] || !state.activeBlankId
      ? blankId
      : state.activeBlankId;

  return {
    ...state,
    activeBlankId: nextActiveBlank,
    progressByStory: {
      ...state.progressByStory,
      [story.id]: {
        ...currentProgress,
        discoveredClues: {
          ...currentProgress.discoveredClues,
          [blankId]: true,
        },
      },
    },
    lastFeedback: {
      type: 'clue',
      message: clue
        ? `ნაპოვნია „${clue.clueTitle}“ — ახლა ჩასვი სწორი ფრაგმენტი ტექსტში!`
        : 'ნაგლეჯი ნაპოვნია!',
    },
  };
}

export function selectActiveBlank(
  state: StoryStageState,
  blankId: string
): StoryStageState {
  return {
    ...state,
    activeBlankId: blankId,
  };
}

export function attemptFixBlank(
  state: StoryStageState,
  blankId: string,
  choiceText: string
): { nextState: StoryStageState; isCorrect: boolean } {
  const story = state.stories[state.currentStoryIndex];
  if (!story) return { nextState: state, isCorrect: false };

  const blank = story.blanks.find((b) => b.blankId === blankId);
  if (!blank) return { nextState: state, isCorrect: false };

  const currentProgress = state.progressByStory[story.id] ?? {
    discoveredClues: {},
    fixedBlanks: {},
  };

  if (currentProgress.fixedBlanks[blankId]) {
    return { nextState: state, isCorrect: true };
  }

  if (blank.correctText === choiceText) {
    const nextFixed = {
      ...currentProgress.fixedBlanks,
      [blankId]: choiceText,
    };

    const nextDiscovered = {
      ...currentProgress.discoveredClues,
      [blankId]: true,
    };

    const nextOpenBlank = story.blanks.find((b) => !nextFixed[b.blankId]);

    return {
      isCorrect: true,
      nextState: {
        ...state,
        activeBlankId: nextOpenBlank ? nextOpenBlank.blankId : '',
        progressByStory: {
          ...state.progressByStory,
          [story.id]: {
            discoveredClues: nextDiscovered,
            fixedBlanks: nextFixed,
          },
        },
        lastFeedback: {
          type: 'correct',
          message:
            blank.kind === 'sentence'
              ? 'ბრავო! გამოტოვებული წინადადება ზუსტად აღადგინე.'
              : 'შესანიშნავია! გამოტოვებული სიტყვა სწორად ჩასვი.',
        },
      },
    };
  }

  return {
    isCorrect: false,
    nextState: {
      ...state,
      mistakes: state.mistakes + 1,
      lastFeedback: {
        type: 'wrong',
        message:
          blank.kind === 'sentence'
            ? 'ეს წინადადება არ შეესაბამება მოთხრობის აზრს — სცადე სხვა ფრაგმენტი.'
            : 'ეს სიტყვა ზუსტი არ არის — დააკვირდი წინადადების შინაარსს და სცადე თავიდან.',
      },
    },
  };
}

export function isCurrentStoryComplete(state: StoryStageState): boolean {
  const story = state.stories[state.currentStoryIndex];
  if (!story) return false;
  const progress = state.progressByStory[story.id];
  if (!progress) return false;
  return story.blanks.every((b) => Boolean(progress.fixedBlanks[b.blankId]));
}

export function advanceToStory(
  state: StoryStageState,
  targetIndex: number
): StoryStageState {
  if (targetIndex < 0 || targetIndex >= state.stories.length) {
    return state;
  }
  const targetStory = state.stories[targetIndex];
  const progress = state.progressByStory[targetStory.id];
  const firstOpen = targetStory.blanks.find(
    (b) => !progress?.fixedBlanks[b.blankId]
  );

  return {
    ...state,
    currentStoryIndex: targetIndex,
    activeBlankId: firstOpen ? firstOpen.blankId : '',
    lastFeedback: {
      type: 'idle',
      message: 'იპოვე სცენაში მანათობელი ნაგლეჯები და გაასწორე გამოტოვებული ადგილები.',
    },
  };
}

export function getStoryTotals(state: StoryStageState): {
  fixedCount: number;
  totalBlanks: number;
  discoveredCount: number;
} {
  let fixedCount = 0;
  let totalBlanks = 0;
  let discoveredCount = 0;

  for (const story of state.stories) {
    totalBlanks += story.blanks.length;
    const prog = state.progressByStory[story.id];
    if (prog) {
      fixedCount += Object.keys(prog.fixedBlanks).length;
      discoveredCount += Object.keys(prog.discoveredClues).length;
    }
  }

  return { fixedCount, totalBlanks, discoveredCount };
}
