import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AdeLogoSvg } from './AdeLogoSvg';
import { PreloaderConfig } from '../types';
import { playLuxuryChime } from '../utils/audio';

interface PreloaderOverlayProps {
  isLoading: boolean;
  config: PreloaderConfig;
  targetPageTitle?: string;
  onComplete?: () => void;
  customLogoUrl?: string | null;
}

const themeBackgrounds: Record<string, string> = {
  'royal-maroon': 'radial-gradient(ellipse at center, #64111d 0%, #61101a 50%, #440911 100%)',
  'midnight-onyx': 'radial-gradient(ellipse at center, #1c1c22 0%, #0e0e11 60%, #050507 100%)',
  'emerald-estate': 'radial-gradient(ellipse at center, #0f3621 0%, #082114 60%, #030f08 100%)',
  'imperial-navy': 'radial-gradient(ellipse at center, #10213d 0%, #091324 60%, #040810 100%)',
};

export const PreloaderOverlay: React.FC<PreloaderOverlayProps> = ({
  isLoading,
  config,
  targetPageTitle = 'Home',
  onComplete,
  customLogoUrl,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Entering AdeClassics...');

  const durationMs =
    config.speed === 'fast' ? 900 : config.speed === 'balanced' ? 1600 : 2500;

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    setProgress(0);
    const messages = [
      'Entering AdeClassics...',
      `Preparing ${targetPageTitle}...`,
      'Refining timeless craftsmanship...',
      'Welcome.',
    ];
    setStatusMessage(messages[0]);

    const startTime = performance.now();
    let animFrame: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      if (pct > 25 && pct <= 60) {
        setStatusMessage(messages[1]);
      } else if (pct > 60 && pct < 90) {
        setStatusMessage(messages[2]);
      } else if (pct >= 90) {
        setStatusMessage(messages[3]);
      }

      if (elapsed < durationMs) {
        animFrame = requestAnimationFrame(tick);
      } else {
        if (config.soundEnabled) {
          playLuxuryChime();
        }
        if (onComplete) {
          setTimeout(onComplete, 250);
        }
      }
    };

    animFrame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [isLoading, durationMs, targetPageTitle, config.soundEnabled, onComplete]);

  if (!isLoading) return null;

  const bgStyle = {
    background: themeBackgrounds[config.theme] || themeBackgrounds['royal-maroon'],
  };

  const isCurtain = config.preset === 'curtain-split';

  return (
    <AnimatePresence>
      <div
        id="adeclassics-preloader"
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={!isCurtain ? bgStyle : undefined}
      >
        {/* If Curtain preset: left and right velvet curtains that slide open */}
        {isCurtain ? (
          <>
            <motion.div
              className="absolute top-0 bottom-0 left-0 w-1/2 z-0 border-r border-[#d4af37]/30 shadow-[5px_0_25px_rgba(0,0,0,0.8)]"
              style={bgStyle}
              exit={{ x: '-100%', transition: { duration: 0.7, ease: [0.77, 0, 0.175, 1] } }}
            />
            <motion.div
              className="absolute top-0 bottom-0 right-0 w-1/2 z-0 border-l border-[#d4af37]/30 shadow-[-5px_0_25px_rgba(0,0,0,0.8)]"
              style={bgStyle}
              exit={{ x: '100%', transition: { duration: 0.7, ease: [0.77, 0, 0.175, 1] } }}
            />
          </>
        ) : (
          /* Subtle vignette overlay */
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
        )}

        {/* Floating golden dust specks / ambient texture */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-[#f7e096] rounded-full blur-[1px] animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-[#d4af37] rounded-full blur-[1px] animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-[#fff3ce] rounded-full blur-[0.5px] animate-pulse [animation-delay:2s]" />
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-[#d4af37] rounded-full blur-[1px] animate-pulse [animation-delay:1.5s]" />
        </div>

        {/* Center Content Container */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center max-w-lg w-full px-6 text-center"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: 'blur(8px)',
            transition: { duration: 0.5, ease: 'easeIn' },
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Logo representation: Vector SVG or Raster if provided */}
          {customLogoUrl ? (
            <div className="relative mb-3 flex flex-col items-center">
              {/* Ambient golden glow behind image */}
              <div 
                className="absolute w-72 h-72 rounded-full pointer-events-none blur-3xl opacity-45 bg-[radial-gradient(circle,#d4af37_0%,#61101a_65%,transparent_85%)] animate-luxury-glow"
                aria-hidden="true"
              />
              <motion.img
                src={customLogoUrl}
                alt="AdeClassics Logo"
                className="relative z-10 w-72 sm:w-80 max-w-[85vw] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.75)]"
                referrerPolicy="no-referrer"
                initial={{ scale: 0.94, opacity: 0 }}
                animate={
                  config.preset === 'fade-pulse'
                    ? { scale: [0.94, 1.02, 0.98, 1], opacity: 1, transition: { duration: 2, ease: 'easeOut' } }
                    : { scale: 1, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } }
                }
              />
            </div>
          ) : (
            <AdeLogoSvg
              preset={config.preset}
              progress={progress}
              size={330}
              className="mb-1"
            />
          )}

          {/* Progress Section */}
          {config.showProgress && (
            <motion.div
              className="w-full max-w-xs mt-3 flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              {/* Slender golden progress bar */}
              <div className="w-full h-[2.5px] bg-[#2e0910] rounded-full overflow-hidden border border-[#d4af37]/25 relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#aa771c] via-[#fae5a2] to-[#d4af37] relative"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear', duration: 0.1 }}
                >
                  {/* Leading sparkle pip */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#ffffff] shadow-[0_0_8px_#fae5a2]" />
                </motion.div>
              </div>

              {/* Status and Percentage */}
              <div className="w-full flex items-center justify-between mt-2.5 px-0.5 text-xs text-[#d8c290]/80 tracking-wider">
                <span className="font-cormorant italic text-sm tracking-widest text-[#f5e6c4]">
                  {statusMessage}
                </span>
                <span className="font-cinzel text-[11px] font-semibold text-[#d4af37]">
                  {progress}%
                </span>
              </div>
            </motion.div>
          )}

          {/* Quick Skip button for convenient previewing */}
          <button
            type="button"
            onClick={() => {
              if (onComplete) onComplete();
            }}
            className="mt-6 text-[10px] tracking-[0.25em] uppercase text-[#f7e096]/50 hover:text-[#f7e096] transition-colors py-1 px-3 rounded border border-transparent hover:border-[#d4af37]/30"
          >
            Skip Intro
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
