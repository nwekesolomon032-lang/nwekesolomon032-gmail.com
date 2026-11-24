import React, {useEffect, useState} from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Paperclip,
  Trash2,
  Upload,
} from 'lucide-react';
import {useStudio} from '../context/StudioContext';
import {APPLICATION_SERVICES, TIMELINE_OPTIONS} from '../data/studioData';
import {ApplicationAttachment} from '../types/studio';
import {uploadBinaryFile} from '../utils/uploadFile';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ApplicationFormState {
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  companyName: string;
  websiteOrSocial: string;
  serviceInterested: string;
  businessAbout: string;
  projectDescription: string;
  problemToSolve: string;
  expectations: string;
  budgetRange: string;
  timeline: string;
  additionalDetails: string;
  attachments: ApplicationAttachment[];
}

const STEPS = [
  {id: 1, title: 'Personal Info'},
  {id: 2, title: 'Project Scope'},
  {id: 3, title: 'Budget'},
  {id: 4, title: 'Timeline'},
  {id: 5, title: 'Additional & Files'},
  {id: 6, title: 'Review & Submit'},
];

export function StartProjectPage() {
  const {preselectedService, settings, navigate} = useStudio();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<ApplicationFormState>({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    companyName: '',
    websiteOrSocial: '',
    serviceInterested: preselectedService || '',
    businessAbout: '',
    projectDescription: '',
    problemToSolve: '',
    expectations: '',
    budgetRange: '',
    timeline: '',
    additionalDetails: '',
    attachments: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedService) {
      const match = APPLICATION_SERVICES.find(
        (s) => s.toLowerCase() === preselectedService.toLowerCase()
      );
      setForm((prev) => ({
        ...prev,
        serviceInterested: match || preselectedService,
      }));
    }
  }, [preselectedService]);

  const validateStep = (targetStep: number): boolean => {
    const next: Record<string, string> = {};
    if (targetStep === 1) {
      if (form.fullName.trim().length < 2) {
        next.fullName = 'Please enter your full name.';
      }
      if (!EMAIL_PATTERN.test(form.email.trim())) {
        next.email = 'Please enter a valid email address.';
      }
    } else if (targetStep === 2) {
      if (!form.serviceInterested) {
        next.serviceInterested = 'Please select the service you are interested in.';
      }
      if (form.projectDescription.trim().length < 15) {
        next.projectDescription =
          'Please describe your project in at least 15 characters.';
      }
    } else if (targetStep === 3) {
      if (!form.budgetRange) {
        next.budgetRange = 'Please select an estimated project budget.';
      }
    } else if (targetStep === 4) {
      if (!form.timeline) {
        next.timeline = 'Please select when you would like the project to begin.';
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(6, s + 1));
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError('');

    const file = files[0];
    if (file.size > 8 * 1024 * 1024) {
      setUploadError('File exceeds the 8MB maximum size limit.');
      return;
    }

    try {
      setUploadProgress(0);
      const uploaded = await uploadBinaryFile('/api/applications/upload', file, (pct) => {
        setUploadProgress(pct);
      });
      setForm((prev) => ({
        ...prev,
        attachments: [
          ...prev.attachments,
          {
            name: uploaded.name,
            url: uploaded.url,
            size: uploaded.size,
            mimeType: uploaded.mimeType,
          },
        ],
      }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Unable to upload file.');
    } finally {
      setUploadProgress(null);
    }
  };

  const handleSubmit = async () => {
    setSubmitError('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        referenceNumber?: string;
        message?: string;
      };
      if (!response.ok || !data.ok || !data.referenceNumber) {
        setSubmitError(
          data.message || 'Unable to submit application. Please verify all required fields.'
        );
        return;
      }
      setSubmittedRef(data.referenceNumber);
      window.scrollTo({top: 0, behavior: 'smooth'});
    } catch {
      setSubmitError('Network error submitting application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedRef) {
    return (
      <main className="bg-[#101216]">
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="rounded-2xl border border-[rgba(191,195,202,0.18)] bg-[#16191F] p-8 sm:p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1769FF]/15 text-[#1769FF]">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </div>

            <h1 className="mt-6 font-display text-3xl font-semibold text-white sm:text-4xl">
              Application Received!
            </h1>

            <p className="mt-4 text-base leading-relaxed text-[#BFC3CA]">
              Thank you for considering SOLMONIX STUDIO. Your project application has been
              successfully submitted. Our team will review your information and get back to you
              regarding the next steps.
            </p>

            <div className="mt-8 rounded-xl border border-[rgba(191,195,202,0.16)] bg-[#101216] p-6">
              <p className="text-xs font-medium text-[#BFC3CA]/75">
                Unique Application Reference Number
              </p>
              <p className="mt-2 font-display text-2xl font-semibold tracking-wider text-white tabular-nums">
                {submittedRef}
              </p>
              <p className="mt-2 text-xs text-[#BFC3CA]">
                Save this reference number together with <strong className="text-white">{form.email}</strong> to
                check your review status anytime.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/track')}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1769FF] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2F7BFF]"
              >
                <span>Track Application Status</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 rounded-lg border border-[rgba(191,195,202,0.24)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white"
              >
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-[rgba(191,195,202,0.12)] bg-[#101216]">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] uppercase">
            Start a Project
          </p>
          <h1
            className="mt-4 font-display font-semibold tracking-tight text-white [text-wrap:balance]"
            style={{fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', lineHeight: 1.08}}
          >
            Have a Vision? Let&apos;s Bring It to Life.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#BFC3CA] sm:text-lg">
            We work with ambitious businesses and brands looking to create meaningful visual
            identities and exceptional digital experiences. Tell us about your project, and
            let&apos;s explore what we can build together.
          </p>

          {/* Progress Stepper */}
          <nav aria-label="Application steps" className="mt-10">
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {STEPS.map((s) => {
                const isCurrent = s.id === step;
                const isDone = s.id < step;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (s.id < step) {
                          setErrors({});
                          setStep(s.id);
                        }
                      }}
                      disabled={s.id > step}
                      className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                        isCurrent
                          ? 'border-[#1769FF] bg-[#1769FF]/15 text-white'
                          : isDone
                            ? 'border-[rgba(191,195,202,0.22)] bg-[#16191F] text-white hover:border-[#1769FF]'
                            : 'border-[rgba(191,195,202,0.1)] bg-[#101216] text-[#BFC3CA]/55 cursor-not-allowed'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] tabular-nums ${
                          isCurrent
                            ? 'bg-[#1769FF] text-white'
                            : isDone
                              ? 'bg-white text-[#101216]'
                              : 'bg-[#1B1F27] text-[#BFC3CA]/70'
                        }`}
                      >
                        {isDone ? <Check className="h-3 w-3" /> : s.id}
                      </span>
                      <span className="truncate">{s.title}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </section>

      {/* Multi-Step Form Body */}
      <section className="bg-[#12151A]">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="rounded-2xl border border-[rgba(191,195,202,0.16)] bg-[#101216] p-6 sm:p-10">
            {/* STEP 1: PERSONAL INFORMATION */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-[#1769FF] tabular-nums">Section 01</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-white">
                    Personal Information
                  </h2>
                  <p className="mt-1.5 text-sm text-[#BFC3CA]">
                    Tell us who we will be collaborating with.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="app-name" className="block text-xs font-medium text-[#BFC3CA]">
                      Full Name *
                    </label>
                    <input
                      id="app-name"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => {
                        setForm((p) => ({...p, fullName: e.target.value}));
                        if (errors.fullName) setErrors((p) => ({...p, fullName: ''}));
                      }}
                      placeholder="Your full name"
                      className="mt-2 w-full rounded-lg border border-[rgba(191,195,202,0.22)] bg-[#16191F] px-4 py-3 text-sm text-white placeholder:text-[#BFC3CA]/40"
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-300">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="app-email" className="block text-xs font-medium text-[#BFC3CA]">
                      Email Address *
                    </label>
                    <input
                      id="app-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => {
                        setForm((p) => ({...p, email: e.target.value}));
                        if (errors.email) setErrors((p) => ({...p, email: ''}));
                      }}
                      placeholder="name@company.com"
                      className="mt-2 w-full rounded-lg border border-[rgba(191,195,202,0.22)] bg-[#16191F] px-4 py-3 text-sm text-white placeholder:text-[#BFC3CA]/40"
                    />
                    {errors.email && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-300">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="app-phone" className="block text-xs font-medium text-[#BFC3CA]">
                      Phone Number
                    </label>
                    <input
                      id="app-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({...p, phone: e.target.value}))}
                      placeholder="+1 555 000 0000"
                      className="mt-2 w-full rounded-lg border border-[rgba(191,195,202,0.22)] bg-[#16191F] px-4 py-3 text-sm text-white placeholder:text-[#BFC3CA]/40"
                    />
                  </div>

                  <div>
                    <label htmlFor="app-whatsapp" className="block text-xs font-medium text-[#BFC3CA]">
                      WhatsApp Number
                    </label>
                    <input
                      id="app-whatsapp"
                      type="tel"
                      value={form.whatsapp}
                      onChange={(e) => setForm((p) => ({...p, whatsapp: e.target.value}))}
                      placeholder="If different from phone"
                      className="mt-2 w-full rounded-lg border border-[rgba(191,195,202,0.22)] bg-[#16191F] px-4 py-3 text-sm text-white placeholder:text-[#BFC3CA]/40"
                    />
                  </div>

                  <div>
                    <label htmlFor="app-company" className="block text-xs font-medium text-[#BFC3CA]">
                      Company or Brand Name
                    </label>
                    <input
                      id="app-company"
                      type="text"
                      value={form.companyName}
                      onChange={(e) => setForm((p) => ({...p, companyName: e.target.value}))}
                      placeholder="Your business or brand"
                      className="mt-2 w-full rounded-lg border border-[rgba(191,195,202,0.22)] bg-[#16191F] px-4 py-3 text-sm text-white placeholder:text-[#BFC3CA]/40"
                    />
                  </div>

                  <div>
                    <label htmlFor="app-website" className="block text-xs font-medium text-[#BFC3CA]">
                      Website or Social Media Link
                    </label>
                    <input
                      id="app-website"
                      type="text"
                      value={form.websiteOrSocial}
                      onChange={(e) => setForm((p) => ({...p, websiteOrSocial: e.target.value}))}
                      placeholder="https://yourbrand.com or @handle"
                      className="mt-2 w-full rounded-lg border border-[rgba(191,195,202,0.22)] bg-[#16191F] px-4 py-3 text-sm text-white placeholder:text-[#BFC3CA]/40"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PROJECT INFORMATION */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-[#1769FF] tabular-nums">Section 02</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-white">
                    Project Information
                  </h2>
                  <p className="mt-1.5 text-sm text-[#BFC3CA]">
                    Help us understand your business, scope, and desired outcomes.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#BFC3CA]">
                    What service are you interested in? *
                  </label>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {APPLICATION_SERVICES.map((svc) => {
                      const active = form.serviceInterested === svc;
                      return (
                        <button
                          key={svc}
                          type="button"
                          onClick={() => {
                            setForm((p) => ({...p, serviceInterested: svc}));
                            if (errors.serviceInterested) {
                              setErrors((p) => ({...p, serviceInterested: ''}));
                            }
                          }}
                          className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                            active
                              ? 'border-[#1769FF] bg-[#1769FF]/15 text-white'
                              : 'border-[rgba(191,195,202,0.18)] bg-[#16191F] text-[#BFC3CA] hover:border-[rgba(191,195,202,0.38)] hover:text-white'
                          }`}
                        >
                          <span>{svc}</span>
                          {active && <Check className="h-4 w-4 text-[#1769FF]" />}
                        </button>
                      );
                    })}
                  </div>
                  {errors.serviceInterested && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-red-300">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{errors.serviceInterested}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="app-business" className="block text-xs font-medium text-[#BFC3CA]">
                    Tell us about your business or brand
                  </label>
                  <textarea
                    id="app-business"
                    rows={3}
                    value={form.businessAbout}
                    onChange={(e) => setForm((p) => ({...p, businessAbout: e.target.value}))}
                    placeholder="What does your company do, who do you serve, and what sets you apart?"
                    className="mt-2 w-full rounded-lg border border-[rgba(191,195,202,0.22)] bg-[#16191F] px-4 py-3 text-sm text-white placeholder:text-[#BFC3CA]/40"
                  />
                </div>

                <div>
                  <label htmlFor="app-desc" className="block text-xs font-medium text-[#BFC3CA]">
                    Describe the project you want us to work on *
                  </label>
                  <textarea
                    id="app-desc"
                    rows={4}
                    value={form.projectDescription}
                    onChange={(e) => {
                      setForm((p) => ({...p, projectDescription: e.target.value}));
                      if (errors.projectDescription) {
                        setErrors((p) => ({...p, projectDescription: ''}));
                      }
                    }}
                    placeholder="Outline the scope, key deliverables, pages, or visual assets you have in mind."
                    className="mt-2 w-full rounded-lg border border-[rgba(191,195,202,0.22)] bg-[#16191F] px-4 py-3 text-sm text-white placeholder:text-[#BFC3CA]/40"
                  />
                  {errors.projectDescription && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-300">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{errors.projectDescription}</span>
                    </p>
                  )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="app-problem" className="block text-xs font-medium text-[#BFC3CA]">
                      What problem are you trying to solve?
                    </label>
                    <textarea
                      id="app-problem"
                      rows={3}
                      value={form.problemToSolve}
                      onChange={(e) => setForm((p) => ({...p, problemToSolve: e.target.value}))}
                      placeholder="e.g., Outdated brand image, low website conversion..."
                      className="mt-2 w-full rounded-lg border border-[rgba(191,195,202,0.22)] bg-[#16191F] px-4 py-3 text-sm text-white placeholder:text-[#BFC3CA]/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="app-expect" className="block text-xs font-medium text-[#BFC3CA]">
                      What are your expectations?
                    </label>
                    <textarea
                      id="app-expect"
                      rows={3}
                      value={form.expectations}
                      onChange={(e) => setForm((p) => ({...p, expectations: e.target.value}))}
                      placeholder="What does a successful outcome look like for you?"
                      className="mt-2 w-full rounded-lg border border-[rgba(191,195,202,0.22)] bg-[#16191F] px-4 py-3 text-sm text-white placeholder:text-[#BFC3CA]/40"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PROJECT BUDGET */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-[#1769FF] tabular-nums">Section 03</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-white">
                    Estimated Project Budget
                  </h2>
                  <p className="mt-1.5 text-sm text-[#BFC3CA]">
                    Select the investment range allocated for this engagement.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {settings.budgetRanges.map((range) => {
                    const active = form.budgetRange === range;
                    return (
                      <button
                        key={range}
                        type="button"
                        onClick={() => {
                          setForm((p) => ({...p, budgetRange: range}));
                          if (errors.budgetRange) setErrors((p) => ({...p, budgetRange: ''}));
                        }}
                        className={`flex items-center justify-between rounded-xl border px-5 py-4 text-left text-sm font-medium transition-colors tabular-nums ${
                          active
                            ? 'border-[#1769FF] bg-[#1769FF]/15 text-white'
                            : 'border-[rgba(191,195,202,0.18)] bg-[#16191F] text-[#BFC3CA] hover:border-[rgba(191,195,202,0.38)] hover:text-white'
                        }`}
                      >
                        <span>{range}</span>
                        {active && <Check className="h-4 w-4 text-[#1769FF]" />}
                      </button>
                    );
                  })}
                </div>
                {errors.budgetRange && (
                  <p className="flex items-center gap-1.5 text-xs text-red-300">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{errors.budgetRange}</span>
                  </p>
                )}
              </div>
            )}

            {/* STEP 4: TIMELINE */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-[#1769FF] tabular-nums">Section 04</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-white">
                    Target Timeline
                  </h2>
                  <p className="mt-1.5 text-sm text-[#BFC3CA]">
                    When would you like SOLMONIX STUDIO to begin?
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {TIMELINE_OPTIONS.map((option) => {
                    const active = form.timeline === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setForm((p) => ({...p, timeline: option}));
                          if (errors.timeline) setErrors((p) => ({...p, timeline: ''}));
                        }}
                        className={`flex items-center justify-between rounded-xl border px-5 py-4 text-left text-sm font-medium transition-colors ${
                          active
                            ? 'border-[#1769FF] bg-[#1769FF]/15 text-white'
                            : 'border-[rgba(191,195,202,0.18)] bg-[#16191F] text-[#BFC3CA] hover:border-[rgba(191,195,202,0.38)] hover:text-white'
                        }`}
                      >
                        <span>{option}</span>
                        {active && <Check className="h-4 w-4 text-[#1769FF]" />}
                      </button>
                    );
                  })}
                </div>
                {errors.timeline && (
                  <p className="flex items-center gap-1.5 text-xs text-red-300">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{errors.timeline}</span>
                  </p>
                )}
              </div>
            )}

            {/* STEP 5: ADDITIONAL INFORMATION & ATTACHMENTS */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-[#1769FF] tabular-nums">Section 05</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-white">
                    Additional Information &amp; References
                  </h2>
                  <p className="mt-1.5 text-sm text-[#BFC3CA]">
                    Share any extra context, inspiration links, or attach a creative brief (optional).
                  </p>
                </div>

                <div>
                  <label htmlFor="app-extra" className="block text-xs font-medium text-[#BFC3CA]">
                    Additional Details
                  </label>
                  <textarea
                    id="app-extra"
                    rows={4}
                    value={form.additionalDetails}
                    onChange={(e) => setForm((p) => ({...p, additionalDetails: e.target.value}))}
                    placeholder="Reference brands, launch deadlines, internal stakeholders, or specific technical requirements."
                    className="mt-2 w-full rounded-lg border border-[rgba(191,195,202,0.22)] bg-[#16191F] px-4 py-3 text-sm text-white placeholder:text-[#BFC3CA]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#BFC3CA]">
                    Reference Files (PDF, Images, DOCX, ZIP — max 8MB each)
                  </label>
                  <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[rgba(191,195,202,0.28)] bg-[#16191F] px-6 py-8 text-center transition-colors hover:border-[#1769FF]">
                    <Upload className="h-6 w-6 text-[#1769FF]" aria-hidden="true" />
                    <span className="mt-3 text-sm font-medium text-white">
                      Click to upload a reference document or visual
                    </span>
                    <span className="mt-1 text-xs text-[#BFC3CA]/75">
                      Files are stored securely for SOLMONIX STUDIO review only
                    </span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.txt,.zip"
                      onChange={(e) => {
                        void handleFileUpload(e.target.files);
                        e.target.value = '';
                      }}
                    />
                  </label>

                  {uploadProgress !== null && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-[#BFC3CA] tabular-nums">
                        <span>Uploading attachment...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#16191F]">
                        <div
                          className="h-full bg-[#1769FF] transition-all duration-150"
                          style={{width: `${uploadProgress}%`}}
                        />
                      </div>
                    </div>
                  )}

                  {uploadError && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-red-300">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{uploadError}</span>
                    </p>
                  )}

                  {form.attachments.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {form.attachments.map((att, idx) => (
                        <li
                          key={`${att.url}-${idx}`}
                          className="flex items-center justify-between rounded-lg border border-[rgba(191,195,202,0.16)] bg-[#16191F] px-4 py-2.5 text-xs text-white"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Paperclip className="h-3.5 w-3.5 shrink-0 text-[#1769FF]" />
                            <span className="truncate">{att.name}</span>
                            <span className="text-[#BFC3CA]/65 tabular-nums">
                              ({Math.max(1, Math.round(att.size / 1024))} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setForm((p) => ({
                                ...p,
                                attachments: p.attachments.filter((_, i) => i !== idx),
                              }))
                            }
                            aria-label={`Remove ${att.name}`}
                            className="ml-3 text-[#BFC3CA] hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* STEP 6: REVIEW SUMMARY */}
            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-[#1769FF] tabular-nums">Final Review</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-white">
                    Review Your Project Application
                  </h2>
                  <p className="mt-1.5 text-sm text-[#BFC3CA]">
                    Please verify your details below before submitting to SOLMONIX STUDIO.
                  </p>
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-lg border border-red-400/40 bg-red-950/30 p-4 text-sm text-red-200"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="divide-y divide-[rgba(191,195,202,0.12)] rounded-xl border border-[rgba(191,195,202,0.16)] bg-[#16191F] px-6">
                  <div className="grid gap-4 py-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-[#BFC3CA]/70">Full Name</p>
                      <p className="mt-1 text-sm font-medium text-white">{form.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#BFC3CA]/70">Email Address</p>
                      <p className="mt-1 text-sm font-medium text-white">{form.email}</p>
                    </div>
                    {form.companyName && (
                      <div>
                        <p className="text-xs text-[#BFC3CA]/70">Company / Brand</p>
                        <p className="mt-1 text-sm font-medium text-white">{form.companyName}</p>
                      </div>
                    )}
                    {(form.phone || form.whatsapp) && (
                      <div>
                        <p className="text-xs text-[#BFC3CA]/70">Phone / WhatsApp</p>
                        <p className="mt-1 text-sm font-medium text-white">
                          {[form.phone, form.whatsapp].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 py-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-[#BFC3CA]/70">Service Interested In</p>
                      <p className="mt-1 text-sm font-semibold text-[#1769FF]">
                        {form.serviceInterested}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#BFC3CA]/70">Estimated Budget</p>
                      <p className="mt-1 text-sm font-medium text-white tabular-nums">
                        {form.budgetRange}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#BFC3CA]/70">Target Start Timeline</p>
                      <p className="mt-1 text-sm font-medium text-white">{form.timeline}</p>
                    </div>
                  </div>

                  <div className="space-y-4 py-5">
                    <div>
                      <p className="text-xs text-[#BFC3CA]/70">Project Description</p>
                      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-white">
                        {form.projectDescription}
                      </p>
                    </div>
                    {form.businessAbout && (
                      <div>
                        <p className="text-xs text-[#BFC3CA]/70">About Business</p>
                        <p className="mt-1 text-sm text-[#BFC3CA]">{form.businessAbout}</p>
                      </div>
                    )}
                    {form.attachments.length > 0 && (
                      <div>
                        <p className="text-xs text-[#BFC3CA]/70">Attachments</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {form.attachments.map((a, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 text-xs text-white"
                            >
                              <FileText className="h-3.5 w-3.5 text-[#1769FF]" />
                              {a.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step Navigation Footer */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(191,195,202,0.14)] pt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[rgba(191,195,202,0.24)] px-5 py-2.5 text-sm font-medium text-[#BFC3CA] transition-colors hover:border-white hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Previous Step</span>
                </button>
              ) : (
                <div />
              )}

              {step < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#1769FF] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2F7BFF]"
                >
                  <span>{step === 5 ? 'Review Application' : 'Continue'}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => void handleSubmit()}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-lg bg-[#1769FF] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2F7BFF] disabled:opacity-60"
                >
                  <span>{submitting ? 'Submitting Application...' : 'Submit Project Application'}</span>
                  <Check className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
