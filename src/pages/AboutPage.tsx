import React, {useState} from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Eye,
  Layers,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
  User,
} from 'lucide-react';
import {motion} from 'motion/react';
import {ServiceVisualImage} from '../components/ServiceVisualImage';
import {SolmonixMonogram} from '../components/SolmonixLogo';
import {StudioIntroVideo} from '../components/StudioIntroVideo';
import {useStudio} from '../context/StudioContext';
import {STUDIO_SERVICES} from '../data/studioData';

const FOUNDER_UPLOADED_PORTRAIT =
  '/assets/aistudio/file_0000000054d08210a42b676004f72b1e_1__9b1a7fcd.png';

const CORE_VALUES = [
  {
    index: '01',
    title: 'Creativity',
    icon: Sparkles,
    description: 'We approach every project with fresh thinking and originality.',
  },
  {
    index: '02',
    title: 'Excellence',
    icon: Layers,
    description: 'We pay attention to the details that make the difference.',
  },
  {
    index: '03',
    title: 'Strategy',
    icon: Target,
    description: 'We design with purpose and clear objectives.',
  },
  {
    index: '04',
    title: 'Innovation',
    icon: Lightbulb,
    description: 'We embrace new ideas and evolving digital possibilities.',
  },
  {
    index: '05',
    title: 'Integrity',
    icon: ShieldCheck,
    description: 'We value honesty, transparency and meaningful relationships.',
  },
];

const DIFFERENTIATORS = [
  {
    index: '01',
    title: 'Strategy-led creativity',
    detail:
      'Every visual decision begins with brand clarity and business purpose, ensuring creative work communicates with intent rather than ornament.',
  },
  {
    index: '02',
    title: 'Thoughtful brand experiences',
    detail:
      'We shape cohesive identities and digital touchpoints designed to help audiences recognise, understand, and trust what your business stands for.',
  },
  {
    index: '03',
    title: 'Design that balances beauty and usability',
    detail:
      'Distinctive visual direction works hand-in-hand with intuitive structure, readable hierarchy, and effortless navigation on every screen.',
  },
  {
    index: '04',
    title: 'Attention to detail',
    detail:
      'From typographic spacing and alignment to interactive responsiveness, we refine the small details that elevate the overall standard.',
  },
  {
    index: '05',
    title: 'Client-focused collaboration',
    detail:
      'We listen closely, communicate transparently, and treat every commission as a genuine creative partnership built around your goals.',
  },
  {
    index: '06',
    title: 'A commitment to quality',
    detail:
      'We hold every brand asset, interface, and deliverable to a consistently high standard before it ever reaches your audience.',
  },
];

const WORKING_PROCESS = [
  {
    step: '01',
    title: 'Discover',
    description: "Understand the client's business, goals, audience and requirements.",
  },
  {
    step: '02',
    title: 'Strategise',
    description: 'Develop a creative direction and establish the approach.',
  },
  {
    step: '03',
    title: 'Create',
    description: 'Design, develop and refine the agreed solution.',
  },
  {
    step: '04',
    title: 'Deliver',
    description: 'Present the completed work and provide the agreed final deliverables.',
  },
];

const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const;

