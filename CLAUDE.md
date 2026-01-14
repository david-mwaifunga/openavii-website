# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

**Created By:** David Mwaifunga

This is a portfolio/showcase website for Openavii Technologies, demonstrating the quality of work and design capabilities. The site displays website development packages offered by the company.

**Brand Name Meaning:**
- **Open** = Open (Transparent, accessible solutions)
- **avi** = Light (Illuminating digital pathways)
- **i** = International (Global reach and standards)

## Development Guidelines

- You are a professional Software Engineer and UI/UX expert
- Do not withhold your skill in styling and animation - yield your full potential
- Follow a component-based architecture
- Follow best practices
- Properly document the code with comments
- Ask whenever you need clarity

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Next.js 16.1** with App Router
- **React 19.2** with Server Components
- **TypeScript 5** (strict mode enabled)
- **Tailwind CSS 4** via `@tailwindcss/postcss`
- **ESLint 9** with flat config (next/core-web-vitals + next/typescript)

## Project Architecture

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout with fonts & metadata
│   ├── page.tsx              # Home page (assembles sections)
│   └── globals.css           # Global styles & animations
│
└── components/
    ├── ui/                   # Reusable UI primitives
    │   ├── Button.tsx        # Multi-variant button component
    │   ├── Badge.tsx         # Label/tag component
    │   ├── Card.tsx          # Glass morphism card component
    │   └── index.ts          # Barrel export
    │
    ├── layout/               # Layout components
    │   ├── Header.tsx        # Navigation with scroll effects
    │   ├── Footer.tsx        # Contact CTA & site links
    │   └── index.ts          # Barrel export
    │
    └── sections/             # Page sections
        ├── Hero.tsx          # Landing hero with animations
        ├── About.tsx         # Company info & values
        ├── Packages.tsx      # Package grid display
        ├── PackageCard.tsx   # Individual package card
        ├── Addons.tsx        # Optional services section
        └── index.ts          # Barrel export
```

## Key Conventions

- **Path alias:** `@/*` maps to `./src/*`
- **Fonts:** Geist Sans and Geist Mono via `next/font/google`
- **Theme:** Dark mode with violet/indigo accent colors
- **Styling:** Tailwind CSS with custom animations in `globals.css`
- **Components:** Each component has JSDoc comments with `@author` and `@company` tags

## Design System

- **Colors:** Violet (#8b5cf6), Indigo (#6366f1), Purple (#a855f7)
- **Effects:** Glassmorphism, gradient backgrounds, subtle animations
- **Animations:** Float, fade-in, pulse, scroll indicator (defined in globals.css)
