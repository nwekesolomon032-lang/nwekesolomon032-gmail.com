import React, {useState} from 'react';
import {Check, Copy, Download} from 'lucide-react';
import {
  SOLMONIX_LOGO_URL,
  SolmonixAppIcon,
  SolmonixHorizontalLogo,
  SolmonixMonogram,
} from '../components/SolmonixLogo';

type MonogramViewMode = 'metallic' | 'flat' | 'grid';

const BRAND_PALETTE = [
  {
    name: 'Brushed Silver',
    hex: '#DCE1EA',
    swatchClass: 'bg-[#DCE1EA] border border-white/15',
  },
  {
    name: 'Electric Blue',
    hex: '#075BFF',
    swatchClass: 'bg-[#075BFF] border border-white/15',
  },
  {
    name: 'Midnight Black',
    hex: '#05060D',
    swatchClass: 'bg-[#05060D] border border-[rgba(191,195,202,0.28)]',
  },
  {
    name: 'Pure White',
    hex: '#FFFFFF',
    swatchClass: 'bg-[#FFFFFF] border border-white/20',
  },
];

export function BrandIdentityPage() {
  const [monogramMode, setMonogramMode] = useState<MonogramViewMode>('metallic');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      window.setTimeout(() => setCopiedHex((curr) => (curr === hex ? null : curr)), 1600);
    } catch {
      // Clipboard access unavailable in restricted contexts
    }
  };

  return (
    <main className="bg-[#05060D] text-white">
      {/* Header */}
      <section className="border-b border-[rgba(191,195,202,0.12)] bg-[#05060D]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#075BFF] uppercase">
            Brand Identity System
          </p>
          <h1
            className="mt-4 max-w-3xl font-display font-semibold tracking-tight text-white [text-wrap:balance]"
            style={{fontSize: 'clamp(2.1rem, 4vw, 3.5rem)', lineHeight: 1.08}}
          >
            SOLMONIX STUDIO — Swept Geometric Monogram &amp; Wordmark
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#BFC3CA]">
            Featuring the official brushed metallic silver geometric S monogram anchored by its
            beveled electric-blue accent triangle and stacked SOLMONIX STUDIO typography.
          </p>

          {/* Refined Palette Strip */}
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-[rgba(191,195,202,0.12)] pt-8 sm:grid-cols-4">
            {BRAND_PALETTE.map((swatch) => (
              <button
                key={swatch.hex}
                type="button"
                onClick={() => void handleCopyHex(swatch.hex)}
                className="group flex items-center gap-3 text-left transition-opacity hover:opacity-90"
              >
                <span className={`h-10 w-10 shrink-0 rounded-lg ${swatch.swatchClass}`} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{swatch.name}</p>
                  <p className="flex items-center gap-1.5 font-mono text-xs text-[#BFC3CA]/80 tabular-nums">
                    <span>{swatch.hex}</span>
                    {copiedHex === swatch.hex ? (
                      <Check className="h-3 w-3 text-[#075BFF]" aria-hidden="true" />
                    ) : (
                      <Copy
                        className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-70"
                        aria-hidden="true"
                      />
                    )}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Presentation 01: Standalone Geometric S Monogram */}
      <section className="border-b border-[rgba(191,195,202,0.12)] bg-[#05060D]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs font-medium tracking-[0.14em] text-[#075BFF] uppercase tabular-nums">
                01 · Primary Brand Symbol
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Standalone Geometric S Monogram
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div
                role="group"
                aria-label="Monogram presentation mode"
                className="inline-flex rounded-lg border border-[rgba(191,195,202,0.16)] bg-[#0A0C14] p-1"
              >
                {[
                  {id: 'metallic', label: 'Brushed Silver'},
                  {id: 'flat', label: 'Flat Vector'},
                  {id: 'grid', label: 'Construction'},
                ].map((mode) => {
                  const active = monogramMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setMonogramMode(mode.id as MonogramViewMode)}
                      className={`whitespace-nowrap rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? 'bg-[#075BFF] text-white'
                          : 'text-[#BFC3CA] hover:text-white'
                      }`}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>

              <a
                href={SOLMONIX_LOGO_URL}
                download="solmonix-studio-logo.png"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-[rgba(191,195,202,0.22)] px-4 py-2 text-xs font-medium text-white transition-colors hover:border-[#075BFF]"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Download Logo PNG</span>
              </a>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            <div className="flex min-h-[340px] items-center justify-center rounded-2xl border border-[rgba(191,195,202,0.14)] bg-[#05060D] p-12 lg:col-span-7">
              <SolmonixMonogram
                variant={monogramMode === 'flat' ? 'flat' : 'metallic'}
                showGrid={monogramMode === 'grid'}
                size={224}
              />
            </div>

            <div className="flex flex-col justify-between gap-6 border-t border-[rgba(191,195,202,0.12)] pt-6 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-base font-semibold text-white">
                    Unboxed Architectural Silhouette
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#BFC3CA]">
                    The monogram stands directly on the surface without enclosing frames, boxes, or
                    circles—allowing the swept negative-space S channel to define the mark.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-white">
                    Integrated Electric-Blue Keystone
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#BFC3CA]">
                    A precision-mitered #075BFF keystone locks flush onto the leading edge of the
                    lower silver ribbon across the central diagonal cut.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-white">
                    Brushed Silver &amp; Flat Fidelity
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#BFC3CA]">
                    Directional platinum gradients and edge highlights translate cleanly down to flat
                    vector ink and single-color applications with zero loss of clarity.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-[rgba(191,195,202,0.12)] pt-5 text-xs">
                <div>
                  <p className="text-[#BFC3CA]/70">Symmetry</p>
                  <p className="mt-1 font-mono font-medium text-white tabular-nums">180° Twin</p>
                </div>
                <div>
                  <p className="text-[#BFC3CA]/70">Canvas</p>
                  <p className="mt-1 font-mono font-medium text-white tabular-nums">120 × 120</p>
                </div>
                <div>
                  <p className="text-[#BFC3CA]/70">Channel Gap</p>
                  <p className="mt-1 font-mono font-medium text-white tabular-nums">7.1 units</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Presentation 02: Complete Horizontal Logo */}
      <section className="border-b border-[rgba(191,195,202,0.12)] bg-[#05060D]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs font-medium tracking-[0.14em] text-[#075BFF] uppercase tabular-nums">
                02 · Primary Horizontal Lockup
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                SOLMONIX STUDIO Wordmark Pairing
              </h2>
            </div>

            <a
              href={SOLMONIX_LOGO_URL}
              download="solmonix-studio-logo.png"
              className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-lg border border-[rgba(191,195,202,0.22)] px-4 py-2 text-xs font-medium text-white transition-colors hover:border-[#075BFF] sm:self-auto"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Download Logo PNG</span>
            </a>
          </div>

          <div className="mt-10 space-y-6">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[rgba(191,195,202,0.14)] bg-[#05060D] px-6 py-16 sm:py-20">
              <SolmonixHorizontalLogo variant="metallic" size="lg" />
              <p className="mt-10 font-mono text-xs tracking-wide text-[#BFC3CA]/65">
                Primary Presentation · Brushed Metallic Silver + #075BFF Keystone + Stacked
                Wordmark
              </p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-[rgba(191,195,202,0.14)] bg-[#080D25]/45 px-6 py-14">
              <SolmonixHorizontalLogo variant="flat" size="md" />
              <p className="mt-8 font-mono text-xs tracking-wide text-[#BFC3CA]/65">
                Flat Vector Application · Solid Silver #DCE1EA + #075BFF Keystone
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Presentation 03: Monochrome Applications */}
      <section className="border-b border-[rgba(191,195,202,0.12)] bg-[#05060D]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs font-medium tracking-[0.14em] text-[#075BFF] uppercase tabular-nums">
                03 · Monochrome Systems
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Single-Ink Dark &amp; Light Applications
              </h2>
            </div>

            <a
              href={SOLMONIX_LOGO_URL}
              download="solmonix-studio-logo.png"
              className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-lg border border-[rgba(191,195,202,0.22)] px-4 py-2 text-xs font-medium text-white transition-colors hover:border-[#075BFF] sm:self-auto"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Download Logo PNG</span>
            </a>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center justify-between gap-10 rounded-2xl border border-[rgba(191,195,202,0.16)] bg-[#05060D] px-8 py-14">
              <SolmonixMonogram variant="monochrome-white" size={112} />
              <div className="w-full border-t border-[rgba(191,195,202,0.12)] pt-8 text-center">
                <SolmonixHorizontalLogo variant="monochrome-white" size="sm" />
              </div>
              <p className="font-mono text-xs text-[#BFC3CA]/70">
                Pure White (#FFFFFF) on Midnight Black (#05060D)
              </p>
            </div>

            <div className="flex flex-col items-center justify-between gap-10 rounded-2xl border border-white/20 bg-[#FFFFFF] px-8 py-14 text-[#05060D]">
              <SolmonixMonogram variant="monochrome-dark" size={112} />
              <div className="w-full border-t border-[#05060D]/12 pt-8 text-center">
                <SolmonixHorizontalLogo variant="monochrome-dark" size="sm" />
              </div>
              <p className="font-mono text-xs text-[#05060D]/70">
                Midnight Black (#05060D) on Pure White (#FFFFFF)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Presentation 04: Small-Scale Favicon & Application Icons */}
      <section className="bg-[#05060D]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs font-medium tracking-[0.14em] text-[#075BFF] uppercase tabular-nums">
                04 · Micro-Scale &amp; Favicon Verification
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Compact Monogram &amp; Browser Tab Clarity
              </h2>
            </div>

            <a
              href={SOLMONIX_LOGO_URL}
              download="solmonix-studio-logo.png"
              className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-lg border border-[rgba(191,195,202,0.22)] px-4 py-2 text-xs font-medium text-white transition-colors hover:border-[#075BFF] sm:self-auto"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Download Logo PNG</span>
            </a>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            <div className="flex flex-col justify-between gap-8 rounded-2xl border border-[rgba(191,195,202,0.14)] bg-[#0A0C14] p-8 lg:col-span-7">
              <div className="flex flex-wrap items-end gap-8">
                <div className="flex flex-col items-center gap-3">
                  <SolmonixAppIcon size={80} surface="midnight" />
                  <span className="font-mono text-xs text-[#BFC3CA]/70 tabular-nums">80px</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <SolmonixAppIcon size={56} surface="midnight" />
                  <span className="font-mono text-xs text-[#BFC3CA]/70 tabular-nums">56px</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <SolmonixAppIcon size={36} surface="midnight" />
                  <span className="font-mono text-xs text-[#BFC3CA]/70 tabular-nums">36px</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <SolmonixAppIcon size={24} surface="midnight" />
                  <span className="font-mono text-xs text-[#BFC3CA]/70 tabular-nums">24px</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <SolmonixAppIcon size={16} surface="midnight" />
                  <span className="font-mono text-xs text-[#BFC3CA]/70 tabular-nums">16px</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8 border-t border-[rgba(191,195,202,0.12)] pt-7">
                <div className="flex items-center gap-3 rounded-xl bg-[#075BFF] px-4 py-3">
                  <SolmonixAppIcon size={36} surface="electric" />
                  <div className="text-xs">
                    <p className="font-medium text-white">On Electric Blue</p>
                    <p className="text-white/80">#FFFFFF Mark</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-[#FFFFFF] px-4 py-3 text-[#05060D]">
                  <SolmonixAppIcon size={36} surface="white" />
                  <div className="text-xs">
                    <p className="font-medium text-[#05060D]">On Pure White</p>
                    <p className="text-[#05060D]/70">#05060D Mark</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 rounded-2xl border border-[rgba(191,195,202,0.14)] bg-[#0A0C14] p-8 lg:col-span-5">
              <div>
                <p className="text-xs font-medium tracking-[0.12em] text-[#BFC3CA]/70 uppercase">
                  Live 16×16 Browser Tab Preview
                </p>
                <div className="mt-4 overflow-hidden rounded-xl border border-[rgba(191,195,202,0.16)] bg-[#05060D]">
                  <div className="flex items-center gap-2 border-b border-[rgba(191,195,202,0.12)] bg-[#101216] px-3 pt-2.5">
                    <div className="flex items-center gap-2 rounded-t-lg border-x border-t border-[rgba(191,195,202,0.14)] bg-[#05060D] px-3 py-2 text-xs text-white">
                      <SolmonixMonogram size={16} className="shrink-0" />
                      <span className="max-w-[160px] truncate font-medium">SOLMONIX STUDIO</span>
                    </div>
                  </div>
                  <div className="px-4 py-3 font-mono text-xs text-[#BFC3CA]/75">
                    solmonixstudio.com
                  </div>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-[#BFC3CA]">
                Rendered standalone without container boxes so the swept S silhouette remains crisp
                and instantly legible across browser tabs, mobile headers, and light or dark
                surfaces.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
