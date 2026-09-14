export type AnimationPreset = 'stroke-draw' | 'fade-pulse' | 'curtain-split' | 'minimal-luxury';

export type LoadingSpeed = 'fast' | 'balanced' | 'cinematic';

export type BackgroundTheme = 'royal-maroon' | 'midnight-onyx' | 'emerald-estate' | 'imperial-navy';

export type PageId = 'home' | 'collections' | 'bespoke' | 'heritage' | 'atelier' | 'boutique';

export interface PreloaderConfig {
  preset: AnimationPreset;
  speed: LoadingSpeed;
  theme: BackgroundTheme;
  showProgress: boolean;
  soundEnabled: boolean;
  blurBackdrop: boolean;
  logoMode: 'svg-vector' | 'raster';
}

export interface NavPage {
  id: PageId;
  title: string;
  subtitle: string;
}
