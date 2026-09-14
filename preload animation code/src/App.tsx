/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { PreloaderOverlay } from './components/PreloaderOverlay';
import { PreloaderToolbar } from './components/PreloaderToolbar';
import { WebsiteShowcase } from './components/WebsiteShowcase';
import { CodeModal } from './components/CodeModal';
import { PageId, PreloaderConfig } from './types';

export default function App() {
  // Navigation & Preloader State
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [pendingPage, setPendingPage] = useState<PageId>('home');
  const [isPreloaderActive, setIsPreloaderActive] = useState<boolean>(true);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);

  // Restore custom logo from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('adeclassics_custom_logo');
      if (saved) {
        setCustomLogoUrl(saved);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleUploadLogo = useCallback((dataUrl: string) => {
    setCustomLogoUrl(dataUrl);
    try {
      localStorage.setItem('adeclassics_custom_logo', dataUrl);
    } catch {
      // storage quota
    }
    setIsPreloaderActive(true);
  }, []);

  const handleClearLogo = useCallback(() => {
    setCustomLogoUrl(null);
    try {
      localStorage.removeItem('adeclassics_custom_logo');
    } catch {
      // ignore
    }
    setIsPreloaderActive(true);
  }, []);

  // Preloader configuration
  const [config, setConfig] = useState<PreloaderConfig>({
    preset: 'stroke-draw',
    speed: 'balanced',
    theme: 'royal-maroon',
    showProgress: true,
    soundEnabled: false,
    blurBackdrop: true,
    logoMode: 'svg-vector',
  });

  // Handle configuration updates
  const handleUpdateConfig = useCallback((newValues: Partial<PreloaderConfig>) => {
    setConfig((prev) => ({ ...prev, ...newValues }));
  }, []);

  // Trigger simulated or explicit page reload
  const handleTriggerReload = useCallback(() => {
    setPendingPage(currentPage);
    setIsPreloaderActive(true);
  }, [currentPage]);

  // Trigger page navigation: Shows preloader on every page open request
  const handleTriggerNavigate = useCallback((targetPage: PageId) => {
    if (targetPage === currentPage && !isPreloaderActive) {
      // Still show preloader even if clicking current page to demonstrate reload
      setPendingPage(targetPage);
      setIsPreloaderActive(true);
      return;
    }
    setPendingPage(targetPage);
    setIsPreloaderActive(true);
  }, [currentPage, isPreloaderActive]);

  // When preloader completes loading animation
  const handlePreloaderComplete = useCallback(() => {
    setCurrentPage(pendingPage);
    setIsPreloaderActive(false);
  }, [pendingPage]);

  // Support drag-and-drop of logo image anywhere on page
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          handleUploadLogo(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Preloader title for current target
  const pageTitles: Record<PageId, string> = {
    home: 'The Grand Maison',
    collections: 'Haute Horology',
    bespoke: 'Bespoke Tailoring',
    heritage: 'Heritage 1892',
    atelier: 'Private Atelier',
    boutique: 'Global Flagships',
  };

  return (
    <div 
      className="min-h-screen bg-[#0d0305] text-[#f7f2e7] flex flex-col relative selection:bg-[#d4af37] selection:text-[#28050a]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* 1. Interactive Control & Simulation Toolbar */}
      <PreloaderToolbar
        config={config}
        onUpdateConfig={handleUpdateConfig}
        onTriggerReload={handleTriggerReload}
        onTriggerNavigate={handleTriggerNavigate}
        currentPage={currentPage}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
        isPreloaderActive={isPreloaderActive}
        customLogoUrl={customLogoUrl}
        onUploadLogo={handleUploadLogo}
        onClearLogo={handleClearLogo}
      />

      {/* 2. Main Luxury Website Experience */}
      <WebsiteShowcase
        currentPage={currentPage}
        onNavigate={handleTriggerNavigate}
        onTriggerReload={handleTriggerReload}
      />

      {/* 3. The Animated Preloader Overlay (Fires on initial reload & on every page navigation) */}
      <PreloaderOverlay
        isLoading={isPreloaderActive}
        config={config}
        targetPageTitle={pageTitles[pendingPage]}
        onComplete={handlePreloaderComplete}
        customLogoUrl={customLogoUrl}
      />

      {/* 4. Ready-to-use Code Exporter Modal */}
      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        config={config}
      />
    </div>
  );
}
