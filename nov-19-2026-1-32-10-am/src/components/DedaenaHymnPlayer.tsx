import React, { useEffect, useRef } from 'react';

export const DEDAENA_HYMN_YOUTUBE_IDS = ['4g_Swkil_PQ', 'JXEzcmpwbW4'] as const;

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  loadVideoById: (videoId: string) => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  getIframe?: () => HTMLIFrameElement;
  destroy: () => void;
}

interface YTGlobal {
  Player: new (
    elementId: string,
    options: {
      height?: string | number;
      width?: string | number;
      videoId: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: { target: YTPlayerInstance }) => void;
        onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
        onError?: (event: { data: number; target: YTPlayerInstance }) => void;
      };
    }
  ) => YTPlayerInstance;
  PlayerState?: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
  };
}

declare global {
  interface Window {
    YT?: YTGlobal;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<YTGlobal> | null = null;

function loadYouTubeIframeApi(): Promise<YTGlobal> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('No window environment'));
  }
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }
  if (ytApiPromise) {
    return ytApiPromise;
  }

  ytApiPromise = new Promise<YTGlobal>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]'
    );

    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevReady) prevReady();
      if (window.YT?.Player) {
        resolve(window.YT);
      }
    };

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => {
        ytApiPromise = null;
        reject(new Error('Failed to load YouTube IFrame API'));
      };
      document.head.appendChild(script);
    }
  });

  return ytApiPromise;
}

interface DedaenaHymnPlayerProps {
  active: boolean;
  paused: boolean;
  muted: boolean;
  onFallbackNeeded?: () => void;
}

export const DedaenaHymnPlayer: React.FC<DedaenaHymnPlayerProps> = ({
  active,
  paused,
  muted,
  onFallbackNeeded,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const readyRef = useRef(false);
  const videoIndexRef = useRef(0);
  const activeRef = useRef(active);
  const pausedRef = useRef(paused);
  const mutedRef = useRef(muted);
  const fallbackRef = useRef(onFallbackNeeded);
  const prevActiveRef = useRef(false);

  activeRef.current = active;
  pausedRef.current = paused;
  mutedRef.current = muted;
  fallbackRef.current = onFallbackNeeded;

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.inert = true;
      wrapperRef.current.setAttribute('inert', '');
    }
    const reclaimFocusFromIframe = () => {
      window.setTimeout(() => {
        const activeEl = document.activeElement;
        if (
          activeEl instanceof HTMLIFrameElement &&
          activeEl.id === 'dedaena-hymn-yt-player'
        ) {
          activeEl.blur();
          window.focus();
        }
      }, 0);
    };
    window.addEventListener('blur', reclaimFocusFromIframe);
    return () => window.removeEventListener('blur', reclaimFocusFromIframe);
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeIframeApi()
      .then((YT) => {
        if (cancelled || playerRef.current) return;

        const initialId = DEDAENA_HYMN_YOUTUBE_IDS[0];
        playerRef.current = new YT.Player('dedaena-hymn-yt-player', {
          width: 200,
          height: 150,
          videoId: initialId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            loop: 1,
            modestbranding: 1,
            playlist: initialId,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (cancelled) return;
              readyRef.current = true;
              const iframe = event.target.getIframe?.();
              if (iframe) {
                iframe.setAttribute('tabindex', '-1');
                iframe.setAttribute('aria-hidden', 'true');
                iframe.referrerPolicy = 'strict-origin-when-cross-origin';
                if (document.activeElement === iframe) {
                  iframe.blur();
                  window.focus();
                }
              }
              document.body.dataset.hymnSource = `youtube-${DEDAENA_HYMN_YOUTUBE_IDS[videoIndexRef.current]}`;

              if (mutedRef.current) {
                event.target.mute();
              } else {
                event.target.unMute();
                event.target.setVolume(85);
              }

              if (activeRef.current && !pausedRef.current) {
                event.target.seekTo(0, true);
                event.target.playVideo();
              }
            },
            onStateChange: (event) => {
              const states = window.YT?.PlayerState;
              const endedCode = states?.ENDED ?? 0;
              const playingCode = states?.PLAYING ?? 1;
              const pausedCode = states?.PAUSED ?? 2;

              if (event.data === playingCode) {
                document.body.dataset.hymnState = 'playing';
              } else if (event.data === pausedCode) {
                document.body.dataset.hymnState = 'paused';
              } else if (event.data === endedCode) {
                document.body.dataset.hymnState = 'ended';
                if (activeRef.current && !pausedRef.current) {
                  event.target.seekTo(0, true);
                  event.target.playVideo();
                }
              }
            },
            onError: (event) => {
              const iframe = event.target.getIframe?.();
              if (iframe && document.activeElement === iframe) {
                iframe.blur();
                window.focus();
              }
              const nextIdx = videoIndexRef.current + 1;
              if (nextIdx < DEDAENA_HYMN_YOUTUBE_IDS.length) {
                videoIndexRef.current = nextIdx;
                const nextId = DEDAENA_HYMN_YOUTUBE_IDS[nextIdx];
                document.body.dataset.hymnSource = `youtube-${nextId}`;
                event.target.loadVideoById(nextId);
                return;
              }
              document.body.dataset.hymnSource = 'fallback';
              document.body.dataset.hymnState = 'error';
              document.body.dataset.hymnError = String(event?.data ?? 'unknown');
              if (activeRef.current && fallbackRef.current) {
                fallbackRef.current();
              }
            },
          },
        });
      })
      .catch(() => {
        document.body.dataset.hymnSource = 'fallback';
        document.body.dataset.hymnState = 'error';
        if (activeRef.current && fallbackRef.current) {
          fallbackRef.current();
        }
      });

    return () => {
      cancelled = true;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore cleanup errors
        }
        playerRef.current = null;
        readyRef.current = false;
      }
    };
  }, []);

  useEffect(() => {
    const justActivated = active && !prevActiveRef.current;
    prevActiveRef.current = active;

    const player = playerRef.current;
    if (!player || !readyRef.current) return;

    if (muted) {
      player.mute();
    } else {
      player.unMute();
      player.setVolume(85);
    }

    if (!active) {
      player.stopVideo();
      document.body.dataset.hymnState = 'stopped';
      return;
    }

    if (paused) {
      player.pauseVideo();
    } else {
      if (justActivated) {
        player.seekTo(0, true);
      }
      player.playVideo();
    }
  }, [active, paused, muted]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none fixed -left-[9999px] top-0 h-[150px] w-[200px] overflow-hidden opacity-0"
    >
      <div id="dedaena-hymn-yt-player" />
    </div>
  );
};
