import React from 'react';
import {ArrowRight, FileCheck2, FolderKanban, Plus, Users} from 'lucide-react';
import {
  ActivityLogItem,
  AdminOverviewStats,
  AdminSection,
  ClientApplication,
  PortfolioProject,
} from '../types/studio';

interface AdminOverviewProps {
  stats: AdminOverviewStats;
  recentActivity: ActivityLogItem[];
  recentProjects: PortfolioProject[];
  recentApplications: ClientApplication[];
  onNavigateSection: (section: AdminSection) => void;
  onEditProject: (project: PortfolioProject) => void;
  onOpenApplication: (app: ClientApplication) => void;
}

export function AdminOverview({
  stats,
  recentActivity,
  recentProjects,
  recentApplications,
  onNavigateSection,
  onEditProject,
  onOpenApplication,
}: AdminOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Header & Quick Actions */}
      <div className="flex flex-col justify-between gap-5 border-b border-[rgba(191,195,202,0.12)] pb-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Studio Overview
          </h1>
          <p className="mt-1.5 text-sm text-[#BFC3CA]">
            Live operational summary of portfolio publications, incoming client applications, and
            active studio work.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigateSection('project-form')}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#1769FF] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#2F7BFF]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>+ Add New Project</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateSection('applications')}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-[rgba(191,195,202,0.22)] bg-[#16191F] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:border-[#1769FF]"
          >
            <span>View Applications</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Real Database Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-5">
          <div className="flex items-center justify-between text-xs text-[#BFC3CA]">
            <span>Portfolio Projects</span>
            <FolderKanban className="h-4 w-4 text-[#1769FF]" aria-hidden="true" />
          </div>
          <p className="mt-3 font-display text-3xl font-semibold text-white tabular-nums">
            {stats.totalProjects}
          </p>
          <p className="mt-2 text-xs text-[#BFC3CA]/80 tabular-nums">
            {stats.publishedProjects} Published <span aria-hidden="true">·</span>{' '}
            {stats.draftProjects} Drafts
          </p>
        </div>

        <div className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-5">
          <div className="flex items-center justify-between text-xs text-[#BFC3CA]">
            <span>Total Applications</span>
            <FileCheck2 className="h-4 w-4 text-[#1769FF]" aria-hidden="true" />
          </div>
          <p className="mt-3 font-display text-3xl font-semibold text-white tabular-nums">
            {stats.totalApplications}
          </p>
          <p className="mt-2 text-xs text-[#BFC3CA]/80 tabular-nums">
            {stats.pendingApplications} Pending Review
          </p>
        </div>

        <div className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-5">
          <div className="flex items-center justify-between text-xs text-[#BFC3CA]">
            <span>Accepted Clients</span>
            <Users className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          </div>
          <p className="mt-3 font-display text-3xl font-semibold text-white tabular-nums">
            {stats.acceptedClients}
          </p>
          <button
            type="button"
            onClick={() => onNavigateSection('accepted')}
            className="mt-2 text-xs font-medium text-[#1769FF] hover:underline"
          >
            Manage Accepted Clients
          </button>
        </div>

        <div className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-5">
          <div className="flex items-center justify-between text-xs text-[#BFC3CA]">
            <span>Rejected Applications</span>
          </div>
          <p className="mt-3 font-display text-3xl font-semibold text-white tabular-nums">
            {stats.rejectedApplications}
          </p>
          <button
            type="button"
            onClick={() => onNavigateSection('rejected')}
            className="mt-2 text-xs font-medium text-[#BFC3CA] hover:text-white"
          >
            View Archive
          </button>
        </div>
      </div>

      {/* Main Split: Recent Applications & Projects + Activity Feed */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Recent Client Applications & Portfolio */}
        <div className="space-y-8 lg:col-span-7">
          <div className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-white">
                Newly Submitted Applications
              </h2>
              <button
                type="button"
                onClick={() => onNavigateSection('applications')}
                className="text-xs font-medium text-[#1769FF] hover:underline"
              >
                All Applications
              </button>
            </div>

            {recentApplications.length === 0 ? (
              <p className="mt-5 text-sm text-[#BFC3CA]/75">
                No client applications have been submitted yet. Submissions from the Start a
                Project page appear here automatically.
              </p>
            ) : (
              <div className="mt-4 divide-y divide-[rgba(191,195,202,0.1)]">
                {recentApplications.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => onOpenApplication(app)}
                    className="flex w-full items-center justify-between gap-4 py-3.5 text-left transition-colors hover:bg-[#1B1F27]/60 px-2 rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {app.fullName}
                        {app.companyName ? ` · ${app.companyName}` : ''}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[#BFC3CA]">
                        {app.referenceNumber} · {app.serviceInterested} · {app.budgetRange}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-semibold ${
                        app.status === 'Accepted'
                          ? 'text-emerald-400'
                          : app.status === 'Rejected'
                            ? 'text-red-300'
                            : 'text-[#1769FF]'
                      }`}
                    >
                      {app.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-white">
                Recent Portfolio Records
              </h2>
              <button
                type="button"
                onClick={() => onNavigateSection('portfolio')}
                className="text-xs font-medium text-[#1769FF] hover:underline"
              >
                Manage Portfolio
              </button>
            </div>

            {recentProjects.length === 0 ? (
              <div className="mt-5">
                <p className="text-sm text-[#BFC3CA]/75">
                  No portfolio projects uploaded yet. Add your first project to publish work to the
                  public website.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigateSection('project-form')}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1769FF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2F7BFF]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create First Project</span>
                </button>
              </div>
            ) : (
              <div className="mt-4 divide-y divide-[rgba(191,195,202,0.1)]">
                {recentProjects.map((proj) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => onEditProject(proj)}
                    className="flex w-full items-center justify-between gap-4 py-3.5 text-left transition-colors hover:bg-[#1B1F27]/60 px-2 rounded-lg"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {proj.coverImageUrl ? (
                        <img
                          src={proj.coverImageUrl}
                          alt={proj.title}
                          className="h-10 w-14 shrink-0 rounded border border-[rgba(191,195,202,0.16)] object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded border border-[rgba(191,195,202,0.16)] bg-[#101216] text-[10px] text-[#BFC3CA]/60">
                          No Img
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{proj.title}</p>
                        <p className="mt-0.5 truncate text-xs text-[#BFC3CA]">{proj.category}</p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-semibold ${
                        proj.status === 'published' ? 'text-emerald-400' : 'text-[#BFC3CA]'
                      }`}
                    >
                      {proj.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-6 lg:col-span-5">
          <h2 className="font-display text-base font-semibold text-white">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="mt-5 text-sm text-[#BFC3CA]/75">
              Studio activity events—such as project publications, client applications, and
              acceptance decisions—will appear here.
            </p>
          ) : (
            <ol className="mt-5 space-y-4">
              {recentActivity.map((log) => (
                <li
                  key={log.id}
                  className="border-b border-[rgba(191,195,202,0.08)] pb-3.5 last:border-0 last:pb-0"
                >
                  <p className="text-xs leading-relaxed text-white">{log.summary}</p>
                  <p className="mt-1 text-[11px] text-[#BFC3CA]/65 tabular-nums">
                    {log.actor} · {new Date(log.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
