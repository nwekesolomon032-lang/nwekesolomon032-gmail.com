import React, {useState} from 'react';
import {
  Edit3,
  Eye,
  Globe,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import {ProjectVisualFrame} from '../components/ProjectVisualFrame';
import {PortfolioProject} from '../types/studio';

interface AdminPortfolioProps {
  projects: PortfolioProject[];
  onAddNew: () => void;
  onEdit: (project: PortfolioProject) => void;
  onRefresh: () => Promise<void>;
}

const CATEGORIES = [
  'All Categories',
  'Brand Identity Design',
  'Graphic Design',
  'Website Design',
  'Website Development',
  'Social Media Design',
];

export function AdminPortfolio({
  projects,
  onAddNew,
  onEdit,
  onRefresh,
}: AdminPortfolioProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<PortfolioProject | null>(null);
  const [previewProject, setPreviewProject] = useState<PortfolioProject | null>(null);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      !search.trim() ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      categoryFilter === 'All Categories' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleTogglePublish = async (project: PortfolioProject) => {
    setBusyId(project.id);
    try {
      const nextStatus = project.status === 'published' ? 'draft' : 'published';
      await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({status: nextStatus}),
      });
      await onRefresh();
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleFeatured = async (project: PortfolioProject) => {
    setBusyId(project.id);
    try {
      await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({isFeatured: !project.isFeatured}),
      });
      await onRefresh();
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (project: PortfolioProject) => {
    setBusyId(project.id);
    try {
      await fetch(`/api/admin/projects/${project.id}`, {method: 'DELETE'});
      setConfirmDelete(null);
      await onRefresh();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-[rgba(191,195,202,0.12)] pb-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            My Portfolio
          </h1>
          <p className="mt-1 text-sm text-[#BFC3CA]">
            Manage published case studies, private drafts, and homepage featured projects.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddNew}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-[#1769FF] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#2F7BFF] sm:self-auto"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>+ Add New Project</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#BFC3CA]/60"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, client, or discipline..."
            className="w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#16191F] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#BFC3CA]/45"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#16191F] px-3 py-2 text-xs text-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="flex rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#16191F] p-1">
            {(['all', 'published', 'draft'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-[#1769FF] text-white'
                    : 'text-[#BFC3CA] hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio List */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] px-6 py-16 text-center">
          <h2 className="font-display text-lg font-semibold text-white">
            {projects.length === 0 ? 'Your Portfolio Is Empty' : 'No Matching Projects'}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#BFC3CA]">
            {projects.length === 0
              ? 'Upload your first brand identity, graphic design, or website project to publish it live.'
              : 'Try adjusting your search query or category filters.'}
          </p>
          {projects.length === 0 && (
            <button
              type="button"
              onClick={onAddNew}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1769FF] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#2F7BFF]"
            >
              <Plus className="h-4 w-4" />
              <span>Add First Project</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((project) => (
            <article
              key={project.id}
              className="flex flex-col justify-between rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-5"
            >
              <div>
                <ProjectVisualFrame project={project} variant="card" />

                <div className="mt-5 flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium text-[#1769FF]">{project.category}</span>
                  <div className="flex items-center gap-3">
                    {project.isFeatured && (
                      <span className="inline-flex items-center gap-1 font-medium text-amber-300">
                        <Star className="h-3 w-3 fill-current" />
                        <span>Featured</span>
                      </span>
                    )}
                    <span
                      className={`font-semibold ${
                        project.status === 'published' ? 'text-emerald-400' : 'text-[#BFC3CA]'
                      }`}
                    >
                      {project.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                <h2 className="mt-2 font-display text-lg font-semibold text-white">
                  {project.title}
                </h2>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#BFC3CA]">
                  {project.shortDescription}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[rgba(191,195,202,0.12)] pt-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busyId === project.id}
                    onClick={() => void handleTogglePublish(project)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                      project.status === 'published'
                        ? 'border border-[rgba(191,195,202,0.22)] text-[#BFC3CA] hover:text-white'
                        : 'bg-[#1769FF] text-white hover:bg-[#2F7BFF]'
                    }`}
                  >
                    {project.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>

                  <button
                    type="button"
                    disabled={busyId === project.id}
                    onClick={() => void handleToggleFeatured(project)}
                    className="inline-flex items-center gap-1 rounded-md border border-[rgba(191,195,202,0.2)] px-2.5 py-1.5 text-xs font-medium text-[#BFC3CA] hover:border-white hover:text-white"
                  >
                    <Star className={`h-3.5 w-3.5 ${project.isFeatured ? 'text-amber-300 fill-current' : ''}`} />
                    <span>{project.isFeatured ? 'Unfeature' : 'Feature'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewProject(project)}
                    aria-label={`Preview ${project.title}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[rgba(191,195,202,0.18)] text-[#BFC3CA] hover:text-white"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(project)}
                    aria-label={`Edit ${project.title}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[rgba(191,195,202,0.18)] text-[#BFC3CA] hover:border-[#1769FF] hover:text-white"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(project)}
                    aria-label={`Delete ${project.title}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[rgba(191,195,202,0.18)] text-[#BFC3CA] hover:border-red-400/50 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-[rgba(191,195,202,0.2)] bg-[#101216] p-6">
            <h3 className="font-display text-lg font-semibold text-white">
              Delete Portfolio Project?
            </h3>
            <p className="mt-2 text-sm text-[#BFC3CA]">
              Are you sure you want to permanently remove <strong className="text-white">{confirmDelete.title}</strong>?
              This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="rounded-lg border border-[rgba(191,195,202,0.22)] px-4 py-2 text-xs font-medium text-[#BFC3CA] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busyId === confirmDelete.id}
                onClick={() => void handleDelete(confirmDelete)}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-60"
              >
                {busyId === confirmDelete.id ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pre-Publish Preview Modal */}
      {previewProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewProject(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[rgba(191,195,202,0.2)] bg-[#101216] p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#1769FF]">
                  {previewProject.status === 'published' ? 'Published Preview' : 'Draft Preview'} ·{' '}
                  {previewProject.category}
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-white">
                  {previewProject.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(191,195,202,0.2)] text-[#BFC3CA] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5">
              <ProjectVisualFrame project={previewProject} variant="hero" />
            </div>

            <div className="mt-6 space-y-4 text-sm text-[#BFC3CA]">
              <p className="leading-relaxed text-white">
                {previewProject.fullOverview || previewProject.shortDescription}
              </p>
              {previewProject.challenge && (
                <div>
                  <h3 className="text-xs font-semibold text-white">Challenge</h3>
                  <p className="mt-1">{previewProject.challenge}</p>
                </div>
              )}
              {previewProject.finalSolution && (
                <div>
                  <h3 className="text-xs font-semibold text-white">Final Solution</h3>
                  <p className="mt-1">{previewProject.finalSolution}</p>
                </div>
              )}
              {previewProject.liveWebsiteUrl && (
                <a
                  href={previewProject.liveWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1769FF] hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>{previewProject.liveWebsiteUrl}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
