import React, {useState} from 'react';
import {Menu, X, ArrowUpRight} from 'lucide-react';
import {useStudio} from '../context/StudioContext';
import {PageRoute} from '../types/studio';
import {SolmonixHorizontalLogo} from './SolmonixLogo';

const NAV_ITEMS: {label: string; path: PageRoute}[] = [
  {label: 'Home', path: '/'},
  {label: 'About', path: '/about'},
  {label: 'Services', path: '/services'},
  {label: 'Projects', path: '/projects'},
  {label: 'Contact', path: '/contact'},
];

export function Navbar() {
  const {activeRoute, navigate} = useStudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: PageRoute) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(191,195,202,0.12)] bg-[#101216]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Custom S Monogram & Two-Tier Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNav('/');
          }}
          className="flex shrink-0 items-center whitespace-nowrap text-white transition-opacity hover:opacity-90"
          aria-label="SOLMONIX STUDIO Home"
        >
          <SolmonixHorizontalLogo size="xs" />
        </a>

        {/* Zone 2: Primary Text Navigation */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeRoute === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.path);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`relative shrink-0 whitespace-nowrap py-1 text-sm font-medium transition-colors duration-150 ${
                  isActive ? 'text-white' : 'text-[#BFC3CA] hover:text-white'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-[2px] origin-left bg-[#1769FF] transition-transform duration-200 ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Trigger */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => handleNav('/start-a-project')}
            className="hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-[#1769FF] px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#2F7BFF] sm:inline-flex"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[rgba(191,195,202,0.18)] text-white transition-colors hover:bg-[#16191F] md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[rgba(191,195,202,0.12)] bg-[#101216] px-4 py-5 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = activeRoute === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(item.path);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex min-h-[44px] items-center justify-between rounded-lg px-3 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#16191F] text-white'
                      : 'text-[#BFC3CA] hover:bg-[#16191F]/60 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#1769FF]" aria-hidden="true" />}
                </a>
              );
            })}
            <a
              href="/track"
              onClick={(e) => {
                e.preventDefault();
                handleNav('/track');
              }}
              className="flex min-h-[44px] items-center justify-between rounded-lg px-3 text-base font-medium text-[#BFC3CA] hover:bg-[#16191F]/60 hover:text-white"
            >
              <span>Track Application</span>
            </a>
            <button
              type="button"
              onClick={() => handleNav('/start-a-project')}
              className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#1769FF] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2F7BFF]"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
