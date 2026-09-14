import React from 'react';
import { motion } from 'motion/react';
import { AnimationPreset } from '../types';

interface AdeLogoSvgProps {
  preset?: AnimationPreset;
  progress?: number;
  className?: string;
  size?: number;
  showTagline?: boolean;
}

export const AdeLogoSvg: React.FC<AdeLogoSvgProps> = ({
  preset = 'stroke-draw',
  className = '',
  size = 340,
  showTagline = true,
}) => {
  const isDrawMode = preset === 'stroke-draw';

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Ambient background golden aura glow matching luxury maroon canvas */}
      <div 
        className="absolute w-80 h-80 rounded-full pointer-events-none blur-3xl opacity-40 bg-[radial-gradient(circle,#d4af37_0%,#61101a_65%,transparent_85%)] animate-luxury-glow"
        aria-hidden="true"
      />

      <motion.svg
        width={size}
        height={size * 1.05}
        viewBox="0 0 500 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_16px_36px_rgba(0,0,0,0.65)] overflow-visible"
        initial={preset === 'fade-pulse' ? { scale: 0.94, opacity: 0 } : undefined}
        animate={
          preset === 'fade-pulse'
            ? {
                scale: [0.94, 1, 1.02, 1],
                opacity: 1,
                transition: { duration: 1.8, ease: 'easeOut' },
              }
            : undefined
        }
      >
        <defs>
          {/* Polished 24K Metallic Gold Linear Gradient */}
          <linearGradient id="adeGoldGrad" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#fdf0b5" />
            <stop offset="22%" stopColor="#e2b952" />
            <stop offset="48%" stopColor="#aa7926" />
            <stop offset="76%" stopColor="#f7dc8c" />
            <stop offset="100%" stopColor="#8d5a15" />
          </linearGradient>

          {/* Concentric Circular Rings Gold Gradient */}
          <linearGradient id="adeGoldRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d8af43" />
            <stop offset="28%" stopColor="#faeab4" />
            <stop offset="55%" stopColor="#ba8b24" />
            <stop offset="82%" stopColor="#fae7a8" />
            <stop offset="100%" stopColor="#966517" />
          </linearGradient>

          {/* Crescent 'C' Ivory White & Soft Platinum Shading */}
          <linearGradient id="adeCrescentWhite" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#faf6ee" />
            <stop offset="85%" stopColor="#f4ebdb" />
            <stop offset="100%" stopColor="#dfca9e" />
          </linearGradient>

          {/* Sweeping 3D Calligraphic Swash Ribbon Gradient */}
          <linearGradient id="adeRibbonShine" x1="0%" y1="40%" x2="100%" y2="60%">
            <stop offset="0%" stopColor="#996a1b" />
            <stop offset="20%" stopColor="#faeab4" />
            <stop offset="45%" stopColor="#caa038" />
            <stop offset="70%" stopColor="#fff6d8" />
            <stop offset="90%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#7a4b0d" />
          </linearGradient>

          {/* Dynamic Speeder Shimmer Light Ray */}
          <linearGradient id="goldLightSweep" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            <animate
              attributeName="x1"
              from="-150%"
              to="250%"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              from="-50%"
              to="350%"
              dur="3s"
              repeatCount="indefinite"
            />
          </linearGradient>

          {/* Drop Shadows & Glow Filters */}
          <filter id="goldReliefGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000000" floodOpacity="0.75" />
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#ffd97a" floodOpacity="0.4" />
          </filter>

          <filter id="textDropShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.8" />
          </filter>

          <clipPath id="swashClip">
            <path d="M 100 170 C 130 240, 200 240, 250 205 C 290 175, 340 190, 385 240 L 375 255 C 330 200, 280 190, 240 220 C 195 255, 130 245, 100 190 Z" />
          </clipPath>
        </defs>

        {/* ================= 1. CIRCULAR MEDALLION RINGS ================= */}
        {/* Outer concentric solid gold circular ring */}
        <motion.circle
          cx="250"
          cy="180"
          r="140"
          stroke="url(#adeGoldRing)"
          strokeWidth="3.4"
          filter="url(#goldReliefGlow)"
          initial={isDrawMode ? { pathLength: 0, opacity: 0 } : { opacity: 1 }}
          animate={{
            pathLength: 1,
            opacity: 1,
            transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
          }}
        />

        {/* Inner concentric solid gold circular ring (matching logo-loader.png spacing) */}
        <motion.circle
          cx="250"
          cy="180"
          r="128"
          stroke="url(#adeGoldRing)"
          strokeWidth="1.8"
          initial={isDrawMode ? { pathLength: 0, opacity: 0 } : { opacity: 0.95 }}
          animate={{
            pathLength: 1,
            opacity: 0.95,
            transition: { duration: 1.6, delay: 0.15, ease: 'easeOut' },
          }}
        />

        {/* ================= 2. THE MONOGRAM ("A" & "C") ================= */}
        <g id="monogram-emblem" filter="url(#goldReliefGlow)">
          {/* CRESCENT 'C' (Luminous Ivory White Face with Golden Contour) */}
          <motion.path
            d="M 305 108 
               C 278 94, 214 98, 185 142 
               C 156 186, 168 238, 208 262 
               C 236 278, 278 274, 304 252 
               C 275 264, 230 258, 204 234 
               C 176 208, 178 165, 208 132 
               C 234 104, 280 102, 305 108 Z"
            fill="url(#adeCrescentWhite)"
            stroke="url(#adeGoldRing)"
            strokeWidth="1.8"
            initial={isDrawMode ? { pathLength: 0, opacity: 0 } : { opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 1,
              transition: { duration: 1.6, delay: 0.25, ease: 'easeInOut' },
            }}
          />

          {/* Crescent 'C' Inner Depth Shading */}
          <motion.path
            d="M 298 114 
               C 274 102, 222 108, 196 148 
               C 170 188, 180 232, 214 254 
               C 224 246, 200 226, 196 195 
               C 192 162, 215 128, 260 114 
               C 276 110, 288 112, 298 114 Z"
            fill="#ffffff"
            opacity="0.9"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9, transition: { duration: 1, delay: 0.5 } }}
          />

          {/* MAIN LETTER 'A' - Regal Neoclassical Serif Geometry */}
          {/* Left Slender Diagonal Leg with Bracketed Base Serif */}
          <motion.path
            d="M 249 56 
               L 165 258 
               L 150 259 
               C 144 260, 144 263, 148 264 
               L 182 264 
               C 186 263, 186 260, 180 259 
               L 173 258 
               L 204 186 
               L 242 70 
               Z"
            fill="url(#adeGoldGrad)"
            stroke="url(#adeGoldRing)"
            strokeWidth="1.2"
            initial={isDrawMode ? { pathLength: 0, opacity: 0 } : { opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 1,
              transition: { duration: 1.6, delay: 0.35, ease: 'easeInOut' },
            }}
          />

          {/* Right Bold Sculpted Diagonal Column with Heavy Base Serif */}
          <motion.path
            d="M 249 56 
               L 305 258 
               L 294 259 
               C 288 260, 288 263, 292 264 
               L 334 264 
               C 338 263, 338 260, 332 259 
               L 320 258 
               L 260 68 
               Z"
            fill="url(#adeGoldGrad)"
            stroke="url(#adeGoldRing)"
            strokeWidth="1.2"
            initial={isDrawMode ? { pathLength: 0, opacity: 0 } : { opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 1,
              transition: { duration: 1.6, delay: 0.4, ease: 'easeInOut' },
            }}
          />

          {/* Classical Apex Cap Serif at the Peak of 'A' */}
          <motion.path
            d="M 238 62 
               C 244 55, 256 55, 262 62 
               L 258 64 
               C 254 60, 246 60, 242 64 
               Z"
            fill="url(#adeGoldRing)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.8 } }}
          />

          {/* SWEEPING CALLIGRAPHIC GOLD RIBBON / SWASH (The Icon of AdeClassics) */}
          {/* Main 3D golden swash curving through the A and C */}
          <motion.path
            d="M 112 215 
               C 128 200, 150 205, 178 194 
               C 212 180, 235 188, 258 214 
               C 285 244, 320 240, 348 210 
               C 362 195, 368 185, 364 212 
               C 360 236, 335 258, 298 252 
               C 255 245, 228 208, 196 206 
               C 166 204, 142 225, 116 232 
               C 108 234, 106 226, 112 215 Z"
            fill="url(#adeRibbonShine)"
            stroke="url(#adeGoldRing)"
            strokeWidth="1.4"
            filter="url(#goldReliefGlow)"
            initial={isDrawMode ? { pathLength: 0, opacity: 0 } : { opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 1,
              transition: { duration: 1.8, delay: 0.5, ease: 'easeInOut' },
            }}
          />

          {/* Upper highlight spine of the swash ribbon */}
          <motion.path
            d="M 116 218 
               C 140 206, 168 202, 196 195 
               C 230 186, 252 202, 276 224 
               C 302 246, 332 242, 356 218"
            stroke="#fff9e2"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
            initial={isDrawMode ? { pathLength: 0 } : { pathLength: 1 }}
            animate={{
              pathLength: 1,
              transition: { duration: 1.4, delay: 0.7 },
            }}
          />

          {/* Metallic gleam sweep animation across the monogram */}
          <rect
            x="100"
            y="50"
            width="300"
            height="230"
            fill="url(#goldLightSweep)"
            opacity="0.4"
            pointerEvents="none"
          />
        </g>

        {/* ================= 3. ROYAL FLEUR-DE-LIS & FOLIAGE VINES ================= */}
        <motion.g
          id="royal-crest-ornament"
          initial={isDrawMode ? { scale: 0.7, opacity: 0 } : { opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            transition: { duration: 0.8, delay: 0.8, ease: 'backOut' },
          }}
          style={{ transformOrigin: '250px 320px' }}
        >
          {/* Center Fleur-de-Lis Spear */}
          <path
            d="M 250 298 
               C 254 308, 258 312, 257 322 
               C 257 328, 250 332, 250 332 
               C 250 332, 243 328, 243 322 
               C 242 312, 246 308, 250 298 Z"
            fill="url(#adeGoldGrad)"
          />
          {/* Left Curled Wing Petal */}
          <path
            d="M 242 322 
               C 230 318, 222 308, 226 298 
               C 230 292, 238 296, 241 306 
               C 243 312, 243 318, 242 322 Z"
            fill="url(#adeGoldGrad)"
          />
          {/* Right Curled Wing Petal */}
          <path
            d="M 258 322 
               C 270 318, 278 308, 274 298 
               C 270 292, 262 296, 259 306 
               C 257 312, 257 318, 258 322 Z"
            fill="url(#adeGoldGrad)"
          />
          {/* Clasp Band */}
          <path
            d="M 236 322 Q 250 325 264 322 L 263 326 Q 250 329 237 326 Z"
            fill="url(#adeGoldRing)"
          />
          {/* Base Bud */}
          <circle cx="250" cy="333" r="2.8" fill="url(#adeGoldGrad)" />

          {/* Left Curved Foliage Vine hugging the bottom circle */}
          <path
            d="M 230 324 
               C 205 325, 178 312, 162 292 
               C 168 296, 178 300, 192 301 
               C 182 303, 175 306, 170 312 
               C 188 312, 208 319, 226 322 Z"
            fill="url(#adeGoldGrad)"
            opacity="0.9"
          />
          {/* Right Curved Foliage Vine hugging the bottom circle */}
          <path
            d="M 270 324 
               C 295 325, 322 312, 338 292 
               C 332 296, 322 300, 308 301 
               C 318 303, 325 306, 330 312 
               C 312 312, 292 319, 274 322 Z"
            fill="url(#adeGoldGrad)"
            opacity="0.9"
          />
        </motion.g>

        {/* ================= 4. BRAND NAME ("AdeClassics") ================= */}
        {/* Exactly matching logo-loader.png: 'Ade' in 3D Gold, 'Classics' in Pristine White */}
        <motion.g
          id="brand-name-group"
          initial={{ opacity: 0, y: 12 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.9, delay: 0.9, ease: 'easeOut' },
          }}
        >
          <text
            x="250"
            y="402"
            textAnchor="middle"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="52"
            fontWeight="600"
            letterSpacing="0.015em"
            filter="url(#textDropShadow)"
          >
            {/* 'Ade' in Rich Lustrous Gold */}
            <tspan fill="url(#adeGoldGrad)">Ade</tspan>
            {/* 'Classics' in Pure Ivory White */}
            <tspan fill="#ffffff">Classics</tspan>
          </text>
        </motion.g>

        {/* ================= 5. DIVIDER LINE WITH DIAMOND ================= */}
        <motion.g
          id="divider-group"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{
            opacity: 1,
            scaleX: 1,
            transition: { duration: 0.8, delay: 1.05, ease: 'easeOut' },
          }}
          style={{ transformOrigin: '250px 426px' }}
        >
          {/* Left rule line */}
          <line
            x1="80"
            y1="426"
            x2="236"
            y2="426"
            stroke="url(#adeGoldRing)"
            strokeWidth="1.6"
            opacity="0.9"
          />
          {/* Center 4-point gold diamond star */}
          <polygon
            points="250,420 256,426 250,432 244,426"
            fill="url(#adeGoldGrad)"
            filter="url(#goldReliefGlow)"
          />
          {/* Right rule line */}
          <line
            x1="264"
            y1="426"
            x2="420"
            y2="426"
            stroke="url(#adeGoldRing)"
            strokeWidth="1.6"
            opacity="0.9"
          />
        </motion.g>

        {/* ================= 6. TAGLINE ("... Timeless Elegance") ================= */}
        {showTagline && (
          <motion.text
            x="250"
            y="464"
            textAnchor="middle"
            fontFamily="'Playfair Display', 'Cormorant Garamond', Georgia, serif"
            fontStyle="italic"
            fontSize="25"
            fontWeight="400"
            letterSpacing="0.16em"
            fill="#f5e4bd"
            filter="url(#textDropShadow)"
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: 0.95,
              y: 0,
              transition: { duration: 0.8, delay: 1.2, ease: 'easeOut' },
            }}
          >
            ...  Timeless Elegance
          </motion.text>
        )}
      </motion.svg>
    </div>
  );
};
