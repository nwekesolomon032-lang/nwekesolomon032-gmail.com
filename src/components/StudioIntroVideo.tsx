import React, {useRef, useState} from 'react';
import {Play} from 'lucide-react';

export const STUDIO_INTRO_VIDEO_SRC = '/assets/aistudio/my_portfolio_video_90b7e0d3.mp4';

interface StudioIntroVideoProps {
  label?: string;
  subtitle?: string;
  className?: string;
}

export function StudioIntroVideo({
  label = 'SOLMONIX STUDIO',
  subtitle = 'Founder Introduction · Brand, Web & AI Systems',
  className = '',
}: StudioIntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handleStartPlayback = () => {
    const el = videoRef.current;
    if (!el) return;
    setHasStarted(true);
    void el.play().catch(() => {
      // Allow native video controls to handle playback if browser blocks autoplay
    });
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[rgba(23,105,255,0.32)] bg-[#080D25] p-2.5 shadow-[0_24px_64px_-20px_rgba(7,91,255,0.38)] ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1769FF]/85 to-transparent"
      />

      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[rgba(191,195,202,0.14)] bg-black">
        <video
          ref={videoRef}
          src={STUDIO_INTRO_VIDEO_SRC}
          controls
          playsInline
          preload="metadata"
          onPlay={() => setHasStarted(true)}
          aria-label="SOLMONIX STUDIO Founder Introduction Video"
          className="block h-full w-full bg-black object-contain"
        >
          Your browser does not support embedded HTML5 video playback.
        </video>

        {!hasStarted && (
          <button
            type="button"
            onClick={handleStartPlayback}
            aria-label="Play SOLMONIX STUDIO introduction video"
            className="group absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#05060D]/70 via-[#05060D]/20 to-transparent transition-colors hover:bg-[#05060D]/30"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-[#1769FF]/90 text-white shadow-[0_12px_36px_-4px_rgba(7,91,255,0.75)] backdrop-blur-sm transition-transform duration-200 group-hover:scale-105 group-hover:bg-[#075BFF]">
              <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-[rgba(191,195,202,0.12)] px-1 pt-2 text-xs">
        <span className="font-semibold tracking-[0.06em] text-white">{label}</span>
        <span className="text-[#BFC3CA]/80">{subtitle}</span>
      </div>
    </div>
  );
}
