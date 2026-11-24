import React from 'react';
import {ArrowRight, ArrowUpRight, ExternalLink, Layers} from 'lucide-react';
import {motion} from 'motion/react';
import {HeroSculpture} from '../components/HeroSculpture';
import {HeroWhatsAppChat} from '../components/HeroWhatsAppChat';
import {ProjectVisualFrame} from '../components/ProjectVisualFrame';
import {ServiceVisualImage} from '../components/ServiceVisualImage';
import {StudioIntroVideo} from '../components/StudioIntroVideo';
import {useStudio} from '../context/StudioContext';
import {CREATIVE_PROCESS, STUDIO_SERVICES, WHY_CHOOSE_US} from '../data/studioData';

export function HomePage() {
  const {navigate, settings, publishedProjects, isLoadingPublicData} = useStudio();

  const featuredProjects = publishedProjects
    .filter((p) => p.isFeatured)
    .concat(publishedProjects.filter((p) => !p.isFeatured))
    .slice(0, 3);

  return (
    <main>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[rgba(191,195,202,0.12)] bg-[#101216]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_at_75%_0%,rgba(23,105,255,0.16),transparent_60%)]"
        />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Typographic Anchor */}
            <motion.div
              initial={{opacity: 0, y: 14}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.45, ease: [0.16, 1, 0.3, 1]}}
              className="flex flex-col justify-between lg:col-span-7 lg:min-h-[490px]"
            >
              <div>
                <p className="text-sm font-medium tracking-wide text-[#BFC3CA]">
                  SOLMONIX STUDIO <span aria-hidden="true" className="mx-2 text-[#1769FF]">·</span>{' '}
                  Designing Brands. Building Digital Experiences.
                </p>

                <h1
                  className="mt-6 font-display font-semibold tracking-tight text-white [text-wrap:balance]"
                  style={{fontSize: 'clamp(2.35rem, 4.3vw, 4.15rem)', lineHeight: 1.07}}
                >
                  We Build Brands That Make Businesses Impossible to Ignore.
                </h1>

                <p className="mt-6 max-w-xl text-base leading-relaxed text-[#BFC3CA] sm:text-lg">
                  We transform ambitious ideas into distinctive brand identities and powerful digital
                  experiences that help businesses stand out, connect, and grow.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/projects')}
                    className="inline-flex min-h-[46px] items-center gap-2.5 rounded-lg bg-[#1769FF] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#2F7BFF]"
                  >
                    <span>Explore Our Work</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/start-a-project')}
                    className="inline-flex min-h-[46px] items-center gap-2 rounded-lg border border-[rgba(191,195,202,0.28)] bg-transparent px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:border-white hover:bg-[#16191F]"
                  >
                    <span>Start a Project</span>
                    <ArrowUpRight className="h-4 w-4 text-[#BFC3CA]" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Discipline Strip */}
              <div className="mt-12 grid grid-cols-2 gap-6 border-t border-[rgba(191,195,202,0.14)] pt-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-[#BFC3CA]/70">Core Focus</p>
                  <p className="mt-1 font-display text-sm font-medium text-white">
                    Brand &amp; Visual Systems
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#BFC3CA]/70">Digital Craft</p>
                  <p className="mt-1 font-display text-sm font-medium text-white">
                    Custom Web Engineering
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-xs text-[#BFC3CA]/70">Client Intake</p>
                  <p className="mt-1 font-display text-sm font-medium text-white">
                    Selective Application Process
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Creative Emblem + Direct WhatsApp Chat Button */}
            <motion.div
              initial={{opacity: 0, scale: 0.98}}
              animate={{opacity: 1, scale: 1}}
              transition={{duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1]}}
              className="flex flex-col items-end gap-4 lg:col-span-5"
            >
              <HeroSculpture />
              <HeroWhatsAppChat />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. BRAND INTRODUCTION */}
      <section className="border-b border-[rgba(191,195,202,0.12)] bg-[#12151A]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] uppercase">
                The Studio
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white [text-wrap:balance] sm:text-4xl">
                Where strategic identity meets precision digital execution.
              </h2>
            </div>

            <div className="space-y-5 lg:col-span-7 lg:pl-8">
              <p className="text-base leading-relaxed text-[#BFC3CA] sm:text-lg">
                Most businesses struggle not because their product lacks quality, but because their
                brand and digital presence fail to communicate the calibre of what they actually
                deliver.
              </p>
              <p className="text-base leading-relaxed text-[#BFC3CA]/85">
                SOLMONIX STUDIO partners with ambitious founders and established organizations to
                close that gap. By unifying brand identity, graphic craft, and high-performing web
                experiences under one roof, we create coherent digital flagships that earn trust
                immediately.
              </p>
              <div className="pt-2">
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/about');
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#1769FF]"
                >
                  <span>Read About Our Philosophy</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-8 border-t border-[rgba(191,195,202,0.12)] pt-12 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] uppercase">
                About SOLMONIX STUDIO
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white [text-wrap:balance] sm:text-3xl">
                Meet the Creative Mind Behind the Studio.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[#BFC3CA] sm:text-base">
                Watch our studio introduction covering graphic design, brand identities, website
                design, and AI-powered digital systems built to help your business stand out.
              </p>
            </div>

            <div className="lg:col-span-7">
              <StudioIntroVideo />
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES OVERVIEW */}
      <section className="relative overflow-hidden border-b border-[rgba(191,195,202,0.12)] bg-[#05060D]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_15%,rgba(7,91,255,0.16),transparent_55%),radial-gradient(ellipse_at_80%_85%,rgba(23,105,255,0.12),transparent_50%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] uppercase">
                Capabilities
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Five Disciplines. One Cohesive Standard.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="inline-flex shrink-0 items-center gap-2 self-start text-sm font-semibold text-[#BFC3CA] transition-colors hover:text-white sm:self-auto"
            >
              <span>Explore All Services</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-6">
            {STUDIO_SERVICES.map((service, idx) => {
              const spanClass = idx < 2 ? 'md:col-span-3' : 'md:col-span-2';
              return (
                <article
                  key={service.id}
                  className={`${spanClass} group flex flex-col justify-between overflow-hidden rounded-2xl border border-[rgba(23,105,255,0.22)] bg-[#080D25]/85 transition-colors duration-200 hover:border-[#1769FF]`}
                >
                  <div>
                    {/* Prominent Service Image Frame */}
                    <div
                      onClick={() => navigate(`/services#${service.id}`)}
                      className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden border-b border-[rgba(23,105,255,0.16)] bg-[#05060D]"
                    >
                      <ServiceVisualImage
                        src={service.imageUrl}
                        alt={service.imageAlt}
                        title={service.title}
                        index={service.index}
                        className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080D25] via-[#080D25]/25 to-transparent"
                      />
                      <span className="absolute left-5 top-4 font-display text-xs font-semibold tracking-wider text-white/90 tabular-nums">
                        {service.index}.
                      </span>
                    </div>

                    <div className="p-6 sm:p-7">
                      <h3 className="font-display text-xl font-semibold text-white">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#BFC3CA]">
                        {service.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[rgba(191,195,202,0.12)] px-6 py-4 sm:px-7">
                    <button
                      type="button"
                      onClick={() => navigate(`/services#${service.id}`)}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-white transition-colors hover:text-[#1769FF]"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#1769FF] transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/services#${service.id}`)}
                      aria-label={`View ${service.title} details`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(23,105,255,0.45)] text-[#1769FF] transition-colors group-hover:bg-[#1769FF] group-hover:text-white"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS (DYNAMICALLY LOADED FROM DATABASE) */}
      <section className="border-b border-[rgba(191,195,202,0.12)] bg-[#12151A]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] uppercase">
                Selected Work
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Featured Portfolio Projects
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-[rgba(191,195,202,0.24)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-[#1769FF] sm:self-auto"
            >
              <span>View All Projects</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {isLoadingPublicData ? (
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <div className="h-80 animate-pulse rounded-2xl border border-[rgba(191,195,202,0.12)] bg-[#101216]" />
              <div className="h-80 animate-pulse rounded-2xl border border-[rgba(191,195,202,0.12)] bg-[#101216]" />
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-[rgba(191,195,202,0.14)] bg-[#101216] p-10 text-center sm:p-14">
              <Layers className="mx-auto h-8 w-8 text-[#1769FF]" aria-hidden="true" />
              <h3 className="mt-4 font-display text-xl font-semibold text-white">
                Portfolio Showcase Ready for Publication
              </h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#BFC3CA]">
                Published projects added in the SOLMONIX STUDIO Control Centre automatically appear
                here with interactive case studies and live previews.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/start-a-project')}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1769FF] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#2F7BFF]"
                >
                  <span>Start a Project</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 lg:grid-cols-12">
              {featuredProjects.map((project, index) => {
                const isPrimary = index === 0;
                return (
                  <article
                    key={project.id}
                    className={`flex flex-col justify-between rounded-2xl border border-[rgba(191,195,202,0.14)] bg-[#101216] p-5 sm:p-6 ${
                      isPrimary ? 'lg:col-span-12' : 'lg:col-span-6'
                    }`}
                  >
                    <div
                      className={`grid gap-6 ${
                        isPrimary ? 'lg:grid-cols-12 lg:items-center lg:gap-8' : ''
                      }`}
                    >
                      <div
                        onClick={() => navigate(`/projects/${project.slug}`)}
                        className={`cursor-pointer ${isPrimary ? 'lg:col-span-7' : ''}`}
                      >
                        <ProjectVisualFrame
                          project={project}
                          variant={isPrimary ? 'hero' : 'card'}
                        />
                      </div>

                      <div
                        className={`flex flex-col justify-between ${
                          isPrimary ? 'lg:col-span-5' : ''
                        }`}
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#BFC3CA]">
                            <span className="font-medium text-[#1769FF]">{project.category}</span>
                            {project.clientName && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{project.clientName}</span>
                              </>
                            )}
                            {project.completionDate && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{project.completionDate}</span>
                              </>
                            )}
                          </div>
                          <h3 className="mt-3 font-display text-2xl font-semibold text-white">
                            {project.title}
                          </h3>
                          <p className="mt-3 text-sm leading-relaxed text-[#BFC3CA]">
                            {project.shortDescription}
                          </p>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => navigate(`/projects/${project.slug}`)}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#1769FF] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#2F7BFF]"
                          >
                            <span>View Case Study</span>
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>

                          {project.liveWebsiteUrl && (
                            <a
                              href={project.liveWebsiteUrl}
                              target={project.liveWebsiteUrl.startsWith('/') ? undefined : '_blank'}
                              rel={
                                project.liveWebsiteUrl.startsWith('/')
                                  ? undefined
                                  : 'noopener noreferrer'
                              }
                              onClick={(e) => {
                                if (project.liveWebsiteUrl.startsWith('/')) {
                                  e.preventDefault();
                                  navigate(project.liveWebsiteUrl);
                                }
                              }}
                              className="inline-flex items-center gap-2 rounded-lg border border-[rgba(191,195,202,0.24)] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:border-white"
                            >
                              <span>
                                {project.liveWebsiteUrl.startsWith('/')
                                  ? 'Open Live Website'
                                  : 'Visit Live Website'}
                              </span>
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="border-b border-[rgba(191,195,202,0.12)] bg-[#101216]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] uppercase">
              Why Choose SOLMONIX STUDIO
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white [text-wrap:balance] sm:text-4xl">
              Crafted for businesses that refuse to look ordinary.
            </h2>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[rgba(191,195,202,0.14)] bg-[rgba(191,195,202,0.14)] md:grid-cols-2">
            {WHY_CHOOSE_US.map((item) => (
              <div key={item.index} className="bg-[#101216] p-8 sm:p-10">
                <span className="font-display text-sm font-semibold text-[#1769FF] tabular-nums">
                  {item.index}.
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#BFC3CA]">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. OUR CREATIVE PROCESS */}
      <section className="border-b border-[rgba(191,195,202,0.12)] bg-[#12151A]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] uppercase">
              Our Process
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Four disciplined stages from brief to launch.
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {CREATIVE_PROCESS.map((stage) => (
              <div
                key={stage.step}
                className="flex flex-col justify-between border-t border-[rgba(191,195,202,0.22)] pt-6"
              >
                <div>
                  <span className="font-display text-2xl font-semibold text-[#1769FF] tabular-nums">
                    {stage.step}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">
                    {stage.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#BFC3CA]">{stage.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. REAL CLIENT TESTIMONIALS ONLY */}
      <section className="border-b border-[rgba(191,195,202,0.12)] bg-[#101216]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] uppercase">
              Client Perspectives
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Testimonials
            </h2>
          </div>

          {settings.testimonials.length === 0 ? (
            <div className="mt-10 rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-8">
              <p className="text-sm leading-relaxed text-[#BFC3CA]">
                Verified client testimonials published through the SOLMONIX STUDIO Settings
                workspace will appear here. We never publish synthetic or unverified reviews.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {settings.testimonials.map((item) => (
                <blockquote
                  key={item.id}
                  className="flex flex-col justify-between rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-8"
                >
                  <div>
                    <p className="text-xs font-medium text-[#1769FF]">{item.projectCategory}</p>
                    <p className="mt-4 font-display text-lg leading-relaxed text-white">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                  <footer className="mt-8 border-t border-[rgba(191,195,202,0.12)] pt-4">
                    <p className="text-sm font-semibold text-white">{item.clientName}</p>
                    <p className="mt-0.5 text-xs text-[#BFC3CA]/75">{item.roleAndCompany}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 8. CLOSING CTA */}
      <section className="relative overflow-hidden bg-[#101216]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(23,105,255,0.18),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-28">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] uppercase">
            Start Your Commission
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white [text-wrap:balance] sm:text-5xl">
            Ready to build a brand that commands attention?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#BFC3CA]">
            Apply to work with SOLMONIX STUDIO. Share your business goals, scope, and timeline
            through our structured project application.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/start-a-project')}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-[#1769FF] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2F7BFF]"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-[rgba(191,195,202,0.26)] px-7 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-[#16191F]"
            >
              <span>Explore Services</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
