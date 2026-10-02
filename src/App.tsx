/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/public/HeroSection';
import { CapabilityStrip } from './components/public/CapabilityStrip';
import { WhatMakesUsDifferent } from './components/public/WhatMakesUsDifferent';
import { DarkFeatureBlocks } from './components/public/DarkFeatureBlocks';
import { WorkflowHighlight } from './components/public/WorkflowHighlight';
import { Footer } from './components/layout/Footer';
import { CommercialViews } from './components/public/CommercialViews';
import { AppShell } from './components/app/AppShell';
import { AuthPanel } from './components/auth/AuthPanel';
import { GmailAuthPrompt } from './components/auth/GmailAuthPrompt';
import { CURRENT_USER } from './data/mockData';
import { UserProfile } from './types/canon';
import { StorageService } from './utils/storage';
import { CheckCircle2, LogOut } from 'lucide-react';

export default function App() {
  const [isAppMode, setIsAppMode] = useState(false);
  const [initialAppTab, setInitialAppTab] = useState('dashboard');
  const [currentPublicView, setCurrentPublicView] = useState('home');
  const [activeModal, setActiveModal] = useState<'pricing' | 'governance' | 'solutions' | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGmailPromptOpen, setIsGmailPromptOpen] = useState(false);
  const [logoutNotice, setLogoutNotice] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => StorageService.getCurrentUser());

  const handleLaunchApp = (tab: string = 'dashboard') => {
    setInitialAppTab(tab);
    // If user is not authenticated via Gmail or explicitly clicked Launch OS, prompt with Gmail Login
    if (!currentUser || !currentUser.email.includes('gmail.com')) {
      setIsGmailPromptOpen(true);
    } else {
      setIsAppMode(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleForceLaunchAppDirectly = (tab: string = 'dashboard') => {
    setInitialAppTab(tab);
    setIsAppMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    StorageService.setCurrentUser(updatedUser);
  };

  const handleSignOut = () => {
    if (currentUser) {
      StorageService.logActivity({
        actor: currentUser.name,
        actorRole: currentUser.role,
        action: 'USER_LOGGED_OUT',
        resource: `User:${currentUser.id}`,
        resourceId: currentUser.id,
        details: 'User explicitly logged out of CANON enterprise session.',
        severity: 'INFO',
      });
    }

    setCurrentUser(null);
    setIsAppMode(false);
    setLogoutNotice('Successfully logged out of PRAMANEX CANON session. Cryptographic session closed.');
    setTimeout(() => setLogoutNotice(null), 4000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublicNavigation = (view: string) => {
    if (view === 'pricing') {
      setActiveModal('pricing');
    } else if (view === 'governance') {
      setActiveModal('governance');
    } else if (view === 'compare') {
      handleForceLaunchAppDirectly('compare');
    } else if (view === 'cross-market') {
      handleForceLaunchAppDirectly('cross-market');
    } else if (view === 'structured') {
      handleForceLaunchAppDirectly('structured');
    } else if (view === 'provenance') {
      handleForceLaunchAppDirectly('provenance');
    } else {
      setCurrentPublicView('home');
      setIsAppMode(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // If in Authenticated OS Mode:
  if (isAppMode && currentUser) {
    return (
      <AppShell
        initialTab={initialAppTab}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
        onSignOut={handleSignOut}
        onExitToPublic={() => {
          setIsAppMode(false);
          setCurrentPublicView('home');
        }}
      />
    );
  }

  // Otherwise, render Public Commercial Website (matching reference template exactly):
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-500 selection:text-white relative">
      {/* Logout Notice Toast Banner */}
      {logoutNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{logoutNotice}</span>
        </div>
      )}

      {/* Top Glassmorphic Navigation Bar */}
      <Navbar
        currentView={currentPublicView}
        onNavigate={handlePublicNavigation}
        onLaunchApp={() => handleLaunchApp('dashboard')}
        isAppMode={isAppMode}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        currentUser={currentUser || undefined}
        onSignOut={handleSignOut}
        onSelectSearchTab={(tab) => handleForceLaunchAppDirectly(tab)}
      />

      <main>
        {/* Hero Section with Embedded Interactive Kanban Window */}
        <HeroSection
          onLaunchApp={() => handleLaunchApp('dashboard')}
          onSelectProductCard={(prodId) => handleLaunchApp('compare')}
        />

        {/* Capability / Proof Strip */}
        <CapabilityStrip />

        {/* "What makes us different" — 3 Pastel Cards (Mint, Lavender, Peach) */}
        <WhatMakesUsDifferent
          onExploreFeature={(featureKey) => handleLaunchApp(featureKey)}
        />

        {/* Real-Time Label Intelligence: Two Dark Forest Green Enterprise Blocks */}
        <DarkFeatureBlocks />

        {/* Warm Golden-Yellow Lineage & Stages Pipeline Section */}
        <WorkflowHighlight
          onExploreProvenance={() => handleLaunchApp('provenance')}
        />
      </main>

      {/* Enterprise Trust Footer */}
      <Footer
        onNavigate={handlePublicNavigation}
        onLaunchApp={() => handleLaunchApp('dashboard')}
      />

      {/* Commercial Modals (Pricing, Governance, Solutions) */}
      <CommercialViews
        view={activeModal}
        onClose={() => setActiveModal(null)}
        onLaunchApp={() => {
          setActiveModal(null);
          handleLaunchApp('dashboard');
        }}
      />

      {/* Authentication & Role Switcher Modal / Panel */}
      <AuthPanel
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser || CURRENT_USER}
        onAuthSuccess={(profile) => {
          handleUpdateUser(profile);
          handleForceLaunchAppDirectly('dashboard');
        }}
      />

      {/* Gmail / Google Login Prompt for Launch CANON OS */}
      <GmailAuthPrompt
        isOpen={isGmailPromptOpen}
        onClose={() => setIsGmailPromptOpen(false)}
        targetEmail="rahuldewangan488@gmail.com"
        onGoogleSuccess={(profile) => {
          handleUpdateUser(profile);
          handleForceLaunchAppDirectly(initialAppTab);
        }}
      />
    </div>
  );
}
