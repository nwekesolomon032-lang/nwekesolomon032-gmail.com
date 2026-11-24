import React, {useState} from 'react';
import {SolmonixMonogram} from './SolmonixLogo';

export function HeroSculpture({compact = false}: {compact?: boolean}) {
  const [tilt, setTilt] = useState({x: 0, y: 0});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({x: -py * 8, y: px * 8});
  };

  const handleMouseLeave = () => {
    setTilt({x: 0, y: 0});
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-[rgba(191,195,202,0.16)] bg-[#13161C] ${
        compact
          ? 'min-h-[285px] px-5 py-14 sm:min-h-[310px] sm:px-7 sm:py-14'
          : 'h-full min-h-[380px] p-6 sm:min-h-[460px] sm:p-10'
      }`}
    >
      {/* Architectural Grid & Controlled Electric-Blue Depth Glow */}
      <div aria-hidden="true" className="studio-grid-pattern pointer-events-none absolute inset-0 opacity-75" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(23,105,255,0.22),rgba(16,18,22,0.2)_55%,#101216_90%)]"
      />

      {/* Precision Frame Crosshairs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-5 border border-[rgba(191,195,202,0.08)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] text-[#BFC3CA]/70"
      >
        <span>SMX</span>
        <span>/</span>
        <span>IDENTITY</span>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-5 text-[11px] font-medium tracking-[0.14em] text-[#BFC3CA]/55 tabular-nums"
      >
        01 · MONOGRAM
      </div>

      {/* Interactive Perspective Monogram */}
      <div
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative z-10 flex flex-col items-center"
      >
        <SolmonixMonogram
          variant="metallic"
          size={compact ? 176 : 256}
        />
      </div>

      {/* Bottom Architectural Caption Strip */}
      <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-center justify-between border-t border-[rgba(191,195,202,0.1)] pt-3 text-xs text-[#BFC3CA]/80">
        <span>Designing Brands. Building Digital Experiences.</span>
        <span className="hidden text-[#1769FF] sm:inline">Brand · Web · Digital</span>
      </div>
    </div>
  );
}
