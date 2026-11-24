import React, {useEffect, useState} from 'react';
import {ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, Link2} from 'lucide-react';
import {ProjectVisualFrame} from '../components/ProjectVisualFrame';
import {useStudio} from '../context/StudioContext';
import {PortfolioProject} from '../types/studio';

interface ProjectDetailPageProps {
  slug: string;
}

export function ProjectDetailPage({slug}: ProjectDetailPageProps) {
  const {publishedProjects, navigate} = useStudio();
  const matchedInContext = publishedProjects.find((p) => p.slug === slug) || null;
  const [project, setProject] = useState<PortfolioProject | null>(matchedInContext);
  const [loading, setLoading] = useState(!matchedInContext);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (matchedInContext) {
      setProject(matchedInContext);
      setLoading(false);
      setNotFound(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetch(`/api/projects/${encodeURIComponent(slug)}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Not found');
        }
        return (await res.json()) as {ok?: boolean; project?: PortfolioProject};
      })
      .then((data) => {
        if (cancelled) return;
        if (data.ok && data.project) {
          setProject(data.project);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, matchedInContext]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="h-96 animate-pulse rounded-2xl border border-[rgba(191,195,202,0.12)] bg-[#16191F]" />
      </main>
    );
  }

  if (notFound || !project) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-semibold text-white">
          Project Not Found
        </h1>
        <p className="mt-4 text-sm text-[#BFC3CA]">
          This project may have been unpublished or moved. Browse all currently published work in
          our portfolio.
        </p>
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#1769FF] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2F7BFF]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Projects</span>
        </button>
      </main>
    );
  }

  const currentIdx = publishedProjects.findIndex((p) => p.slug === project.slug);
  const nextProject =
    publishedProjects.length > 1
      ? publishedProjects[(currentIdx >= 0 ? currentIdx + 1 : 0) % publishedProjects.length]
      : null;

  const allVisuals = Array.from(
    new Set([
      ...project.websiteScreenshots,
      ...project.galleryImages,
    ].filter(Boolean))
  );

  const sections = [
    {num: '01', title: 'Project Overview', body: project.fullOverview || project.shortDescription},
    {num: '02', title: 'The Challenge', body: project.challenge},
    {num: '03', title: 'Creative Approach', body: project.creativeApproach},
    {num: '04', title: 'Design Process', body: project.designProcess},
    {num: '05', title: 'Final Solution', body: project.finalSolution},
  ].filter((s) => Boolean(s.body));

  return (
    <main>
      <section className="border-b border-[rgba(191,195,202,0.12)] bg-[#101216]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#BFC3CA] transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to All Projects</span>
          </button>

          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
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
              <h1
                className="mt-4 font-display font-semibold tracking-tight text-white [text-wrap:balance]"
                style={{fontSize: 'clamp(2rem, 3.8vw, 3.4rem)', lineHeight: 1.09}}
              >
                {project.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#BFC3CA]">
                {project.shortDescription}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              {project.liveWebsiteUrl && (
                <a
                  href={project.liveWebsiteUrl}
                  target={project.liveWebsiteUrl.startsWith('/') ? undefined : '_blank'}
                  rel={project.liveWebsiteUrl.startsWith('/') ? undefined : 'noopener noreferrer'}
                  onClick={(e) => {
                    if (project.liveWebsiteUrl.startsWith('/')) {
                      e.preventDefault();
                      navigate(project.liveWebsiteUrl);
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1769FF] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#2F7BFF]"
                >
                  <span>
                    {project.liveWebsiteUrl.startsWith('/')
                      ? 'Open Live Website'
                      : 'Visit Live Website'}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
              {project.externalProjectUrl && (
                <a
                  href={project.externalProjectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-[rgba(191,195,202,0.24)] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:border-white"
                >
                  <span>External Link</span>
                  <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          <div className="mt-10">
            <ProjectVisualFrame project={project} variant="hero" />
          </div>
        </div>
      </section>

      <section className="border-b border-[rgba(191,195,202,0.12)] bg-[#12151A]">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section) => (
              <div
                key={section.num}
                className="grid gap-6 border-b border-[rgba(191,195,202,0.12)] pb-12 lg:grid-cols-12"
              >
                <div className="lg:col-span-4">
                  <h2 className="font-display text-lg font-semibold text-white">
                    {section.num}. {section.title}
                  </h2>
                </div>
                <div className="lg:col-span-8">
                  <p className="whitespace-pre-line text-base leading-relaxed text-[#BFC3CA]">
                    {section.body}
                  </p>
                </div>
              </div>
            ))}

            {project.tools.length > 0 && (
              <div className="grid gap-6 border-b border-[rgba(191,195,202,0.12)] pb-12 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <h2 className="font-display text-lg font-semibold text-white">
                    Tools &amp; Technologies
                  </h2>
                </div>
                <div className="lg:col-span-8">
                  <p className="text-base text-[#BFC3CA]">{project.tools.join(' · ')}</p>
                </div>
              </div>
            )}

            {project.mediaLinks.length > 0 && (
              <div className="grid gap-6 border-b border-[rgba(191,195,202,0.12)] pb-12 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <h2 className="font-display text-lg font-semibold text-white">
                    Video &amp; Media Links
                  </h2>
                </div>
                <div className="space-y-2 lg:col-span-8">
                  {project.mediaLinks.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-[#1769FF] hover:underline"
                    >
                      <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{url}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {allVisuals.length > 0 && (
              <div>
                <h2 className="font-display text-lg font-semibold text-white">
                  Visual Gallery &amp; Screens
                </h2>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {allVisuals.map((imgUrl, idx) => (
                    <div
                      key={`${imgUrl}-${idx}`}
                      className="overflow-hidden rounded-xl border border-[rgba(191,195,202,0.16)] bg-[#101216]"
                    >
                      <img
                        src={imgUrl}
                        alt={`${project.title} gallery frame ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#101216]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 py-16 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          {nextProject ? (
            <div>
              <p className="text-xs font-medium text-[#BFC3CA]/70">Next Published Project</p>
              <button
                type="button"
                onClick={() => navigate(`/projects/${nextProject.slug}`)}
                className="mt-2 inline-flex items-center gap-3 font-display text-2xl font-semibold text-white transition-colors hover:text-[#1769FF]"
              >
                <span>{nextProject.title}</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={() =>
              navigate('/start-a-project', {preselectedService: project.category})
            }
            className="inline-flex items-center gap-2 rounded-lg bg-[#1769FF] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2F7BFF]"
          >
            <span>Start a Similar Project</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  );
}
