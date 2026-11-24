import React, {useState} from 'react';
import {
  AlertCircle,
  Check,
  Clock,
  Download,
  Eye,
  Mail,
  Search,
  X,
  XCircle,
} from 'lucide-react';
import {ClientApplication, EmailConfigStatus} from '../types/studio';

interface AdminApplicationsProps {
  applications: ClientApplication[];
  emailConfig: EmailConfigStatus;
  mode: 'all' | 'rejected';
  selectedApp: ClientApplication | null;
  onSelectApp: (app: ClientApplication | null) => void;
  onRefresh: () => Promise<void>;
}

export function AdminApplications({
  applications,
  emailConfig,
  mode,
  selectedApp,
  onSelectApp,
  onRefresh,
}: AdminApplicationsProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'Accepted' | 'Rejected'>(
    mode === 'rejected' ? 'Rejected' : 'all'
  );

  // Decision form state inside detail modal
  const [internalNotes, setInternalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [notifyClient, setNotifyClient] = useState(false);
  const [savingDecision, setSavingDecision] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'success' | 'warning' | 'error'; text: string} | null>(
    null
  );

  const openModal = (app: ClientApplication) => {
    setInternalNotes(app.internalNotes || '');
    setRejectionReason(app.rejectionReason || '');
    setNotifyClient(false);
    setFeedback(null);
    onSelectApp(app);
  };

  const baseList =
    mode === 'rejected'
      ? applications.filter((a) => a.status === 'Rejected')
      : applications;

  const filtered = baseList.filter((app) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      app.fullName.toLowerCase().includes(q) ||
      app.companyName.toLowerCase().includes(q) ||
      app.referenceNumber.toLowerCase().includes(q) ||
      app.serviceInterested.toLowerCase().includes(q);

    if (mode === 'rejected') return matchesSearch;

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'pending'
          ? app.status === 'Submitted' || app.status === 'Under Review'
          : app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = applications.filter(
    (a) => a.status === 'Submitted' || a.status === 'Under Review'
  ).length;
  const acceptedCount = applications.filter((a) => a.status === 'Accepted').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;

  const submitDecision = async (
    decision: 'Accepted' | 'Rejected' | 'Under Review'
  ) => {
    if (!selectedApp) return;
    setSavingDecision(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}/decision`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          decision,
          internalNotes,
          rejectionReason,
          notifyClient: notifyClient && (decision === 'Accepted' || decision === 'Rejected'),
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        application?: ClientApplication;
        emailResult?: {sent: boolean; provider: string; error?: string} | null;
      };

      if (!res.ok || !data.ok || !data.application) {
        setFeedback({type: 'error', text: data.message || 'Unable to save decision.'});
        return;
      }

      onSelectApp(data.application);
      await onRefresh();

      if (notifyClient && data.emailResult && !data.emailResult.sent) {
        setFeedback({
          type: 'warning',
          text: `Status saved as ${decision}. Email notification was NOT sent: ${data.emailResult.error}`,
        });
      } else if (notifyClient && data.emailResult?.sent) {
        setFeedback({
          type: 'success',
          text: `Status saved as ${decision} and client notification sent via ${data.emailResult.provider}.`,
        });
      } else {
        setFeedback({
          type: 'success',
          text: `Application ${data.application.referenceNumber} updated to ${decision}.`,
        });
      }
    } catch {
      setFeedback({type: 'error', text: 'Network error updating application.'});
    } finally {
      setSavingDecision(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[rgba(191,195,202,0.12)] pb-6">
        <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
          {mode === 'rejected' ? 'Rejected Applications' : 'Client Applications'}
        </h1>
        <p className="mt-1.5 text-sm text-[#BFC3CA]">
          {mode === 'rejected'
            ? 'Archive of declined project applications and internal decision notes.'
            : 'Review incoming project briefs, inspect attachments, and record acceptance decisions.'}
        </p>

        {mode === 'all' && (
          <div className="mt-5 flex flex-wrap gap-2">
            {(
              [
                {id: 'all', label: 'All Applications', count: applications.length},
                {id: 'pending', label: 'Pending Review', count: pendingCount},
                {id: 'Accepted', label: 'Accepted', count: acceptedCount},
                {id: 'Rejected', label: 'Rejected', count: rejectedCount},
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-[#1769FF] text-white'
                    : 'border border-[rgba(191,195,202,0.18)] bg-[#16191F] text-[#BFC3CA] hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className="tabular-nums opacity-80">{tab.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#BFC3CA]/60"
          aria-hidden="true"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by reference, client, company, or service..."
          className="w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#16191F] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#BFC3CA]/45"
        />
      </div>

      {/* Applications Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-white">No Applications Found</p>
          <p className="mt-2 text-sm text-[#BFC3CA]">
            {mode === 'rejected'
              ? 'No applications have been marked as rejected.'
              : 'Submitted project applications from potential clients will appear here.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F]">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="border-b border-[rgba(191,195,202,0.12)] bg-[#101216] text-xs text-[#BFC3CA]">
              <tr>
                <th className="px-4 py-3.5 font-medium">Reference</th>
                <th className="px-4 py-3.5 font-medium">Client</th>
                <th className="px-4 py-3.5 font-medium">Company</th>
                <th className="px-4 py-3.5 font-medium">Service</th>
                <th className="px-4 py-3.5 font-medium">Budget</th>
                <th className="px-4 py-3.5 font-medium">Submitted</th>
                <th className="px-4 py-3.5 font-medium">Status</th>
                <th className="px-4 py-3.5 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(191,195,202,0.08)]">
              {filtered.map((app) => (
                <tr key={app.id} className="transition-colors hover:bg-[#1B1F27]/70">
                  <td className="px-4 py-3.5 font-mono text-xs font-medium text-white tabular-nums">
                    {app.referenceNumber}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-white">{app.fullName}</td>
                  <td className="px-4 py-3.5 text-[#BFC3CA]">{app.companyName || '—'}</td>
                  <td className="px-4 py-3.5 text-[#BFC3CA]">{app.serviceInterested}</td>
                  <td className="px-4 py-3.5 text-xs text-[#BFC3CA] tabular-nums">
                    {app.budgetRange}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[#BFC3CA] tabular-nums">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-xs font-semibold ${
                        app.status === 'Accepted'
                          ? 'text-emerald-400'
                          : app.status === 'Rejected'
                            ? 'text-red-300'
                            : 'text-[#1769FF]'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => openModal(app)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[rgba(191,195,202,0.22)] px-3 py-1.5 text-xs font-medium text-white hover:border-[#1769FF]"
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Full Application Detail & Decision Modal */}
      {selectedApp && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Application details for ${selectedApp.fullName}`}
        >
          <div className="flex h-full w-full max-w-2xl flex-col border-l border-[rgba(191,195,202,0.18)] bg-[#101216] text-white">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[rgba(191,195,202,0.14)] px-6 py-5">
              <div>
                <p className="text-xs font-medium text-[#1769FF] tabular-nums">
                  {selectedApp.referenceNumber} · Status: {selectedApp.status}
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-white">
                  {selectedApp.fullName}
                </h2>
                <p className="text-xs text-[#BFC3CA]">
                  {selectedApp.companyName || 'Independent / Personal Brand'} · Submitted{' '}
                  {new Date(selectedApp.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectApp(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(191,195,202,0.2)] text-[#BFC3CA] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 text-sm">
              {feedback && (
                <div
                  role="alert"
                  className={`flex items-start gap-2.5 rounded-lg border p-3.5 text-xs ${
                    feedback.type === 'success'
                      ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
                      : feedback.type === 'warning'
                        ? 'border-amber-500/40 bg-amber-950/30 text-amber-200'
                        : 'border-red-500/40 bg-red-950/30 text-red-200'
                  }`}
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{feedback.text}</span>
                </div>
              )}

              {/* Client & Business Info */}
              <div className="grid gap-4 rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-[#BFC3CA]/70">Email Address</p>
                  <p className="mt-1 font-medium text-white">{selectedApp.email}</p>
                </div>
                <div>
                  <p className="text-xs text-[#BFC3CA]/70">Phone / WhatsApp</p>
                  <p className="mt-1 text-white tabular-nums">
                    {[selectedApp.phone, selectedApp.whatsapp].filter(Boolean).join(' · ') || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#BFC3CA]/70">Company / Brand</p>
                  <p className="mt-1 text-white">{selectedApp.companyName || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#BFC3CA]/70">Website / Social</p>
                  <p className="mt-1 break-all text-white">
                    {selectedApp.websiteOrSocial || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Scope, Budget, Timeline */}
              <div className="grid gap-4 rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-[#BFC3CA]/70">Requested Service</p>
                  <p className="mt-1 font-semibold text-[#1769FF]">
                    {selectedApp.serviceInterested}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#BFC3CA]/70">Project Budget</p>
                  <p className="mt-1 font-medium text-white tabular-nums">
                    {selectedApp.budgetRange}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#BFC3CA]/70">Target Timeline</p>
                  <p className="mt-1 text-white">{selectedApp.timeline}</p>
                </div>
              </div>

              {/* Detailed Brief */}
              <div className="space-y-4 rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-5">
                {selectedApp.businessAbout && (
                  <div>
                    <p className="text-xs font-medium text-[#BFC3CA]/75">About Business</p>
                    <p className="mt-1 leading-relaxed text-white">{selectedApp.businessAbout}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-[#BFC3CA]/75">Project Description</p>
                  <p className="mt-1 whitespace-pre-line leading-relaxed text-white">
                    {selectedApp.projectDescription}
                  </p>
                </div>
                {selectedApp.problemToSolve && (
                  <div>
                    <p className="text-xs font-medium text-[#BFC3CA]/75">Problem to Solve</p>
                    <p className="mt-1 leading-relaxed text-[#BFC3CA]">
                      {selectedApp.problemToSolve}
                    </p>
                  </div>
                )}
                {selectedApp.expectations && (
                  <div>
                    <p className="text-xs font-medium text-[#BFC3CA]/75">Client Expectations</p>
                    <p className="mt-1 leading-relaxed text-[#BFC3CA]">
                      {selectedApp.expectations}
                    </p>
                  </div>
                )}
                {selectedApp.additionalDetails && (
                  <div>
                    <p className="text-xs font-medium text-[#BFC3CA]/75">Additional Details</p>
                    <p className="mt-1 leading-relaxed text-[#BFC3CA]">
                      {selectedApp.additionalDetails}
                    </p>
                  </div>
                )}
              </div>

              {/* Attachments */}
              {selectedApp.attachments.length > 0 && (
                <div className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-5">
                  <p className="text-xs font-medium text-[#BFC3CA]/75">Uploaded Attachments</p>
                  <div className="mt-3 space-y-2">
                    {selectedApp.attachments.map((att, idx) => (
                      <a
                        key={`${att.url}-${idx}`}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-lg border border-[rgba(191,195,202,0.16)] bg-[#101216] px-4 py-2.5 text-xs text-white hover:border-[#1769FF]"
                      >
                        <span className="truncate">{att.name}</span>
                        <Download className="h-3.5 w-3.5 shrink-0 text-[#1769FF]" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Administrator Notes & Decision Controls */}
              <div className="space-y-4 rounded-xl border border-[rgba(191,195,202,0.18)] bg-[#16191F] p-5">
                <h3 className="font-display text-base font-semibold text-white">
                  Administrator Decision &amp; Notes
                </h3>

                <div>
                  <label className="block text-xs font-medium text-[#BFC3CA]">
                    Internal Notes (never visible to client)
                  </label>
                  <textarea
                    rows={3}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Record strategic notes, call takeaways, or scope remarks..."
                    className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#BFC3CA]">
                    Internal Rejection Reason (only if rejecting; never shown publicly)
                  </label>
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g., Timeline mismatch, out of studio scope..."
                    className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="rounded-lg border border-[rgba(191,195,202,0.14)] bg-[#101216] p-3.5">
                  <label className="flex cursor-pointer items-start gap-2.5 text-xs text-white">
                    <input
                      type="checkbox"
                      checked={notifyClient}
                      onChange={(e) => setNotifyClient(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded accent-[#1769FF]"
                    />
                    <span>
                      Attempt email notification on Accept / Reject{' '}
                      <span className="block mt-0.5 text-[11px] text-[#BFC3CA]/75">
                        {emailConfig.configured
                          ? `Connected: ${emailConfig.details}`
                          : 'No email service configured (set RESEND_API_KEY or ENQUIRY_WEBHOOK_URL). Status will still save without simulating an email.'}
                      </span>
                    </span>
                  </label>

                  {!emailConfig.configured && (
                    <a
                      href={`mailto:${selectedApp.email}?subject=${encodeURIComponent(
                        `SOLMONIX STUDIO — Application ${selectedApp.referenceNumber}`
                      )}`}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#1769FF] hover:underline"
                    >
                      <Mail className="h-3 w-3" />
                      <span>Open Manual Email Draft to Client</span>
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-2.5 pt-2">
                  <button
                    type="button"
                    disabled={savingDecision}
                    onClick={() => void submitDecision('Accepted')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-60"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Accept Application</span>
                  </button>

                  <button
                    type="button"
                    disabled={savingDecision}
                    onClick={() => void submitDecision('Rejected')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-60"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Reject Application</span>
                  </button>

                  <button
                    type="button"
                    disabled={savingDecision}
                    onClick={() => void submitDecision('Under Review')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(191,195,202,0.24)] px-4 py-2.5 text-xs font-medium text-[#BFC3CA] hover:border-white hover:text-white disabled:opacity-60"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>Keep Pending / Under Review</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
