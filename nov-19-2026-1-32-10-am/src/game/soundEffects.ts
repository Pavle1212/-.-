export type MusicTrack = 'folk' | 'hymn';

interface ThemeStep {
  melody: number | null;
  harmony: number | null;
  pluck: number[];
  bass: [number, number] | null;
  melodyDur?: number;
}

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private muted = false;
  private musicTimer: number | null = null;
  private musicActive = false;
  private currentTrack: MusicTrack = 'folk';
  private stepIdx = 0;

  /**
   * Authentic Georgian polyphonic / lyrical folk theme ("ქართული მელოდია")
   * Played during Biography, Stories & Quiz stages.
   */
  private readonly folkSteps: ThemeStep[] = [
    // Phrase 1: Am -> G -> F -> E7 (warm lyrical Georgian opening)
    { melody: 440.0, harmony: 329.63, pluck: [220.0, 261.63, 329.63], bass: [110.0, 164.81], melodyDur: 0.9 },
    { melody: 523.25, harmony: 392.0, pluck: [329.63], bass: null, melodyDur: 0.55 },
    { melody: 493.88, harmony: 392.0, pluck: [261.63, 329.63], bass: null, melodyDur: 0.55 },
    { melody: 440.0, harmony: 329.63, pluck: [329.63], bass: null, melodyDur: 0.9 },
    { melody: 392.0, harmony: 293.66, pluck: [196.0, 246.94, 293.66], bass: [98.0, 146.83], melodyDur: 0.9 },
    { melody: 440.0, harmony: 329.63, pluck: [293.66], bass: null, melodyDur: 0.55 },
    { melody: 392.0, harmony: 293.66, pluck: [246.94, 293.66], bass: null, melodyDur: 0.55 },
    { melody: 329.63, harmony: 246.94, pluck: [293.66], bass: null, melodyDur: 1.0 },

    // Phrase 2: F -> C -> Dm -> E (rising heartfelt Georgian climb)
    { melody: 349.23, harmony: 261.63, pluck: [174.61, 220.0, 261.63], bass: [87.31, 130.81], melodyDur: 0.85 },
    { melody: 440.0, harmony: 349.23, pluck: [261.63], bass: null, melodyDur: 0.55 },
    { melody: 523.25, harmony: 392.0, pluck: [261.63, 329.63], bass: [130.81, 196.0], melodyDur: 0.85 },
    { melody: 587.33, harmony: 440.0, pluck: [329.63], bass: null, melodyDur: 0.7 },
    { melody: 523.25, harmony: 440.0, pluck: [293.66, 349.23], bass: [146.83, 220.0], melodyDur: 0.8 },
    { melody: 493.88, harmony: 392.0, pluck: [349.23], bass: null, melodyDur: 0.55 },
    { melody: 440.0, harmony: 329.63, pluck: [246.94, 329.63], bass: [164.81, 246.94], melodyDur: 1.1 },
    { melody: null, harmony: null, pluck: [329.63, 440.0], bass: null },

    // Phrase 3: High Salamuri call & Georgian cadence
    { melody: 659.25, harmony: 523.25, pluck: [220.0, 329.63, 440.0], bass: [110.0, 164.81], melodyDur: 0.9 },
    { melody: 587.33, harmony: 440.0, pluck: [329.63], bass: null, melodyDur: 0.55 },
    { melody: 523.25, harmony: 392.0, pluck: [261.63, 329.63], bass: null, melodyDur: 0.6 },
    { melody: 493.88, harmony: 349.23, pluck: [293.66], bass: [98.0, 146.83], melodyDur: 0.85 },
    { melody: 440.0, harmony: 329.63, pluck: [220.0, 293.66, 349.23], bass: [146.83, 220.0], melodyDur: 0.8 },
    { melody: 392.0, harmony: 293.66, pluck: [293.66], bass: null, melodyDur: 0.55 },
    { melody: 349.23, harmony: 261.63, pluck: [220.0, 261.63], bass: [110.0, 164.81], melodyDur: 0.7 },
    { melody: 329.63, harmony: 246.94, pluck: [246.94, 329.63], bass: null, melodyDur: 1.1 },

    // Phrase 4: Warm resolution home to A
    { melody: 392.0, harmony: 293.66, pluck: [196.0, 246.94, 293.66], bass: [98.0, 146.83], melodyDur: 0.65 },
    { melody: 440.0, harmony: 329.63, pluck: [220.0, 293.66], bass: null, melodyDur: 0.65 },
    { melody: 493.88, harmony: 392.0, pluck: [246.94, 329.63], bass: [164.81, 246.94], melodyDur: 0.75 },
    { melody: 440.0, harmony: 329.63, pluck: [329.63], bass: null, melodyDur: 0.55 },
    { melody: 392.0, harmony: 293.66, pluck: [261.63, 329.63], bass: null, melodyDur: 0.6 },
    { melody: 440.0, harmony: 329.63, pluck: [220.0, 261.63, 329.63], bass: [110.0, 164.81], melodyDur: 1.45 },
    { melody: null, harmony: null, pluck: [220.0, 329.63, 440.0], bass: null },
    { melody: null, harmony: null, pluck: [329.63], bass: null },
  ];

  /**
   * "ჰიმნი დედაენას" — Georgian Choral Anthem Arrangement (G Major / E Minor Polyphony)
   * Starts when the Labyrinth begins and continues through receiving Dedaena and reading its story,
   * ending only when the player completely finishes the game.
   */
  private readonly hymnSteps: ThemeStep[] = [
    // Phrase 1: „აი ია, აი შენი დედა ენა...“ (G -> Em -> C -> D)
    { melody: 392.0, harmony: 293.66, pluck: [196.0, 246.94, 293.66], bass: [98.0, 146.83], melodyDur: 0.95 }, // G4 ("ა-ი")
    { melody: 440.0, harmony: 329.63, pluck: [293.66], bass: null, melodyDur: 0.65 }, // A4 ("ი-ა")
    { melody: 493.88, harmony: 392.0, pluck: [246.94, 293.66, 392.0], bass: [82.41, 123.47], melodyDur: 1.0 }, // B4 ("აი შენი")
    { melody: 587.33, harmony: 493.88, pluck: [392.0], bass: null, melodyDur: 0.7 }, // D5
    { melody: 523.25, harmony: 392.0, pluck: [261.63, 329.63, 392.0], bass: [130.81, 196.0], melodyDur: 0.9 }, // C5 ("დე-და")
    { melody: 493.88, harmony: 392.0, pluck: [329.63], bass: null, melodyDur: 0.65 }, // B4
    { melody: 440.0, harmony: 349.23, pluck: [220.0, 293.66, 369.99], bass: [146.83, 220.0], melodyDur: 1.15 }, // A4 ("ე-ნა")
    { melody: null, harmony: null, pluck: [293.66, 392.0], bass: null },

    // Phrase 2: „აკვნიდანვე რომ გაჩუქა მზე და რწმენა...“ (G -> Am7 -> D7 -> G)
    { melody: 493.88, harmony: 392.0, pluck: [196.0, 246.94, 293.66], bass: [98.0, 146.83], melodyDur: 0.85 }, // B4
    { melody: 523.25, harmony: 440.0, pluck: [261.63, 329.63], bass: null, melodyDur: 0.65 }, // C5
    { melody: 587.33, harmony: 493.88, pluck: [293.66, 392.0], bass: [110.0, 164.81], melodyDur: 0.9 }, // D5
    { melody: 659.25, harmony: 523.25, pluck: [329.63, 392.0], bass: null, melodyDur: 0.75 }, // E5
    { melody: 587.33, harmony: 440.0, pluck: [293.66, 369.99, 440.0], bass: [146.83, 220.0], melodyDur: 0.85 }, // D5
    { melody: 523.25, harmony: 440.0, pluck: [369.99], bass: null, melodyDur: 0.6 }, // C5
    { melody: 493.88, harmony: 392.0, pluck: [246.94, 293.66, 392.0], bass: [98.0, 146.83], melodyDur: 1.1 }, // B4
    { melody: 392.0, harmony: 293.66, pluck: [293.66], bass: null, melodyDur: 0.65 }, // G4

    // Phrase 3: Soaring Choral Refrain „ოი დედა ენა, ოი დედა ენავ — ეჰეჰეი!“
    { melody: 587.33, harmony: 493.88, pluck: [196.0, 293.66, 392.0], bass: [98.0, 146.83], melodyDur: 0.95 }, // D5
    { melody: 783.99, harmony: 587.33, pluck: [293.66, 392.0, 493.88], bass: [196.0, 293.66], melodyDur: 1.05 }, // G5!
    { melody: 739.99, harmony: 587.33, pluck: [293.66, 369.99], bass: null, melodyDur: 0.65 }, // F#5
    { melody: 659.25, harmony: 523.25, pluck: [261.63, 329.63, 392.0], bass: [130.81, 196.0], melodyDur: 0.9 }, // E5
    { melody: 587.33, harmony: 493.88, pluck: [293.66, 392.0], bass: [98.0, 146.83], melodyDur: 0.85 }, // D5
    { melody: 659.25, harmony: 523.25, pluck: [329.63, 392.0], bass: null, melodyDur: 0.65 }, // E5
    { melody: 587.33, harmony: 440.0, pluck: [293.66, 369.99], bass: [146.83, 220.0], melodyDur: 0.85 }, // D5
    { melody: 493.88, harmony: 392.0, pluck: [246.94, 392.0], bass: null, melodyDur: 1.0 }, // B4

    // Phrase 4: Solemn Cadence „დედავ, ქვეყნის ნათლის სვეტო... აი ია, აი ია!“
    { melody: 523.25, harmony: 440.0, pluck: [261.63, 329.63, 392.0], bass: [130.81, 196.0], melodyDur: 0.85 }, // C5
    { melody: 493.88, harmony: 392.0, pluck: [246.94, 293.66], bass: null, melodyDur: 0.65 }, // B4
    { melody: 440.0, harmony: 349.23, pluck: [220.0, 293.66, 369.99], bass: [146.83, 220.0], melodyDur: 0.85 }, // A4
    { melody: 392.0, harmony: 293.66, pluck: [196.0, 293.66], bass: [98.0, 146.83], melodyDur: 0.85 }, // G4
    { melody: 440.0, harmony: 329.63, pluck: [261.63, 329.63], bass: [130.81, 196.0], melodyDur: 0.7 }, // A4 ("ა-ი")
    { melody: 493.88, harmony: 392.0, pluck: [246.94, 293.66, 392.0], bass: null, melodyDur: 0.85 }, // B4 ("ი-ა")
    { melody: 392.0, harmony: 293.66, pluck: [196.0, 246.94, 293.66, 392.0], bass: [98.0, 146.83], melodyDur: 1.55 }, // G4 ("ა-ი ი-ა!")
    { melody: null, harmony: null, pluck: [293.66, 392.0], bass: null },
  ];

  public isMuted(): boolean {
    return this.muted;
  }

  public isMusicActive(): boolean {
    return this.musicActive;
  }

  public getCurrentTrack(): MusicTrack {
    return this.currentTrack;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        muted ? 0 : 0.85,
        this.ctx.currentTime,
        0.04
      );
    }
    if (muted) {
      this.stopMusicLoop();
    } else if (this.musicActive) {
      this.startMusicLoop();
    }
  }

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
      const compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      compressor.knee.setValueAtTime(18, this.ctx.currentTime);
      compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      compressor.attack.setValueAtTime(0.01, this.ctx.currentTime);
      compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.85, this.ctx.currentTime);

      // Warm lowpass filter on music bus so Georgian folk & choral voices sound rich & acoustic
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, this.ctx.currentTime);
      filter.Q.setValueAtTime(0.7, this.ctx.currentTime);

      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.setValueAtTime(0.95, this.ctx.currentTime);

      this.musicBus.connect(filter);
      filter.connect(compressor);
      compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainValue = 0.08,
    delay = 0,
    attack = 0.02,
    useMusicBus = false
  ) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainValue, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    const dest = useMusicBus && this.musicBus ? this.musicBus : (this.masterGain ?? ctx.destination);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  /** Warm Georgian Salamuri / Duduki flute-like lead voice with subtle overtone */
  private playSalamuriNote(freq: number, duration: number, gainValue: number) {
    this.playTone(freq, duration, 'triangle', gainValue, 0, 0.06, true);
    this.playTone(freq * 2, duration * 0.7, 'sine', gainValue * 0.22, 0.02, 0.08, true);
  }

  /** Rich Georgian Choral Anthem Lead for "ჰიმნი დედაენას" */
  private playChoralHymnVoice(freq: number, duration: number, gainValue: number) {
    this.playTone(freq, duration, 'triangle', gainValue, 0, 0.09, true);
    this.playTone(freq * 1.003, duration * 0.95, 'sine', gainValue * 0.7, 0.015, 0.1, true);
    this.playTone(freq * 2, duration * 0.65, 'sine', gainValue * 0.16, 0.03, 0.1, true);
  }

  /** Plucked Chonguri / Panduri / Harp string shimmer */
  private playChonguriPluck(freqs: number[], gainValue: number) {
    freqs.forEach((f, idx) => {
      this.playTone(f, 0.65, 'triangle', gainValue, idx * 0.045, 0.008, true);
      this.playTone(f * 2, 0.35, 'sine', gainValue * 0.3, idx * 0.045, 0.006, true);
    });
  }

  public startMusic(track: MusicTrack = 'folk') {
    this.currentTrack = track;
    this.stepIdx = 0;
    this.musicActive = true;
    if (this.musicBus && this.ctx) {
      this.musicBus.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicBus.gain.setTargetAtTime(0.95, this.ctx.currentTime, 0.05);
    }
    if (!this.muted) {
      this.stopMusicLoop();
      this.startMusicLoop();
    }
  }

  public setMusicTrack(track: MusicTrack) {
    if (this.currentTrack === track && this.musicActive) return;
    this.currentTrack = track;
    this.stepIdx = 0;
    this.musicActive = true;
    if (this.musicBus && this.ctx) {
      this.musicBus.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicBus.gain.setTargetAtTime(0.95, this.ctx.currentTime, 0.05);
    }
    if (!this.muted) {
      this.stopMusicLoop();
      this.startMusicLoop();
    }
  }

  public stopMusic() {
    this.musicActive = false;
    this.stopMusicLoop();
    this.currentTrack = 'folk';
    this.stepIdx = 0;
    if (this.musicBus && this.ctx) {
      this.musicBus.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicBus.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.18);
    }
  }

  public pauseMusic() {
    this.stopMusicLoop();
  }

  public resumeMusic() {
    if (this.musicActive && !this.muted) {
      if (this.musicBus && this.ctx) {
        this.musicBus.gain.setTargetAtTime(0.95, this.ctx.currentTime, 0.04);
      }
      this.startMusicLoop();
    }
  }

  private startMusicLoop() {
    if (this.musicTimer !== null || typeof window === 'undefined') return;
    const stepMs = this.currentTrack === 'hymn' ? 500 : 460;
    this.playMusicStep();
    this.musicTimer = window.setInterval(() => {
      this.playMusicStep();
    }, stepMs);
  }

  private stopMusicLoop() {
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  private playMusicStep() {
    if (this.muted || !this.musicActive) return;
    const steps = this.currentTrack === 'hymn' ? this.hymnSteps : this.folkSteps;
    const step = steps[this.stepIdx % steps.length];

    if (this.currentTrack === 'hymn') {
      if (step.melody !== null) {
        this.playChoralHymnVoice(step.melody, step.melodyDur ?? 0.9, 0.14);
      }
      if (step.harmony !== null) {
        this.playTone(step.harmony, (step.melodyDur ?? 0.9) * 0.95, 'sine', 0.095, 0.02, 0.09, true);
      }
      if (step.pluck.length > 0) {
        this.playChonguriPluck(step.pluck, 0.068);
      }
      if (step.bass) {
        const [root, fifth] = step.bass;
        this.playTone(root, 2.6, 'triangle', 0.105, 0, 0.16, true);
        this.playTone(fifth, 2.5, 'sine', 0.068, 0.02, 0.18, true);
      }
    } else {
      if (step.melody !== null) {
        this.playSalamuriNote(step.melody, step.melodyDur ?? 0.75, 0.145);
      }
      if (step.harmony !== null) {
        this.playTone(step.harmony, (step.melodyDur ?? 0.75) * 0.9, 'sine', 0.085, 0.01, 0.06, true);
      }
      if (step.pluck.length > 0) {
        this.playChonguriPluck(step.pluck, 0.075);
      }
      if (step.bass) {
        const [root, fifth] = step.bass;
        this.playTone(root, 2.3, 'triangle', 0.095, 0, 0.14, true);
        this.playTone(fifth, 2.2, 'sine', 0.06, 0.02, 0.16, true);
      }
    }

    this.stepIdx += 1;
  }

  public playBellChime() {
    this.playTone(523.25, 0.9, 'triangle', 0.12, 0);
    this.playTone(783.99, 1.1, 'sine', 0.09, 0.06);
    this.playTone(1046.5, 1.2, 'sine', 0.06, 0.12);
  }

  public playPageTurn() {
    this.playTone(440, 0.18, 'sine', 0.065, 0);
    this.playTone(554.37, 0.22, 'sine', 0.05, 0.05);
  }

  public playQuizAnswer(correct: boolean) {
    if (correct) {
      this.playTone(523.25, 0.22, 'triangle', 0.1, 0);
      this.playTone(659.25, 0.28, 'triangle', 0.1, 0.09);
      this.playTone(783.99, 0.36, 'sine', 0.085, 0.18);
    } else {
      this.playTone(246.94, 0.24, 'triangle', 0.08, 0);
      this.playTone(220.0, 0.32, 'sine', 0.07, 0.1);
    }
  }

  public playStep() {
    this.playTone(185 + Math.random() * 24, 0.06, 'sine', 0.032, 0);
  }

  public playCollectLetter() {
    this.playTone(587.33, 0.22, 'triangle', 0.1, 0);
    this.playTone(880, 0.34, 'sine', 0.085, 0.08);
  }

  public playCollectViolet() {
    this.playTone(659.25, 0.22, 'sine', 0.085, 0);
    this.playTone(987.77, 0.32, 'sine', 0.07, 0.07);
  }

  public playAiIaReveal() {
    this.playTone(440, 0.55, 'sine', 0.11, 0);
    this.playTone(554.37, 0.65, 'sine', 0.11, 0.14);
    this.playTone(659.25, 0.85, 'triangle', 0.11, 0.28);
    this.playTone(880, 1.15, 'sine', 0.09, 0.42);
  }

  public playDedaenaGift() {
    const notes = [392.0, 493.88, 587.33, 783.99, 987.77];
    notes.forEach((freq, idx) => {
      this.playTone(
        freq,
        0.95,
        idx % 2 === 0 ? 'triangle' : 'sine',
        0.095,
        idx * 0.11
      );
    });
  }
}

export const soundFX = new SoundEffectsEngine();

