import React, {useState} from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ImagePlus,
  Plus,
  Star,
  Trash2,
  Upload,
} from 'lucide-react';
import {PortfolioProject} from '../types/studio';
import {uploadBinaryFile} from '../utils/uploadFile';

const CATEGORIES = [
  'Brand Identity Design',
  'Graphic Design',
  'Website Design',
  'Website Development',
  'Social Media Design',
];

interface AdminProjectFormProps {
  existingProject: PortfolioProject | null;
  onSaved: (project: PortfolioProject) => void;
  onCancel: () => void;
}

export function AdminProjectForm({
  existingProject,
  onSaved,
  onCancel,
}: AdminProjectFormProps) {
  const [title, setTitle] = useState(existingProject?.title || '');
  const [category, setCategory] = useState(existingProject?.category || 'Brand Identity Design');
  const [shortDescription, setShortDescription] = useState(
    existingProject?.shortDescription || ''
  );
  const [fullOverview, setFullOverview] = useState(existingProject?.fullOverview || '');
  const [clientName, setClientName] = useState(existingProject?.clientName || '');
  const [completionDate, setCompletionDate] = useState(existingProject?.completionDate || '');

  const [coverImageUrl, setCoverImageUrl] = useState(existingProject?.coverImageUrl || '');
  const [galleryImages, setGalleryImages] = useState<string[]>(
    existingProject?.galleryImages || []
  );
  const [websiteScreenshots, setWebsiteScreenshots] = useState<string[]>(
    existingProject?.websiteScreenshots || []
  );
  const [mediaLinks, setMediaLinks] = useState<string[]>(existingProject?.mediaLinks || []);
  const [newMediaLink, setNewMediaLink] = useState('');

  const [challenge, setChallenge] = useState(existingProject?.challenge || '');
  const [creativeApproach, setCreativeApproach] = useState(
    existingProject?.creativeApproach || ''
  );
  const [designProcess, setDesignProcess] = useState(existingProject?.designProcess || '');
  const [finalSolution, setFinalSolution] = useState(existingProject?.finalSolution || '');
  const [toolsText, setToolsText] = useState(
    existingProject?.tools.join(', ') || ''
  );
  const [liveWebsiteUrl, setLiveWebsiteUrl] = useState(existingProject?.liveWebsiteUrl || '');
  const [externalProjectUrl, setExternalProjectUrl] = useState(
    existingProject?.externalProjectUrl || ''
  );

  const [isFeatured, setIsFeatured] = useState(existingProject?.isFeatured || false);
  const [isCompleted, setIsCompleted] = useState(
    existingProject ? existingProject.isCompleted : true
  );

  const [uploadProgress, setUploadProgress] = useState<{
    target: string;
    percent: number;
  } | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const validateAndUploadFiles = async (
    files: FileList | File[],
    target: 'cover' | 'gallery' | 'screenshots'
  ) => {
    setUploadError('');
    const list = Array.from(files);
    if (list.length === 0) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

    for (const file of list) {
      if (!allowed.includes(file.type)) {
        setUploadError(`"${file.name}" is not a supported image (JPG, PNG, WebP, GIF).`);
        continue;
      }
      if (file.size > 8 * 1024 * 1024) {
        setUploadError(`"${file.name}" exceeds the 8MB maximum file size.`);
        continue;
      }

      try {
        setUploadProgress({target, percent: 0});
        const uploaded = await uploadBinaryFile('/api/admin/upload', file, (pct) => {
          setUploadProgress({target, percent: pct});
        });

        if (target === 'cover') {
          setCoverImageUrl(uploaded.url);
        } else if (target === 'gallery') {
          setGalleryImages((prev) => [...prev, uploaded.url]);
        } else {
          setWebsiteScreenshots((prev) => [...prev, uploaded.url]);
        }
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Image upload failed.');
      } finally {
        setUploadProgress(null);
      }
    }
  };

  const handleSave = async (publishStatus: 'draft' | 'published') => {
    setError('');
    if (title.trim().length < 2) {
      setError('Please enter a project title.');
      return;
    }
    if (shortDescription.trim().length < 10) {
      setError('Please enter a short description (at least 10 characters).');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        category,
        shortDescription: shortDescription.trim(),
        fullOverview: fullOverview.trim() || shortDescription.trim(),
        clientName: clientName.trim(),
        completionDate: completionDate.trim(),
        coverImageUrl,
        galleryImages,
        websiteScreenshots,
        mediaLinks,
        challenge: challenge.trim(),
        creativeApproach: creativeApproach.trim(),
        designProcess: designProcess.trim(),
        finalSolution: finalSolution.trim(),
        tools: toolsText
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        liveWebsiteUrl: liveWebsiteUrl.trim(),
        externalProjectUrl: externalProjectUrl.trim(),
        status: publishStatus,
        isFeatured,
        isCompleted,
      };

      const url = existingProject
        ? `/api/admin/projects/${existingProject.id}`
        : '/api/admin/projects';
      const method = existingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        project?: PortfolioProject;
      };

      if (!res.ok || !data.ok || !data.project) {
        setError(data.message || 'Failed to save project.');
        return;
      }

      onSaved(data.project);
    } catch {
      setError('Network error saving project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(191,195,202,0.12)] pb-6">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#BFC3CA] hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to My Portfolio</span>
          </button>
          <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            {existingProject ? `Edit: ${existingProject.title}` : 'Add New Portfolio Project'}
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave('draft')}
            className="rounded-lg border border-[rgba(191,195,202,0.25)] bg-[#16191F] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:border-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave('published')}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1769FF] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#2F7BFF] disabled:opacity-60"
          >
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{saving ? 'Publishing...' : 'Publish Project'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-red-400/40 bg-red-950/30 p-4 text-sm text-red-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {uploadError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-red-400/40 bg-red-950/30 p-4 text-sm text-red-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* 1. PROJECT INFORMATION */}
      <section className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-white">
          01. Project Information
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="proj-title" className="block text-xs font-medium text-[#BFC3CA]">
              Project Title *
            </label>
            <input
              id="proj-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Aurelia Architectural Identity"
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label htmlFor="proj-cat" className="block text-xs font-medium text-[#BFC3CA]">
              Project Category *
            </label>
            <select
              id="proj-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="proj-client" className="block text-xs font-medium text-[#BFC3CA]">
              Client or Brand Name
            </label>
            <input
              id="proj-client"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Optional client name"
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label htmlFor="proj-date" className="block text-xs font-medium text-[#BFC3CA]">
              Completion Date
            </label>
            <input
              id="proj-date"
              type="text"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              placeholder="e.g., October 2026"
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="proj-short" className="block text-xs font-medium text-[#BFC3CA]">
            Short Description * (shown on portfolio cards)
          </label>
          <textarea
            id="proj-short"
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Concise 1–2 sentence overview of what SOLMONIX STUDIO created."
            className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="proj-overview" className="block text-xs font-medium text-[#BFC3CA]">
            Full Project Overview
          </label>
          <textarea
            id="proj-overview"
            rows={4}
            value={fullOverview}
            onChange={(e) => setFullOverview(e.target.value)}
            placeholder="Detailed case study introduction, goals, and context."
            className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
          />
        </div>
      </section>

      {/* 2. PROJECT MEDIA (DRAG & DROP) */}
      <section className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-white">02. Project Media</h2>

        {/* Cover Image Dropzone */}
        <div className="mt-6">
          <label className="block text-xs font-medium text-[#BFC3CA]">
            Featured Cover Image (JPG, PNG, WebP, GIF — max 8MB)
          </label>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragTarget('cover');
            }}
            onDragLeave={() => setDragTarget(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDragTarget(null);
              void validateAndUploadFiles(e.dataTransfer.files, 'cover');
            }}
            className={`mt-2 rounded-xl border border-dashed p-5 transition-colors ${
              dragTarget === 'cover'
                ? 'border-[#1769FF] bg-[#1769FF]/10'
                : 'border-[rgba(191,195,202,0.25)] bg-[#101216]'
            }`}
          >
            {coverImageUrl ? (
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  className="h-36 w-56 rounded-lg border border-[rgba(191,195,202,0.2)] object-cover"
                />
                <div className="space-y-3">
                  <p className="text-xs font-medium text-white">Cover Image Active</p>
                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[rgba(191,195,202,0.25)] bg-[#16191F] px-3.5 py-2 text-xs font-medium text-white hover:border-[#1769FF]">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Replace Cover</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          if (e.target.files) void validateAndUploadFiles(e.target.files, 'cover');
                          e.target.value = '';
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setCoverImageUrl('')}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/30 px-3.5 py-2 text-xs font-medium text-red-300 hover:bg-red-950/30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center py-6 text-center">
                <ImagePlus className="h-7 w-7 text-[#1769FF]" aria-hidden="true" />
                <span className="mt-2.5 text-sm font-medium text-white">
                  Drag and drop cover image here, or click to select
                </span>
                <span className="mt-1 text-xs text-[#BFC3CA]/70">
                  Recommended 16:9 or 4:3 high-resolution image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    if (e.target.files) void validateAndUploadFiles(e.target.files, 'cover');
                    e.target.value = '';
                  }}
                />
              </label>
            )}

            {uploadProgress?.target === 'cover' && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-[#BFC3CA] tabular-nums">
                  <span>Uploading cover...</span>
                  <span>{uploadProgress.percent}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#16191F]">
                  <div
                    className="h-full bg-[#1769FF]"
                    style={{width: `${uploadProgress.percent}%`}}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Multiple Project Gallery Images */}
        <div className="mt-8">
          <label className="block text-xs font-medium text-[#BFC3CA]">
            Project Gallery Images (Upload multiple images)
          </label>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragTarget('gallery');
            }}
            onDragLeave={() => setDragTarget(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDragTarget(null);
              void validateAndUploadFiles(e.dataTransfer.files, 'gallery');
            }}
            className={`mt-2 rounded-xl border border-dashed p-5 transition-colors ${
              dragTarget === 'gallery'
                ? 'border-[#1769FF] bg-[#1769FF]/10'
                : 'border-[rgba(191,195,202,0.25)] bg-[#101216]'
            }`}
          >
            <label className="flex cursor-pointer flex-col items-center justify-center py-4 text-center">
              <Upload className="h-5 w-5 text-[#1769FF]" aria-hidden="true" />
              <span className="mt-2 text-xs font-medium text-white">
                Drag and drop multiple gallery images, or click to browse
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files) void validateAndUploadFiles(e.target.files, 'gallery');
                  e.target.value = '';
                }}
              />
            </label>

            {uploadProgress?.target === 'gallery' && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-[#BFC3CA] tabular-nums">
                  <span>Uploading gallery image...</span>
                  <span>{uploadProgress.percent}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#16191F]">
                  <div
                    className="h-full bg-[#1769FF]"
                    style={{width: `${uploadProgress.percent}%`}}
                  />
                </div>
              </div>
            )}

            {galleryImages.length > 0 && (
              <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {galleryImages.map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
                    className="overflow-hidden rounded-lg border border-[rgba(191,195,202,0.18)] bg-[#16191F]"
                  >
                    <img src={url} alt={`Gallery ${idx + 1}`} className="h-28 w-full object-cover" />
                    <div className="flex items-center justify-between gap-1 p-2">
                      <button
                        type="button"
                        onClick={() => setCoverImageUrl(url)}
                        className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                          coverImageUrl === url ? 'text-[#1769FF]' : 'text-[#BFC3CA] hover:text-white'
                        }`}
                      >
                        <Star className="h-3 w-3" />
                        <span>{coverImageUrl === url ? 'Cover' : 'Set Cover'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setGalleryImages((prev) => prev.filter((_, i) => i !== idx))
                        }
                        aria-label="Remove gallery image"
                        className="text-[#BFC3CA] hover:text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Website Screenshots Dropzone */}
        <div className="mt-8">
          <label className="block text-xs font-medium text-[#BFC3CA]">
            Website Hero &amp; Page Screenshots (displayed in browser showcase frames)
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragTarget('screenshots');
            }}
            onDragLeave={() => setDragTarget(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDragTarget(null);
              void validateAndUploadFiles(e.dataTransfer.files, 'screenshots');
            }}
            className={`mt-2 rounded-xl border border-dashed p-5 transition-colors ${
              dragTarget === 'screenshots'
                ? 'border-[#1769FF] bg-[#1769FF]/10'
                : 'border-[rgba(191,195,202,0.25)] bg-[#101216]'
            }`}
          >
            <label className="flex cursor-pointer flex-col items-center justify-center py-4 text-center">
              <Upload className="h-5 w-5 text-[#1769FF]" aria-hidden="true" />
              <span className="mt-2 text-xs font-medium text-white">
                Upload website screenshots (hero &amp; full-page captures)
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files) void validateAndUploadFiles(e.target.files, 'screenshots');
                  e.target.value = '';
                }}
              />
            </label>

            {uploadProgress?.target === 'screenshots' && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-[#BFC3CA] tabular-nums">
                  <span>Uploading screenshot...</span>
                  <span>{uploadProgress.percent}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#16191F]">
                  <div
                    className="h-full bg-[#1769FF]"
                    style={{width: `${uploadProgress.percent}%`}}
                  />
                </div>
              </div>
            )}

            {websiteScreenshots.length > 0 && (
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {websiteScreenshots.map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
                    className="overflow-hidden rounded-lg border border-[rgba(191,195,202,0.18)] bg-[#16191F]"
                  >
                    <img
                      src={url}
                      alt={`Screenshot ${idx + 1}`}
                      className="h-28 w-full object-cover object-top"
                    />
                    <div className="flex justify-end p-2">
                      <button
                        type="button"
                        onClick={() =>
                          setWebsiteScreenshots((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="inline-flex items-center gap-1 text-[11px] text-[#BFC3CA] hover:text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Video or Media Links */}
        <div className="mt-8">
          <label className="block text-xs font-medium text-[#BFC3CA]">
            Video or Media Links (Vimeo, YouTube, Loom, Behance embed links)
          </label>
          <div className="mt-2 flex gap-2">
            <input
              type="url"
              value={newMediaLink}
              onChange={(e) => setNewMediaLink(e.target.value)}
              placeholder="https://vimeo.com/..."
              className="flex-1 rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2 text-sm text-white"
            />
            <button
              type="button"
              onClick={() => {
                const trimmed = newMediaLink.trim();
                if (trimmed) {
                  setMediaLinks((prev) => [...prev, trimmed]);
                  setNewMediaLink('');
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(191,195,202,0.25)] bg-[#101216] px-4 py-2 text-xs font-medium text-white hover:border-[#1769FF]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Link</span>
            </button>
          </div>
          {mediaLinks.length > 0 && (
            <ul className="mt-3 space-y-2">
              {mediaLinks.map((link, idx) => (
                <li
                  key={`${link}-${idx}`}
                  className="flex items-center justify-between rounded-lg border border-[rgba(191,195,202,0.14)] bg-[#101216] px-3.5 py-2 text-xs text-[#BFC3CA]"
                >
                  <span className="truncate">{link}</span>
                  <button
                    type="button"
                    onClick={() => setMediaLinks((prev) => prev.filter((_, i) => i !== idx))}
                    className="ml-3 text-[#BFC3CA] hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 3. CASE STUDY DETAILS */}
      <section className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-white">
          03. Case Study Narrative &amp; Links
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="proj-challenge" className="block text-xs font-medium text-[#BFC3CA]">
              Project Challenge
            </label>
            <textarea
              id="proj-challenge"
              rows={3}
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label htmlFor="proj-approach" className="block text-xs font-medium text-[#BFC3CA]">
              Creative Approach
            </label>
            <textarea
              id="proj-approach"
              rows={3}
              value={creativeApproach}
              onChange={(e) => setCreativeApproach(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label htmlFor="proj-process" className="block text-xs font-medium text-[#BFC3CA]">
              Design Process
            </label>
            <textarea
              id="proj-process"
              rows={3}
              value={designProcess}
              onChange={(e) => setDesignProcess(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label htmlFor="proj-solution" className="block text-xs font-medium text-[#BFC3CA]">
              Final Solution
            </label>
            <textarea
              id="proj-solution"
              rows={3}
              value={finalSolution}
              onChange={(e) => setFinalSolution(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="proj-tools" className="block text-xs font-medium text-[#BFC3CA]">
              Tools &amp; Technologies (comma-separated)
            </label>
            <input
              id="proj-tools"
              type="text"
              value={toolsText}
              onChange={(e) => setToolsText(e.target.value)}
              placeholder="Figma, Illustrator, React, TypeScript"
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label htmlFor="proj-live" className="block text-xs font-medium text-[#BFC3CA]">
              Live Website URL
            </label>
            <input
              id="proj-live"
              type="text"
              value={liveWebsiteUrl}
              onChange={(e) => setLiveWebsiteUrl(e.target.value)}
              placeholder="https://clientdomain.com or /showcase/..."
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label htmlFor="proj-ext" className="block text-xs font-medium text-[#BFC3CA]">
              External Project URL
            </label>
            <input
              id="proj-ext"
              type="url"
              value={externalProjectUrl}
              onChange={(e) => setExternalProjectUrl(e.target.value)}
              placeholder="https://behance.net/..."
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
        </div>
      </section>

      {/* 4. PUBLISHING CONTROLS */}
      <section className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-white">04. Publishing Controls</h2>

        <div className="mt-5 flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-white">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded accent-[#1769FF]"
            />
            <span>Feature on Homepage</span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-white">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
              className="h-4 w-4 rounded accent-[#1769FF]"
            />
            <span>Mark as Completed</span>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-[rgba(191,195,202,0.12)] pt-6">
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave('draft')}
            className="rounded-lg border border-[rgba(191,195,202,0.25)] px-5 py-2.5 text-xs font-semibold text-white hover:border-white disabled:opacity-60"
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave('published')}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1769FF] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#2F7BFF] disabled:opacity-60"
          >
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{existingProject?.status === 'published' ? 'Update Published Project' : 'Publish Project'}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
