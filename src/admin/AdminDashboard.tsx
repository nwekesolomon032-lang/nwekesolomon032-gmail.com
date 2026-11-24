import React, {useCallback, useEffect, useState} from 'react';
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react';
import {SolmonixMonogram} from '../components/SolmonixLogo';
import {useStudio} from '../context/StudioContext';
import {DEFAULT_STUDIO_SETTINGS} from '../data/studioData';
import {
  ActivityLogItem,
  AdminOverviewStats,
  AdminSection,
  AdminUser,
  ClientApplication,
  EmailConfigStatus,
  PortfolioProject,
  StudioSettings,
} from '../types/studio';
import {AdminAcceptedClients} from './AdminAcceptedClients';
import {AdminApplications} from './AdminApplications';
import {AdminKnowledgeBase} from './AdminKnowledgeBase';
import {AdminOverview} from './AdminOverview';
import {AdminPortfolio} from './AdminPortfolio';
import {AdminProjectForm} from './AdminProjectForm';
import {AdminSettings} from './AdminSettings';

interface AdminDashboardProps {
  admin: AdminUser;
  onLogout: () => Promise<void>;
}

const SIDEBAR_ITEMS: Array<{
  id: AdminSection;
  label: string;
  icon: React.ComponentType<{className?: string}>;
}> = [
  {id: 'overview', label: 'Overview', icon: LayoutDashboard},
  {id: 'portfolio', label: 'My Portfolio', icon: FolderKanban},
  {id: 'project-form', label: 'Add New Project', icon: PlusCircle},
  {id: 'applications', label: 'Client Applications', icon: FileText},
  {id: 'accepted', label: 'Accepted Clients', icon: CheckCircle2},
  {id: 'rejected', label: 'Rejected Applications', icon: XCircle},
  {id: 'knowledge', label: 'AI Knowledge Base', icon: Sparkles},
  {id: 'settings', label: 'Settings', icon: Settings},
];

