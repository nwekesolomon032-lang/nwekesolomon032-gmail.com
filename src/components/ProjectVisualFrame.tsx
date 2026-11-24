import React, {useState} from 'react';
import {Globe, Layers} from 'lucide-react';
import {PortfolioProject} from '../types/studio';

interface ProjectVisualFrameProps {
  project: PortfolioProject;
  imageUrl?: string;
  variant?: 'card' | 'hero' | 'secondary';
}

export function ProjectVisualFrame({
  project,
  imageUrl,
  variant = 'card',
}: ProjectVisualFrameProps) {
  const [imgError, setImgError] = useState(false);

  const isWebsite =
    project.category === 'Website Design' ||
    project.category === 'Website Development' ||
    project.websiteScreenshots.length > 0;

  const resolvedSrc =
    imageUrl ||
    (isWebsite ? project.websiteScreenshots[0] || project.coverImageUrl : project.coverImageUrl) ||
    project.galleryImages[0] ||
    '';

  const hasImage = Boolean(resolvedSrc) && !imgError;

  const aspectClass =
    variant === 'hero'
      ? 'aspect-[16/9]'
      : variant === 'secondary'
        ? 'aspect-[16/10]'
        : 'aspect-[4/3]';

  if (isWebsite) {
    return (
      <div
        className={`group relative flex flex-col overflow-hidden rounded-xl border border-[rgba(191,195,202,0.16)] bg-[#14171D] ${aspectClass}`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[rgba(191,195,202,0.12)] bg-[#101216] px-4 py-2.5">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[rgba(191,195,202,0.28)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[rgba(191,195,202,0.2)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[rgba(191,195,202,0.14)]" />
          </div>
          <div className="flex max-w-[65%] items-center gap-1.5 truncate rounded bg-[#16191F] px-3 py-1 text-[11px] text-[#BFC3CA]/85">
            <Globe className="h-3 w-3 shrink-0 text-[#1769FF]" aria-hidden="true" />
            <span className="truncate">
              {project.liveWebsiteUrl
                ? project.liveWebsiteUrl.startsWith('/')
                  ? `solmonixstudio.com${project.liveWebsiteUrl}`
                  : project.liveWebsiteUrl.replace(/^https?:\/\//, '')
                : project.slug}
            </span>
          </div>
          <span className="text-[11px] font-medium text-[#BFC3CA]/60">Web Showcase</span>
        </div>

        <div className="relative flex-1 overflow-hidden bg-[#101216]">
          {hasImage ? (
            <img
              src={resolvedSrc}
              alt={`${project.title} preview`}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="studio-grid-pattern flex h-full w-full flex-col items-center justify-center p-6 text-center">
              <Layers className="h-7 w-7 text-[#1769FF]/70" aria-hidden="true" />
              <p className="mt-3 font-display text-sm font-medium text-white">{project.title}</p>
              <p className="mt-1 text-xs text-[#BFC3CA]/70">{project.category}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-[rgba(191,195,202,0.16)] bg-[#14171D] ${aspectClass}`}
    >
      {hasImage ? (
        <img
          src={resolvedSrc}
          alt={project.title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="studio-grid-pattern flex h-full w-full flex-col items-center justify-center p-6 text-center">
          <Layers className="h-7 w-7 text-[#1769FF]/70" aria-hidden="true" />
          <p className="mt-3 font-display text-sm font-medium text-white">{project.title}</p>
          <p className="mt-1 text-xs text-[#BFC3CA]/70">{project.category}</p>
        </div>
      )}
    </div>
  );
}
