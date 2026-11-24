import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {DEFAULT_STUDIO_SETTINGS} from '../data/studioData';
import {
  PageRoute,
  PortfolioProject,
  ProjectFilter,
  StudioSettings,
} from '../types/studio';

interface NavigateOptions {
  preselectedService?: string;
  projectFilter?: ProjectFilter;
}

interface StudioContextValue {
  currentPath: string;
  activeRoute: PageRoute;
  activeProjectSlug: string | null;
  preselectedService: string;
  activeProjectFilter: ProjectFilter;
  setActiveProjectFilter: (filter: ProjectFilter) => void;
  navigate: (to: string, options?: NavigateOptions) => void;
  settings: StudioSettings;
  publishedProjects: PortfolioProject[];
  isLoadingPublicData: boolean;
  refreshPublicData: () => Promise<void>;
}

const StudioContext = createContext<StudioContextValue | undefined>(undefined);

const ROUTE_META: Record<PageRoute, {title: string; description: string}> = {
  '/': {
    title: 'SOLMONIX STUDIO — Designing Brands. Building Digital Experiences.',
    description:
      'SOLMONIX STUDIO transforms ambitious ideas into distinctive brand identities and powerful digital experiences that help businesses stand out, connect, and grow.',
  },
  '/about': {
    title: 'About — SOLMONIX STUDIO',
    description:
      'Discover the story, mission, vision, creative philosophy, and leadership behind SOLMONIX STUDIO.',
  },
  '/services': {
    title: 'Services — SOLMONIX STUDIO',
    description:
      'Explore Brand Identity Design, Graphic Design, Website Design, Website Development, and Social Media Design at SOLMONIX STUDIO.',
  },
  '/projects': {
    title: 'Projects — SOLMONIX STUDIO',
    description:
      'Explore published brand identities, graphic design systems, and bespoke websites crafted by SOLMONIX STUDIO.',
  },
  '/showcase': {
    title: 'California Custom Landscape, Inc. — Live Website Showcase — SOLMONIX STUDIO',
    description:
      'Interactive website portfolio showcase designed and built by SOLMONIX STUDIO for California Custom Landscape, Inc.',
  },
  '/brand-identity': {
    title: 'Brand Identity — SOLMONIX STUDIO',
    description:
      'Explore the custom geometric S monogram, horizontal wordmark, monochrome applications, and favicon specifications for SOLMONIX STUDIO.',
  },
  '/start-a-project': {
    title: 'Start a Project — SOLMONIX STUDIO',
    description:
      'Have a vision? Submit a project application to collaborate with SOLMONIX STUDIO.',
  },
  '/track': {
    title: 'Track Application — SOLMONIX STUDIO',
    description:
      'Check the current review status of your SOLMONIX STUDIO project application.',
  },
  '/contact': {
    title: 'Contact — SOLMONIX STUDIO',
    description:
      'Connect with SOLMONIX STUDIO or begin your project application.',
  },
  '/admin': {
    title: 'Control Centre — SOLMONIX STUDIO',
    description: 'Private administrator workspace for SOLMONIX STUDIO.',
  },
};

function parseRoute(pathname: string): {route: PageRoute; slug: string | null} {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/about') return {route: '/about', slug: null};
  if (clean === '/services') return {route: '/services', slug: null};
  if (clean === '/projects') return {route: '/projects', slug: null};
  if (clean.startsWith('/projects/')) {
    const slug = clean.slice('/projects/'.length);
    return {route: '/projects', slug: slug || null};
  }
  if (clean === '/showcase' || clean.startsWith('/showcase/')) {
    const slug = clean.startsWith('/showcase/') ? clean.slice('/showcase/'.length) : null;
    return {route: '/showcase', slug: slug || 'california-custom-landscape'};
  }
  if (clean === '/brand-identity' || clean === '/brand') {
    return {route: '/brand-identity', slug: null};
  }
  if (clean === '/start-a-project') return {route: '/start-a-project', slug: null};
  if (clean === '/track') return {route: '/track', slug: null};
  if (clean === '/contact') return {route: '/contact', slug: null};
  if (clean === '/admin' || clean.startsWith('/admin/')) return {route: '/admin', slug: null};
  return {route: '/', slug: null};
}