export function AdminDashboard({admin, onLogout}: AdminDashboardProps) {
  const {navigate, refreshPublicData} = useStudio();
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [stats, setStats] = useState<AdminOverviewStats>({
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    totalApplications: 0,
    pendingApplications: 0,
    acceptedClients: 0,
    rejectedApplications: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityLogItem[]>([]);
  const [recentProjects, setRecentProjects] = useState<PortfolioProject[]>([]);
  const [recentApplications, setRecentApplications] = useState<ClientApplication[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [applications, setApplications] = useState<ClientApplication[]>([]);
  const [settings, setSettings] = useState<StudioSettings>(DEFAULT_STUDIO_SETTINGS);
  const [emailConfig, setEmailConfig] = useState<EmailConfigStatus>({
    configured: false,
    provider: 'none',
    details: '',
  });

  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ClientApplication | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAllAdminData = useCallback(async () => {
    try {
      const [ovRes, projRes, appRes, setRes] = await Promise.all([
        fetch('/api/admin/overview'),
        fetch('/api/admin/projects'),
        fetch('/api/admin/applications'),
        fetch('/api/admin/settings'),
      ]);

      if (ovRes.ok) {
        const ov = (await ovRes.json()) as {
          ok?: boolean;
          stats?: AdminOverviewStats;
          recentActivity?: ActivityLogItem[];
          recentProjects?: PortfolioProject[];
          recentApplications?: ClientApplication[];
        };
        if (ov.stats) setStats(ov.stats);
        if (ov.recentActivity) setRecentActivity(ov.recentActivity);
        if (ov.recentProjects) setRecentProjects(ov.recentProjects);
        if (ov.recentApplications) setRecentApplications(ov.recentApplications);
      }

      if (projRes.ok) {
        const pr = (await projRes.json()) as {projects?: PortfolioProject[]};
        if (Array.isArray(pr.projects)) setProjects(pr.projects);
      }

      if (appRes.ok) {
        const ap = (await appRes.json()) as {applications?: ClientApplication[]};
        if (Array.isArray(ap.applications)) setApplications(ap.applications);
      }

      if (setRes.ok) {
        const st = (await setRes.json()) as {
          settings?: StudioSettings;
          emailConfig?: EmailConfigStatus;
        };
        if (st.settings) setSettings(st.settings);
        if (st.emailConfig) setEmailConfig(st.emailConfig);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAllAdminData();
  }, [loadAllAdminData]);

  const handleFullRefresh = async () => {
    await Promise.all([loadAllAdminData(), refreshPublicData()]);
  };

  const selectSection = (section: AdminSection) => {
    if (section === 'project-form') {
      setEditingProject(null);
    }
    setSelectedApplication(null);
    setActiveSection(section);
    setMobileNavOpen(false);
  };

  const activeLabel =
    activeSection === 'project-form' && editingProject
      ? 'Edit Project'
      : SIDEBAR_ITEMS.find((i) => i.id === activeSection)?.label || 'Overview';

  const SidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#0C0E12] px-4 py-6">
      <div>
        {/* Studio Brand */}
        <div className="flex items-center gap-3 border-b border-[rgba(191,195,202,0.12)] px-2 pb-6">
          <SolmonixMonogram size={34} className="shrink-0" />
          <div className="min-w-0">
            <p className="truncate font-display text-xs font-semibold tracking-[0.2em] text-white uppercase">
              SOLMONIX
            </p>
            <p className="mt-0.5 truncate font-display text-[9px] font-medium tracking-[0.46em] text-[#BFC3CA]/80 uppercase">
              STUDIO
            </p>
            <p className="mt-1 truncate text-[11px] text-[#BFC3CA]/65">Control Centre</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 space-y-1" aria-label="Administrator navigation">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectSection(item.id)}
                className={`flex min-h-[42px] w-full items-center justify-between rounded-lg px-3 text-left text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1769FF] text-white'
                    : 'text-[#BFC3CA] hover:bg-[#16191F] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </span>
                {item.id === 'applications' && stats.pendingApplications > 0 && (
                  <span
                    className={`tabular-nums text-[11px] ${
                      isActive ? 'text-white' : 'text-[#1769FF]'
                    }`}
                  >
                    {stats.pendingApplications}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Admin Identity & Logout */}
      <div className="border-t border-[rgba(191,195,202,0.12)] pt-5">
        <div className="px-2 pb-4">
          <p className="truncate text-xs font-semibold text-white">{admin.name}</p>
          <p className="truncate text-[11px] text-[#BFC3CA]/70">{admin.email}</p>
        </div>
        <button
          type="button"
          onClick={() => void onLogout()}
          className="flex min-h-[40px] w-full items-center gap-3 rounded-lg px-3 text-xs font-medium text-[#BFC3CA] transition-colors hover:bg-[#16191F] hover:text-white"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#101216] text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[260px] shrink-0 border-r border-[rgba(191,195,202,0.12)] lg:block">
        <div className="sticky top-0 h-screen">{SidebarContent}</div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-[260px] border-r border-[rgba(191,195,202,0.14)] bg-[#0C0E12]">
            {SidebarContent}
          </div>
          <div
            className="flex-1 bg-black/70"
            onClick={() => setMobileNavOpen(false)}
          >
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close sidebar"
              className="m-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#16191F] text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Bar Contract */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[rgba(191,195,202,0.12)] bg-[#101216]/95 px-4 backdrop-blur-md sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(191,195,202,0.18)] text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 truncate text-xs text-[#BFC3CA]">
              <span className="hidden sm:inline">SOLMONIX STUDIO</span>
              <span className="hidden sm:inline" aria-hidden="true">
                /
              </span>
              <span className="font-semibold text-white">{activeLabel}</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[rgba(191,195,202,0.2)] px-3.5 py-2 text-xs font-medium text-[#BFC3CA] transition-colors hover:border-white hover:text-white"
            >
              <span>Public Website</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-8 lg:py-10">
          <div className="mx-auto max-w-6xl">
            {loading ? (
              <div className="space-y-4">
                <div className="h-24 animate-pulse rounded-xl bg-[#16191F]" />
                <div className="h-64 animate-pulse rounded-xl bg-[#16191F]" />
              </div>
            ) : (
              <>
                {activeSection === 'overview' && (
                  <AdminOverview
                    stats={stats}
                    recentActivity={recentActivity}
                    recentProjects={recentProjects}
                    recentApplications={recentApplications}
                    onNavigateSection={selectSection}
                    onEditProject={(proj) => {
                      setEditingProject(proj);
                      setActiveSection('project-form');
                    }}
                    onOpenApplication={(app) => {
                      setSelectedApplication(app);
                      setActiveSection('applications');
                    }}
                  />
                )}

                {activeSection === 'portfolio' && (
                  <AdminPortfolio
                    projects={projects}
                    onAddNew={() => {
                      setEditingProject(null);
                      setActiveSection('project-form');
                    }}
                    onEdit={(proj) => {
                      setEditingProject(proj);
                      setActiveSection('project-form');
                    }}
                    onRefresh={handleFullRefresh}
                  />
                )}

                {activeSection === 'project-form' && (
                  <AdminProjectForm
                    existingProject={editingProject}
                    onSaved={async () => {
                      await handleFullRefresh();
                      setEditingProject(null);
                      setActiveSection('portfolio');
                    }}
                    onCancel={() => {
                      setEditingProject(null);
                      setActiveSection('portfolio');
                    }}
                  />
                )}

                {(activeSection === 'applications' || activeSection === 'rejected') && (
                  <AdminApplications
                    applications={applications}
                    emailConfig={emailConfig}
                    mode={activeSection === 'rejected' ? 'rejected' : 'all'}
                    selectedApp={selectedApplication}
                    onSelectApp={setSelectedApplication}
                    onRefresh={handleFullRefresh}
                  />
                )}

                {activeSection === 'accepted' && (
                  <AdminAcceptedClients
                    applications={applications}
                    onViewApplication={(app) => {
                      setSelectedApplication(app);
                      setActiveSection('applications');
                    }}
                    onRefresh={handleFullRefresh}
                  />
                )}

                {activeSection === 'knowledge' && (
                  <AdminKnowledgeBase onRefreshDashboard={handleFullRefresh} />
                )}

                {activeSection === 'settings' && (
                  <AdminSettings
                    initialSettings={settings}
                    emailConfig={emailConfig}
                    onSaved={handleFullRefresh}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
