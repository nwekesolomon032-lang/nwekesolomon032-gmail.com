import React, {useState} from 'react';
import {AlertCircle, ArrowRight, CheckCircle2, Clock, Search, XCircle} from 'lucide-react';
import {useStudio} from '../context/StudioContext';

interface TrackedResult {
  referenceNumber: string;
  fullName: string;
  companyName: string;
  serviceInterested: string;
  budgetRange: string;
  timeline: string;
  status: 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected';
  projectProgress: string | null;
  decisionDate: string | null;
  submittedAt: string;
  updatedAt: string;
}

export function TrackApplicationPage() {
  const {navigate} = useStudio();
  const [referenceNumber, setReferenceNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TrackedResult | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!referenceNumber.trim() || !email.trim()) {
      setError('Please enter both your application reference number and email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/applications/track', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          referenceNumber: referenceNumber.trim(),
          email: email.trim(),
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        application?: TrackedResult;
      };
      if (!response.ok || !data.ok || !data.application) {
        setError(data.message || 'Unable to locate an application matching those credentials.');
        return;
      }
      setResult(data.application);
    } catch {
      setError('Network error checking application status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="border-b border-[rgba(191,195,202,0.12)] bg-[#101216]">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] uppercase">
            Application Tracker
          </p>
          <h1
            className="mt-4 font-display font-semibold tracking-tight text-white [text-wrap:balance]"
            style={{fontSize: 'clamp(2.1rem, 3.8vw, 3.4rem)', lineHeight: 1.08}}
          >
            Track Your Project Application
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#BFC3CA]">
            Enter the unique reference number provided upon submission together with your verified
            email address to check your current review status.
          </p>
        </div>
      </section>

      <section className="bg-[#12151A]">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="rounded-2xl border border-[rgba(191,195,202,0.16)] bg-[#101216] p-6 sm:p-10">
            <form onSubmit={handleTrack} className="grid gap-5 sm:grid-cols-12 sm:items-end">
              <div className="sm:col-span-4">
                <label htmlFor="track-ref" className="block text-xs font-medium text-[#BFC3CA]">
                  Reference Number
                </label>
                <input
                  id="track-ref"
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="SMX-XXXXXX"
                  className="mt-2 w-full rounded-lg border border-[rgba(191,195,202,0.22)] bg-[#16191F] px-4 py-3 text-sm uppercase text-white placeholder:normal-case placeholder:text-[#BFC3CA]/40"
                />
              </div>

              <div className="sm:col-span-5">
                <label htmlFor="track-email" className="block text-xs font-medium text-[#BFC3CA]">
                  Verified Email Address
                </label>
                <input
                  id="track-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="mt-2 w-full rounded-lg border border-[rgba(191,195,202,0.22)] bg-[#16191F] px-4 py-3 text-sm text-white placeholder:text-[#BFC3CA]/40"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-[#1769FF] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2F7BFF] disabled:opacity-60"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  <span>{loading ? 'Checking...' : 'Check Status'}</span>
                </button>
              </div>
            </form>

            {error && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-2.5 rounded-lg border border-red-400/40 bg-red-950/30 p-4 text-sm text-red-200"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {result && (
              <div className="mt-8 rounded-xl border border-[rgba(191,195,202,0.16)] bg-[#16191F] p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[rgba(191,195,202,0.12)] pb-5">
                  <div>
                    <p className="text-xs text-[#BFC3CA]/75">Application Reference</p>
                    <p className="mt-1 font-display text-xl font-semibold text-white tabular-nums">
                      {result.referenceNumber}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {result.status === 'Accepted' && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                    )}
                    {result.status === 'Rejected' && (
                      <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                    )}
                    {(result.status === 'Submitted' || result.status === 'Under Review') && (
                      <Clock className="h-5 w-5 text-[#1769FF]" aria-hidden="true" />
                    )}
                    <span
                      className={`text-sm font-semibold ${
                        result.status === 'Accepted'
                          ? 'text-emerald-400'
                          : result.status === 'Rejected'
                            ? 'text-red-300'
                            : 'text-[#1769FF]'
                      }`}
                    >
                      Status: {result.status}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-[#BFC3CA]/70">Applicant</p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {result.fullName}
                      {result.companyName ? ` · ${result.companyName}` : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#BFC3CA]/70">Requested Service</p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {result.serviceInterested}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#BFC3CA]/70">Submitted On</p>
                    <p className="mt-1 text-sm text-[#BFC3CA] tabular-nums">
                      {new Date(result.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#BFC3CA]/70">Last Updated</p>
                    <p className="mt-1 text-sm text-[#BFC3CA] tabular-nums">
                      {new Date(result.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {result.status === 'Accepted' && result.projectProgress && (
                  <div className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-4">
                    <p className="text-xs font-medium text-emerald-300">Active Project Progress</p>
                    <p className="mt-1 font-display text-base font-semibold text-white">
                      {result.projectProgress}
                    </p>
                  </div>
                )}

                {result.status === 'Rejected' && (
                  <p className="mt-6 text-sm text-[#BFC3CA]">
                    Thank you for applying to SOLMONIX STUDIO. We are unable to move forward with
                    this commission at this time.
                  </p>
                )}
              </div>
            )}

            <div className="mt-8 border-t border-[rgba(191,195,202,0.12)] pt-6 text-xs text-[#BFC3CA]/75">
              Haven&apos;t applied yet?{' '}
              <button
                type="button"
                onClick={() => navigate('/start-a-project')}
                className="inline-flex items-center gap-1 font-semibold text-[#1769FF] hover:underline"
              >
                <span>Start a Project Application</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
