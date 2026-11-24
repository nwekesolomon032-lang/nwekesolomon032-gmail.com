import React, {useCallback, useEffect, useState} from 'react';
import {
  BookOpen,
  Check,
  Edit3,
  Eye,
  EyeOff,
  FileUp,
  Layers,
  Plus,
  Send,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import {AiResponseMeta, KnowledgeCategory, KnowledgeEntry} from '../types/studio';

const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  'About the Agency',
  'Services',
  'Portfolio',
  'Pricing and Packages',
  'Frequently Asked Questions',
  'Contact Information',
  'Policies and Processes',
];

interface AdminKnowledgeBaseProps {
  onRefreshDashboard: () => Promise<void>;
}

interface PreviewResult {
  reply: string;
  meta: AiResponseMeta;
  groundingSummary: {
    knowledgeEntriesUsed: Array<{id: string; category: string; title: string}>;
    publishedProjectsAvailable: Array<{slug: string; title: string; category: string}>;
  };
}

export function AdminKnowledgeBase({onRefreshDashboard}: AdminKnowledgeBaseProps) {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [statusMessage, setStatusMessage] = useState<{type: 'ok' | 'err'; text: string} | null>(
    null
  );

  // Create / Edit Form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('About the Agency');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [sourceFilename, setSourceFilename] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [saving, setSaving] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Live AI Preview Tester
  const [previewQuestion, setPreviewQuestion] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [previewResult, setPreviewResult] = useState<PreviewResult | null>(null);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/knowledge');
      if (res.ok) {
        const data = (await res.json()) as {ok?: boolean; entries?: KnowledgeEntry[]};
        if (data.ok && Array.isArray(data.entries)) {
          setEntries(data.entries);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEntries();
  }, [fetchEntries]);

  const resetForm = () => {
    setEditingId(null);
    setCategory(activeCategory !== 'All' ? activeCategory : 'About the Agency');
    setTitle('');
    setContent('');
    setTags('');
    setSourceFilename('');
    setStatus('published');
    setShowForm(false);
  };

  const openCreateForm = () => {
    setEditingId(null);
    setCategory(activeCategory !== 'All' ? activeCategory : 'About the Agency');
    setTitle('');
    setContent('');
    setTags('');
    setSourceFilename('');
    setStatus('published');
    setShowForm(true);
  };

  const openEditForm = (entry: KnowledgeEntry) => {
    setEditingId(entry.id);
    setCategory(entry.category);
    setTitle(entry.title);
    setContent(entry.content);
    setTags(entry.tags);
    setSourceFilename(entry.sourceFilename || '');
    setStatus(entry.status);
    setShowForm(true);
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const endpoint = editingId
        ? `/api/admin/knowledge/${editingId}`
        : '/api/admin/knowledge';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          category,
          title,
          content,
          tags,
          sourceFilename,
          status,
        }),
      });
      const data = (await res.json()) as {ok?: boolean; message?: string};

      if (!res.ok || !data.ok) {
        setStatusMessage({
          type: 'err',
          text: data.message || 'Could not save knowledge entry.',
        });
        return;
      }

      setStatusMessage({
        type: 'ok',
        text: editingId
          ? 'Knowledge entry updated and synced with SOLMONIX AI.'
          : 'New knowledge entry saved and available to SOLMONIX AI.',
      });
      resetForm();
      await Promise.all([fetchEntries(), onRefreshDashboard()]);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (entry: KnowledgeEntry) => {
    const nextStatus = entry.status === 'published' ? 'draft' : 'published';
    const res = await fetch(`/api/admin/knowledge/${entry.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({status: nextStatus}),
    });
    if (res.ok) {
      setStatusMessage({
        type: 'ok',
        text: `"${entry.title}" is now ${
          nextStatus === 'published' ? 'Published to SOLMONIX AI' : 'Hidden (Draft)'
        }.`,
      });
      await fetchEntries();
    }
  };

  const handleDeleteEntry = async (entry: KnowledgeEntry) => {
    const res = await fetch(`/api/admin/knowledge/${entry.id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setStatusMessage({
        type: 'ok',
        text: `Removed "${entry.title}" from the AI knowledge base.`,
      });
      if (editingId === entry.id) {
        resetForm();
      }
      await Promise.all([fetchEntries(), onRefreshDashboard()]);
    }
  };

  const handleDocumentUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploadingDoc(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/knowledge/upload-doc', {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'text/plain',
          'X-File-Name': encodeURIComponent(file.name),
        },
        body: file,
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        filename?: string;
        suggestedTitle?: string;
        extractedContent?: string;
      };
      if (!res.ok || !data.ok) {
        setStatusMessage({
          type: 'err',
          text: data.message || 'Could not extract text from uploaded document.',
        });
        return;
      }

      setShowForm(true);
      if (!title.trim() && data.suggestedTitle) {
        setTitle(data.suggestedTitle);
      }
      setContent(data.extractedContent || '');
      setSourceFilename(data.filename || file.name);
      setStatusMessage({
        type: 'ok',
        text: `Loaded "${file.name}" into editor. Review category and click Save Entry to publish.`,
      });
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleRunPreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewQuestion.trim() || previewLoading) return;
    setPreviewLoading(true);
    setPreviewError('');
    try {
      const res = await fetch('/api/admin/ai/preview', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: previewQuestion.trim(), history: []}),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
      } & Partial<PreviewResult>;

      if (!res.ok || !data.ok || !data.reply) {
        setPreviewError(data.message || 'Unable to generate AI preview right now.');
        return;
      }

      setPreviewResult({
        reply: data.reply,
        meta: data.meta || {projects: [], actions: []},
        groundingSummary: data.groundingSummary || {
          knowledgeEntriesUsed: [],
          publishedProjectsAvailable: [],
        },
      });
    } catch {
      setPreviewError('Network error while testing SOLMONIX AI.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const filteredEntries =
    activeCategory === 'All'
      ? entries
      : entries.filter((item) => item.category === activeCategory);

  const publishedCount = entries.filter((e) => e.status === 'published').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[rgba(191,195,202,0.12)] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-[#1769FF] uppercase">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>SOLMONIX AI Grounding</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">
            AI Knowledge Base
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[#BFC3CA]">
            Manage what SOLMONIX AI knows across agency identity, FAQs, services, pricing notes,
            and policies. Published Portfolio projects and Settings contact details also sync
            automatically.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[rgba(191,195,202,0.24)] bg-[#16191F] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:border-[#1769FF]">
            <FileUp className="h-3.5 w-3.5 text-[#1769FF]" />
            <span>{uploadingDoc ? 'Reading...' : 'Import Document (.txt/.md/.csv)'}</span>
            <input
              type="file"
              accept=".txt,.md,.markdown,.csv,.json"
              className="sr-only"
              onChange={(e) => {
                void handleDocumentUpload(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </label>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1769FF] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#2F7BFF]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Knowledge Entry</span>
          </button>
        </div>
      </div>

      {/* Sync Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-5">
          <p className="text-xs text-[#BFC3CA]">Published Knowledge Entries</p>
          <p className="mt-2 font-display text-2xl font-semibold text-white tabular-nums">
            {publishedCount}
          </p>
          <p className="mt-1 text-[11px] text-[#BFC3CA]/70">Active in assistant retrieval</p>
        </div>
        <div className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-5">
          <p className="text-xs text-[#BFC3CA]">Portfolio &amp; Contact Sync</p>
          <p className="mt-2 font-display text-sm font-semibold text-emerald-300">
            Live Automatic Sync
          </p>
          <p className="mt-1 text-[11px] text-[#BFC3CA]/70">
            Reads only published projects &amp; public contact settings
          </p>
        </div>
        <div className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-5">
          <p className="text-xs text-[#BFC3CA]">Privacy Guardrail</p>
          <p className="mt-2 font-display text-sm font-semibold text-white">
            Drafts &amp; Client Apps Isolated
          </p>
          <p className="mt-1 text-[11px] text-[#BFC3CA]/70">
            Never exposes drafts, admin credentials, or private briefs
          </p>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`rounded-lg border px-4 py-3 text-xs ${
            statusMessage.type === 'ok'
              ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
              : 'border-red-500/40 bg-red-950/30 text-red-200'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Create / Edit Knowledge Modal / Inline Drawer */}
      {showForm && (
        <form
          onSubmit={handleSaveEntry}
          className="space-y-4 rounded-xl border border-[rgba(23,105,255,0.45)] bg-[#141821] p-6"
        >
          <div className="flex items-center justify-between border-b border-[rgba(191,195,202,0.12)] pb-3">
            <h2 className="font-display text-base font-semibold text-white">
              {editingId ? 'Edit Knowledge Entry' : 'New Knowledge Entry'}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg p-1.5 text-[#BFC3CA] hover:bg-white/10 hover:text-white"
              aria-label="Close editor"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-[#BFC3CA]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
              >
                {KNOWLEDGE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#BFC3CA]">Visibility</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
              >
                <option value="published">Published (Live in SOLMONIX AI)</option>
                <option value="draft">Draft (Hidden from SOLMONIX AI)</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-[#BFC3CA]">Title / Topic</label>
              <input
                type="text"
                required
                minLength={3}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Typical Website Design Turnaround"
                className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#BFC3CA]">
                Search Keywords / Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., turnaround, timeline, revisions, branding"
                className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">
              Knowledge Content / Answer{' '}
              {sourceFilename && (
                <span className="ml-2 text-[#4D8EFF]">(Imported from {sourceFilename})</span>
              )}
            </label>
            <textarea
              required
              minLength={10}
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write factual agency details, FAQ Q&A pairs, package scope notes, or project explanations that SOLMONIX AI should use..."
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm leading-relaxed text-white"
            />
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-[rgba(191,195,202,0.22)] px-4 py-2 text-xs font-medium text-[#BFC3CA] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1769FF] px-5 py-2 text-xs font-semibold text-white hover:bg-[#2F7BFF] disabled:opacity-60"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{saving ? 'Saving...' : 'Save Entry'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Main Split: Knowledge Entries List + Live AI Preview Tester */}
      <div className="grid gap-8 xl:grid-cols-12">
        {/* Left 7 Cols: Category Filter & Entries */}
        <div className="space-y-5 xl:col-span-7">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === 'All'
                  ? 'bg-[#1769FF] text-white'
                  : 'border border-[rgba(191,195,202,0.18)] bg-[#16191F] text-[#BFC3CA] hover:text-white'
              }`}
            >
              All ({entries.length})
            </button>
            {KNOWLEDGE_CATEGORIES.map((cat) => {
              const count = entries.filter((e) => e.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeCategory === cat
                      ? 'bg-[#1769FF] text-white'
                      : 'border border-[rgba(191,195,202,0.18)] bg-[#16191F] text-[#BFC3CA] hover:text-white'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="space-y-3">
              <div className="h-28 animate-pulse rounded-xl bg-[#16191F]" />
              <div className="h-28 animate-pulse rounded-xl bg-[#16191F]" />
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-10 text-center">
              <BookOpen className="mx-auto h-7 w-7 text-[#1769FF]" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-white">
                No entries in this category yet.
              </p>
              <p className="mt-1 text-xs text-[#BFC3CA]">
                Click Add Knowledge Entry or Import Document to teach SOLMONIX AI.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEntries.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-5 transition-colors hover:border-[rgba(23,105,255,0.4)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="rounded bg-[#101216] px-2 py-0.5 font-medium text-[#4D8EFF]">
                          {entry.category}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 font-medium ${
                            entry.status === 'published'
                              ? 'bg-emerald-950/60 text-emerald-300'
                              : 'bg-amber-950/60 text-amber-300'
                          }`}
                        >
                          {entry.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                        {entry.sourceFilename && (
                          <span className="text-[#BFC3CA]/70">
                            File: {entry.sourceFilename}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 font-display text-base font-semibold text-white">
                        {entry.title}
                      </h3>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => void handleToggleStatus(entry)}
                        title={
                          entry.status === 'published'
                            ? 'Unpublish (move to Draft)'
                            : 'Publish to SOLMONIX AI'
                        }
                        className="rounded-lg border border-[rgba(191,195,202,0.18)] bg-[#101216] p-2 text-[#BFC3CA] hover:border-[#1769FF] hover:text-white"
                      >
                        {entry.status === 'published' ? (
                          <Eye className="h-3.5 w-3.5 text-emerald-300" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5 text-amber-300" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditForm(entry)}
                        aria-label={`Edit ${entry.title}`}
                        className="rounded-lg border border-[rgba(191,195,202,0.18)] bg-[#101216] p-2 text-[#BFC3CA] hover:border-[#1769FF] hover:text-white"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteEntry(entry)}
                        aria-label={`Delete ${entry.title}`}
                        className="rounded-lg border border-[rgba(191,195,202,0.18)] bg-[#101216] p-2 text-[#BFC3CA] hover:border-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 whitespace-pre-line text-xs leading-relaxed text-[#BFC3CA]">
                    {entry.content}
                  </p>

                  {entry.tags && (
                    <p className="mt-3 text-[11px] text-[#BFC3CA]/60">
                      Keywords: {entry.tags}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Preview How SOLMONIX AI Uses Knowledge */}
        <div className="xl:col-span-5">
          <div className="sticky top-24 rounded-xl border border-[rgba(23,105,255,0.35)] bg-[#0A0E1C] p-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1769FF]/20 text-[#4D8EFF]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-base font-semibold text-white">
                  Preview SOLMONIX AI
                </h2>
                <p className="text-[11px] text-[#BFC3CA]">
                  Test how the assistant answers using your current published knowledge base
                </p>
              </div>
            </div>

            <form onSubmit={handleRunPreview} className="mt-5 space-y-3">
              <textarea
                rows={3}
                value={previewQuestion}
                onChange={(e) => setPreviewQuestion(e.target.value)}
                placeholder="Ask a sample visitor question (e.g., 'What services do you offer for a new brand?' or 'Show me your website projects')"
                className="w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-xs text-white placeholder-[#BFC3CA]/55"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'What services do you offer?',
                    'Show me your projects',
                    'How much does a website cost?',
                  ].map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => setPreviewQuestion(sample)}
                      className="rounded border border-[rgba(191,195,202,0.18)] px-2 py-1 text-[10px] text-[#BFC3CA] hover:border-[#1769FF] hover:text-white"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={!previewQuestion.trim() || previewLoading}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1769FF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2F7BFF] disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{previewLoading ? 'Testing...' : 'Test Response'}</span>
                </button>
              </div>
            </form>

            {previewError && (
              <div className="mt-4 rounded-lg border border-red-500/40 bg-red-950/30 p-3 text-xs text-red-200">
                {previewError}
              </div>
            )}

            {previewResult && (
              <div className="mt-5 space-y-4 border-t border-[rgba(191,195,202,0.14)] pt-4">
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-[#4D8EFF] uppercase">
                    Assistant Preview Output
                  </p>
                  <div className="mt-2 whitespace-pre-line rounded-lg border border-[rgba(191,195,202,0.14)] bg-[#101216] p-3.5 text-xs leading-relaxed text-[#E2E6ED]">
                    {previewResult.reply}
                  </div>
                </div>

                {previewResult.meta.projects.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold tracking-wider text-[#BFC3CA] uppercase">
                      Project Cards Attached ({previewResult.meta.projects.length})
                    </p>
                    <div className="mt-1.5 space-y-1.5">
                      {previewResult.meta.projects.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-2 rounded-lg border border-[rgba(23,105,255,0.3)] bg-[#101216] p-2 text-xs"
                        >
                          <Layers className="h-3.5 w-3.5 text-[#1769FF]" />
                          <span className="font-medium text-white">{p.title}</span>
                          <span className="text-[10px] text-[#BFC3CA]">({p.category})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-[#BFC3CA] uppercase">
                    Grounding Sources Used
                  </p>
                  <ul className="mt-1.5 space-y-1 text-[11px] text-[#BFC3CA]">
                    {previewResult.groundingSummary.knowledgeEntriesUsed.slice(0, 5).map((k) => (
                      <li key={k.id} className="truncate">
                        &bull; [{k.category}] {k.title}
                      </li>
                    ))}
                    <li className="text-[#4D8EFF]">
                      &bull; Published Portfolio Projects Grounded:{' '}
                      {previewResult.groundingSummary.publishedProjectsAvailable.length}
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
