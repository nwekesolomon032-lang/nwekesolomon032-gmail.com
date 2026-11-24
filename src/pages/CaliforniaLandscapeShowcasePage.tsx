import React, {useState} from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Phone,
  X,
} from 'lucide-react';
import heroPatioImg from '../assets/images/ccl_hero_patio_1795435226084.jpg';
import frontLandscapeImg from '../assets/images/ccl_front_landscape_1795435225314.jpg';
import stoneFireplaceImg from '../assets/images/ccl_stone_fireplace_1795435226500.jpg';
import hardscapeKitchenImg from '../assets/images/ccl_hardscape_kitchen_1795435227063.jpg';
import concreteWalkwayImg from '../assets/images/ccl_concrete_walkway_1795435226192.jpg';
import turfPatioImg from '../assets/images/ccl_turf_patio_1795435226274.jpg';
import {useStudio} from '../context/StudioContext';

type TradeKey = 'Landscape' | 'Concrete' | 'Artificial Turf';

const TRADE_DETAILS: Record<
  TradeKey,
  {
    title: string;
    subtitle: string;
    description: string;
    highlights: string[];
    image: string;
  }
> = {
  Landscape: {
    title: 'Custom Landscape Design & Planting',
    subtitle: 'Architectural greenery, stone planters, and drought-smart Southern California gardens.',
    description:
      'Complete front and backyard transformations combining stacked-stone retaining planters, low-voltage accent lighting, water-efficient irrigation, and curated California plant palettes.',
    highlights: [
      'Natural stacked-stone & travertine retaining walls',
      'Drought-tolerant planting & drip irrigation systems',
      'Low-voltage architectural path & tree uplighting',
    ],
    image: frontLandscapeImg,
  },
  Concrete: {
    title: 'Custom Concrete, Hardscape & Outdoor Living',
    subtitle: 'Stamped patios, curved walkways, stone BBQ islands, and custom fireplaces.',
    description:
      'Engineered structural concrete slabs, broom-finished walkways, travertine pool decks, built-in stainless steel BBQ kitchens, and custom stone fire features designed for year-round entertaining.',
    highlights: [
      'Stamped, coloured & architectural concrete flatwork',
      'Custom stone BBQ islands & granite bar counters',
      'Outdoor natural gas fireplaces & seating walls',
    ],
    image: concreteWalkwayImg,
  },
  'Artificial Turf': {
    title: 'Premium Artificial Turf Installation',
    subtitle: 'Lush evergreen lawns with pet-safe drainage and zero weekly mowing.',
    description:
      'High-density multi-tone synthetic turf installed over compacted crushed-rock sub-bases for crisp year-round greenery alongside pools, flagstone paths, and residential courtyards.',
    highlights: [
      'Natural blade texture & UV-stabilised yarns',
      'Permeable crushed-rock sub-base & drainage',
      'Clean concrete mow-curb & stone edging transitions',
    ],
    image: turfPatioImg,
  },
};

const SERVICE_CITIES = [
  'Chino Hills',
  'Anaheim',
  'Orange County',
  'Irvine',
  'Rancho Cucamonga',
  'Yorba Linda',
  'Fullerton',
  'Los Angeles Metro',
];

