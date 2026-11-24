import React from 'react';

export const SOLMONIX_LOGO_URL = '/assets/aistudio/Screenshot_2026-11-18_132841_3bf24f38.png';

export type MonogramVariant =
  | 'metallic'
  | 'flat'
  | 'monochrome-white'
  | 'monochrome-dark';

interface SolmonixMonogramProps {
  variant?: MonogramVariant;
  size?: number | string;
  showGrid?: boolean;
  className?: string;
}

export function SolmonixMonogram({
  variant = 'metallic',
  size = 40,
  showGrid = false,
  className = '',
}: SolmonixMonogramProps) {
  const isLightBackdrop = variant === 'monochrome-dark';

  const svgElement = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="284 14 576 477"
      width={isLightBackdrop ? '100%' : size}
      height={isLightBackdrop ? '100%' : size}
      role="img"
      aria-label="SOLMONIX STUDIO logo"
      style={isLightBackdrop ? undefined : {mixBlendMode: 'lighten'}}
      className={isLightBackdrop ? 'block h-full w-full' : className}
    >
      {showGrid && (
        <g aria-hidden="true" stroke="rgba(7,91,255,0.45)" strokeWidth="2.4">
          <rect x="292" y="22" width="560" height="461" fill="none" strokeDasharray="10 10" />
          <line x1="572" y1="14" x2="572" y2="491" />
          <line x1="284" y1="252.5" x2="860" y2="252.5" />
        </g>
      )}
      <image
        href={SOLMONIX_LOGO_URL}
        x="0"
        y="0"
        width="977"
        height="649"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );

  if (isLightBackdrop) {
    return (
      <span
        style={{width: size, height: size}}
        className={`inline-flex shrink-0 items-center justify-center rounded-xl bg-[#05060D] p-1.5 ${className}`}
      >
        {svgElement}
      </span>
    );
  }

  return svgElement;
}

interface SolmonixHorizontalLogoProps {
  variant?: MonogramVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function SolmonixHorizontalLogo({
  variant = 'metallic',
  size = 'md',
  className = '',
}: SolmonixHorizontalLogoProps) {
  const isDarkInk = variant === 'monochrome-dark';
  const primaryTextColor = isDarkInk ? 'text-[#05060D]' : 'text-white';
  const secondaryTextColor = isDarkInk
    ? 'text-[#05060D]/75'
    : variant === 'monochrome-white'
      ? 'text-white/80'
      : 'text-[#BFC3CA]';

  const scaleMap = {
    xs: {
      iconSize: 34,
      gap: 'gap-2.5',
      title: 'text-[15px] tracking-[0.19em]',
      sub: 'mt-[3px] text-[8.5px] tracking-[0.52em]',
    },
    sm: {
      iconSize: 42,
      gap: 'gap-3',
      title: 'text-[18px] tracking-[0.21em]',
      sub: 'mt-1 text-[9.5px] tracking-[0.58em]',
    },
    md: {
      iconSize: 56,
      gap: 'gap-4 sm:gap-5',
      title: 'text-2xl sm:text-[28px] tracking-[0.22em]',
      sub: 'mt-1.5 text-[10px] sm:text-[11px] tracking-[0.62em]',
    },
    lg: {
      iconSize: 82,
      gap: 'gap-5 sm:gap-7',
      title: 'text-3xl sm:text-4xl lg:text-[42px] tracking-[0.21em]',
      sub: 'mt-2 text-[11px] sm:text-[13px] tracking-[0.64em]',
    },
  }[size];

  return (
    <div className={`inline-flex items-center select-none ${scaleMap.gap} ${className}`}>
      <SolmonixMonogram variant={variant} size={scaleMap.iconSize} className="shrink-0" />
      <div className="flex flex-col leading-none">
        <span
          className={`font-display font-semibold uppercase whitespace-nowrap ${scaleMap.title} ${primaryTextColor}`}
        >
          SOLMONIX
        </span>
        <span
          className={`font-display font-medium uppercase whitespace-nowrap pl-[0.04em] ${scaleMap.sub} ${secondaryTextColor}`}
        >
          STUDIO
        </span>
      </div>
    </div>
  );
}

interface SolmonixAppIconProps {
  size?: number;
  surface?: 'midnight' | 'white' | 'electric';
  className?: string;
}

export function SolmonixAppIcon({
  size = 64,
  surface = 'midnight',
  className = '',
}: SolmonixAppIconProps) {
  if (surface === 'white' || surface === 'electric') {
    return (
      <span
        style={{width: size, height: size}}
        className={`inline-flex shrink-0 items-center justify-center rounded-xl bg-[#05060D] p-1 ${className}`}
      >
        <SolmonixMonogram variant="metallic" size="100%" />
      </span>
    );
  }

  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${className}`}>
      <SolmonixMonogram variant="metallic" size={size} />
    </span>
  );
}