export function StudioProvider({children}: {children: React.ReactNode}) {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [preselectedService, setPreselectedService] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('service') || '';
  });
  const [activeProjectFilter, setActiveProjectFilter] = useState<ProjectFilter>('All Projects');
  const [settings, setSettings] = useState<StudioSettings>(DEFAULT_STUDIO_SETTINGS);
  const [publishedProjects, setPublishedProjects] = useState<PortfolioProject[]>([]);
  const [isLoadingPublicData, setIsLoadingPublicData] = useState<boolean>(true);

  const {route: activeRoute, slug: activeProjectSlug} = parseRoute(currentPath);

  const refreshPublicData = useCallback(async () => {
    try {
      const [settingsRes, projectsRes] = await Promise.all([
        fetch('/api/settings/public'),
        fetch('/api/projects'),
      ]);
      if (settingsRes.ok) {
        const sData = (await settingsRes.json()) as {ok?: boolean; settings?: StudioSettings};
        if (sData.ok && sData.settings) {
          setSettings(sData.settings);
        }
      }
      if (projectsRes.ok) {
        const pData = (await projectsRes.json()) as {
          ok?: boolean;
          projects?: PortfolioProject[];
        };
        if (pData.ok && Array.isArray(pData.projects)) {
          setPublishedProjects(pData.projects);
        }
      }
    } catch {
      // Keep current state cleanly on transient network error
    } finally {
      setIsLoadingPublicData(false);
    }
  }, []);

  useEffect(() => {
    void refreshPublicData();
  }, [refreshPublicData]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      const params = new URLSearchParams(window.location.search);
      setPreselectedService(params.get('service') || '');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const projectMatch =
      activeRoute === '/projects' && activeProjectSlug
        ? publishedProjects.find((p) => p.slug === activeProjectSlug)
        : null;

    if (projectMatch) {
      document.title = `${projectMatch.title} — Projects — SOLMONIX STUDIO`;
    } else {
      const meta = ROUTE_META[activeRoute];
      document.title = meta.title;
      const descTag = document.querySelector('meta[name="description"]');
      if (descTag) {
        descTag.setAttribute('content', meta.description);
      }
    }
  }, [activeRoute, activeProjectSlug, publishedProjects]);

  const navigate = useCallback((to: string, options?: NavigateOptions) => {
    const [pathOnly, hashPart] = to.split('#');
    const normalizedPath = pathOnly || '/';

    if (options?.preselectedService) {
      setPreselectedService(options.preselectedService);
    } else if (normalizedPath !== '/start-a-project' && normalizedPath !== '/contact') {
      setPreselectedService('');
    }

    if (options?.projectFilter) {
      setActiveProjectFilter(options.projectFilter);
    }

    const search =
      options?.preselectedService &&
      (normalizedPath === '/start-a-project' || normalizedPath === '/contact')
        ? `?service=${encodeURIComponent(options.preselectedService)}`
        : '';

    const nextUrl = `${normalizedPath}${search}${hashPart ? `#${hashPart}` : ''}`;
    if (window.location.pathname + window.location.search !== `${normalizedPath}${search}`) {
      window.history.pushState({}, '', nextUrl);
    }
    setCurrentPath(normalizedPath);

    if (hashPart) {
      window.requestAnimationFrame(() => {
        const el = document.getElementById(hashPart);
        if (el) {
          el.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
      });
    } else {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, []);

  return (
    <StudioContext.Provider
      value={{
        currentPath,
        activeRoute,
        activeProjectSlug,
        preselectedService,
        activeProjectFilter,
        setActiveProjectFilter,
        navigate,
        settings,
        publishedProjects,
        isLoadingPublicData,
        refreshPublicData,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return ctx;
}
