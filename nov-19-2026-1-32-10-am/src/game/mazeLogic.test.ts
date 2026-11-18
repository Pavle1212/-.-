import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createMazeState,
  canMoveTo,
  movePlayer,
  findShortestPath,
  getTileVisibility,
  LANTERN_VISION_RADIUS,
  MAZE_COLS,
  MAZE_ROWS,
} from './mazeLogic';

test('maze initializes a larger 27x21 labyrinth with 4 letters and 4 violets', () => {
  const maze = createMazeState();
  assert.equal(maze.cols, MAZE_COLS);
  assert.equal(maze.rows, MAZE_ROWS);
  assert.equal(maze.player.x, 1);
  assert.equal(maze.player.y, 1);
  assert.equal(canMoveTo(maze.grid, maze.player.x, maze.player.y), true);
  assert.equal(canMoveTo(maze.grid, maze.goal.x, maze.goal.y), true);
  assert.equal(
    maze.collectibles.filter((c) => c.kind === 'letter').length,
    4
  );
  assert.equal(
    maze.collectibles.filter((c) => c.kind === 'violet').length,
    4
  );
});

test('challenging maze requires at least 45 steps and every collectible is reachable', () => {
  const maze = createMazeState();
  const pathToGoal = findShortestPath(maze.grid, maze.player, maze.goal);
  assert.ok(
    pathToGoal.length >= 45,
    `Expected challenging maze path (>= 45 steps), got ${pathToGoal.length}`
  );
  assert.deepEqual(pathToGoal[0], maze.player);
  assert.deepEqual(pathToGoal[pathToGoal.length - 1], maze.goal);

  for (const item of maze.collectibles) {
    const pathToItem = findShortestPath(maze.grid, maze.player, {
      x: item.x,
      y: item.y,
    });
    assert.ok(
      pathToItem.length > 0,
      `Collectible ${item.char} at (${item.x},${item.y}) must be reachable`
    );
  }
});

test('fog of war hides distant tiles outside lantern radius', () => {
  const player = { x: 1, y: 1 };
  assert.equal(getTileVisibility(player, { x: 1, y: 1 }), 1);
  assert.ok(getTileVisibility(player, { x: 2, y: 1 }) > 0.5);
  assert.equal(
    getTileVisibility(player, { x: 1 + Math.ceil(LANTERN_VISION_RADIUS) + 1, y: 1 }),
    0
  );
  assert.equal(getTileVisibility(player, { x: 25, y: 19 }), 0);
});

test('movePlayer blocks wall collisions, updates facing, and triggers win at goal', () => {
  let maze = createMazeState();
  const blocked = movePlayer(maze, 0, -1);
  assert.deepEqual(blocked.player, { x: 1, y: 1 });
  assert.deepEqual(blocked.facing, { x: 0, y: -1 });
  assert.equal(blocked.steps, 0);

  const path = findShortestPath(maze.grid, maze.player, maze.goal);
  for (let i = 1; i < path.length; i++) {
    const dx = path[i].x - maze.player.x;
    const dy = path[i].y - maze.player.y;
    maze = movePlayer(maze, dx, dy);
  }

  assert.equal(maze.won, true);
  assert.deepEqual(maze.player, maze.goal);
  assert.equal(maze.steps, path.length - 1);
  assert.ok(maze.score >= 100); // all 4 path letters collected (4 * 25) plus any path violets
});
