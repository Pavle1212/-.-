export type CellType = 0 | 1; // 0 = walkable stone path, 1 = cypress/stone wall

export interface Point {
  x: number;
  y: number;
}

export interface CollectibleItem {
  id: string;
  kind: 'letter' | 'violet';
  char: string;
  x: number;
  y: number;
  collected: boolean;
}

export interface MazeState {
  cols: number;
  rows: number;
  grid: CellType[][];
  player: Point;
  facing: Point;
  goal: Point;
  collectibles: CollectibleItem[];
  steps: number;
  score: number;
  won: boolean;
}

export const MAZE_COLS = 27;
export const MAZE_ROWS = 21;
export const LANTERN_VISION_RADIUS = 3.4;

function createSeededRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Generates a challenging, winding 27x21 labyrinth using iterative randomized
 * depth-first recursive backtracker with deterministic seed so tests and runs
 * are consistent while offering real dead-ends and branching corridors.
 */
export function generateMazeGrid(
  cols = MAZE_COLS,
  rows = MAZE_ROWS,
  seed = 1876
): CellType[][] {
  const grid: CellType[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 1 as CellType)
  );
  const rand = createSeededRng(seed);

  const stack: Point[] = [{ x: 1, y: 1 }];
  grid[1][1] = 0;

  const dirs: Point[] = [
    { x: 2, y: 0 },
    { x: -2, y: 0 },
    { x: 0, y: 2 },
    { x: 0, y: -2 },
  ];

  while (stack.length > 0) {
    const curr = stack[stack.length - 1];
    const neighbors: { nx: number; ny: number; wx: number; wy: number }[] = [];

    for (const d of dirs) {
      const nx = curr.x + d.x;
      const ny = curr.y + d.y;
      if (nx > 0 && nx < cols - 1 && ny > 0 && ny < rows - 1 && grid[ny][nx] === 1) {
        neighbors.push({
          nx,
          ny,
          wx: curr.x + d.x / 2,
          wy: curr.y + d.y / 2,
        });
      }
    }

    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }

    const pick = neighbors[Math.floor(rand() * neighbors.length)];
    grid[pick.wy][pick.wx] = 0;
    grid[pick.ny][pick.nx] = 0;
    stack.push({ x: pick.nx, y: pick.ny });
  }

  return grid;
}

function collectWalkableCells(grid: CellType[][]): Point[] {
  const list: Point[] = [];
  for (let y = 1; y < grid.length - 1; y++) {
    for (let x = 1; x < grid[0].length - 1; x++) {
      if (grid[y][x] === 0) {
        list.push({ x, y });
      }
    }
  }
  return list;
}

export function createMazeState(seed = 1876): MazeState {
  const grid = generateMazeGrid(MAZE_COLS, MAZE_ROWS, seed);
  const start: Point = { x: 1, y: 1 };
  const goal: Point = { x: MAZE_COLS - 2, y: MAZE_ROWS - 2 };

  const shortestPath = findShortestPath(grid, start, goal);
  const walkable = collectWalkableCells(grid).filter(
    (p) =>
      !(p.x === start.x && p.y === start.y) &&
      !(p.x === goal.x && p.y === goal.y)
  );

  // Place 4 golden letters ('დ', 'ე', 'დ', 'ა') spread along and near the maze route
  const pathIndices = [
    Math.floor(shortestPath.length * 0.2),
    Math.floor(shortestPath.length * 0.45),
    Math.floor(shortestPath.length * 0.68),
    Math.floor(shortestPath.length * 0.86),
  ];
  const letterChars = ['დ', 'ე', 'დ', 'ა'];
  const usedKeys = new Set<string>([
    `${start.x},${start.y}`,
    `${goal.x},${goal.y}`,
  ]);

  const collectibles: CollectibleItem[] = [];

  letterChars.forEach((ch, idx) => {
    const pt = shortestPath[pathIndices[idx]] ?? walkable[idx * 5];
    usedKeys.add(`${pt.x},${pt.y}`);
    collectibles.push({
      id: `l${idx + 1}`,
      kind: 'letter',
      char: ch,
      x: pt.x,
      y: pt.y,
      collected: false,
    });
  });

  // Place 4 bonus violets in deeper side branches
  const offPathCandidates = walkable.filter(
    (p) => !usedKeys.has(`${p.x},${p.y}`)
  );
  for (let v = 0; v < 4; v++) {
    const pickIdx = Math.floor(((v + 1) * offPathCandidates.length) / 5);
    const pt = offPathCandidates[pickIdx];
    if (pt) {
      usedKeys.add(`${pt.x},${pt.y}`);
      collectibles.push({
        id: `v${v + 1}`,
        kind: 'violet',
        char: 'ია',
        x: pt.x,
        y: pt.y,
        collected: false,
      });
    }
  }

  return {
    cols: MAZE_COLS,
    rows: MAZE_ROWS,
    grid,
    player: start,
    facing: { x: 1, y: 0 },
    goal,
    collectibles,
    steps: 0,
    score: 0,
    won: false,
  };
}

