import React from 'react';
import {ArrowRight, ArrowUpRight, Check} from 'lucide-react';
import {ServiceVisualImage} from '../components/ServiceVisualImage';
import {useStudio} from '../context/StudioContext';
import {STUDIO_SERVICES} from '../data/studioData';

export function ServicesPage() {
  const {navigate} = useStudio();

  const scrollToService = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };

  return (
    <main>
      <section className="border-b border-[rgba(191,195,202,0.12)] bg-[#101216]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] uppercase">
            Services &amp; Capabilities
          </p>
          <h1
            className="mt-4 max-w-4xl font-display font-semibold tracking-tight text-white [text-wrap:balance]"
            style={{fontSize: 'clamp(2.25rem, 4vw, 3.75rem)', lineHeight: 1.08}}
          >
            Integrated creative and digital services engineered for growth.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#BFC3CA] sm:text-lg">
            Every engagement can be commissioned as a focused discipline or combined into a
            unified brand-to-web transformation.
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {STUDIO_SERVICES.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => scrollToService(service.id)}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#16191F] px-4 py-2 text-xs font-medium text-[#BFC3CA] transition-colors hover:border-[#1769FF] hover:text-white"
              >
                <span className="text-[#1769FF] tabular-nums">{service.index}</span>
                <span>{service.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div>
        {STUDIO_SERVICES.map((service, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <section
              key={service.id}
              id={service.id}
              className={`relative scroll-mt-20 overflow-hidden border-b border-[rgba(191,195,202,0.12)] ${
                isEven ? 'bg-[#05060D]' : 'bg-[#080D25]/60'
              }`}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(7,91,255,0.12),transparent_55%)]"
              />
              <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
                <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
                  <div className={`lg:col-span-5 ${!isEven ? 'lg:order-2' : ''}`}>
                    <span className="font-display text-sm font-semibold text-[#1769FF] tabular-nums">
                      {service.index}. Service Discipline
                    </span>
                    <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                      {service.title}
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-[#BFC3CA]">
                      {service.description}
                    </p>
                    <p className="mt-5 border-t border-[rgba(191,195,202,0.14)] pt-5 text-sm leading-relaxed text-[#BFC3CA]/80">
                      <strong className="font-semibold text-white">Best suited for:</strong>{' '}
                      {service.idealFor}
                    </p>

                    <div className="mt-8">
                      <button
                        type="button"
                        onClick={() =>
                          navigate('/start-a-project', {preselectedService: service.title})
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-[#1769FF] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2F7BFF]"
                      >
                        <span>Apply for {service.shortTitle}</span>
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div
                    className={`space-y-6 lg:col-span-7 ${
                      !isEven ? 'lg:order-1' : ''
                    }`}
                  >
                    {/* Dedicated Service Visual Showcase */}
                    <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-[rgba(23,105,255,0.28)] bg-[#05060D] shadow-[0_24px_60px_-24px_rgba(7,91,255,0.35)]">
                      <ServiceVisualImage
                        src={service.imageUrl}
                        alt={service.imageAlt}
                        title={service.title}
                        index={service.index}
                        className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05060D]/80 via-transparent to-transparent"
                      />
                      <div className="pointer-events-none absolute inset-x-5 bottom-4 flex items-center justify-between text-xs text-white/90">
                        <span className="font-display font-medium">{service.title}</span>
                        <span className="text-[#BFC3CA]/80 tabular-nums">{service.index}</span>
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="rounded-2xl border border-[rgba(191,195,202,0.14)] bg-[#080D25]/80 p-7">
                        <h3 className="font-display text-base font-semibold text-white">
                          Key Deliverables
                        </h3>
                        <ul className="mt-5 space-y-3.5">
                          {service.deliverables.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-3 text-sm leading-relaxed text-[#BFC3CA]"
                            >
                              <Check
                                className="mt-0.5 h-4 w-4 shrink-0 text-[#1769FF]"
                                aria-hidden="true"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-[rgba(191,195,202,0.14)] bg-[#101216] p-7">
                        <h3 className="font-display text-base font-semibold text-white">
                          Business Benefits
                        </h3>
                        <ul className="mt-5 space-y-3.5">
                          {service.benefits.map((benefit) => (
                            <li
                              key={benefit}
                              className="flex items-start gap-3 text-sm leading-relaxed text-[#BFC3CA]"
                            >
                              <ArrowRight
                                className="mt-0.5 h-4 w-4 shrink-0 text-[#BFC3CA]"
                                aria-hidden="true"
                              />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="bg-[#12151A]">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Need multiple services in one cohesive engagement?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#BFC3CA]">
            Start a project application and select Multiple Services to receive a unified
            brand and digital proposal.
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={() =>
                navigate('/start-a-project', {preselectedService: 'Multiple Services'})
              }
              className="inline-flex items-center gap-2 rounded-lg bg-[#1769FF] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2F7BFF]"
            >
              <span>Start a Project Application</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
