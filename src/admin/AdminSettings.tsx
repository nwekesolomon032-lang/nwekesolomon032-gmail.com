import React, {useState} from 'react';
import {AlertCircle, Check, Plus, Trash2, Upload} from 'lucide-react';
import {EmailConfigStatus, StudioSettings, TestimonialItem} from '../types/studio';
import {uploadBinaryFile} from '../utils/uploadFile';

interface AdminSettingsProps {
  initialSettings: StudioSettings;
  emailConfig: EmailConfigStatus;
  onSaved: () => Promise<void>;
}

export function AdminSettings({
  initialSettings,
  emailConfig,
  onSaved,
}: AdminSettingsProps) {
  const [settings, setSettings] = useState<StudioSettings>(initialSettings);
  const [newBudget, setNewBudget] = useState('');

  // New Testimonial
  const [tQuote, setTQuote] = useState('');
  const [tName, setTName] = useState('');
  const [tRole, setTRole] = useState('');
  const [tCat, setTCat] = useState('Brand Identity Design');

  // Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwFeedback, setPwFeedback] = useState<{type: 'ok' | 'err'; msg: string} | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaveMessage('Studio settings saved and applied to public site.');
        await onSaved();
      } else {
        setSaveMessage('Failed to save settings.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleFounderPhoto = async (file: File | undefined) => {
    if (!file) return;
    try {
      setUploadProgress(0);
      const res = await uploadBinaryFile('/api/admin/upload', file, (pct) => {
        setUploadProgress(pct);
      });
      setSettings((prev) => ({
        ...prev,
        founder: {...prev.founder, photoUrl: res.url},
      }));
    } finally {
      setUploadProgress(null);
    }
  };

  const handleAddTestimonial = () => {
    if (!tQuote.trim() || !tName.trim()) return;
    const item: TestimonialItem = {
      id: `test-${Date.now()}`,
      quote: tQuote.trim(),
      clientName: tName.trim(),
      roleAndCompany: tRole.trim(),
      projectCategory: tCat,
    };
    setSettings((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, item],
    }));
    setTQuote('');
    setTName('');
    setTRole('');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwFeedback(null);
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({currentPassword, newPassword}),
    });
    const data = (await res.json()) as {ok?: boolean; message?: string};
    if (!res.ok || !data.ok) {
      setPwFeedback({type: 'err', msg: data.message || 'Could not update password.'});
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setPwFeedback({type: 'ok', msg: data.message || 'Password updated.'});
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(191,195,202,0.12)] pb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Studio Settings
          </h1>
          <p className="mt-1 text-sm text-[#BFC3CA]">
            Configure editable budget ranges, studio contact channels, founder profile, verified
            testimonials, and security.
          </p>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={() => void handleSaveSettings()}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1769FF] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#2F7BFF] disabled:opacity-60"
        >
          <Check className="h-4 w-4" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {saveMessage && (
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-xs text-emerald-200">
          {saveMessage}
        </div>
      )}

      {/* 1. Editable Budget Ranges */}
      <section className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-6">
        <h2 className="font-display text-lg font-semibold text-white">
          01. Application Budget Ranges
        </h2>
        <p className="mt-1 text-xs text-[#BFC3CA]">
          These options dynamically populate Section 3 of the public Start a Project form.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {settings.budgetRanges.map((range, idx) => (
            <div
              key={`${range}-${idx}`}
              className="flex items-center gap-2 rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3 py-2 text-xs text-white tabular-nums"
            >
              <span>{range}</span>
              <button
                type="button"
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    budgetRanges: prev.budgetRanges.filter((_, i) => i !== idx),
                  }))
                }
                aria-label={`Remove ${range}`}
                className="text-[#BFC3CA] hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex max-w-md gap-2">
          <input
            type="text"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            placeholder="e.g., $10,000 – $20,000"
            className="flex-1 rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2 text-xs text-white"
          />
          <button
            type="button"
            onClick={() => {
              if (!newBudget.trim()) return;
              setSettings((prev) => ({
                ...prev,
                budgetRanges: [...prev.budgetRanges, newBudget.trim()],
              }));
              setNewBudget('');
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(191,195,202,0.25)] bg-[#101216] px-3.5 py-2 text-xs font-medium text-white hover:border-[#1769FF]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>
      </section>

      {/* 2. Contact Channels */}
      <section className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-6">
        <h2 className="font-display text-lg font-semibold text-white">
          02. Public Studio Contact &amp; Business Information
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">Business Email</label>
            <input
              type="email"
              value={settings.contact.email}
              onChange={(e) =>
                setSettings((p) => ({...p, contact: {...p.contact, email: e.target.value}}))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">
              Secondary / Admin Email
            </label>
            <input
              type="email"
              value={settings.contact.secondaryEmail || ''}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact: {...p.contact, secondaryEmail: e.target.value},
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">Phone Numbers</label>
            <input
              type="text"
              value={settings.contact.phone}
              onChange={(e) =>
                setSettings((p) => ({...p, contact: {...p.contact, phone: e.target.value}}))
              }
              placeholder="09161407826 / 09068653628"
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">
              WhatsApp Number (with country code)
            </label>
            <input
              type="text"
              value={settings.contact.whatsappNumber}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact: {...p.contact, whatsappNumber: e.target.value},
                }))
              }
              placeholder="+234 916 140 7826"
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">Working Hours</label>
            <input
              type="text"
              value={settings.contact.workingHours}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact: {...p.contact, workingHours: e.target.value},
                }))
              }
              placeholder="Always Open"
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">
              Preferred Contact Method
            </label>
            <input
              type="text"
              value={settings.contact.preferredContactMethod}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact: {...p.contact, preferredContactMethod: e.target.value},
                }))
              }
              placeholder="WhatsApp"
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">Location (Optional)</label>
            <input
              type="text"
              value={settings.contact.location}
              onChange={(e) =>
                setSettings((p) => ({...p, contact: {...p.contact, location: e.target.value}}))
              }
              placeholder="Leave blank if not displayed"
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">Brand Tagline</label>
            <input
              type="text"
              value={settings.contact.tagline}
              onChange={(e) =>
                setSettings((p) => ({...p, contact: {...p.contact, tagline: e.target.value}}))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">Instagram Handle</label>
            <input
              type="text"
              value={settings.contact.instagramHandle}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact: {...p.contact, instagramHandle: e.target.value},
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">Instagram URL</label>
            <input
              type="url"
              value={settings.contact.instagramUrl}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact: {...p.contact, instagramUrl: e.target.value},
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">Facebook Name / Label</label>
            <input
              type="text"
              value={settings.contact.facebookLabel}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact: {...p.contact, facebookLabel: e.target.value},
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">Facebook URL</label>
            <input
              type="url"
              value={settings.contact.facebookUrl}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact: {...p.contact, facebookUrl: e.target.value},
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">TikTok Handle</label>
            <input
              type="text"
              value={settings.contact.tiktokLabel || ''}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact: {...p.contact, tiktokLabel: e.target.value},
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">TikTok URL</label>
            <input
              type="url"
              value={settings.contact.tiktokUrl || ''}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact: {...p.contact, tiktokUrl: e.target.value},
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">LinkedIn Label</label>
            <input
              type="text"
              value={settings.contact.linkedinLabel}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact: {...p.contact, linkedinLabel: e.target.value},
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">LinkedIn URL</label>
            <input
              type="url"
              value={settings.contact.linkedinUrl}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact: {...p.contact, linkedinUrl: e.target.value},
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">X (Twitter) Handle</label>
            <input
              type="text"
              value={settings.contact.xLabel || ''}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact: {...p.contact, xLabel: e.target.value},
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">X URL</label>
            <input
              type="url"
              value={settings.contact.xUrl || ''}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact: {...p.contact, xUrl: e.target.value},
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">Behance Label</label>
            <input
              type="text"
              value={settings.contact.behanceLabel || ''}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact: {...p.contact, behanceLabel: e.target.value},
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">Behance URL</label>
            <input
              type="url"
              value={settings.contact.behanceUrl || ''}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact: {...p.contact, behanceUrl: e.target.value},
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">Dribbble Label</label>
            <input
              type="text"
              value={settings.contact.dribbbleLabel || ''}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact: {...p.contact, dribbbleLabel: e.target.value},
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">Dribbble URL</label>
            <input
              type="url"
              value={settings.contact.dribbbleUrl || ''}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact: {...p.contact, dribbbleUrl: e.target.value},
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
        </div>
      </section>

      {/* 3. Founder Profile */}
      <section className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-6">
        <h2 className="font-display text-lg font-semibold text-white">03. Founder Profile</h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">Founder Name</label>
            <input
              type="text"
              value={settings.founder.name}
              onChange={(e) =>
                setSettings((p) => ({...p, founder: {...p.founder, name: e.target.value}}))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#BFC3CA]">Founder Role</label>
            <input
              type="text"
              value={settings.founder.role}
              onChange={(e) =>
                setSettings((p) => ({...p, founder: {...p.founder, role: e.target.value}}))
              }
              className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-medium text-[#BFC3CA]">Founder Portrait</label>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            {settings.founder.photoUrl && (
              <img
                src={settings.founder.photoUrl}
                alt="Founder preview"
                className="h-20 w-16 rounded-lg border border-[rgba(191,195,202,0.2)] object-cover"
              />
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[rgba(191,195,202,0.24)] bg-[#101216] px-4 py-2 text-xs font-medium text-white hover:border-[#1769FF]">
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Portrait Photo</span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  void handleFounderPhoto(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </label>
            {uploadProgress !== null && (
              <span className="text-xs text-[#BFC3CA] tabular-nums">{uploadProgress}%</span>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-medium text-[#BFC3CA]">Founder Biography</label>
          <textarea
            rows={3}
            value={settings.founder.bio}
            onChange={(e) =>
              setSettings((p) => ({...p, founder: {...p.founder, bio: e.target.value}}))
            }
            className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
          />
        </div>
      </section>

      {/* 4. Verified Client Testimonials */}
      <section className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-6">
        <h2 className="font-display text-lg font-semibold text-white">
          04. Verified Client Testimonials
        </h2>
        <p className="mt-1 text-xs text-[#BFC3CA]">
          Add only real client testimonials. Remember to click Save All Settings above after
          changes.
        </p>

        {settings.testimonials.length > 0 && (
          <div className="mt-4 space-y-3">
            {settings.testimonials.map((t) => (
              <div
                key={t.id}
                className="flex items-start justify-between gap-4 rounded-lg border border-[rgba(191,195,202,0.14)] bg-[#101216] p-4 text-xs"
              >
                <div>
                  <p className="text-white">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-1.5 text-[#BFC3CA]">
                    {t.clientName} · {t.roleAndCompany} ({t.projectCategory})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSettings((p) => ({
                      ...p,
                      testimonials: p.testimonials.filter((x) => x.id !== t.id),
                    }))
                  }
                  className="text-[#BFC3CA] hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 grid gap-3 rounded-lg border border-[rgba(191,195,202,0.12)] bg-[#101216] p-4 sm:grid-cols-2">
          <textarea
            rows={2}
            value={tQuote}
            onChange={(e) => setTQuote(e.target.value)}
            placeholder="Client testimonial quote..."
            className="sm:col-span-2 rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#16191F] px-3 py-2 text-xs text-white"
          />
          <input
            type="text"
            value={tName}
            onChange={(e) => setTName(e.target.value)}
            placeholder="Client Full Name"
            className="rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#16191F] px-3 py-2 text-xs text-white"
          />
          <input
            type="text"
            value={tRole}
            onChange={(e) => setTRole(e.target.value)}
            placeholder="Role & Company"
            className="rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#16191F] px-3 py-2 text-xs text-white"
          />
          <input
            type="text"
            value={tCat}
            onChange={(e) => setTCat(e.target.value)}
            placeholder="Project Discipline"
            className="rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#16191F] px-3 py-2 text-xs text-white"
          />
          <button
            type="button"
            onClick={handleAddTestimonial}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[rgba(191,195,202,0.25)] px-4 py-2 text-xs font-medium text-white hover:border-[#1769FF]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Testimonial</span>
          </button>
        </div>
      </section>

      {/* 5. Email Service Status & Security */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-6">
          <h2 className="font-display text-lg font-semibold text-white">
            05. Email Notification Configuration
          </h2>
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-[rgba(191,195,202,0.16)] bg-[#101216] p-4 text-xs leading-relaxed">
            <AlertCircle
              className={`mt-0.5 h-4 w-4 shrink-0 ${
                emailConfig.configured ? 'text-emerald-400' : 'text-amber-300'
              }`}
            />
            <div>
              <p className="font-semibold text-white">
                {emailConfig.configured
                  ? `Email Delivery Ready (${emailConfig.provider})`
                  : 'Email Service Not Configured'}
              </p>
              <p className="mt-1 text-[#BFC3CA]">{emailConfig.details}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[rgba(191,195,202,0.14)] bg-[#16191F] p-6">
          <h2 className="font-display text-lg font-semibold text-white">
            06. Administrator Password
          </h2>
          <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
            {pwFeedback && (
              <p
                className={`text-xs ${
                  pwFeedback.type === 'ok' ? 'text-emerald-300' : 'text-red-300'
                }`}
              >
                {pwFeedback.msg}
              </p>
            )}
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2 text-xs text-white"
            />
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 8 characters)"
              className="w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2 text-xs text-white"
            />
            <button
              type="submit"
              className="rounded-lg border border-[rgba(191,195,202,0.25)] px-4 py-2 text-xs font-semibold text-white hover:border-[#1769FF]"
            >
              Update Password
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
