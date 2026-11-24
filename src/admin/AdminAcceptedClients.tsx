import React, {useState} from 'react';
import {Check, Eye, Search} from 'lucide-react';
import {ClientApplication, ProjectProgressStatus} from '../types/studio';

interface AdminAcceptedClientsProps {
  applications: ClientApplication[];
  onViewApplication: (app: ClientApplication) => void;
  onRefresh: () => Promise<void>;
}

const PROGRESS_OPTIONS: ProjectProgressStatus[] = [
  'Awaiting Start',
  'In Progress',
  'Awaiting Client Feedback',
  'Completed',
];

export function AdminAcceptedClients({
  applications,
  onViewApplication,
  onRefresh,
}: AdminAcceptedClientsProps) {
  const [search, setSearch] = useState('');
  const [progressFilter, setProgressFilter] = useState('All');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [draftNotes, setDraftNotes] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const accepted = applications.filter((a) => a.status === 'Accepted');
  const filtered = accepted.filter((client) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      client.fullName.toLowerCase().includes(q) ||
      client.companyName.toLowerCase().includes(q) ||
      client.referenceNumber.toLowerCase().includes(q) ||
      client.serviceInterested.toLowerCase().includes(q);
    const matchesProg =
      progressFilter === 'All' || client.projectProgress === progressFilter;
    return matchesSearch && matchesProg;
  });

  const handleProgressChange = async (
    client: ClientApplication,
    nextProgress: ProjectProgressStatus
  ) => {
    setBusyId(client.id);
    try {
      await fetch(`/api/admin/applications/${client.id}/progress`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({projectProgress: nextProgress}),
      });
      await onRefresh();
    } finally {
      setBusyId(null);
    }
  };

  const handleSaveNotes = async (client: ClientApplication) => {
    setBusyId(client.id);
    try {
      await fetch(`/api/admin/applications/${client.id}/progress`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({internalNotes: draftNotes}),
      });
      setEditingNotesId(null);
      await onRefresh();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[rgba(191,195,202,0.12)] pb-6">
        <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
          Accepted Clients
        </h1>
        <p className="mt-1.5 text-sm text-[#BFC3CA]">
          Active and approved client commissions with live project progress tracking and private
          studio notes.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#BFC3CA]/60"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search accepted clients..."
            className="w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#16191F] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#BFC3CA]/45"
          />
        </div>

        <select
          aria-label="Filter by project progress"
          value={progressFilter}
          onChange={(e) => setProgressFilter(e.target.value)}
          className="rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#16191F] px-3.5 py-2.5 text-xs text-white"
        >
          <option value="All">All Progress Stages</option>
          {PROGRESS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-white">
            {accepted.length === 0 ? 'No Accepted Clients Yet' : 'No Matching Clients'}
          </p>
          <p className="mt-2 text-sm text-[#BFC3CA]">
            {accepted.length === 0
              ? 'Applications approved from Client Applications will appear here for ongoing progress management.'
              : 'Adjust your search or progress filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((client) => (
            <div
              key={client.id}
              className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-6"
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#BFC3CA]">
                    <span className="font-mono font-semibold text-[#1769FF] tabular-nums">
                      {client.referenceNumber}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{client.serviceInterested}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{client.budgetRange}</span>
                    {client.decisionDate && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">
                          Accepted {new Date(client.decisionDate).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="mt-2 font-display text-xl font-semibold text-white">
                    {client.fullName}
                    {client.companyName ? ` — ${client.companyName}` : ''}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    aria-label={`Project progress for ${client.fullName}`}
                    disabled={busyId === client.id}
                    value={client.projectProgress}
                    onChange={(e) =>
                      void handleProgressChange(
                        client,
                        e.target.value as ProjectProgressStatus
                      )
                    }
                    className="rounded-lg border border-[rgba(191,195,202,0.24)] bg-[#101216] px-3 py-2 text-xs font-medium text-white"
                  >
                    {PROGRESS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => onViewApplication(client)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(191,195,202,0.22)] px-3.5 py-2 text-xs font-medium text-white hover:border-[#1769FF]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Full Application</span>
                  </button>
                </div>
              </div>

              {/* Private Notes Inline Editor */}
              <div className="mt-5 border-t border-[rgba(191,195,202,0.1)] pt-4">
                {editingNotesId === client.id ? (
                  <div className="space-y-3">
                    <textarea
                      rows={3}
                      value={draftNotes}
                      onChange={(e) => setDraftNotes(e.target.value)}
                      placeholder="Private project notes, milestones, or client deliverables..."
                      className="w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-xs text-white"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={busyId === client.id}
                        onClick={() => void handleSaveNotes(client)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-[#1769FF] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2F7BFF]"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Save Notes</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingNotesId(null)}
                        className="rounded-md border border-[rgba(191,195,202,0.2)] px-3 py-1.5 text-xs text-[#BFC3CA] hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs leading-relaxed text-[#BFC3CA]">
                      <strong className="text-white">Private Notes:</strong>{' '}
                      {client.internalNotes || 'No internal notes recorded yet.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNotesId(client.id);
                        setDraftNotes(client.internalNotes || '');
                      }}
                      className="shrink-0 text-xs font-medium text-[#1769FF] hover:underline"
                    >
                      Edit Notes
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
