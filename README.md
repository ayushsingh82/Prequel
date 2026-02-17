# NJU

**Early price discovery for pre-token projects.** A modern marketing site for **NJU**—prediction markets as the default venue for pre-token price discovery, in the spirit of Hyperliquid and Pendle pre-markets.

---

## Overview

This repository contains the front-end for **NJU** (v0.1 / Beta): a single-page marketing site built with Next.js. The application presents the product value proposition, live markets, trading categories, platform principles, and platform colophon in one scrollable experience with smooth scroll, scroll-triggered animations, and an editorial visual style.

---

## Features

- **Single-page layout** — Hero, Live Markets, Trading Categories, Why Pre-Markets, and Colophon in one vertical flow with fixed side navigation and smooth section scrolling.
- **Scroll-driven animations** — GSAP ScrollTrigger for parallax, fade/slide reveals, and Lenis-compatible smooth scroll (component provided; wire in layout to enable).
- **Interactive UI** — Split-flap headline with optional sound, scramble-on-hover CTA text, custom cursor in markets section, hover-reveal cards in categories, and highlight/parallax text in principles.
- **Design system** — Monochrome base with orange accent, grid background, animated noise overlay, and typography (Bebas Neue for display, Geist/Geist Mono for body).
- **Responsive** — Layout and typography scale for mobile and desktop.

---

## Tech Stack

| Category   | Technologies |
|-----------|---------------|
| Framework | Next.js 16, React 19 |
| Styling   | Tailwind CSS 4, tw-animate-css, custom design tokens (globals.css) |
| Animation | GSAP (ScrollTrigger), Framer Motion, Lenis (smooth scroll) |
| UI        | Radix UI primitives, Lucide React icons |
| Fonts     | Next.js Google Fonts (Geist, Geist Mono), Bebas Neue (display) |
| Analytics | Vercel Analytics |

---

## Prerequisites

- **Node.js** 18.x or later  
- **npm** (or yarn/pnpm)

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The root route renders the marketing page.

### Build for production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
nextui-starter4/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Marketing page (all sections)
│   └── globals.css         # Design tokens, grid/noise, base styles
├── components/
│   ├── hero-section.tsx        # Hero, split-flap title, CTAs
│   ├── signals-section.tsx     # Live markets horizontal strip
│   ├── work-section.tsx        # Trading categories grid
│   ├── principles-section.tsx  # Why Pre-Markets principles
│   ├── colophon-section.tsx    # Platform footer / colophon
│   ├── side-nav.tsx            # Section nav + smooth scroll
│   ├── split-flap-text.tsx     # Split-flap display + audio
│   ├── scramble-text.tsx       # Scramble-on-hover text
│   ├── highlight-text.tsx      # Accent highlight + parallax
│   ├── bitmap-chevron.tsx      # CTA arrow icon
│   ├── animated-noise.tsx      # Canvas noise overlay
│   └── smooth-scroll.tsx       # Lenis + GSAP integration
└── lib/
    └── utils.ts
```

---

## Application Sections

| Section        | ID          | Description |
|----------------|-------------|-------------|
| Hero           | `#hero`     | Headline (split-flap), tagline, value prop, Start Trading / Market Activity CTAs. |
| Live Markets   | `#signals`  | Horizontal list of market cards (e.g. AI, DeFi, L2, NFT, Gaming) with custom cursor. |
| Trading Categories | `#work` | Asymmetric grid of categories (DeFi, Infrastructure, AI, Gaming, NFT, RWA) with hover-reveal. |
| Why Pre-Markets | `#principles` | Four principles (Early Discovery, Liquidity First, Market Signals, Proven Model) with highlight text. |
| Colophon       | `#colophon` | Platform, stack, typography, markets, trading links, copyright. |

Side navigation tracks the visible section (IntersectionObserver) and scrolls to sections on click.

---

## License

Proprietary. © 2025 NJU. All rights reserved.
