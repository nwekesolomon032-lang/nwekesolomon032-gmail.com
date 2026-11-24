import React from 'react';
import {ArrowUpRight, Lock} from 'lucide-react';
import {useStudio} from '../context/StudioContext';
import {STUDIO_SERVICES} from '../data/studioData';
import {SolmonixHorizontalLogo} from './SolmonixLogo';

export function Footer() {
  const {navigate, settings} = useStudio();
  const year = new Date().getFullYear();

  const whatsappDigits = settings.contact.whatsappNumber.replace(/[^\d]/g, '');
  const hasWhatsapp = whatsappDigits.length >= 7;

  const phoneEntries = (settings.contact.phone || '')
    .split(/[/,|]/)
    .map((item) => item.trim())
    .filter(Boolean);

  const optionalSocials = [
    {
      name: 'Instagram',
      label: settings.contact.instagramHandle,
      url: settings.contact.instagramUrl,
    },
    {
      name: 'Facebook',
      label: settings.contact.facebookLabel,
      url: settings.contact.facebookUrl,
    },
    {
      name: 'TikTok',
      label: settings.contact.tiktokLabel || '',
      url: settings.contact.tiktokUrl || '',
    },
    {
      name: 'LinkedIn',
      label: settings.contact.linkedinLabel,
      url: settings.contact.linkedinUrl,
    },
    {
      name: 'X',
      label: settings.contact.xLabel || '',
      url: settings.contact.xUrl || '',
    },
    {
      name: 'Behance',
      label: settings.contact.behanceLabel || '',
      url: settings.contact.behanceUrl || '',
    },
    {
      name: 'Dribbble',
      label: settings.contact.dribbbleLabel || '',
      url: settings.contact.dribbbleUrl || '',
    },
  ].filter((item) => item.label.trim() || item.url.trim());

  return (
    <footer className="border-t border-[rgba(191,195,202,0.14)] bg-[#101216] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="inline-flex items-center transition-opacity hover:opacity-90"
              aria-label="SOLMONIX STUDIO Home"
            >
              <SolmonixHorizontalLogo size="md" />
            </a>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-[#BFC3CA]">
              {settings.contact.tagline || 'Designing Brands. Building Digital Experiences.'}
            </p>
            {(settings.contact.location || settings.contact.workingHours) && (
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#BFC3CA]/75">
                {[
                  settings.contact.location?.trim(),
                  settings.contact.workingHours?.trim()
                    ? `Hours: ${settings.contact.workingHours.trim()}`
                    : '',
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/start-a-project')}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1769FF] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2F7BFF]"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/track')}
                className="inline-flex items-center gap-2 rounded-lg border border-[rgba(191,195,202,0.22)] px-4 py-2.5 text-sm font-medium text-[#BFC3CA] transition-colors hover:border-white hover:text-white"
              >
                <span>Track Application</span>
              </button>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h2 className="font-display text-sm font-semibold text-white">Navigation</h2>
              <ul className="mt-4 space-y-3 text-sm text-[#BFC3CA]">
                {[
                  {label: 'Home', path: '/'},
                  {label: 'About', path: '/about'},
                  {label: 'Services', path: '/services'},
                  {label: 'Projects', path: '/projects'},
                  {label: 'Brand Identity', path: '/brand-identity'},
                  {label: 'Start a Project', path: '/start-a-project'},
                  {label: 'Track Application', path: '/track'},
                  {label: 'Contact', path: '/contact'},
                ].map((link) => (
                  <li key={link.path}>
                    <a
                      href={link.path}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(link.path);
                      }}
                      className="transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-sm font-semibold text-white">Disciplines</h2>
              <ul className="mt-4 space-y-3 text-sm text-[#BFC3CA]">
                {STUDIO_SERVICES.map((service) => (
                  <li key={service.id}>
                    <a
                      href={`/services#${service.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/services#${service.id}`);
                      }}
                      className="transition-colors hover:text-white"
                    >
                      {service.shortTitle}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h2 className="font-display text-sm font-semibold text-white">Connect</h2>
              <ul className="mt-4 space-y-3 text-sm text-[#BFC3CA]">
                {settings.contact.email && (
                  <li>
                    <a
                      href={`mailto:${settings.contact.email}`}
                      className="break-all transition-colors hover:text-white"
                    >
                      {settings.contact.email}
                    </a>
                  </li>
                )}
                {phoneEntries.length > 0 && (
                  <li className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                    {phoneEntries.map((num, idx) => (
                      <React.Fragment key={num}>
                        {idx > 0 && <span className="text-[#BFC3CA]/50">/</span>}
                        <a
                          href={`tel:${num.replace(/[^\d+]/g, '')}`}
                          className="tabular-nums transition-colors hover:text-white"
                        >
                          {num}
                        </a>
                      </React.Fragment>
                    ))}
                  </li>
                )}
                {hasWhatsapp && (
                  <li>
                    <a
                      href={`https://wa.me/${whatsappDigits}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-white"
                    >
                      WhatsApp: {settings.contact.whatsappNumber}
                    </a>
                  </li>
                )}
                {optionalSocials.map((social) => (
                  <li key={social.name}>
                    {social.url.trim() ? (
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-white"
                      >
                        {social.name}
                        {social.label.trim() ? ` (${social.label.trim()})` : ''}
                      </a>
                    ) : (
                      <span className="text-[#BFC3CA]/80">
                        {social.name}: {social.label.trim()}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Private Admin Portal Entry */}
        <div className="mt-14 grid grid-cols-1 items-center justify-items-center gap-4 border-t border-[rgba(191,195,202,0.12)] pt-8 text-xs text-[#BFC3CA]/75 sm:grid-cols-[1fr_auto_1fr]">
          <p className="sm:justify-self-start">&copy; {year} SOLMONIX STUDIO. All rights reserved.</p>
          <a
            href="/admin"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#BFC3CA]/75 transition-colors hover:text-white"
          >
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Studio Control Centre</span>
          </a>
          <div className="hidden sm:block" aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
}