export function canMoveTo(grid: CellType[][], x: number, y: number): boolean {
  if (y < 0 || y >= grid.length) return false;
  if (x < 0 || x >= grid[0].length) return false;
  return grid[y][x] === 0;
}

export function getTileDistance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Returns normalized light visibility [0..1] for fog-of-war rendering:
 * 1 = brightly lit near player, 0 = shrouded in darkness beyond lantern radius.
 */
export function getTileVisibility(
  playerPos: Point,
  tilePos: Point,
  visionRadius = LANTERN_VISION_RADIUS
): number {
  const dist = getTileDistance(playerPos, tilePos);
  if (dist >= visionRadius) return 0;
  const t = 1 - dist / visionRadius;
  return Math.min(1, Math.max(0, t * t * (3 - 2 * t) * 1.15));
}

export function movePlayer(state: MazeState, dx: number, dy: number): MazeState {
  if (state.won) return state;
  if (Math.abs(dx) + Math.abs(dy) !== 1) return state;

  const nx = state.player.x + dx;
  const ny = state.player.y + dy;

  if (!canMoveTo(state.grid, nx, ny)) {
    return {
      ...state,
      facing: { x: dx, y: dy },
    };
  }

  let addedScore = 0;
  const nextCollectibles = state.collectibles.map((item) => {
    if (!item.collected && item.x === nx && item.y === ny) {
      addedScore += item.kind === 'letter' ? 25 : 15;
      return { ...item, collected: true };
    }
    return item;
  });

  const reachedGoal = nx === state.goal.x && ny === state.goal.y;

  return {
    ...state,
    player: { x: nx, y: ny },
    facing: { x: dx, y: dy },
    collectibles: nextCollectibles,
    steps: state.steps + 1,
    score: state.score + addedScore,
    won: reachedGoal,
  };
}

export function findShortestPath(
  grid: CellType[][],
  start: Point,
  goal: Point
): Point[] {
  if (!canMoveTo(grid, start.x, start.y) || !canMoveTo(grid, goal.x, goal.y)) {
    return [];
  }

  const key = (p: Point) => `${p.x},${p.y}`;
  const queue: Point[] = [start];
  const visited = new Set<string>([key(start)]);
  const parent = new Map<string, Point>();
  const dirs: Point[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr.x === goal.x && curr.y === goal.y) {
      const path: Point[] = [];
      let trace: Point | undefined = curr;
      while (trace) {
        path.unshift(trace);
        trace = parent.get(key(trace));
      }
      return path;
    }

    for (const d of dirs) {
      const next = { x: curr.x + d.x, y: curr.y + d.y };
      const nextKey = key(next);
      if (canMoveTo(grid, next.x, next.y) && !visited.has(nextKey)) {
        visited.add(nextKey);
        parent.set(nextKey, curr);
        queue.push(next);
      }
    }
  }

  return [];
}
