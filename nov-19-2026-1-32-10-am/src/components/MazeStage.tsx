import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  createMazeState,
  findShortestPath,
  getTileVisibility,
  LANTERN_VISION_RADIUS,
  MazeState,
  movePlayer,
  Point,
} from '../game/mazeLogic';
import { soundFX } from '../game/soundEffects';

interface MazeStageProps {
  paused: boolean;
  onComplete: (lettersCollected: number, steps: number) => void;
}

interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface FloatingLabel {
  active: boolean;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

export const MazeStage: React.FC<MazeStageProps> = ({ paused, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mazeRef = useRef<MazeState>(createMazeState());
  const visualPosRef = useRef<{ x: number; y: number }>({ x: 1, y: 1 });
  const visitedRef = useRef<Set<string>>(new Set(['1,1']));
  const bounceRef = useRef<number>(0);
  const compassTimerRef = useRef<number>(0);
  const compassDirRef = useRef<Point | null>(null);
  const pausedRef = useRef<boolean>(paused);
  const wonTimerRef = useRef<number | null>(null);

  const particlesRef = useRef<Particle[]>(
    Array.from({ length: 48 }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 0.6,
      color: '#F3C96B',
      size: 3,
    }))
  );
  const labelsRef = useRef<FloatingLabel[]>(
    Array.from({ length: 8 }, () => ({
      active: false,
      x: 0,
      y: 0,
      text: '',
      color: '#F3C96B',
      life: 0,
    }))
  );

  const [hudSnapshot, setHudSnapshot] = useState({
    steps: 0,
    score: 0,
    collectedChars: [] as string[],
    totalLetters: 4,
    violetsCollected: 0,
    totalViolets: 4,
    compassCharges: 3,
    won: false,
  });

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    canvasRef.current?.focus({ preventScroll: true });
  }, []);

  const spawnBurst = useCallback(
    (gridX: number, gridY: number, color: string, labelText: string) => {
      const pool = particlesRef.current;
      let spawned = 0;
      for (let i = 0; i < pool.length && spawned < 14; i++) {
        if (!pool[i].active) {
          const angle = (Math.PI * 2 * spawned) / 14 + Math.random() * 0.3;
          const speed = 1.6 + Math.random() * 2.2;
          pool[i].active = true;
          pool[i].x = gridX + 0.5;
          pool[i].y = gridY + 0.5;
          pool[i].vx = Math.cos(angle) * speed;
          pool[i].vy = Math.sin(angle) * speed;
          pool[i].life = 0.55;
          pool[i].maxLife = 0.55;
          pool[i].color = color;
          pool[i].size = 3 + Math.random() * 2.5;
          spawned++;
        }
      }

      const lpool = labelsRef.current;
      for (let i = 0; i < lpool.length; i++) {
        if (!lpool[i].active) {
          lpool[i].active = true;
          lpool[i].x = gridX + 0.5;
          lpool[i].y = gridY + 0.25;
          lpool[i].text = labelText;
          lpool[i].color = color;
          lpool[i].life = 0.9;
          break;
        }
      }
    },
    []
  );

  const triggerMove = useCallback(
    (dx: number, dy: number) => {
      if (pausedRef.current || mazeRef.current.won) return;

      const prev = mazeRef.current;
      const next = movePlayer(prev, dx, dy);
      mazeRef.current = next;

      if (next.steps === prev.steps) return;

      visitedRef.current.add(`${next.player.x},${next.player.y}`);
      bounceRef.current = 1;

      const newlyCollected = next.collectibles.find(
        (c, idx) => c.collected && !prev.collectibles[idx].collected
      );

      if (newlyCollected) {
        if (newlyCollected.kind === 'letter') {
          soundFX.playCollectLetter();
          spawnBurst(
            newlyCollected.x,
            newlyCollected.y,
            '#F3C96B',
            `${newlyCollected.char}! +25`
          );
        } else {
          soundFX.playCollectViolet();
          spawnBurst(
            newlyCollected.x,
            newlyCollected.y,
            '#C4B5FD',
            'ია! +15'
          );
        }
      } else {
        soundFX.playStep();
      }

      if (compassTimerRef.current > 0) {
        const path = findShortestPath(next.grid, next.player, next.goal);
        compassDirRef.current = path[1]
          ? { x: path[1].x - next.player.x, y: path[1].y - next.player.y }
          : null;
      }

      const collectedLetters = next.collectibles.filter(
        (c) => c.kind === 'letter' && c.collected
      );
      const collectedViolets = next.collectibles.filter(
        (c) => c.kind === 'violet' && c.collected
      );

      setHudSnapshot((s) => ({
        ...s,
        steps: next.steps,
        score: next.score,
        collectedChars: collectedLetters.map((c) => c.char),
        violetsCollected: collectedViolets.length,
        won: next.won,
      }));

      if (next.won) {
        soundFX.playBellChime();
        spawnBurst(next.goal.x, next.goal.y, '#A78BFA', 'საფლავი!');
        wonTimerRef.current = window.setTimeout(() => {
          onComplete(collectedLetters.length, next.steps);
        }, 700);
      }
    },
    [onComplete, spawnBurst]
  );

  const activateCompassPulse = () => {
    if (hudSnapshot.compassCharges <= 0 || mazeRef.current.won) return;
    const path = findShortestPath(
      mazeRef.current.grid,
      mazeRef.current.player,
      mazeRef.current.goal
    );
    if (path.length > 1) {
      compassDirRef.current = {
        x: path[1].x - mazeRef.current.player.x,
        y: path[1].y - mazeRef.current.player.y,
      };
      compassTimerRef.current = 3.2;
      soundFX.playPageTurn();
      setHudSnapshot((s) => ({
        ...s,
        compassCharges: Math.max(0, s.compassCharges - 1),
      }));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (pausedRef.current || mazeRef.current.won) return;
      const k = e.key.toLowerCase();
      if (k === 'arrowup' || k === 'w') {
        e.preventDefault();
        triggerMove(0, -1);
      } else if (k === 'arrowdown' || k === 's') {
        e.preventDefault();
        triggerMove(0, 1);
      } else if (k === 'arrowleft' || k === 'a') {
        e.preventDefault();
        triggerMove(-1, 0);
      } else if (k === 'arrowright' || k === 'd') {
        e.preventDefault();
        triggerMove(1, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (wonTimerRef.current !== null) {
        window.clearTimeout(wonTimerRef.current);
      }
    };
  }, [triggerMove]);

  // Scrolling 2D Adventure Camera + Lantern Fog-of-War Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let lastTime = performance.now();

    const draw = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const state = mazeRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth || 720;
      const cssH = canvas.clientHeight || 520;
      if (
        canvas.width !== Math.round(cssW * dpr) ||
        canvas.height !== Math.round(cssH * dpr)
      ) {
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Dark Mtatsminda nocturnal void
      ctx.fillStyle = '#07090D';
      ctx.fillRect(0, 0, cssW, cssH);

      // Smoothly track player position with scrolling camera
      const lerpAlpha = 1 - Math.exp(-15 * dt);
      visualPosRef.current.x +=
        (state.player.x - visualPosRef.current.x) * lerpAlpha;
      visualPosRef.current.y +=
        (state.player.y - visualPosRef.current.y) * lerpAlpha;
      bounceRef.current = Math.max(0, bounceRef.current - dt * 4.5);
      if (compassTimerRef.current > 0) {
        compassTimerRef.current = Math.max(0, compassTimerRef.current - dt);
      }

      // Zoomed-in 2D adventure viewport (~10.5 tiles wide so distant map is off-screen + fogged)
      const tileSize = Math.max(46, Math.min(68, cssW / 10.5));
      const centerX = cssW / 2;
      const centerY = cssH / 2;
      const camOffsetX = centerX - (visualPosRef.current.x + 0.5) * tileSize;
      const camOffsetY = centerY - (visualPosRef.current.y + 0.5) * tileSize;

      const flicker = 1 + Math.sin(now * 0.009) * 0.04;
      const visionR = LANTERN_VISION_RADIUS * flicker;

      // Determine visible tile bounds around camera
      const minX = Math.max(0, Math.floor((0 - camOffsetX) / tileSize) - 1);
      const maxX = Math.min(
        state.cols - 1,
        Math.ceil((cssW - camOffsetX) / tileSize) + 1
      );
      const minY = Math.max(0, Math.floor((0 - camOffsetY) / tileSize) - 1);
      const maxY = Math.min(
        state.rows - 1,
        Math.ceil((cssH - camOffsetY) / tileSize) + 1
      );

      // Draw ONLY nearby tiles within lantern radius (strict Fog-of-War!)
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const vis = getTileVisibility(visualPosRef.current, { x, y }, visionR);
          if (vis <= 0.01) continue;

          const px = camOffsetX + x * tileSize;
          const py = camOffsetY + y * tileSize;
          const hash = (x * 73856093) ^ (y * 19349663);

          ctx.save();
          ctx.globalAlpha = vis;

          if (state.grid[y][x] === 1) {
            // 3D Carved Stone Plinth + Layered Mtatsminda Cypress Shrub Wall
            ctx.fillStyle = '#0F1C18';
            ctx.fillRect(px, py, tileSize + 0.6, tileSize + 0.6);

            // Chiseled Stone Base Rim
            ctx.fillStyle = '#2B3542';
            ctx.fillRect(px + 2, py + tileSize * 0.64, tileSize - 4, tileSize * 0.32);
            ctx.fillStyle = '#3E4B5C';
            ctx.fillRect(px + 2, py + tileSize * 0.64, tileSize - 4, 3);
            ctx.strokeStyle = 'rgba(15, 23, 32, 0.55)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px + tileSize * 0.45, py + tileSize * 0.64);
            ctx.lineTo(px + tileSize * 0.45, py + tileSize * 0.96);
            ctx.stroke();

            // Multi-layered Cypress Hedge Canopy with Moonlit Rim
            ctx.fillStyle = '#183328';
            ctx.beginPath();
            ctx.roundRect(px + 3, py + 3, tileSize - 6, tileSize * 0.72, 9);
            ctx.fill();

            ctx.fillStyle = '#244A3A';
            ctx.beginPath();
            ctx.arc(px + tileSize * 0.36, py + tileSize * 0.44, tileSize * 0.25, 0, Math.PI * 2);
            ctx.arc(px + tileSize * 0.65, py + tileSize * 0.42, tileSize * 0.23, 0, Math.PI * 2);
            ctx.arc(px + tileSize * 0.5, py + tileSize * 0.28, tileSize * 0.26, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#346650';
            ctx.beginPath();
            ctx.arc(px + tileSize * 0.46, py + tileSize * 0.26, tileSize * 0.16, 0, Math.PI * 2);
            ctx.fill();

            if ((hash & 3) === 0) {
              // Subtle wild violet/moss accent on select wall hedges
              ctx.fillStyle = '#6D5B9E';
              ctx.beginPath();
              ctx.arc(px + tileSize * 0.7, py + tileSize * 0.56, 2.3, 0, Math.PI * 2);
              ctx.fill();
            }
          } else {
            // Textured Cobblestone Courtyard Flagstones
            const baseTone = (x + y) % 2 === 0 ? '#242C3A' : '#293242';
            ctx.fillStyle = baseTone;
            ctx.fillRect(px, py, tileSize + 0.6, tileSize + 0.6);

            // Split Flagstone Mortar Seam Pattern (deterministic per tile)
            ctx.strokeStyle = 'rgba(12, 16, 23, 0.52)';
            ctx.lineWidth = 1.2;
            ctx.strokeRect(px + 1, py + 1, tileSize - 2, tileSize - 2);
            if ((hash & 1) === 0) {
              ctx.beginPath();
              ctx.moveTo(px + tileSize * 0.52, py + 2);
              ctx.lineTo(px + tileSize * 0.48, py + tileSize - 2);
              ctx.moveTo(px + 2, py + tileSize * 0.55);
              ctx.lineTo(px + tileSize * 0.5, py + tileSize * 0.55);
              ctx.stroke();
            } else {
              ctx.beginPath();
              ctx.moveTo(px + 2, py + tileSize * 0.48);
              ctx.lineTo(px + tileSize - 2, py + tileSize * 0.52);
              ctx.moveTo(px + tileSize * 0.45, py + 2);
              ctx.lineTo(px + tileSize * 0.45, py + tileSize * 0.48);
              ctx.stroke();
            }

            // Subtle Top-Left Bevel Highlight on Flagstones
            ctx.strokeStyle = 'rgba(212, 163, 74, 0.08)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px + 3, py + tileSize - 3);
            ctx.lineTo(px + 3, py + 3);
            ctx.lineTo(px + tileSize - 3, py + 3);
            ctx.stroke();

            // Subtle Golden Trail Pebble on Visited Tiles
            if (visitedRef.current.has(`${x},${y}`)) {
              ctx.fillStyle = 'rgba(212, 163, 74, 0.25)';
              ctx.beginPath();
              ctx.arc(px + tileSize * 0.5, py + tileSize * 0.52, 2.6, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.restore();
        }
      }

      // Draw Goal ONLY if within lantern sight
      {
        const goalVis = getTileVisibility(
          visualPosRef.current,
          state.goal,
          visionR + 0.6
        );
        if (goalVis > 0.02) {
          const gx = camOffsetX + (state.goal.x + 0.5) * tileSize;
          const gy = camOffsetY + (state.goal.y + 0.5) * tileSize;
          ctx.save();
          ctx.globalAlpha = goalVis;
          const grad = ctx.createRadialGradient(
            gx,
            gy,
            tileSize * 0.1,
            gx,
            gy,
            tileSize * 1.05
          );
          grad.addColorStop(0, 'rgba(167, 139, 250, 0.72)');
          grad.addColorStop(0.6, 'rgba(243, 201, 107, 0.2)');
          grad.addColorStop(1, 'rgba(167, 139, 250, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(gx, gy, tileSize * 1.05, 0, Math.PI * 2);
          ctx.fill();

          // Carved Mtatsminda Stepped Stone Plinth & Cross
          ctx.fillStyle = '#5D6675';
          ctx.fillRect(gx - tileSize * 0.28, gy + tileSize * 0.18, tileSize * 0.56, tileSize * 0.14);
          ctx.fillStyle = '#9BA4B5';
          ctx.fillRect(gx - tileSize * 0.08, gy - tileSize * 0.34, tileSize * 0.16, tileSize * 0.54);
          ctx.fillRect(gx - tileSize * 0.22, gy - tileSize * 0.2, tileSize * 0.44, tileSize * 0.13);
          ctx.strokeStyle = '#D4A34A';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(gx, gy - tileSize * 0.135, tileSize * 0.055, 0, Math.PI * 2);
          ctx.stroke();

          // Blooming Violet Next to Grave
          const vr = tileSize * 0.065;
          const vx = gx + tileSize * 0.18;
          const vy = gy + tileSize * 0.2;
          ctx.fillStyle = '#A78BFA';
          for (let p = 0; p < 5; p++) {
            const a = (Math.PI * 2 * p) / 5;
            ctx.beginPath();
            ctx.arc(vx + Math.cos(a) * vr, vy + Math.sin(a) * vr, vr * 0.9, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#FDE047';
          ctx.beginPath();
          ctx.arc(vx, vy, vr * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Draw Collectibles ONLY if within lantern radius
      for (const item of state.collectibles) {
        if (item.collected) continue;
        const vis = getTileVisibility(visualPosRef.current, item, visionR);
        if (vis <= 0.02) continue;

        const lx = camOffsetX + (item.x + 0.5) * tileSize;
        const ly =
          camOffsetY +
          (item.y + 0.5) * tileSize +
          Math.sin(now * 0.0045 + item.x) * 2.5;

        ctx.save();
        ctx.globalAlpha = vis;
        if (item.kind === 'letter') {
          ctx.fillStyle = 'rgba(243, 201, 107, 0.26)';
          ctx.beginPath();
          ctx.arc(lx, ly, tileSize * 0.36, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(243, 201, 107, 0.72)';
          ctx.lineWidth = 1.4;
          ctx.stroke();

          ctx.fillStyle = '#F3C96B';
          ctx.font = `700 ${Math.round(tileSize * 0.45)}px "Noto Serif Georgian", serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item.char, lx, ly + 1);
        } else {
          const r = tileSize * 0.11;
          ctx.fillStyle = 'rgba(167, 139, 250, 0.22)';
          ctx.beginPath();
          ctx.arc(lx, ly, tileSize * 0.28, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#A78BFA';
          for (let p = 0; p < 5; p++) {
            const a = (Math.PI * 2 * p) / 5;
            ctx.beginPath();
            ctx.arc(
              lx + Math.cos(a) * r,
              ly + Math.sin(a) * r,
              r * 0.9,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
          ctx.fillStyle = '#FDE047';
          ctx.beginPath();
          ctx.arc(lx, ly, r * 0.55, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Subtle Ambient Golden Firefly Motes inside Lantern Aura
      for (let f = 0; f < 5; f++) {
        const angle = now * 0.0012 + f * 1.3;
        const rad = tileSize * (0.9 + (f % 3) * 0.55);
        const fx = centerX + Math.cos(angle) * rad;
        const fy = centerY + Math.sin(angle * 1.2) * rad * 0.8;
        ctx.fillStyle = `rgba(253, 230, 138, ${0.28 + 0.18 * Math.sin(now * 0.004 + f)})`;
        ctx.beginPath();
        ctx.arc(fx, fy, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Detailed 2D Traveler Hero Sprite at Center of Camera
      {
        const bob = Math.sin(bounceRef.current * Math.PI) * tileSize * 0.11;
        const stride = Math.sin(bounceRef.current * Math.PI * 2) * tileSize * 0.06;
        const px = centerX;
        const py = centerY - bob;

        // Warm flickering lantern glow
        const aura = ctx.createRadialGradient(
          px,
          py,
          tileSize * 0.15,
          px,
          py,
          tileSize * LANTERN_VISION_RADIUS * 0.95
        );
        aura.addColorStop(0, 'rgba(243, 201, 107, 0.3)');
        aura.addColorStop(0.55, 'rgba(243, 201, 107, 0.09)');
        aura.addColorStop(1, 'rgba(7, 9, 13, 0)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(px, py, tileSize * LANTERN_VISION_RADIUS * 0.95, 0, Math.PI * 2);
        ctx.fill();

        // Ground shadow
        ctx.fillStyle = 'rgba(0,0,0,0.48)';
        ctx.beginPath();
        ctx.ellipse(px, py + tileSize * 0.31, tileSize * 0.22, tileSize * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();

        // Walking Boots
        ctx.fillStyle = '#3D2518';
        ctx.beginPath();
        ctx.roundRect(px - tileSize * 0.13, py + tileSize * 0.22 + stride * 0.5, tileSize * 0.1, tileSize * 0.09, 3);
        ctx.roundRect(px + tileSize * 0.03, py + tileSize * 0.22 - stride * 0.5, tileSize * 0.1, tileSize * 0.09, 3);
        ctx.fill();

        // Shaded Georgian Traveler Coat & Lapels
        ctx.fillStyle = '#2B4563';
        ctx.strokeStyle = '#19293D';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(
          px - tileSize * 0.2,
          py - tileSize * 0.02,
          tileSize * 0.4,
          tileSize * 0.26,
          7
        );
        ctx.fill();
        ctx.stroke();

        // Coat Collar & Cream Shirt
        ctx.fillStyle = '#F3EFE4';
        ctx.beginPath();
        ctx.moveTo(px - tileSize * 0.06, py - tileSize * 0.02);
        ctx.lineTo(px + tileSize * 0.06, py - tileSize * 0.02);
        ctx.lineTo(px, py + tileSize * 0.08);
        ctx.closePath();
        ctx.fill();

        // Leather Satchel Strap + Brass Buckle
        ctx.strokeStyle = '#9C6644';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(px - tileSize * 0.15, py);
        ctx.lineTo(px + tileSize * 0.16, py + tileSize * 0.21);
        ctx.stroke();
        ctx.fillStyle = '#D4A34A';
        ctx.fillRect(px + tileSize * 0.02, py + tileSize * 0.09, 4, 4);

        // Neck & Shaded Ears
        ctx.fillStyle = '#D6A080';
        ctx.fillRect(px - tileSize * 0.05, py - tileSize * 0.06, tileSize * 0.1, tileSize * 0.06);
        ctx.beginPath();
        ctx.arc(px - tileSize * 0.16, py - tileSize * 0.13, tileSize * 0.04, 0, Math.PI * 2);
        ctx.arc(px + tileSize * 0.16, py - tileSize * 0.13, tileSize * 0.04, 0, Math.PI * 2);
        ctx.fill();

        // Contoured Face
        ctx.fillStyle = '#F2C6A8';
        ctx.beginPath();
        ctx.arc(px, py - tileSize * 0.13, tileSize * 0.165, 0, Math.PI * 2);
        ctx.fill();

        // Traditional Peaked Georgian Cap with Gold Trim & Hair Tufts
        ctx.fillStyle = '#1E2532';
        ctx.beginPath();
        ctx.arc(px, py - tileSize * 0.165, tileSize * 0.17, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#D4A34A';
        ctx.fillRect(
          px - tileSize * 0.175,
          py - tileSize * 0.18,
          tileSize * 0.35,
          tileSize * 0.042
        );

        // Directional Brows, Whites of Eyes, Pupils & Warm Smile
        const ex = state.facing.x * tileSize * 0.035;
        const ey = state.facing.y * tileSize * 0.02;
        ctx.strokeStyle = '#2B2320';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(px - tileSize * 0.09 + ex, py - tileSize * 0.14 + ey);
        ctx.lineTo(px - tileSize * 0.03 + ex, py - tileSize * 0.145 + ey);
        ctx.moveTo(px + tileSize * 0.03 + ex, py - tileSize * 0.145 + ey);
        ctx.lineTo(px + tileSize * 0.09 + ex, py - tileSize * 0.14 + ey);
        ctx.stroke();

        ctx.fillStyle = '#FFFDF9';
        ctx.beginPath();
        ctx.ellipse(px - tileSize * 0.06 + ex, py - tileSize * 0.11 + ey, 3.1, 2.1, 0, 0, Math.PI * 2);
        ctx.ellipse(px + tileSize * 0.06 + ex, py - tileSize * 0.11 + ey, 3.1, 2.1, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1F2937';
        ctx.beginPath();
        ctx.arc(px - tileSize * 0.06 + ex * 1.2, py - tileSize * 0.11 + ey * 1.2, 1.5, 0, Math.PI * 2);
        ctx.arc(px + tileSize * 0.06 + ex * 1.2, py - tileSize * 0.11 + ey * 1.2, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#A86E50';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(px + ex * 0.6, py - tileSize * 0.06 + ey * 0.5, 3.2, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // Ornate Handheld Brass Lantern
        const lx = px + (state.facing.x !== 0 ? state.facing.x * tileSize * 0.24 : tileSize * 0.23);
        const ly = py + tileSize * 0.06 + state.facing.y * tileSize * 0.12;
        ctx.fillStyle = '#926B2A';
        ctx.fillRect(lx - 4.5, ly - 6, 9, 12);
        ctx.fillStyle = '#FDE68A';
        ctx.beginPath();
        ctx.arc(lx, ly, tileSize * 0.068, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#78350F';
        ctx.lineWidth = 1.4;
        ctx.strokeRect(lx - 4.5, ly - 6, 9, 12);

        // Optional Directional Compass Pulse Arrow (when player uses 1 of 3 charges)
        if (compassTimerRef.current > 0 && compassDirRef.current) {
          const cd = compassDirRef.current;
          const ax = px + cd.x * tileSize * 0.72;
          const ay = py + cd.y * tileSize * 0.72;
          const angle = Math.atan2(cd.y, cd.x);
          ctx.save();
          ctx.translate(ax, ay);
          ctx.rotate(angle);
          ctx.globalAlpha = Math.min(1, compassTimerRef.current);
          ctx.fillStyle = '#F3C96B';
          ctx.beginPath();
          ctx.moveTo(10, 0);
          ctx.lineTo(-6, -7);
          ctx.lineTo(-3, 0);
          ctx.lineTo(-6, 7);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      // Pooled Particles
      const pool = particlesRef.current;
      for (let i = 0; i < pool.length; i++) {
        const p = pool[i];
        if (!p.active) continue;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life <= 0) {
          p.active = false;
          continue;
        }
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(
          camOffsetX + p.x * tileSize,
          camOffsetY + p.y * tileSize,
          p.size,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Floating Popups
      const lpool = labelsRef.current;
      for (let i = 0; i < lpool.length; i++) {
        const lbl = lpool[i];
        if (!lbl.active) continue;
        lbl.y -= dt * 1.1;
        lbl.life -= dt;
        if (lbl.life <= 0) {
          lbl.active = false;
          continue;
        }
        ctx.globalAlpha = Math.min(1, lbl.life * 1.4);
        ctx.fillStyle = lbl.color;
        ctx.font = `700 ${Math.round(tileSize * 0.34)}px "Noto Sans Georgian", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(
          lbl.text,
          camOffsetX + lbl.x * tileSize,
          camOffsetY + lbl.y * tileSize
        );
      }
      ctx.globalAlpha = 1;

      // Outer Vignette Reinforcing Fog of War
      const fog = ctx.createRadialGradient(
        centerX,
        centerY,
        tileSize * 1.9,
        centerX,
        centerY,
        tileSize * LANTERN_VISION_RADIUS
      );
      fog.addColorStop(0, 'rgba(7, 9, 13, 0)');
      fog.addColorStop(1, 'rgba(7, 9, 13, 0.98)');
      ctx.fillStyle = fog;
      ctx.fillRect(0, 0, cssW, cssH);

      ctx.restore();
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 pt-20 pb-6 sm:px-8">
      <div className="grid w-full grid-cols-1 items-center gap-6 lg:grid-cols-12">
        <section className="relative overflow-hidden rounded-2xl border border-[#D4A34A]/35 bg-[#07090D] p-2 shadow-2xl lg:col-span-8">
          <div className="relative aspect-[14/10] w-full">
            <canvas
              ref={canvasRef}
              tabIndex={-1}
              data-testid="maze-canvas"
              aria-label="მთაწმინდის ბნელი ლაბირინთი — ჩანს მხოლოდ ფარნის ახლო არე"
              className="h-full w-full rounded-xl outline-none"
            />
            {hudSnapshot.won && (
              <div
                className="absolute inset-0 flex items-center justify-center rounded-xl"
                style={{ backgroundColor: 'rgba(18, 22, 28, 0.88)' }}
              >
                <p
                  className="px-6 text-center text-2xl font-bold text-[#D4A34A]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  მიაღწიე იაკობის საფლავს მთაწმინდაზე!
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="flex flex-col justify-between gap-5 rounded-2xl border border-[#2C3440] bg-[#1A2029] p-6 lg:col-span-4">
          <div>
            <p className="text-xs font-medium text-[#D4A34A]">
              მისია · მთაწმინდის ლაბირინთი (27×21)
            </p>
            <h1
              className="mt-2 text-2xl font-bold text-[#F4EFE4]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              გზა სიბნელეში ფარნით
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#C9C3B8]">
              ლაბირინთი დიდი და ჩახლართულია — ფარანი მხოლოდ შენს ახლოს ანათებს!
              იპოვე ოქროს ასოები („დ ე დ ა“), იები და იაკობის საფლავი.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2 border-y border-[#2C3440] py-4 text-center">
              <div>
                <p className="text-xs text-[#8892A0]">ასოები</p>
                <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-[#D4A34A]">
                  {hudSnapshot.collectedChars.length}/{hudSnapshot.totalLetters}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#8892A0]">იები</p>
                <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-[#C4B5FD]">
                  {hudSnapshot.violetsCollected}/{hudSnapshot.totalViolets}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#8892A0]">ნაბიჯი</p>
                <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-[#F4EFE4]">
                  {hudSnapshot.steps}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => triggerMove(0, -1)}
              aria-label="ზემოთ [W ან ზედა ისარი]"
              className="flex h-12 w-14 items-center justify-center rounded-xl border border-[#343E4D] bg-[#141921] text-lg font-bold text-[#F4EFE4] transition-colors hover:border-[#D4A34A] hover:text-[#D4A34A] active:bg-[#D4A34A] active:text-[#12161C]"
            >
              ↑
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => triggerMove(-1, 0)}
                aria-label="მარცხნივ [A ან მარცხენა ისარი]"
                className="flex h-12 w-14 items-center justify-center rounded-xl border border-[#343E4D] bg-[#141921] text-lg font-bold text-[#F4EFE4] transition-colors hover:border-[#D4A34A] hover:text-[#D4A34A] active:bg-[#D4A34A] active:text-[#12161C]"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => triggerMove(0, 1)}
                aria-label="ქვემოთ [S ან ქვედა ისარი]"
                className="flex h-12 w-14 items-center justify-center rounded-xl border border-[#343E4D] bg-[#141921] text-lg font-bold text-[#F4EFE4] transition-colors hover:border-[#D4A34A] hover:text-[#D4A34A] active:bg-[#D4A34A] active:text-[#12161C]"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => triggerMove(1, 0)}
                aria-label="მარჯვნივ [D ან მარჯვენა ისარი]"
                className="flex h-12 w-14 items-center justify-center rounded-xl border border-[#343E4D] bg-[#141921] text-lg font-bold text-[#F4EFE4] transition-colors hover:border-[#D4A34A] hover:text-[#D4A34A] active:bg-[#D4A34A] active:text-[#12161C]"
              >
                →
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={activateCompassPulse}
              disabled={hudSnapshot.compassCharges <= 0}
              className="min-h-[44px] w-full rounded-xl border border-[#D4A34A]/35 bg-[#141921] px-4 py-2 text-sm font-medium text-[#D4A34A] transition-colors hover:bg-[#1E2530] disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap"
            >
              კომპასის სხივი (დარჩა {hudSnapshot.compassCharges})
            </button>
            <p className="text-center text-xs text-[#8892A0]">
              მართვა: WASD ან კლავიატურის ისრები
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};
