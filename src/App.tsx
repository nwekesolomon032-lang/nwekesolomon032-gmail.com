/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {AdminAuthGate} from './admin/AdminAuthGate';
import {Footer} from './components/Footer';
import {Navbar} from './components/Navbar';
import {SolmonixAiWidget} from './components/SolmonixAiWidget';
import {StudioProvider, useStudio} from './context/StudioContext';
import {AboutPage} from './pages/AboutPage';
import {BrandIdentityPage} from './pages/BrandIdentityPage';
import {CaliforniaLandscapeShowcasePage} from './pages/CaliforniaLandscapeShowcasePage';
import {ContactPage} from './pages/ContactPage';
import {HomePage} from './pages/HomePage';
import {ProjectDetailPage} from './pages/ProjectDetailPage';
import {ProjectsPage} from './pages/ProjectsPage';
import {ServicesPage} from './pages/ServicesPage';
import {StartProjectPage} from './pages/StartProjectPage';
import {TrackApplicationPage} from './pages/TrackApplicationPage';

function AppShell() {
  const {activeRoute, activeProjectSlug} = useStudio();

  if (activeRoute === '/admin') {
    return <AdminAuthGate />;
  }

  if (activeRoute === '/showcase') {
    return <CaliforniaLandscapeShowcasePage />;
  }

  const renderPage = () => {
    if (activeRoute === '/about') return <AboutPage />;
    if (activeRoute === '/services') return <ServicesPage />;
    if (activeRoute === '/projects') {
      if (activeProjectSlug) {
        return <ProjectDetailPage slug={activeProjectSlug} />;
      }
      return <ProjectsPage />;
    }
    if (activeRoute === '/brand-identity') return <BrandIdentityPage />;
    if (activeRoute === '/start-a-project') return <StartProjectPage />;
    if (activeRoute === '/track') return <TrackApplicationPage />;
    if (activeRoute === '/contact') return <ContactPage />;
    return <HomePage />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#101216] text-white">
      <Navbar />
      <div className="flex-1">{renderPage()}</div>
      <Footer />
      <SolmonixAiWidget />
    </div>
  );
}

export default function App() {
  return (
    <StudioProvider>
      <AppShell />
    </StudioProvider>
  );
}
