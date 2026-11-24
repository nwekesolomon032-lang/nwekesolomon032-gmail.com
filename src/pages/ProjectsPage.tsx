import React, {useState} from 'react';
import {ArrowRight, ArrowUpRight, ExternalLink, Eye, Layers, X} from 'lucide-react';
import {ProjectVisualFrame} from '../components/ProjectVisualFrame';
import {useStudio} from '../context/StudioContext';
import {PortfolioProject, ProjectFilter} from '../types/studio';

const FILTERS: ProjectFilter[] = [
  'All Projects',
  'Brand Identity Design',
  'Graphic Design',
  'Website Design',
  'Website Development',
  'Social Media Design',
];

export function ProjectsPage() {
  const {
    publishedProjects,
    isLoadingPublicData,
    activeProjectFilter,
    setActiveProjectFilter,
    navigate,
  } = useStudio();

  const [previewProject, setPreviewProject] = useState<PortfolioProject | null>(null);

  const filteredProjects =
    activeProjectFilter === 'All Projects'
      ? publishedProjects
      : publishedProjects.filter((project) => project.category === activeProjectFilter);

  const countForFilter = (filter: ProjectFilter) =>
    filter === 'All Projects'
      ? publishedProjects.length
      : publishedProjects.filter((p) => p.category === filter).length;

  return (
    <main>
      {/* Header & Filter Bar */}
      <section className="border-b border-[rgba(191,195,202,0.12)] bg-[#101216]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] uppercase">
                Selected Work &amp; Case Studies
              </p>
              <h1
                className="mt-4 max-w-3xl font-display font-semibold tracking-tight text-white [text-wrap:balance]"
                style={{fontSize: 'clamp(2.25rem, 4vw, 3.75rem)', lineHeight: 1.08}}
              >
                Portfolio Showcase
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#BFC3CA]">
                Every published brand system, editorial layout, and bespoke web platform crafted by
                SOLMONIX STUDIO.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/start-a-project')}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg bg-[#1769FF] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#2F7BFF] lg:self-auto"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Interactive Filter Tabs */}
          <div
            className="mt-10 flex flex-wrap items-center gap-2"
            role="tablist"
            aria-label="Filter published projects by category"
          >
            {FILTERS.map((filter) => {
              const isActive = activeProjectFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveProjectFilter(filter)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#1769FF] text-white'
                      : 'border border-[rgba(191,195,202,0.18)] bg-[#16191F] text-[#BFC3CA] hover:border-[rgba(191,195,202,0.35)] hover:text-white'
                  }`}
                >
                  <span>{filter}</span>
                  <span
                    className={`tabular-nums text-[11px] ${
                      isActive ? 'text-white/85' : 'text-[#BFC3CA]/60'
                    }`}
                  >
                    {countForFilter(filter)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Body */}
      <section className="bg-[#12151A]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          {isLoadingPublicData ? (
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="h-96 animate-pulse rounded-2xl border border-[rgba(191,195,202,0.12)] bg-[#101216]" />
              <div className="h-96 animate-pulse rounded-2xl border border-[rgba(191,195,202,0.12)] bg-[#101216]" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-[rgba(191,195,202,0.14)] bg-[#101216] px-6 py-20 text-center">
              <Layers className="mx-auto h-9 w-9 text-[#1769FF]" aria-hidden="true" />
              <h2 className="mt-5 font-display text-2xl font-semibold text-white">
                {publishedProjects.length === 0
                  ? 'No Published Projects Yet'
                  : `No Published Projects in ${activeProjectFilter}`}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#BFC3CA]">
                {publishedProjects.length === 0
                  ? 'Projects created and published inside the SOLMONIX STUDIO Control Centre automatically appear in this portfolio.'
                  : 'Select another discipline filter or view all published studio work.'}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                {activeProjectFilter !== 'All Projects' && (
                  <button
                    type="button"
                    onClick={() => setActiveProjectFilter('All Projects')}
                    className="rounded-lg border border-[rgba(191,195,202,0.25)] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:border-white"
                  >
                    Show All Categories
                  </button>
                )}
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
            <div className="grid gap-8 lg:grid-cols-12">
              {filteredProjects.map((project, index) => {
                const isWide = index === 0 || (index % 3 === 0 && filteredProjects.length > 2);
                return (
                  <article
                    key={project.id}
                    className={`flex flex-col justify-between rounded-2xl border border-[rgba(191,195,202,0.14)] bg-[#101216] p-5 transition-colors duration-200 hover:border-[rgba(191,195,202,0.3)] sm:p-7 ${
                      isWide ? 'lg:col-span-12' : 'lg:col-span-6'
                    }`}
                  >
                    <div
                      className={`grid gap-7 ${
                        isWide ? 'lg:grid-cols-12 lg:items-center' : ''
                      }`}
                    >
                      <div
                        onClick={() => navigate(`/projects/${project.slug}`)}
                        className={`cursor-pointer ${isWide ? 'lg:col-span-7' : ''}`}
                      >
                        <ProjectVisualFrame
                          project={project}
                          variant={isWide ? 'hero' : 'card'}
                        />
                      </div>

                      <div
                        className={`flex flex-col justify-between ${
                          isWide ? 'lg:col-span-5' : ''
                        }`}
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#BFC3CA]">
                            <span className="font-semibold text-[#1769FF]">{project.category}</span>
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

                          <h2 className="mt-3 font-display text-2xl font-semibold text-white">
                            <button
                              type="button"
                              onClick={() => navigate(`/projects/${project.slug}`)}
                              className="text-left transition-colors hover:text-[#1769FF]"
                            >
                              {project.title}
                            </button>
                          </h2>

                          <p className="mt-3 text-sm leading-relaxed text-[#BFC3CA]">
                            {project.shortDescription}
                          </p>

                          {project.tools.length > 0 && (
                            <p className="mt-4 text-xs text-[#BFC3CA]/70">
                              {project.tools.join(' · ')}
                            </p>
                          )}
                        </div>

                        <div className="mt-7 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => navigate(`/projects/${project.slug}`)}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#1769FF] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#2F7BFF]"
                          >
                            <span>View Case Study</span>
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setPreviewProject(project)}
                            className="inline-flex items-center gap-2 rounded-lg border border-[rgba(191,195,202,0.22)] px-4 py-2.5 text-xs font-medium text-[#BFC3CA] transition-colors hover:border-white hover:text-white"
                          >
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Quick Preview</span>
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
                              className="inline-flex items-center gap-2 rounded-lg border border-[#1769FF]/50 bg-[#1769FF]/10 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:border-[#1769FF] hover:bg-[#1769FF]"
                            >
                              <span>
                                {project.liveWebsiteUrl.startsWith('/')
                                  ? 'Open Live Website'
                                  : 'Live Site'}
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

      {/* Interactive Lightbox Preview Modal */}
      {previewProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Quick preview for ${previewProject.title}`}
          onClick={() => setPreviewProject(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[rgba(191,195,202,0.2)] bg-[#101216] p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#1769FF]">{previewProject.category}</p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-white">
                  {previewProject.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                aria-label="Close preview"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(191,195,202,0.2)] text-[#BFC3CA] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6">
              <ProjectVisualFrame project={previewProject} variant="hero" />
            </div>

            <p className="mt-6 text-sm leading-relaxed text-[#BFC3CA]">
              {previewProject.fullOverview || previewProject.shortDescription}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(191,195,202,0.14)] pt-5">
              <div className="text-xs text-[#BFC3CA]">
                {previewProject.clientName && <span>Client: {previewProject.clientName}</span>}
              </div>
              <div className="flex flex-wrap gap-3">
                {previewProject.liveWebsiteUrl && (
                  <a
                    href={previewProject.liveWebsiteUrl}
                    target={previewProject.liveWebsiteUrl.startsWith('/') ? undefined : '_blank'}
                    rel={
                      previewProject.liveWebsiteUrl.startsWith('/')
                        ? undefined
                        : 'noopener noreferrer'
                    }
                    onClick={(e) => {
                      if (previewProject.liveWebsiteUrl.startsWith('/')) {
                        e.preventDefault();
                        const dest = previewProject.liveWebsiteUrl;
                        setPreviewProject(null);
                        navigate(dest);
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-[rgba(191,195,202,0.25)] px-4 py-2 text-xs font-semibold text-white hover:border-white"
                  >
                    <span>
                      {previewProject.liveWebsiteUrl.startsWith('/')
                        ? 'Open Live Website'
                        : 'Visit Live Website'}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const targetSlug = previewProject.slug;
                    setPreviewProject(null);
                    navigate(`/projects/${targetSlug}`);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1769FF] px-5 py-2 text-xs font-semibold text-white hover:bg-[#2F7BFF]"
                >
                  <span>Open Full Case Study</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