export function CaliforniaLandscapeShowcasePage() {
  const {navigate} = useStudio();
  const [selectedTrade, setSelectedTrade] = useState<TradeKey>('Landscape');
  const [selectedCity, setSelectedCity] = useState<string>('Chino Hills');
  const [lightboxImage, setLightboxImage] = useState<{src: string; caption: string} | null>(null);
  const [estimateOpen, setEstimateOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);

  const [estimateForm, setEstimateForm] = useState({
    name: '',
    phone: '',
    city: 'Chino Hills',
    service: 'Landscape Design',
    notes: '',
  });
  const [estimateError, setEstimateError] = useState('');
  const [estimateSubmitted, setEstimateSubmitted] = useState(false);

  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };

  const openEstimateFor = (service?: string, city?: string) => {
    setEstimateForm((prev) => ({
      ...prev,
      service: service || prev.service,
      city: city || prev.city,
    }));
    setEstimateError('');
    setEstimateSubmitted(false);
    setEstimateOpen(true);
  };

  const handleEstimateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (estimateForm.name.trim().length < 2 || estimateForm.phone.trim().length < 7) {
      setEstimateError('Please provide your name and a valid callback phone number.');
      return;
    }
    setEstimateError('');
    setEstimateSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#3F454C] [font-family:'Manrope',sans-serif]">
      {/* Compact Top Portfolio Bar connecting back to SOLMONIX STUDIO */}
      <div className="sticky top-0 z-40 border-b border-[rgba(191,195,202,0.16)] bg-[#0A0D14]/95 text-white backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-[#BFC3CA] transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Back to Projects</span>
            </button>
            <span className="hidden text-[#BFC3CA]/40 sm:inline" aria-hidden="true">
              /
            </span>
            <span className="hidden truncate text-[#BFC3CA] sm:inline">
              SOLMONIX STUDIO Portfolio Showcase · California Custom Landscape, Inc.
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/projects/california-custom-landscape')}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-[rgba(191,195,202,0.25)] px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:border-[#1769FF]"
            >
              <span>View Case Study</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() =>
                navigate('/start-a-project', {preselectedService: 'Website Design'})
              }
              className="hidden items-center gap-1.5 whitespace-nowrap rounded-md bg-[#1769FF] px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#2F7BFF] sm:inline-flex"
            >
              <span>Request Similar Website</span>
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* 1. HERO SECTION */}
      <header id="ccl-home" className="relative overflow-hidden bg-[#1D2024] text-white">
        <img
          src={heroPatioImg}
          alt="Luxury Southern California backyard patio pergola, fire pit lounge, and turf"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,17,22,0.72)_0%,rgba(14,17,22,0.52)_55%,rgba(14,17,22,0.74)_100%)]"
        />

        <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 sm:pb-36 lg:px-8">
          {/* Top Contact & Navigation Header */}
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            {/* Script Logo Lockup matching screenshot */}
            <a
              href="#ccl-home"
              onClick={(e) => {
                e.preventDefault();
                scrollToAnchor('ccl-home');
              }}
              className="inline-block shrink-0 text-left"
            >
              <span
                className="block text-3xl leading-[1.05] text-[#2699FB] drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] sm:text-4xl"
                style={{fontFamily: "'Great Vibes', 'Cormorant Garamond', Georgia, serif"}}
              >
                California Custom
                <span className="block pl-6">Landscape, Inc.</span>
              </span>
              <span className="mt-1.5 block text-[10px] font-semibold tracking-[0.22em] text-white/85 uppercase">
                Design, Construction &amp; Maintenance
              </span>
            </a>

            {/* Right Phone Button, License & Single-Line Navigation */}
            <div className="flex flex-col items-start gap-3 md:items-end">
              <div className="flex flex-col items-start md:items-end">
                <a
                  href="tel:9094656515"
                  className="inline-flex items-center gap-2 rounded bg-[#0A84FF] px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-sm transition-colors hover:bg-[#006FE0] tabular-nums"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>909-465-6515</span>
                </a>
                <span className="mt-1.5 text-[11px] font-medium tracking-wider text-white/85 tabular-nums">
                  CL# 791956
                </span>
              </div>

              <nav
                aria-label="California Custom Landscape Navigation"
                className="flex flex-wrap items-center gap-5 text-[11px] font-semibold tracking-[0.14em] text-white/90 uppercase"
              >
                <button
                  type="button"
                  onClick={() => scrollToAnchor('ccl-home')}
                  className="whitespace-nowrap border-b border-white pb-0.5 text-white transition-colors hover:text-[#3AA0FF]"
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTrade('Landscape');
                    scrollToAnchor('ccl-services');
                  }}
                  className="whitespace-nowrap pb-0.5 text-white/85 transition-colors hover:text-[#3AA0FF]"
                >
                  Landscape
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTrade('Concrete');
                    scrollToAnchor('ccl-services');
                  }}
                  className="whitespace-nowrap pb-0.5 text-white/85 transition-colors hover:text-[#3AA0FF]"
                >
                  Hardscape
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTrade('Artificial Turf');
                    scrollToAnchor('ccl-services');
                  }}
                  className="whitespace-nowrap pb-0.5 text-white/85 transition-colors hover:text-[#3AA0FF]"
                >
                  Artificial Turf
                </button>
                <button
                  type="button"
                  onClick={() => openEstimateFor()}
                  className="whitespace-nowrap pb-0.5 text-white/85 transition-colors hover:text-[#3AA0FF]"
                >
                  Contact
                </button>
              </nav>
            </div>
          </div>

          {/* Centered Hero Headline & CTA */}
          <div className="mx-auto mt-16 max-w-2xl text-center sm:mt-20">
            <h1
              className="text-2xl font-medium tracking-tight text-white [text-wrap:balance] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-3xl"
              style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
            >
              Your Local Landscaping &amp; Hardscaping Contractor Since 2001
            </h1>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => openEstimateFor()}
                className="inline-flex min-h-[42px] items-center justify-center rounded-md bg-[#0A84FF] px-7 py-2.5 text-xs font-semibold text-white shadow-[0_10px_25px_-8px_rgba(10,132,255,0.75)] transition-colors hover:bg-[#006FE0]"
              >
                Call us for a free estimate!
              </button>
            </div>
          </div>
        </div>

        {/* Concave White Bottom Wave */}
        <svg
          viewBox="0 0 1440 110"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none relative z-10 -mb-px block h-14 w-full sm:h-20"
        >
          <path
            d="M0,25 C340,105 560,108 770,58 C1010,2 1220,-6 1440,35 L1440,110 L0,110 Z"
            fill="#FFFFFF"
          />
        </svg>
      </header>

      {/* 2. LANDSCAPING & CONCRETE SERVICES INTRO */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-medium text-[#30353B] sm:text-4xl"
            style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
          >
            Landscaping &amp; Concrete Services
          </h2>

          {/* Minimal Shrub Emblem */}
          <div className="mx-auto mt-3 flex justify-center" aria-hidden="true">
            <svg viewBox="0 0 88 38" className="h-8 w-20 text-[#3F7C2C]">
              <path
                d="M14 33 C10 23, 18 14, 28 16 C31 7, 47 6, 52 15 C61 10, 74 16, 73 27 C77 30, 74 34, 68 34 L18 34 C13 34, 12 34, 14 33 Z"
                fill="#4D8C32"
              />
              <path
                d="M22 33 C21 24, 30 18, 38 22 C42 15, 55 16, 58 24 C65 22, 70 28, 66 33 Z"
                fill="#65AB3E"
              />
              <ellipse cx="44" cy="34.5" rx="34" ry="2.2" fill="#2E5420" opacity="0.25" />
            </svg>
          </div>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#5E656E]">
            When you need a landscaping design company to create your dream backyard, then you need
            California Custom Landscape Inc. For over 20 years, we have been the go-to landscaping
            design team helping our customers in Southern California build beautiful landscapes,
            concrete work, and artificial turf installation. Call our team now for your free
            estimate on your next landscaping design project!
          </p>

          {/* 2-Column Showcase Photos */}
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setLightboxImage({
                  src: frontLandscapeImg,
                  caption: 'Custom Front Yard Landscape & Stacked-Stone Planter Beds',
                })
              }
              className="group overflow-hidden rounded-sm bg-[#F3F4F6] text-left shadow-[0_14px_30px_-14px_rgba(0,0,0,0.28)]"
            >
              <img
                src={frontLandscapeImg}
                alt="Custom front yard landscaping with stone planters and concrete walkway"
                referrerPolicy="no-referrer"
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </button>

            <button
              type="button"
              onClick={() =>
                setLightboxImage({
                  src: stoneFireplaceImg,
                  caption: 'Custom Architectural Outdoor Stacked-Stone Fireplace',
                })
              }
              className="group overflow-hidden rounded-sm bg-[#F3F4F6] text-left shadow-[0_14px_30px_-14px_rgba(0,0,0,0.28)]"
            >
              <img
                src={stoneFireplaceImg}
                alt="Custom outdoor stacked-stone patio fireplace glowing at dusk"
                referrerPolicy="no-referrer"
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </button>
          </div>
        </div>
      </section>

      {/* 3. DARK WAVY BAND: CORE SERVICES */}
      <section
        id="ccl-services"
        className="relative scroll-mt-14 overflow-hidden bg-[#1D2126] text-white"
      >
        <img
          src={heroPatioImg}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,23,27,0.88)_0%,rgba(20,23,27,0.82)_100%)]"
        />

        {/* Top White Wave */}
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none relative z-10 -mt-px block h-14 w-full sm:h-20"
        >
          <path
            d="M0,0 L1440,0 L1440,35 C1210,82 960,82 720,38 C480,-6 220,10 0,60 Z"
            fill="#FFFFFF"
          />
        </svg>

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid gap-7 sm:grid-cols-3">
            {(
              [
                {key: 'Landscape', label: 'Landscape', img: frontLandscapeImg},
                {key: 'Concrete', label: 'Concrete', img: concreteWalkwayImg},
                {key: 'Artificial Turf', label: 'Artificial Turf', img: turfPatioImg},
              ] as const
            ).map((card) => {
              const isSelected = selectedTrade === card.key;
              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => setSelectedTrade(card.key)}
                  className="group text-center focus:outline-none"
                >
                  <div
                    className={`overflow-hidden rounded-sm border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-[#0A84FF] shadow-[0_14px_30px_-10px_rgba(10,132,255,0.45)]'
                        : 'border-white/10 group-hover:border-white/40'
                    }`}
                  >
                    <img
                      src={card.img}
                      alt={`${card.label} contractor work`}
                      referrerPolicy="no-referrer"
                      className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p
                    className={`mt-3 text-sm font-medium transition-colors ${
                      isSelected ? 'text-[#3AA0FF]' : 'text-white group-hover:text-[#3AA0FF]'
                    }`}
                  >
                    {card.label}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Interactive Selected Trade Scope Panel */}
          <div className="mt-10 rounded-lg border border-white/15 bg-black/35 p-6 backdrop-blur-sm sm:p-7">
            <div className="grid items-center gap-6 md:grid-cols-12">
              <div className="md:col-span-8">
                <p className="text-xs font-semibold tracking-wider text-[#3AA0FF] uppercase">
                  Selected Specialty · {selectedTrade}
                </p>
                <h3
                  className="mt-1.5 text-2xl font-medium text-white"
                  style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
                >
                  {TRADE_DETAILS[selectedTrade].title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  {TRADE_DETAILS[selectedTrade].description}
                </p>
                <ul className="mt-4 grid gap-2 text-xs text-white/90 sm:grid-cols-3">
                  {TRADE_DETAILS[selectedTrade].highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <CheckCircle2
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0A84FF]"
                        aria-hidden="true"
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex md:col-span-4 md:justify-end">
                <button
                  type="button"
                  onClick={() => openEstimateFor(selectedTrade)}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-md bg-[#0A84FF] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#006FE0]"
                >
                  Request {selectedTrade} Estimate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom White Wave */}
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none relative z-10 -mb-px block h-14 w-full sm:h-20"
        >
          <path
            d="M0,45 C280,95 620,10 920,45 C1180,75 1340,42 1440,18 L1440,90 L0,90 Z"
            fill="#FFFFFF"
          />
        </svg>
      </section>

      {/* 4. FEATURED PROJECTS & SERVICE AREAS */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Top 2-Column Backyard & BBQ Photos */}
          <div className="grid gap-8 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setLightboxImage({
                  src: turfPatioImg,
                  caption: 'Backyard Artificial Turf Lawn & Travertine Stone Seating Wall',
                })
              }
              className="group overflow-hidden rounded-sm bg-[#F3F4F6] shadow-[0_14px_30px_-14px_rgba(0,0,0,0.28)]"
            >
              <img
                src={turfPatioImg}
                alt="Backyard artificial turf with flagstone patio and stone seating wall"
                referrerPolicy="no-referrer"
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </button>

            <button
              type="button"
              onClick={() =>
                setLightboxImage({
                  src: hardscapeKitchenImg,
                  caption: 'Custom Stacked-Stone Outdoor BBQ Kitchen & Poolside Bar',
                })
              }
              className="group overflow-hidden rounded-sm bg-[#F3F4F6] shadow-[0_14px_30px_-14px_rgba(0,0,0,0.28)]"
            >
              <img
                src={hardscapeKitchenImg}
                alt="Custom stone BBQ kitchen island with granite counter next to swimming pool"
                referrerPolicy="no-referrer"
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </button>
          </div>

          {/* Service Areas Header */}
          <h2
            className="mx-auto mt-14 max-w-xl text-center text-2xl font-medium leading-snug text-[#0A84FF] sm:text-3xl"
            style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
          >
            Proudly Serving Our Neighbors Throughout the Los Angeles County Metro Area Including:
          </h2>

          {/* 4-Column City List */}
          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-2.5 text-xs text-[#5E656E] sm:grid-cols-4">
            {SERVICE_CITIES.map((city) => {
              const active = selectedCity === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setSelectedCity(city);
                    openEstimateFor(undefined, city);
                  }}
                  className={`flex items-center gap-2 rounded py-1 text-left transition-colors ${
                    active ? 'font-semibold text-[#0A84FF]' : 'hover:text-[#0A84FF]'
                  }`}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#3F454C]" aria-hidden="true" />
                  <span className="truncate">{city}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom 2-Column Patio & Concrete Walkway Photos */}
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setLightboxImage({
                  src: heroPatioImg,
                  caption: 'Custom Pergola Patio, Fire Feature & Poolside Hardscape',
                })
              }
              className="group overflow-hidden rounded-sm bg-[#F3F4F6] shadow-[0_14px_30px_-14px_rgba(0,0,0,0.28)]"
            >
              <img
                src={heroPatioImg}
                alt="Covered patio remodel with stone fire table and pool"
                referrerPolicy="no-referrer"
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </button>

            <button
              type="button"
              onClick={() =>
                setLightboxImage({
                  src: concreteWalkwayImg,
                  caption: 'Architectural Curved Broom-Finished Concrete Walkway & River Rock Beds',
                })
              }
              className="group overflow-hidden rounded-sm bg-[#F3F4F6] shadow-[0_14px_30px_-14px_rgba(0,0,0,0.28)]"
            >
              <img
                src={concreteWalkwayImg}
                alt="Curved residential concrete front walkway with decorative rock beds"
                referrerPolicy="no-referrer"
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </button>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIAL BAND */}
      <section className="relative overflow-hidden bg-[#1D2126] text-white">
        <img
          src={stoneFireplaceImg}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,23,27,0.82)_0%,rgba(20,23,27,0.88)_100%)]"
        />

        {/* Top White Wave */}
        <svg
          viewBox="0 0 1440 85"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none relative z-10 -mt-px block h-14 w-full sm:h-20"
        >
          <path
            d="M0,0 L1440,0 L1440,42 C1120,88 860,12 520,26 C260,36 110,70 0,58 Z"
            fill="#FFFFFF"
          />
        </svg>

        <div className="relative z-10 mx-auto max-w-3xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
          <h2
            className="text-center text-2xl font-medium text-white sm:text-3xl"
            style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
          >
            See Why Our Customers Choose Us For Their Landscaping!
          </h2>

          <div className="relative mt-10 rounded-xl bg-white px-7 py-10 text-center text-[#3F454C] shadow-2xl sm:px-14 sm:py-12">
            {/* Opening Quote Badge */}
            <div
              aria-hidden="true"
              className="absolute -top-4 left-6 flex h-9 w-9 items-center justify-center rounded-full bg-[#0A84FF] font-serif text-xl font-bold text-white shadow-md"
            >
              &ldquo;
            </div>

            <blockquote className="text-sm leading-relaxed text-[#4A5058]">
              We are extremely pleased with the complete backyard landscape remodel by California
              Custom Landscape. From the start, they were extremely responsive and very willing to
              work with us to design and build our vision for our backyard. This was a large
              project, including demolition of all of the old planters, trees, plants, sod, and old
              patio. They installed all new stamped-concrete patios, planters, trees, plants,
              irrigation and accent lighting. Their work crews were prompt, worked hard, and
              cleaned up the site every day. They kept us informed every step of the way and worked
              with us on every detail.
            </blockquote>
            <p className="mt-4 text-xs font-semibold text-[#0A84FF]">
              Homeowner Remodel Client · Southern California
            </p>

            {/* Closing Quote Badge */}
            <div
              aria-hidden="true"
              className="absolute -bottom-4 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-[#0A84FF] font-serif text-xl font-bold text-white shadow-md"
            >
              &rdquo;
            </div>
          </div>
        </div>
      </section>

      {/* 6. DARK CHARCOAL FOOTER */}
      <footer className="bg-[#2F3134] py-12 text-center text-xs text-white/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-medium tracking-[0.14em] uppercase">
            <button
              type="button"
              onClick={() => scrollToAnchor('ccl-home')}
              className="hover:text-white"
            >
              Home
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => {
                setSelectedTrade('Landscape');
                scrollToAnchor('ccl-services');
              }}
              className="hover:text-white"
            >
              Landscape
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => {
                setSelectedTrade('Concrete');
                scrollToAnchor('ccl-services');
              }}
              className="hover:text-white"
            >
              Hardscape
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => {
                setSelectedTrade('Artificial Turf');
                scrollToAnchor('ccl-services');
              }}
              className="hover:text-white"
            >
              Artificial Turf
            </button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={() => openEstimateFor()} className="hover:text-white">
              Contact
            </button>
          </div>

          <p className="mt-4 text-[11px] text-white/75 tabular-nums">
            CL# 791956 · Phone:{' '}
            <a href="tel:9094656515" className="font-medium text-[#3AA0FF] hover:underline">
              909-465-6515
            </a>
          </p>

          <p className="mt-8 text-[10px] leading-relaxed text-white/55">
            California Custom Landscape, Inc. — Interactive Website Portfolio Built by{' '}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="font-semibold text-[#3AA0FF] hover:underline"
            >
              SOLMONIX STUDIO
            </button>
            .{' '}
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="text-[#3AA0FF] hover:underline"
            >
              Terms of Use
            </button>{' '}
            |{' '}
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="text-[#3AA0FF] hover:underline"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </footer>

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl overflow-hidden rounded-xl bg-[#16191F] text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              aria-label="Close photo"
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white hover:bg-[#0A84FF]"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={lightboxImage.src}
              alt={lightboxImage.caption}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-full object-contain bg-black"
            />
            <div className="flex items-center justify-between gap-4 px-5 py-3.5 text-xs">
              <span>{lightboxImage.caption}</span>
              <button
                type="button"
                onClick={() => {
                  setLightboxImage(null);
                  openEstimateFor();
                }}
                className="shrink-0 font-semibold text-[#3AA0FF] hover:underline"
              >
                Request Estimate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Free Estimate Inquiry Modal */}
      {estimateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Request a Free Landscape Estimate"
          onClick={() => setEstimateOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white p-6 text-[#30353B] shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-4">
              <div>
                <p className="text-[11px] font-semibold tracking-wider text-[#0A84FF] uppercase">
                  California Custom Landscape, Inc. · CL# 791956
                </p>
                <h3
                  className="mt-1 text-2xl font-semibold text-[#1D2024]"
                  style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
                >
                  Request Your Free Estimate
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEstimateOpen(false)}
                aria-label="Close modal"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {estimateSubmitted ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-[#0A84FF]" aria-hidden="true" />
                <h4 className="mt-4 text-lg font-semibold text-[#1D2024]">
                  Estimate Request Received
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  Thank you, <strong className="text-gray-900">{estimateForm.name}</strong>. Our
                  estimating desk for <strong className="text-gray-900">{estimateForm.city}</strong>{' '}
                  has your <strong className="text-gray-900">{estimateForm.service}</strong> inquiry
                  or you can call directly at{' '}
                  <a href="tel:9094656515" className="font-semibold text-[#0A84FF] hover:underline">
                    909-465-6515
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setEstimateOpen(false)}
                  className="mt-6 rounded-md bg-[#0A84FF] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#006FE0]"
                >
                  Return to Website
                </button>
              </div>
            ) : (
              <form onSubmit={handleEstimateSubmit} className="mt-5 space-y-4">
                {estimateError && (
                  <p className="rounded-md border border-red-200 bg-red-50 px-3.5 py-2 text-xs text-red-700">
                    {estimateError}
                  </p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      value={estimateForm.name}
                      onChange={(e) => setEstimateForm((p) => ({...p, name: e.target.value}))}
                      placeholder="Your name"
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#0A84FF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={estimateForm.phone}
                      onChange={(e) => setEstimateForm((p) => ({...p, phone: e.target.value}))}
                      placeholder="(909) 000-0000"
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#0A84FF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700">
                      Service Area
                    </label>
                    <div className="relative mt-1">
                      <MapPin
                        className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                      <select
                        value={estimateForm.city}
                        onChange={(e) => setEstimateForm((p) => ({...p, city: e.target.value}))}
                        className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-3 text-sm text-gray-900 focus:border-[#0A84FF] focus:outline-none"
                      >
                        {SERVICE_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700">
                      Primary Trade
                    </label>
                    <select
                      value={estimateForm.service}
                      onChange={(e) => setEstimateForm((p) => ({...p, service: e.target.value}))}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#0A84FF] focus:outline-none"
                    >
                      <option value="Landscape Design">Landscape Design</option>
                      <option value="Concrete & Hardscape">Concrete &amp; Hardscape</option>
                      <option value="Artificial Turf">Artificial Turf</option>
                      <option value="Complete Backyard Remodel">Complete Backyard Remodel</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Project Scope Notes
                  </label>
                  <textarea
                    rows={3}
                    value={estimateForm.notes}
                    onChange={(e) => setEstimateForm((p) => ({...p, notes: e.target.value}))}
                    placeholder="Patio square footage, retaining walls, turf area, or BBQ island goals..."
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#0A84FF] focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <a
                    href="tel:9094656515"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A84FF] hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Or Call 909-465-6515</span>
                  </a>
                  <button
                    type="submit"
                    className="rounded-md bg-[#0A84FF] px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#006FE0]"
                  >
                    Submit Estimate Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Terms / Privacy Info Modal */}
      {legalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLegalModal(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 text-[#30353B] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-semibold text-[#1D2024]">
                {legalModal === 'terms' ? 'Terms of Use' : 'Privacy Policy'}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                aria-label="Close"
                className="text-gray-500 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-gray-600">
              {legalModal === 'terms'
                ? 'This California Custom Landscape, Inc. website showcase demonstrates SOLMONIX STUDIO web design and front-end engineering work. License CL# 791956 reference applies to contractor showcase representation.'
                : 'Estimate inquiries submitted inside this portfolio showcase stay local to your browser preview and are not transmitted to third-party marketing lists.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
