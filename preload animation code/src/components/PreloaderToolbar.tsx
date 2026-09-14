import React, { useRef } from 'react';
import {
  RotateCw,
  Sparkles,
  Layers,
  Clock,
  Palette,
  Volume2,
  VolumeX,
  Code2,
  Play,
  Eye,
  Upload,
  Image as ImageIcon,
  Check,
  RotateCcw,
} from 'lucide-react';
import {
  AnimationPreset,
  BackgroundTheme,
  LoadingSpeed,
  PageId,
  PreloaderConfig,
} from '../types';

interface PreloaderToolbarProps {
  config: PreloaderConfig;
  onUpdateConfig: (newConfig: Partial<PreloaderConfig>) => void;
  onTriggerReload: () => void;
  onTriggerNavigate: (page: PageId) => void;
  currentPage: PageId;
  onOpenCodeModal: () => void;
  isPreloaderActive: boolean;
  customLogoUrl: string | null;
  onUploadLogo: (dataUrl: string) => void;
  onClearLogo: () => void;
}

export const PreloaderToolbar: React.FC<PreloaderToolbarProps> = ({
  config,
  onUpdateConfig,
  onTriggerReload,
  onTriggerNavigate,
  currentPage,
  onOpenCodeModal,
  isPreloaderActive,
  customLogoUrl,
  onUploadLogo,
  onClearLogo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          onUploadLogo(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const pages: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Grand Maison' },
    { id: 'collections', label: 'Haute Horology' },
    { id: 'bespoke', label: 'Bespoke Tailoring' },
    { id: 'heritage', label: 'Heritage 1892' },
    { id: 'atelier', label: 'Private Atelier' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#16060a]/95 backdrop-blur-md border-b border-[#d4af37]/25 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Brand title & Live status */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34d399] animate-ping" />
              <span className="font-cinzel text-sm sm:text-base font-bold tracking-wider gold-gradient-text">
                AdeClassics
              </span>
              <span className="hidden sm:inline-block text-[11px] uppercase tracking-widest text-[#d8c290]/70 border-l border-[#d4af37]/30 pl-2">
                Preloader Engine
              </span>
            </div>

            {/* Direct Trigger Button */}
            <button
              id="btn-trigger-preloader"
              type="button"
              onClick={onTriggerReload}
              disabled={isPreloaderActive}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#2a0409] font-cinzel text-xs font-bold tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_2px_10px_rgba(212,175,55,0.3)] disabled:opacity-50 cursor-pointer"
              title="Simulate page reload with preloader"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isPreloaderActive ? 'animate-spin' : ''}`} />
              <span>Test Reload</span>
            </button>
          </div>

          {/* Quick Page navigation triggers (The key requirement: shows every time you try opening a new page) */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
            <span className="text-[11px] uppercase tracking-widest text-[#d8c290]/50 mr-1 hidden md:inline">
              Switch Page:
            </span>
            {pages.map((p) => {
              const isActive = currentPage === p.id;
              return (
                <button
                  key={p.id}
                  id={`nav-tab-${p.id}`}
                  type="button"
                  onClick={() => onTriggerNavigate(p.id)}
                  className={`px-2.5 py-1 text-xs font-montserrat tracking-wider rounded transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#d4af37]/20 text-[#fcedaa] border border-[#d4af37]/50 font-medium'
                      : 'text-[#e5d4b5]/70 hover:text-[#fff3ce] hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Configuration controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Animation style select */}
            <div className="flex items-center space-x-1 bg-[#25080e] rounded p-0.5 border border-[#d4af37]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37] ml-1.5 hidden sm:inline" />
              <select
                id="select-preset"
                value={config.preset}
                onChange={(e) =>
                  onUpdateConfig({ preset: e.target.value as AnimationPreset })
                }
                className="bg-transparent text-xs text-[#fae5a2] font-montserrat py-1 px-2 focus:outline-none cursor-pointer"
                title="Animation Preset"
              >
                <option value="stroke-draw" className="bg-[#25080e] text-[#f7e096]">
                  SVG Stroke Draw
                </option>
                <option value="fade-pulse" className="bg-[#25080e] text-[#f7e096]">
                  Fade & Gold Pulse
                </option>
                <option value="curtain-split" className="bg-[#25080e] text-[#f7e096]">
                  Velvet Curtain Split
                </option>
                <option value="minimal-luxury" className="bg-[#25080e] text-[#f7e096]">
                  Minimalist Luxury
                </option>
              </select>
            </div>

            {/* Speed toggle */}
            <div className="flex items-center space-x-1 bg-[#25080e] rounded p-0.5 border border-[#d4af37]/30">
              <Clock className="w-3 h-3 text-[#d4af37] ml-1.5 hidden sm:inline" />
              <select
                id="select-speed"
                value={config.speed}
                onChange={(e) =>
                  onUpdateConfig({ speed: e.target.value as LoadingSpeed })
                }
                className="bg-transparent text-xs text-[#fae5a2] font-montserrat py-1 px-1.5 focus:outline-none cursor-pointer"
                title="Loading Speed"
              >
                <option value="fast" className="bg-[#25080e] text-[#f7e096]">
                  Fast (0.9s)
                </option>
                <option value="balanced" className="bg-[#25080e] text-[#f7e096]">
                  Normal (1.6s)
                </option>
                <option value="cinematic" className="bg-[#25080e] text-[#f7e096]">
                  Cinematic (2.5s)
                </option>
              </select>
            </div>

            {/* Background Theme */}
            <div className="flex items-center space-x-1 bg-[#25080e] rounded p-0.5 border border-[#d4af37]/30">
              <Palette className="w-3 h-3 text-[#d4af37] ml-1.5 hidden sm:inline" />
              <select
                id="select-theme"
                value={config.theme}
                onChange={(e) =>
                  onUpdateConfig({ theme: e.target.value as BackgroundTheme })
                }
                className="bg-transparent text-xs text-[#fae5a2] font-montserrat py-1 px-1.5 focus:outline-none cursor-pointer"
                title="Color Palette"
              >
                <option value="royal-maroon" className="bg-[#25080e] text-[#f7e096]">
                  Maroon Wine
                </option>
                <option value="midnight-onyx" className="bg-[#25080e] text-[#f7e096]">
                  Midnight Onyx
                </option>
                <option value="emerald-estate" className="bg-[#25080e] text-[#f7e096]">
                  Royal Emerald
                </option>
                <option value="imperial-navy" className="bg-[#25080e] text-[#f7e096]">
                  Imperial Navy
                </option>
              </select>
            </div>

            {/* Sound chime toggle */}
            <button
              id="btn-toggle-sound"
              type="button"
              onClick={() => onUpdateConfig({ soundEnabled: !config.soundEnabled })}
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                config.soundEnabled
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#fceaaa]'
                  : 'bg-[#25080e] border-[#d4af37]/30 text-[#8d795b] hover:text-[#e2cca4]'
              }`}
              title={config.soundEnabled ? 'Luxury chime sound enabled' : 'Muted'}
            >
              {config.soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Custom Logo File Uploader */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
              id="logo-file-input"
            />

            {customLogoUrl ? (
              <div className="flex items-center gap-1 bg-[#2a0b12] border border-[#d4af37]/40 rounded px-2 py-1 text-xs text-[#fae5a2]">
                <ImageIcon className="w-3.5 h-3.5 text-[#34d399]" />
                <span className="hidden sm:inline font-montserrat text-[11px]">Original PNG</span>
                <button
                  type="button"
                  onClick={onClearLogo}
                  title="Switch back to Vector SVG"
                  className="ml-1 text-[#d8c290]/60 hover:text-[#fae5a2] p-0.5 rounded transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                id="btn-upload-logo"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-[#d4af37]/30 bg-[#25080e] hover:bg-[#350b14] text-[#fae5a2] text-xs font-montserrat tracking-wide transition-all cursor-pointer"
                title="Upload or drop your logo image (e.g. logo-loader.png)"
              >
                <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="hidden sm:inline">Use Image</span>
              </button>
            )}

            {/* Get Code Export Button */}
            <button
              id="btn-open-code-modal"
              type="button"
              onClick={onOpenCodeModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#d4af37]/60 bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#fcedaa] text-xs font-montserrat font-medium tracking-wide transition-all shadow-[0_0_12px_rgba(212,175,55,0.15)] cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Get Website Code</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
