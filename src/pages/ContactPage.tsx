import React from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  SearchCheck,
} from 'lucide-react';
import {useStudio} from '../context/StudioContext';

function WhatsAppIcon({className = 'h-4 w-4'}: {className?: string}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM17.46 15.96C17.23 16.61 16.12 17.2 15.6 17.28C15.12 17.35 14.52 17.38 13.86 17.17C13.46 17.04 12.95 16.87 12.3 16.59C9.56 15.41 7.77 12.65 7.63 12.46C7.49 12.27 6.51 10.97 6.51 9.62C6.51 8.27 7.22 7.61 7.47 7.34C7.72 7.07 8.01 7 8.2 7C8.39 7 8.58 7.01 8.74 7.01C8.92 7.02 9.15 6.95 9.38 7.5C9.62 8.08 10.19 9.48 10.26 9.62C10.33 9.76 10.38 9.92 10.28 10.11C10.19 10.3 10.14 10.42 10 10.58C9.86 10.74 9.71 10.94 9.58 11.06C9.44 11.2 9.3 11.35 9.46 11.63C9.62 11.91 10.18 12.82 11 13.55C12.06 14.49 12.95 14.79 13.23 14.93C13.51 15.07 13.67 15.05 13.84 14.86C14.01 14.67 14.56 14.02 14.75 13.74C14.94 13.46 15.13 13.51 15.39 13.6C15.65 13.7 17.04 14.38 17.32 14.52C17.6 14.66 17.79 14.73 17.86 14.85C17.93 14.97 17.93 15.31 17.46 15.96Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ContactPage() {
  const {navigate, settings} = useStudio();

  const whatsappDigits =
    (settings.contact.whatsappNumber || '').replace(/[^\d]/g, '') || '2349161407826';
  const contactWhatsAppUrl = `https://wa.me/${whatsappDigits}?text=Hello%20SOLMONIX%20STUDIO%2C%20I%20would%20like%20to%20make%20an%20inquiry.`;

  const phoneEntries = (settings.contact.phone || '')
    .split(/[/,|]/)
    .map((item) => item.trim())
    .filter(Boolean);

  const extraSocialCards = [
    {
      name: 'TikTok',
      subtitle: 'Short-form studio showcase',
      label: settings.contact.tiktokLabel || '',
      url: settings.contact.tiktokUrl || '',
    },
    {
      name: 'LinkedIn',
      subtitle: 'Agency profile & partnerships',
      label: settings.contact.linkedinLabel || '',
      url: settings.contact.linkedinUrl || '',
    },
    {
      name: 'X',
      subtitle: 'Studio notes & releases',
      label: settings.contact.xLabel || '',
      url: settings.contact.xUrl || '',
    },
    {
      name: 'Behance',
      subtitle: 'Curated visual case studies',
      label: settings.contact.behanceLabel || '',
      url: settings.contact.behanceUrl || '',
    },
    {
      name: 'Dribbble',
      subtitle: 'Interface & craft snapshots',
      label: settings.contact.dribbbleLabel || '',
      url: settings.contact.dribbbleUrl || '',
    },
  ].filter((item) => item.label.trim() || item.url.trim());

  return (
    <main>
      <section className="border-b border-[rgba(191,195,202,0.12)] bg-[#101216]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] uppercase">
            Contact SOLMONIX STUDIO
          </p>
          <h1
            className="mt-4 max-w-4xl font-display font-semibold tracking-tight text-white [text-wrap:balance]"
            style={{fontSize: 'clamp(2.25rem, 4vw, 3.75rem)', lineHeight: 1.08}}
          >
            Let&apos;s Create Something Exceptional Together.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#BFC3CA] sm:text-lg">
            For all new project commissions, please submit a structured project application so our
            team can evaluate your scope, timeline, and objectives thoroughly.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => navigate('/start-a-project')}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-[#1769FF] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2F7BFF]"
            >
              <span>Submit a Project Application</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/track')}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-[rgba(191,195,202,0.26)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-[#16191F]"
            >
              <SearchCheck className="h-4 w-4 text-[#1769FF]" aria-hidden="true" />
              <span>Track Existing Application</span>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#12151A]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Direct Channels Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
              {settings.contact.email && (
                <div className="rounded-2xl border border-[rgba(191,195,202,0.14)] bg-[#101216] p-7">
                  <Mail className="h-5 w-5 text-[#1769FF]" aria-hidden="true" />
                  <h2 className="mt-4 font-display text-lg font-semibold text-white">
                    Business Email
                  </h2>
                  <p className="mt-1 text-xs text-[#BFC3CA]/75">
                    General enquiries and project correspondence
                  </p>
                  <a
                    href={`mailto:${settings.contact.email}`}
                    className="mt-4 inline-block break-all text-sm font-medium text-white transition-colors hover:text-[#1769FF]"
                  >
                    {settings.contact.email}
                  </a>
                </div>
              )}

              <div className="rounded-2xl border border-[rgba(191,195,202,0.14)] bg-[#101216] p-7">
                <MessageCircle className="h-5 w-5 text-[#1769FF]" aria-hidden="true" />
                <h2 className="mt-4 font-display text-lg font-semibold text-white">WhatsApp</h2>
                <p className="mt-1 text-xs text-[#BFC3CA]/75">
                  {settings.contact.preferredContactMethod?.toLowerCase() === 'whatsapp'
                    ? `Preferred contact · ${settings.contact.whatsappNumber || '+234 916 140 7826'}`
                    : settings.contact.whatsappNumber || 'Direct studio messaging'}
                </p>
                <div className="mt-4">
                  <a
                    href={contactWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[rgba(191,195,202,0.26)] bg-[#16191F] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:border-[#1769FF] hover:bg-[#1769FF]"
                  >
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366] transition-colors group-hover:text-white" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {phoneEntries.length > 0 && (
                <div className="rounded-2xl border border-[rgba(191,195,202,0.14)] bg-[#101216] p-7">
                  <Phone className="h-5 w-5 text-[#1769FF]" aria-hidden="true" />
                  <h2 className="mt-4 font-display text-lg font-semibold text-white">Phone</h2>
                  <p className="mt-1 text-xs text-[#BFC3CA]/75">Direct studio telephone lines</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-white tabular-nums">
                    {phoneEntries.map((num, idx) => (
                      <React.Fragment key={num}>
                        {idx > 0 && <span className="text-[#BFC3CA]/45">/</span>}
                        <a
                          href={`tel:${num.replace(/[^\d+]/g, '')}`}
                          className="transition-colors hover:text-[#1769FF]"
                        >
                          {num}
                        </a>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {(settings.contact.instagramHandle || settings.contact.instagramUrl) && (
                <div className="rounded-2xl border border-[rgba(191,195,202,0.14)] bg-[#101216] p-7">
                  <Instagram className="h-5 w-5 text-[#1769FF]" aria-hidden="true" />
                  <h2 className="mt-4 font-display text-lg font-semibold text-white">Instagram</h2>
                  <p className="mt-1 text-xs text-[#BFC3CA]/75">Studio updates and visual work</p>
                  {settings.contact.instagramUrl ? (
                    <a
                      href={settings.contact.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-[#1769FF]"
                    >
                      <span>{settings.contact.instagramHandle || settings.contact.instagramUrl}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <p className="mt-4 text-sm text-[#BFC3CA]">{settings.contact.instagramHandle}</p>
                  )}
                </div>
              )}

              {(settings.contact.facebookLabel || settings.contact.facebookUrl) && (
                <div className="rounded-2xl border border-[rgba(191,195,202,0.14)] bg-[#101216] p-7">
                  <Globe className="h-5 w-5 text-[#1769FF]" aria-hidden="true" />
                  <h2 className="mt-4 font-display text-lg font-semibold text-white">Facebook</h2>
                  <p className="mt-1 text-xs text-[#BFC3CA]/75">Direct founder &amp; studio profile</p>
                  {settings.contact.facebookUrl ? (
                    <a
                      href={settings.contact.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-[#1769FF]"
                    >
                      <span>{settings.contact.facebookLabel || settings.contact.facebookUrl}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <p className="mt-4 text-sm font-medium text-white">
                      {settings.contact.facebookLabel}
                    </p>
                  )}
                </div>
              )}

              {extraSocialCards.map((social) => (
                <div
                  key={social.name}
                  className="rounded-2xl border border-[rgba(191,195,202,0.14)] bg-[#101216] p-7"
                >
                  {social.name === 'LinkedIn' ? (
                    <Linkedin className="h-5 w-5 text-[#1769FF]" aria-hidden="true" />
                  ) : (
                    <Globe className="h-5 w-5 text-[#1769FF]" aria-hidden="true" />
                  )}
                  <h2 className="mt-4 font-display text-lg font-semibold text-white">
                    {social.name}
                  </h2>
                  <p className="mt-1 text-xs text-[#BFC3CA]/75">{social.subtitle}</p>
                  {social.url ? (
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-[#1769FF]"
                    >
                      <span>{social.label || social.url}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <p className="mt-4 text-sm text-[#BFC3CA]">{social.label}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Application Gate Card */}
            <aside className="flex flex-col justify-between rounded-2xl border border-[rgba(191,195,202,0.16)] bg-[#16191F] p-8 lg:col-span-5">
              <div>
                <div className="space-y-2">
                  {settings.contact.workingHours && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1769FF]">
                      <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Working Hours: {settings.contact.workingHours}</span>
                    </div>
                  )}
                  {settings.contact.location && (
                    <div className="flex items-center gap-2 text-xs font-medium text-[#BFC3CA]">
                      <MapPin className="h-4 w-4 shrink-0 text-[#1769FF]" aria-hidden="true" />
                      <span>{settings.contact.location}</span>
                    </div>
                  )}
                </div>
                <h2 className="mt-4 font-display text-2xl font-semibold text-white">
                  Ready to Start Your Project?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#BFC3CA]">
                  Our multi-step client application captures your brand context, deliverables,
                  budget range, and timeline—and issues a unique reference number so you can track
                  our review status anytime.
                </p>
                {settings.contact.preferredContactMethod && (
                  <p className="mt-4 text-xs text-[#BFC3CA]/80">
                    Preferred Contact Method:{' '}
                    <span className="font-semibold text-white">
                      {settings.contact.preferredContactMethod}
                    </span>
                  </p>
                )}
              </div>

              <div className="mt-8 space-y-3 border-t border-[rgba(191,195,202,0.14)] pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/start-a-project')}
                  className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-[#1769FF] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2F7BFF]"
                >
                  <span>Go to Project Application</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/track')}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[rgba(191,195,202,0.22)] px-6 py-2.5 text-xs font-medium text-[#BFC3CA] transition-colors hover:border-white hover:text-white"
                >
                  <span>Check Existing Application Status</span>
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
