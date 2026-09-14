import React, { useState } from 'react';
import { X, Check, Copy, Code2, Globe, Sparkles, FileCode, CheckCircle2 } from 'lucide-react';
import { PreloaderConfig } from '../types';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PreloaderConfig;
}

export const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose, config }) => {
  const [activeTab, setActiveTab] = useState<'vanilla' | 'react' | 'single-file'>('vanilla');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const htmlSnippet = `<!-- 1. PASTE DIRECTLY AFTER YOUR <body> TAG -->
<div id="ade-preloader" class="ade-preloader-container">
  <div class="ade-preloader-glow"></div>
  <div class="ade-preloader-content">
    <!-- AdeClassics Animated Monogram Crest -->
    <div class="ade-logo-wrapper">
      <svg class="ade-svg" viewBox="0 0 500 520" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="goldGrad" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stop-color="#fdf0b5" />
            <stop offset="25%" stop-color="#e2b952" />
            <stop offset="50%" stop-color="#aa7926" />
            <stop offset="75%" stop-color="#f7dc8c" />
            <stop offset="100%" stop-color="#8d5a15" />
          </linearGradient>
          <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#d8af43" />
            <stop offset="30%" stop-color="#faeab4" />
            <stop offset="60%" stop-color="#ba8b24" />
            <stop offset="100%" stop-color="#966517" />
          </linearGradient>
          <linearGradient id="crescentWhite" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="60%" stop-color="#faf6ee" />
            <stop offset="100%" stop-color="#dfca9e" />
          </linearGradient>
        </defs>

        <!-- Concentric Solid Gold Circular Rings -->
        <circle class="anim-ring outer" cx="250" cy="180" r="140" stroke="url(#goldRing)" stroke-width="3.4" />
        <circle class="anim-ring inner" cx="250" cy="180" r="128" stroke="url(#goldRing)" stroke-width="1.8" />

        <!-- Crescent 'C' & Monogram 'A' -->
        <path class="anim-draw c-path" d="M 305 108 C 278 94, 214 98, 185 142 C 156 186, 168 238, 208 262 C 236 278, 278 274, 304 252 C 275 264, 230 258, 204 234 C 176 208, 178 165, 208 132 C 234 104, 280 102, 305 108 Z" fill="url(#crescentWhite)" stroke="url(#goldRing)" stroke-width="1.8" />
        <path class="anim-draw a-leg-left" d="M 249 56 L 165 258 L 150 259 C 144 260, 144 263, 148 264 L 182 264 C 186 263, 186 260, 180 259 L 173 258 L 204 186 L 242 70 Z" fill="url(#goldGrad)" stroke="url(#goldRing)" stroke-width="1.2" />
        <path class="anim-draw a-leg-right" d="M 249 56 L 305 258 L 294 259 C 288 260, 288 263, 292 264 L 334 264 C 338 263, 338 260, 332 259 L 320 258 L 260 68 Z" fill="url(#goldGrad)" stroke="url(#goldRing)" stroke-width="1.2" />
        <path class="anim-draw a-swash" d="M 112 215 C 128 200, 150 205, 178 194 C 212 180, 235 188, 258 214 C 285 244, 320 240, 348 210 C 362 195, 368 185, 364 212 C 360 236, 335 258, 298 252 C 255 245, 228 208, 196 206 C 166 204, 142 225, 116 232 C 108 234, 106 226, 112 215 Z" fill="url(#goldGrad)" stroke="url(#goldRing)" stroke-width="1.4" />

        <!-- Fleur-de-lis Crest -->
        <path d="M 250 298 C 254 308, 258 312, 257 322 C 257 328, 250 332, 250 332 C 250 332, 243 328, 243 322 C 242 312, 246 308, 250 298 Z" fill="url(#goldGrad)" />
        <path d="M 242 322 C 230 318, 222 308, 226 298 C 230 292, 238 296, 241 306 C 243 312, 243 318, 242 322 Z" fill="url(#goldGrad)" />
        <path d="M 258 322 C 270 318, 278 308, 274 298 C 270 292, 262 296, 259 306 C 257 312, 257 318, 258 322 Z" fill="url(#goldGrad)" />

        <!-- Brand Name: 'Ade' in Gold, 'Classics' in White -->
        <text x="250" y="402" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="52" font-weight="600">
          <tspan fill="url(#goldGrad)">Ade</tspan><tspan fill="#ffffff">Classics</tspan>
        </text>

        <!-- Divider & Diamond -->
        <line x1="80" y1="426" x2="236" y2="426" stroke="url(#goldRing)" stroke-width="1.6" />
        <polygon points="250,420 256,426 250,432 244,426" fill="url(#goldGrad)" />
        <line x1="264" y1="426" x2="420" y2="426" stroke="url(#goldRing)" stroke-width="1.6" />

        <!-- Tagline -->
        <text x="250" y="464" text-anchor="middle" font-family="'Playfair Display', 'Cormorant Garamond', Georgia, serif" font-style="italic" font-size="25" fill="#f5e4bd">...  Timeless Elegance</text>
      </svg>
    </div>

    <!-- Progress Line -->
    <div class="ade-progress-track">
      <div id="ade-progress-bar" class="ade-progress-bar"></div>
    </div>
    <div id="ade-status-text" class="ade-status-text">Entering AdeClassics...</div>
  </div>
</div>`;

  const cssSnippet = `/* 2. ADD TO YOUR STYLESHEET OR <style> TAG */
.ade-preloader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(ellipse at center, #64111d 0%, #61101a 50%, #440911 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.6s ease;
  overflow: hidden;
}

.ade-preloader-container.fade-out {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.ade-preloader-glow {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(107,19,33,0.8) 60%, transparent 80%);
  filter: blur(50px);
  animation: glowPulse 3s ease-in-out infinite;
}

.ade-preloader-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 380px;
  width: 90%;
  animation: scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.ade-svg {
  width: 100%;
  max-width: 280px;
  height: auto;
  filter: drop-shadow(0 12px 25px rgba(0,0,0,0.6));
}

/* SVG Stroke Drawing Animations */
.anim-ring {
  stroke-dasharray: 850;
  stroke-dashoffset: 850;
  animation: drawStroke 1.6s ease-out forwards;
}

.anim-draw {
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  animation: drawStroke 1.8s ease-in-out 0.2s forwards, fillIn 0.6s ease-out 1.2s forwards;
}

.ade-progress-track {
  width: 180px;
  height: 2px;
  background: rgba(212,175,55,0.2);
  margin: 16px auto 8px;
  border-radius: 99px;
  overflow: hidden;
  position: relative;
}

.ade-progress-bar {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #aa771c, #fae5a2, #d4af37);
  transition: width 0.15s linear;
}

.ade-status-text {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 13px;
  letter-spacing: 0.12em;
  color: #f5e6c4;
}

@keyframes drawStroke {
  to { stroke-dashoffset: 0; }
}

@keyframes fillIn {
  from { fill-opacity: 0; }
  to { fill-opacity: 1; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.92) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.75; transform: scale(1.1); }
}`;

  const jsSnippet = `/* 3. ADD BEFORE YOUR CLOSING </body> TAG */
<script>
(function() {
  const preloader = document.getElementById('ade-preloader');
  const progressBar = document.getElementById('ade-progress-bar');
  const statusText = document.getElementById('ade-status-text');
  if (!preloader) return;

  function hidePreloader() {
    if (progressBar) progressBar.style.width = '100%';
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 250);
  }

  function showPreloader(message) {
    preloader.classList.remove('fade-out');
    if (progressBar) progressBar.style.width = '35%';
    if (statusText && message) statusText.textContent = message;
  }

  // 1. Trigger when first reloading or loading any page
  window.addEventListener('load', () => {
    hidePreloader();
  });

  // Fallback timeout in case assets take long
  setTimeout(hidePreloader, 3500);

  // 2. Trigger EVERY TIME the user clicks to open a new page!
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    const target = link.getAttribute('target');

    // Only intercept valid internal page navigations
    if (
      href && 
      !href.startsWith('#') && 
      !href.startsWith('javascript:') && 
      !href.startsWith('mailto:') && 
      !href.startsWith('tel:') && 
      (!target || target === '_self') &&
      !e.ctrlKey && !e.metaKey && !e.shiftKey
    ) {
      // Don't show if clicking exact same URL hash
      if (link.hostname === window.location.hostname) {
        showPreloader('Loading next page...');
      }
    }
  });

  // 3. Handle browser Back/Forward (bfcache restore)
  window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
      preloader.classList.add('fade-out');
    }
  });
})();
</script>`;

  const singleFileBundle = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AdeClassics Website</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Cormorant+Garamond:ital@1&display=swap" rel="stylesheet">
  <style>
${cssSnippet}
  </style>
</head>
<body>

${htmlSnippet}

  <main style="padding: 60px; color: #333; font-family: sans-serif; text-align: center;">
    <h1>Welcome to AdeClassics</h1>
    <p>Try reloading this page, or click this link to test opening a new page:</p>
    <a href="?page=collection" style="color: #61101a; font-weight: bold;">Explore Collections &rarr;</a>
  </main>

${jsSnippet}
</body>
</html>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#1a070c] border border-[#d4af37]/40 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d4af37]/25 bg-[#250910]">
          <div className="flex items-center space-x-3">
            <Code2 className="w-5 h-5 text-[#d4af37]" />
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#f7e096]">
                AdeClassics Preloader Code
              </h2>
              <p className="text-xs text-[#d8c290]/80">
                Copy and paste directly into WordPress, Shopify, Next.js, or any website
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#d4af37]/60 hover:text-[#f7e096] rounded-md hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#d4af37]/20 px-6 bg-[#160408]">
          <button
            type="button"
            onClick={() => setActiveTab('vanilla')}
            className={`py-3 px-4 text-xs sm:text-sm font-montserrat font-medium border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'vanilla'
                ? 'border-[#d4af37] text-[#fae5a2]'
                : 'border-transparent text-[#b09d7c] hover:text-[#fae5a2]'
            }`}
          >
            <Globe className="w-4 h-4" />
            Standard HTML / CSS / JS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('single-file')}
            className={`py-3 px-4 text-xs sm:text-sm font-montserrat font-medium border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'single-file'
                ? 'border-[#d4af37] text-[#fae5a2]'
                : 'border-transparent text-[#b09d7c] hover:text-[#fae5a2]'
            }`}
          >
            <FileCode className="w-4 h-4" />
            All-in-One Complete HTML
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-[#e0cfaf]">
          {activeTab === 'vanilla' && (
            <div className="space-y-6">
              {/* How it works banner */}
              <div className="p-4 rounded border border-[#d4af37]/30 bg-[#2b0c13]/50 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-[#f4e4bf] leading-relaxed">
                  <strong>Automatic Trigger on Reload & Link Click:</strong> The script below
                  automatically hooks into <code className="text-[#f7e096]">window.load</code> to hide
                  smoothly when the page is ready, and intercepts every internal link click so the
                  luxury preloader seamlessly animates when navigating to any new page.
                </div>
              </div>

              {/* Step 1: HTML */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                    Step 1: HTML (Place right after &lt;body&gt;)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(htmlSnippet, 'html')}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[#351019] hover:bg-[#4a1623] text-[#f7e096] border border-[#d4af37]/30 cursor-pointer"
                  >
                    {copiedSection === 'html' ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedSection === 'html' ? 'Copied!' : 'Copy HTML'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded bg-[#0d0305] text-[#ecd8b0] text-xs font-mono overflow-x-auto max-h-48 border border-[#d4af37]/20">
                  {htmlSnippet}
                </pre>
              </div>

              {/* Step 2: CSS */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                    Step 2: CSS Stylesheet
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(cssSnippet, 'css')}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[#351019] hover:bg-[#4a1623] text-[#f7e096] border border-[#d4af37]/30 cursor-pointer"
                  >
                    {copiedSection === 'css' ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedSection === 'css' ? 'Copied!' : 'Copy CSS'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded bg-[#0d0305] text-[#ecd8b0] text-xs font-mono overflow-x-auto max-h-48 border border-[#d4af37]/20">
                  {cssSnippet}
                </pre>
              </div>

              {/* Step 3: JS */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                    Step 3: JavaScript Navigation Interceptor
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(jsSnippet, 'js')}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[#351019] hover:bg-[#4a1623] text-[#f7e096] border border-[#d4af37]/30 cursor-pointer"
                  >
                    {copiedSection === 'js' ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedSection === 'js' ? 'Copied!' : 'Copy JS'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded bg-[#0d0305] text-[#ecd8b0] text-xs font-mono overflow-x-auto max-h-48 border border-[#d4af37]/20">
                  {jsSnippet}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'single-file' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#d8c290]">
                  Ready-to-run single file combining HTML, CSS animations, and page transition JS:
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(singleFileBundle, 'single')}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#25080e] font-semibold cursor-pointer"
                >
                  {copiedSection === 'single' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-900" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copiedSection === 'single' ? 'Copied Bundle!' : 'Copy All Code'}</span>
                </button>
              </div>
              <pre className="p-4 rounded bg-[#0d0305] text-[#ecd8b0] text-xs font-mono overflow-x-auto max-h-[500px] border border-[#d4af37]/20">
                {singleFileBundle}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#d4af37]/20 bg-[#250910] flex items-center justify-between">
          <span className="font-cormorant italic text-xs text-[#d8c290]/80">
            AdeClassics &bull; Timeless Elegance Preloader Architecture
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-montserrat uppercase tracking-wider bg-[#3d121c] hover:bg-[#521927] text-[#fae5a2] border border-[#d4af37]/30 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