export function AboutPage() {
  const {navigate, settings} = useStudio();
  const [portraitFallbackStep, setPortraitFallbackStep] = useState<0 | 1 | 2>(0);
  const [activeDifferentiator, setActiveDifferentiator] = useState(0);
  const [activeCapabilityIndex, setActiveCapabilityIndex] = useState(0);

  const customFounderPhoto = settings.founder.photoUrl?.trim() || '';
  const portraitSrc =
    portraitFallbackStep === 0 && customFounderPhoto
      ? customFounderPhoto
      : portraitFallbackStep < 2
        ? FOUNDER_UPLOADED_PORTRAIT
        : '';

  const handlePortraitError = () => {
    if (portraitFallbackStep === 0 && customFounderPhoto) {
      setPortraitFallbackStep(1);
    } else {
      setPortraitFallbackStep(2);
    }
  };

  const hasCustomBio =
    Boolean(settings.founder.bio?.trim()) &&
    !settings.founder.bio.includes('Update this founder biography');

  const rawFounderName = settings.founder.name?.trim() || '';
  const isPlaceholderName =
    !rawFounderName || rawFounderName.includes('[Update in Admin Settings]');

  const activeService = STUDIO_SERVICES[activeCapabilityIndex] || STUDIO_SERVICES[0];

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };

  return (
    <main className="bg-[#05060D] text-white">
      {/* 1. ABOUT PAGE HERO */}
      <section className="relative overflow-hidden border-b border-[rgba(191,195,202,0.12)] bg-[#05060D]">
        <div
          aria-hidden="true"
          className="studio-grid-pattern pointer-events-none absolute inset-0 opacity-60"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_15%,rgba(7,91,255,0.22),transparent_55%),radial-gradient(ellipse_at_15%_85%,rgba(23,105,255,0.12),transparent_50%)]"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(240px,0.8fr)] md:gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:gap-12">
            {/* Left Column: Headline, Introductory Text & CTA */}
            <motion.div
              initial={{opacity: 0, y: 14}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.45, ease: EDITORIAL_EASE}}
              className="min-w-0 md:col-start-1"
            >
              <p className="text-xs font-semibold tracking-[0.16em] text-[#1769FF] uppercase">
                Behind the Creative Vision
              </p>

              <h1
                className="mt-5 font-display font-semibold tracking-tight text-white [text-wrap:balance]"
                style={{fontSize: 'clamp(2.45rem, 4.7vw, 4.35rem)', lineHeight: 1.05}}
              >
                Creativity With Purpose.{' '}
                <span className="text-[#1769FF]">Design With Impact.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#BFC3CA] sm:text-lg">
                Discover the vision, thinking and creative ambition behind SOLMONIX STUDIO — where
                strategic design and digital innovation come together to build meaningful brand
                experiences.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => scrollToSection('our-story')}
                  className="inline-flex min-h-[46px] items-center gap-2.5 rounded-lg bg-[#1769FF] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#075BFF]"
                >
                  <span>Explore Our Story</span>
                  <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('founder-vision')}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-lg border border-[rgba(191,195,202,0.24)] bg-[#080D25]/60 px-5 py-3 text-sm font-medium text-[#BFC3CA] transition-colors duration-150 hover:border-[#1769FF] hover:text-white"
                >
                  <span>Meet the Founder</span>
                </button>
              </div>
            </motion.div>

            {/* Right Column: Sharp Original Uploaded Founder Photograph */}
            <motion.div
              initial={{opacity: 0, y: 16}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.08, ease: EDITORIAL_EASE}}
              className="relative mx-auto w-full max-w-[300px] md:col-start-2 md:mx-0 md:max-w-[310px] lg:max-w-[336px] md:self-center md:justify-self-end"
            >
              {/* Subtle electric-blue illumination strictly behind the frame */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-6 rounded-3xl bg-[radial-gradient(circle_at_50%_46%,rgba(7,91,255,0.28),rgba(23,105,255,0.08)_58%,transparent_78%)]"
              />

              <div className="relative rounded-2xl border border-[rgba(23,105,255,0.32)] bg-[#080D25] p-2.5 shadow-[0_24px_64px_-20px_rgba(7,91,255,0.38)]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1769FF]/80 to-transparent"
                />

                <div className="aspect-[1199/1312] overflow-hidden rounded-xl border border-[rgba(191,195,202,0.12)] bg-[#05060D]">
                  {portraitSrc ? (
                    <img
                      src={portraitSrc}
                      alt={
                        isPlaceholderName
                          ? 'Founder of SOLMONIX STUDIO'
                          : `${rawFounderName} — Founder of SOLMONIX STUDIO`
                      }
                      width={1199}
                      height={1312}
                      loading="eager"
                      decoding="sync"
                      referrerPolicy="no-referrer"
                      onError={handlePortraitError}
                      className="block h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="studio-grid-pattern flex h-full w-full flex-col items-center justify-center p-6 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[rgba(191,195,202,0.22)] bg-[#080D25]">
                        <User className="h-6 w-6 text-[#1769FF]" aria-hidden="true" />
                      </div>
                      <p className="mt-4 font-display text-sm font-medium text-white">
                        Founder Portrait Unavailable
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-[rgba(191,195,202,0.12)] px-0.5 pt-2 text-xs">
                  <span className="truncate font-medium text-white">
                    {isPlaceholderName ? 'Founder & Creative Director' : rawFounderName}
                  </span>
                  <span className="shrink-0 font-semibold text-[#1769FF]">SOLMONIX STUDIO</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. FOUNDER'S INTRODUCTION */}
      <section
        id="founder-vision"
        className="relative scroll-mt-16 overflow-hidden border-b border-[rgba(191,195,202,0.12)] bg-[#080D25]/45"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(7,91,255,0.14),transparent_55%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          {/* Featured Studio Introduction Film */}
          <motion.div
            initial={{opacity: 0, y: 18}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, amount: 0.15}}
            transition={{duration: 0.5, ease: EDITORIAL_EASE}}
            className="grid items-center gap-10 border-b border-[rgba(191,195,202,0.12)] pb-16 lg:grid-cols-12 lg:gap-14"
          >
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#1769FF] uppercase">
                Studio Introduction Film
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white [text-wrap:balance] sm:text-4xl">
                Hear the Vision Behind{' '}
                <span className="text-[#1769FF]">SOLMONIX STUDIO.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#BFC3CA]">
                Watch a direct introduction from our founder on how we unite graphic design, brand
                identity systems, bespoke websites, and intelligent AI workflows to help businesses
                stand out and grow.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/start-a-project')}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#1769FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#075BFF]"
                >
                  <span>Work With Us</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/services')}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[rgba(191,195,202,0.24)] px-5 py-2.5 text-sm font-medium text-[#BFC3CA] transition-colors duration-150 hover:border-[#1769FF] hover:text-white"
                >
                  <span>Explore Capabilities</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <StudioIntroVideo />
            </div>
          </motion.div>

          <div className="mt-16 grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Studio Emblem & Chapter Index Plate */}
            <motion.aside
              initial={{opacity: 0, y: 18}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, amount: 0.15}}
              transition={{duration: 0.5, ease: EDITORIAL_EASE}}
              aria-label="About page chapters"
              className="rounded-2xl border border-[rgba(23,105,255,0.28)] bg-[#080D25]/85 p-6 sm:p-8 lg:col-span-5"
            >
              <div className="flex items-center gap-4 border-b border-[rgba(191,195,202,0.12)] pb-6">
                <SolmonixMonogram size={44} className="shrink-0" />
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold tracking-[0.2em] text-white uppercase">
                    SOLMONIX
                  </p>
                  <p className="mt-0.5 truncate font-display text-[10px] font-medium tracking-[0.52em] text-[#BFC3CA]/85 uppercase">
                    STUDIO
                  </p>
                  <p className="mt-1.5 text-xs leading-snug text-[#BFC3CA]">
                    Designing Brands. Building Digital Experiences.
                  </p>
                </div>
              </div>

              <p className="mt-5 text-xs font-semibold tracking-[0.14em] text-[#1769FF] uppercase">
                Studio Overview
              </p>

              <nav className="mt-3 divide-y divide-[rgba(191,195,202,0.1)]" aria-label="Section index">
                {[
                  {index: '01', label: "Founder's Introduction", target: 'founder-vision'},
                  {index: '02', label: 'The SOLMONIX Story', target: 'our-story'},
                  {index: '03', label: 'Mission, Vision & Values', target: 'mission-vision'},
                  {index: '04', label: 'Creative Capabilities', target: 'creative-capabilities'},
                  {index: '05', label: 'Working Process', target: 'working-process'},
                ].map((chapter) => (
                  <button
                    key={chapter.target}
                    type="button"
                    onClick={() => scrollToSection(chapter.target)}
                    className="group flex w-full items-center justify-between py-3.5 text-left text-xs transition-colors hover:text-white"
                  >
                    <span className="flex items-center gap-3 text-[#BFC3CA] group-hover:text-white">
                      <span className="font-display font-semibold text-[#1769FF] tabular-nums">
                        {chapter.index}
                      </span>
                      <span className="font-medium">{chapter.label}</span>
                    </span>
                    <ArrowRight
                      className="h-3.5 w-3.5 text-[#BFC3CA]/60 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[#1769FF]"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </nav>
            </motion.aside>

            {/* Founder Narrative */}
            <motion.div
              initial={{opacity: 0, y: 18}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, amount: 0.15}}
              transition={{duration: 0.5, delay: 0.08, ease: EDITORIAL_EASE}}
              className="lg:col-span-7"
            >
              <p className="text-xs font-semibold tracking-[0.16em] text-[#1769FF] uppercase">
                The Person Behind the Vision
              </p>

              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white [text-wrap:balance] sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]">
                Driven by Vision. Built on Creativity.
              </h2>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-[#BFC3CA]">
                <span className="text-white">
                  {isPlaceholderName
                    ? 'Founder Name (Editable in Studio Settings)'
                    : rawFounderName}
                </span>
                <span aria-hidden="true" className="text-[#1769FF]">
                  ·
                </span>
                <span>{settings.founder.role || 'Founder & Creative Director, SOLMONIX STUDIO'}</span>
              </div>

              <div className="mt-7 space-y-5 text-base leading-relaxed text-[#BFC3CA]">
                {hasCustomBio ? (
                  <p>{settings.founder.bio}</p>
                ) : (
                  <>
                    <p>
                      SOLMONIX STUDIO is shaped by a deep belief in the power of intentional
                      design. Great businesses deserve visual identities and digital platforms that
                      communicate their true value the moment an audience arrives.
                    </p>
                    <p>
                      With a genuine passion for creative direction, brand systems, and modern web
                      craft, the studio was built to combine original aesthetic vision with
                      disciplined execution—helping ambitious founders and growing organisations
                      present themselves with clarity, confidence, and lasting impact.
                    </p>
                    <p className="text-sm text-[#BFC3CA]/80">
                      Every collaboration reflects a personal commitment to craft: listening
                      carefully, thinking strategically, and refining every detail until the final
                      brand or digital experience feels unmistakable.
                    </p>
                  </>
                )}
              </div>

              {settings.founder.quote && (
                <blockquote className="mt-8 border-t border-[rgba(191,195,202,0.16)] pt-7">
                  <p className="font-display text-lg leading-relaxed text-white sm:text-xl">
                    &ldquo;{settings.founder.quote}&rdquo;
                  </p>
                  <footer className="mt-3 text-xs font-medium text-[#BFC3CA]/80">
                    Creative Philosophy · SOLMONIX STUDIO
                  </footer>
                </blockquote>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/start-a-project')}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-lg bg-[#1769FF] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#075BFF]"
                >
                  <span>Start a Project</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/projects')}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-lg border border-[rgba(191,195,202,0.24)] px-5 py-3 text-sm font-medium text-white transition-colors duration-150 hover:border-[#1769FF] hover:bg-[#080D25]"
                >
                  <span>Explore Our Projects</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. THE SOLMONIX STORY */}
      <section
        id="our-story"
        className="scroll-mt-16 border-b border-[rgba(191,195,202,0.12)] bg-[#05060D]"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#1769FF] uppercase">
                Our Story
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white [text-wrap:balance] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                More Than Design. A Commitment to{' '}
                <span className="text-[#1769FF]">Making Brands Matter.</span>
              </h2>
            </div>

            <div className="space-y-6 lg:col-span-6 lg:pt-2">
              <p className="font-display text-lg leading-relaxed text-white/95 sm:text-xl">
                SOLMONIX STUDIO exists to help ambitious businesses communicate with clarity,
                connect with their audience, and grow through strategic design and thoughtful
                digital experiences.
              </p>
              <div className="space-y-4 border-t border-[rgba(191,195,202,0.14)] pt-6 text-base leading-relaxed text-[#BFC3CA]">
                <p>
                  Too many capable businesses go unnoticed simply because their visual identity and
                  website fail to express the real quality behind their work.
                </p>
                <p>
                  By bringing brand identity, graphic craft, and web design and development together
                  within one focused studio, we remove the disconnect between how a brand looks
                  and how its digital flagship performs—creating work people remember and trust.
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Story Pillars — Unboxed Hairline Strip */}
          <div className="mt-16 grid gap-8 border-t border-[rgba(191,195,202,0.14)] pt-10 md:grid-cols-3">
            {[
              {
                index: '01',
                heading: 'Communicate Clearly',
                text: 'Visual language and brand systems shaped around what sets your business apart.',
              },
              {
                index: '02',
                heading: 'Connect Meaningfully',
                text: 'Human-centred digital interfaces crafted to build credibility from the first interaction.',
              },
              {
                index: '03',
                heading: 'Grow With Confidence',
                text: 'Cohesive foundations across brand and web built to support long-term momentum.',
              },
            ].map((pillar) => (
              <div key={pillar.index} className="flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-display text-xs font-semibold text-[#1769FF] tabular-nums">
                    {pillar.index}
                  </span>
                  <span className="h-px flex-1 bg-[rgba(23,105,255,0.28)]" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">
                  {pillar.heading}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#BFC3CA]">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MISSION, VISION AND VALUES */}
      <section
        id="mission-vision"
        className="relative scroll-mt-16 overflow-hidden border-b border-[rgba(191,195,202,0.12)] bg-[#080D25]/45"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(7,91,255,0.14),transparent_55%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#1769FF] uppercase">
              Purpose &amp; Principles
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white [text-wrap:balance] sm:text-4xl">
              Guided by clear mission, long-term vision, and enduring values.
            </h2>
          </div>

          {/* Area 1 & 2: Mission & Vision Diptych */}
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="relative overflow-hidden rounded-2xl border border-[rgba(23,105,255,0.3)] bg-[#080D25]/90 p-8 sm:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1769FF] to-transparent"
              />
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1769FF]/15 text-[#1769FF] ring-1 ring-[#1769FF]/30">
                  <Compass className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="text-xs font-semibold tracking-[0.16em] text-[#1769FF] uppercase">
                  Mission
                </p>
              </div>
              <p className="mt-6 font-display text-xl leading-relaxed font-semibold text-white sm:text-2xl">
                To help businesses communicate their value and stand out through purposeful design
                and effective digital experiences.
              </p>
            </article>

            <article className="relative overflow-hidden rounded-2xl border border-[rgba(191,195,202,0.16)] bg-[#05060D]/90 p-8 sm:p-10">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1769FF]/15 text-[#1769FF] ring-1 ring-[#1769FF]/30">
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="text-xs font-semibold tracking-[0.16em] text-[#1769FF] uppercase">
                  Vision
                </p>
              </div>
              <p className="mt-6 font-display text-xl leading-relaxed font-semibold text-white sm:text-2xl">
                To become a recognised creative and digital studio known for building meaningful
                brands and exceptional digital experiences.
              </p>
            </article>
          </div>

          {/* Area 3: Five Core Values — Editorial Ledger */}
          <div className="mt-14 border-t border-[rgba(191,195,202,0.14)] pt-12">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-[#1769FF] uppercase">
                  Core Values
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-white">
                  Five principles behind every engagement.
                </h3>
              </div>
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {CORE_VALUES.map((val) => {
                const Icon = val.icon;
                return (
                  <div
                    key={val.index}
                    className="group border-t border-[rgba(191,195,202,0.18)] pt-6 transition-colors duration-150 hover:border-[#1769FF]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs font-semibold text-[#1769FF] tabular-nums">
                        {val.index}
                      </span>
                      <Icon
                        className="h-4 w-4 text-[#BFC3CA]/70 transition-colors duration-150 group-hover:text-[#1769FF]"
                        aria-hidden="true"
                      />
                    </div>
                    <h4 className="mt-4 font-display text-lg font-semibold text-white">
                      {val.title}
                    </h4>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#BFC3CA]">
                      {val.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHAT MAKES US DIFFERENT */}
      <section className="border-b border-[rgba(191,195,202,0.12)] bg-[#05060D]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            {/* Left Sticky Editorial Summary */}
            <div className="lg:sticky lg:top-24 lg:col-span-5">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#1769FF] uppercase">
                What Makes Us Different
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white [text-wrap:balance] sm:text-4xl">
                Why Brands Choose SOLMONIX STUDIO
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#BFC3CA]">
                We do not rely on templates or guesswork. Every brand system and digital product is
                shaped through clear strategy, careful craft, and genuine partnership.
              </p>

              {/* Dynamic Spotlight Readout */}
              <div className="mt-8 rounded-2xl border border-[rgba(23,105,255,0.28)] bg-[#080D25]/80 p-6 sm:p-7">
                <p className="font-display text-xs font-semibold text-[#1769FF] tabular-nums">
                  {DIFFERENTIATORS[activeDifferentiator].index} · Studio Standard
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-white">
                  {DIFFERENTIATORS[activeDifferentiator].title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#BFC3CA]">
                  {DIFFERENTIATORS[activeDifferentiator].detail}
                </p>
              </div>
            </div>

            {/* Right Interactive Hairline Index */}
            <div className="divide-y divide-[rgba(191,195,202,0.14)] border-y border-[rgba(191,195,202,0.14)] lg:col-span-7">
              {DIFFERENTIATORS.map((item, idx) => {
                const isSelected = idx === activeDifferentiator;
                return (
                  <button
                    key={item.index}
                    type="button"
                    onMouseEnter={() => setActiveDifferentiator(idx)}
                    onClick={() => setActiveDifferentiator(idx)}
                    className={`group flex w-full items-start justify-between gap-6 px-3 py-6 text-left transition-colors duration-150 sm:px-5 sm:py-7 ${
                      isSelected ? 'bg-[#080D25]/70' : 'hover:bg-[#080D25]/35'
                    }`}
                  >
                    <div className="flex items-start gap-5 sm:gap-7">
                      <span
                        className={`mt-1 font-display text-sm font-semibold tabular-nums transition-colors ${
                          isSelected
                            ? 'text-[#1769FF]'
                            : 'text-[#BFC3CA]/60 group-hover:text-[#1769FF]'
                        }`}
                      >
                        {item.index}
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-white sm:text-xl">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#BFC3CA]">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      className={`mt-1.5 h-4 w-4 shrink-0 transition-transform duration-150 ${
                        isSelected
                          ? 'translate-x-0.5 text-[#1769FF]'
                          : 'text-[#BFC3CA]/40 group-hover:translate-x-0.5 group-hover:text-[#1769FF]'
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. OUR CREATIVE CAPABILITIES */}
      <section
        id="creative-capabilities"
        className="relative scroll-mt-16 overflow-hidden border-b border-[rgba(191,195,202,0.12)] bg-[#080D25]/40"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_80%,rgba(7,91,255,0.14),transparent_55%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-[#1769FF] uppercase">
                Our Creative Capabilities
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white [text-wrap:balance] sm:text-4xl">
                Five focused disciplines. One unified creative studio.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="inline-flex shrink-0 items-center gap-2 self-start text-sm font-semibold text-[#BFC3CA] transition-colors hover:text-white sm:self-auto"
            >
              <span>View All Services</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Interactive Discipline Selector + Visual Showcase */}
          <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-stretch">
            {/* Left Service Index */}
            <div className="flex flex-col justify-between divide-y divide-[rgba(191,195,202,0.12)] border-y border-[rgba(191,195,202,0.12)] lg:col-span-5">
              {STUDIO_SERVICES.map((service, idx) => {
                const active = idx === activeCapabilityIndex;
                return (
                  <div
                    key={service.id}
                    className={`flex items-center justify-between gap-3 px-3 py-4 transition-colors duration-150 sm:px-4 ${
                      active ? 'bg-[#080D25]/85' : 'hover:bg-[#080D25]/40'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveCapabilityIndex(idx)}
                      onMouseEnter={() => setActiveCapabilityIndex(idx)}
                      className="flex min-w-0 flex-1 items-center gap-4 text-left"
                    >
                      <span
                        className={`font-display text-xs font-semibold tabular-nums ${
                          active ? 'text-[#1769FF]' : 'text-[#BFC3CA]/60'
                        }`}
                      >
                        {service.index}
                      </span>
                      <div className="min-w-0">
                        <p
                          className={`truncate font-display text-base font-semibold ${
                            active ? 'text-white' : 'text-[#E6E9EF]'
                          }`}
                        >
                          {service.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-[#BFC3CA]/80">
                          {service.summary}
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/services#${service.id}`)}
                      aria-label={`Explore ${service.title} on Services page`}
                      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                        active
                          ? 'border-[#1769FF] bg-[#1769FF] text-white'
                          : 'border-[rgba(191,195,202,0.2)] text-[#BFC3CA] hover:border-[#1769FF] hover:text-white'
                      }`}
                    >
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Right Active Service Visual Plate */}
            <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[rgba(23,105,255,0.28)] bg-[#05060D] lg:col-span-7">
              <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[rgba(191,195,202,0.12)]">
                <ServiceVisualImage
                  key={activeService.id}
                  src={activeService.imageUrl}
                  alt={activeService.imageAlt}
                  title={activeService.title}
                  index={activeService.index}
                  className="h-full w-full object-cover object-center transition-transform duration-500 ease-out"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05060D] via-[#05060D]/20 to-transparent"
                />
                <div className="pointer-events-none absolute inset-x-6 bottom-5 flex items-center justify-between text-xs text-[#BFC3CA]">
                  <span className="font-display font-semibold text-[#1769FF] tabular-nums">
                    {activeService.index} · Creative Discipline
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-white">
                    {activeService.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#BFC3CA] sm:text-base">
                    {activeService.description}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(191,195,202,0.12)] pt-5">
                  <button
                    type="button"
                    onClick={() => navigate(`/services#${activeService.id}`)}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#1769FF] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#075BFF]"
                  >
                    <span>Explore {activeService.shortTitle}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate('/start-a-project', {preselectedService: activeService.title})
                    }
                    className="inline-flex min-h-[42px] items-center gap-1.5 text-xs font-semibold text-[#BFC3CA] transition-colors hover:text-white"
                  >
                    <span>Commission This Service</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#1769FF]" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. OUR WORKING PROCESS */}
      <section
        id="working-process"
        className="scroll-mt-16 border-b border-[rgba(191,195,202,0.12)] bg-[#05060D]"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#1769FF] uppercase">
              Our Working Process
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white [text-wrap:balance] sm:text-4xl">
              From First Conversation to Final Experience.
            </h2>
          </div>

          {/* Desktop Horizontal Connected Track / Mobile Vertical Timeline */}
          <div className="relative mt-14">
            {/* Desktop horizontal connector line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-5 hidden h-px bg-gradient-to-r from-[#1769FF]/70 via-[#1769FF]/30 to-[rgba(191,195,202,0.14)] lg:block"
            />
            {/* Mobile vertical connector line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-6 left-5 top-5 w-px bg-gradient-to-b from-[#1769FF]/70 via-[#1769FF]/30 to-[rgba(191,195,202,0.14)] lg:hidden"
            />

            <ol className="grid gap-10 lg:grid-cols-4 lg:gap-8">
              {WORKING_PROCESS.map((stage, idx) => (
                <motion.li
                  key={stage.step}
                  initial={{opacity: 0, y: 12}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true, amount: 0.15}}
                  transition={{duration: 0.4, delay: idx * 0.06, ease: EDITORIAL_EASE}}
                  className="relative flex gap-5 lg:block"
                >
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#1769FF]/60 bg-[#080D25] font-display text-xs font-semibold text-white tabular-nums shadow-[0_0_24px_-4px_rgba(7,91,255,0.65)]">
                    {stage.step}
                  </div>
                  <div className="pt-1 lg:mt-6 lg:pt-0">
                    <h3 className="font-display text-xl font-semibold text-white">{stage.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#BFC3CA]">
                      {stage.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION */}
      <section className="relative overflow-hidden bg-[#080D25]/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(7,91,255,0.28),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-28">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#1769FF] uppercase">
            Collaborate With SOLMONIX STUDIO
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white [text-wrap:balance] sm:text-5xl">
            Have a Vision? Let&apos;s Bring It to Life.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#BFC3CA] sm:text-lg">
            Let&apos;s turn your next idea into a meaningful brand experience.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/start-a-project')}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-[#1769FF] px-7 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#075BFF]"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-[rgba(191,195,202,0.28)] bg-[#05060D]/70 px-7 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:border-[#1769FF] hover:bg-[#080D25]"
            >
              <span>Explore Our Projects</span>
              <ArrowRight className="h-4 w-4 text-[#BFC3CA]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
