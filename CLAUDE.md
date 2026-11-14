# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project Context

**Created By:** David Mwaifunga

The marketing site for **Openavii Technologies Limited** (Lusaka, Zambia): a technology partner that turns complex
business challenges into practical, secure and scalable digital solutions. It presents the company, its 15 services, its
process, the sectors it serves, the team, and the website packages and add-ons it sells.

**Brand name:** **Open** = open (transparent, accessible) · **avi** = light (illuminating) · **i** = ideas.
**Tagline:** Illuminating Your Digital Journey. **Campaign line:** The Right Technology Changes Everything.

**Source of truth for brand facts and copy:** [`docs/brand-2026/brand-source-of-truth.md`](docs/brand-2026/brand-source-of-truth.md)
(the "Digest", distilled from the 2026 Brand Guideline and Company Profile). The brief that produced the 2026 rebuild is
[`docs/brand-2026/website-update-prompt.md`](docs/brand-2026/website-update-prompt.md). Read the Digest before changing
copy, colour, type or imagery. Do not re-open the original PDFs.

## Development Guidelines

- You are a professional software engineer and UI/UX expert. Use full craft in styling and animation, inside the guardrails below.
- **Test-driven development is the default** (red, then green, then refactor). Content and CSS tokens count as behaviour.
  Never weaken an assertion to get green; understand the failure first. Exempt: pure renames, comment/doc/format-only
  edits, mechanical file moves.
- Follow a component-based architecture; document code with JSDoc (`@author David Mwaifunga`, `@company Openavii Technologies`)
  and comments that explain *why*.
- **British English** everywhere (organisation, optimise, colour, programme, enquiry).
- Ask whenever you need clarity, and always before inventing a fact.

## Commands

```bash
npm run dev         # development server (http://localhost:3000)
npm run build       # production build (also type-checks every .ts/.tsx, tests included)
npm run start       # serve the production build
npm run lint        # ESLint (must be clean: no warnings)
npm test            # Vitest, run once
npm run test:watch  # Vitest, watch mode
npm run typecheck   # tsc --noEmit
npm run assets      # regenerate public/brand/** from the brand masters (see "Brand assets")
```

## Tech Stack

- **Next.js 16.1** (App Router, Turbopack) · **React 19.2** · **TypeScript 5** (strict) · **Tailwind CSS 4** (`@tailwindcss/postcss`)
- **Geist** (variable, via `next/font/google`) is the only typeface. Geist Mono is not part of the brand and is not loaded.
- **lucide-react** is the single icon set (stroke 1.5, round caps). It is the only runtime dependency beyond Next and React.
- **Vitest 4** + Testing Library + `vitest-axe` (jsdom). `sharp` is a dev dependency for the asset pipeline.
- No backend, no analytics, no trackers, no cookies. The enquiry form opens the visitor's own mail app (`mailto:`).

## Project Architecture

```
src/
├── app/                    layout.tsx, page.tsx (assembles the sections), globals.css (design tokens),
│                           manifest.ts, sitemap.ts, robots.ts, icon.png, apple-icon.png, favicon.ico,
│                           opengraph-image.png, twitter-image.png   (file conventions supply icons and social cards)
├── content/                ALL copy and facts, as typed data. No copy lives in components.
│                           site.ts (the only place for company name, contact details, address, registration, nav),
│                           hero, problems, about, values, services, process, sectors, why, team, clients,
│                           packages, addons, contact, photos (image manifest), icons, copy (COPY-NEW registry)
├── components/
│   ├── ui/                 primitives: Button, Chip, Icon, IconRing, Logo, Modal, InquiryModal, Reveal, RingMark,
│   │                       Section, SectionHeader, ShapedPhoto + ShapeDefs, Tile/Panel, ThemeToggle,
│   │                       CurveDivider, GhostNumeral
│   ├── layout/             Header, Footer, SkipLink
│   ├── sections/           Hero, ProblemBand, WhoWeAre, Services, Approach, Sectors, Why, Team, Clients,
│   │                       Packages (+ PackageCard), Addons, ContactCta
│   └── seo/                JsonLd
├── context/                ThemeContext (light/dark/system), InquiryContext (one shared enquiry dialog)
├── hooks/                  useDialogBehaviour, useScrollAnimation, useScrolled, useMounted
├── lib/                    contrast (WCAG engine + CSS token reader), mailto, format, cn, seo, themeScript
└── test/                   setup (fails on unexpected console.error), utils, render, axe, digest (reads the Digest)
scripts/prepare-brand-assets.mjs     the asset pipeline (sharp)
docs/brand-2026/                     the Digest, the update prompt, QA screenshots
public/brand/                        optimised derivatives only (generated)
```

Tests live next to the code they cover (`*.test.ts` / `*.test.tsx`). `@/*` maps to `./src/*`.

## Key Conventions

- **Content is data.** Components import from `@/content`. A new sentence that is not verbatim from the Digest goes through
  `newCopy('module.field', '...')` and carries a `// COPY-NEW` comment; `copy-rules.test.ts` keeps both in step and the list
  is exported as `copyNew` for owner approval. Never invent statistics, years, counts, testimonials, awards, extra clients,
  extra team members, bios, surnames or social URLs. Registrations "Awaiting Approval" are never shown as achieved; the ZRA TPIN is never published.
- **One source of facts.** Phone numbers, e-mail addresses, address and the PACRA number exist only in `content/site.ts`.
- **Tokens only.** No hex literals or Tailwind default colours in components. Raw brand tokens (`--brand-*`) live in
  `globals.css`; components use semantic tokens (`bg-page`, `text-fg`, `text-accent-text`, `bg-btn`, ...). `repo-hygiene.test.ts` enforces this.
- **Surfaces.** `page` and `alt` sections follow the theme. `data-surface="dark"` and `data-surface="brand"` are fixed brand
  surfaces that redefine the semantic tokens locally, so one component is correct everywhere. Never put two sections with the
  same surface next to each other. Curved dividers are painted in the neighbouring section's colour using `--theme-page` / `--theme-alt`.
- **Accessibility is a requirement (WCAG 2.2 AA).** Contrast is tested in `tokens.test.ts` for every pairing in all four
  colour contexts. Never put white text on `#099CC1` (3.19:1); on cyan use `#111111`. Skip link first, one `<h1>`, visible
  focus ring, 44 px targets, `inert` background and focus trap in dialogs, `aria-expanded` on the menu, alt text everywhere
  (empty + `aria-hidden` only for decoration).
- **Motion = illumination** (things move from dim to lit). Animate transform and opacity only, with CSS and one
  IntersectionObserver; no animation library. Scroll reveals are hidden only under `html.js` (set by the inline theme script) so
  no-JS and crawlers see everything. `prefers-reduced-motion` shows final states.
- **Speed is a brand principle.** Exactly one preloaded image (the hero photo, via `preload`); every other `next/image` is
  lazy; logos below the fold use `eager={false}`. No file in `public/` over 400 KB. `ssr.test.tsx` checks the real server HTML.
- **Theme.** The inline script in `<head>` (`lib/themeScript`) applies the theme before paint; the `localStorage` key is `openavii-theme`.
  Logos switch by CSS (`.logo-on-light` / `.logo-on-dark`), never with a mounted skeleton.
- React 19 lint rules are strict: no `setState` in effects (use `useSyncExternalStore`), no ref access during render.
- Test setup fails any test that logs an unexpected `console.error` (this caught invalid HTML nesting). A test that expects an error mocks it explicitly.

## Design System

- **Colours (Digest §4.2):** Navy `#223450` (primary) · Deep blue `#1D4A68` · Teal `#146F91` · Cyan `#099CC1` (accent) ·
  Bright cyan `#00C0EC` (small text/fills on dark) · White `#FEFEFE` · Mist `#F2F2F2` · Near-black `#111111`.
  Green `#02AF17` and orange `#FF5B00` are not UI colours. Gradients: `--grad-divider`, `--grad-panel`, `--grad-band`.
- **Type (Geist):** H1/H2 ExtraBold 800 tightly tracked (-0.04em / -0.035em), H3/H4 Bold 700, body Regular 400, lead lines Light 300,
  button labels Bold 700 (a documented deviation: Light fails legibility on a filled button). Fluid scale in `@theme` (`text-h1` ... `text-overline`).
  Headlines are Title Case; body is sentence case.
- **Brand devices:** ghost section numerals, wave artwork, curved-edge panels, shaped and chamfered photos (the six "Layout Shapes",
  traced to SVG clip paths in `components/ui/shapePaths.ts`), the oversized ring watermark (`RingMark`, the approved mark as a mask),
  two-tone headings, the colour-blocked tile mosaic, thin cyan rules, thin-line icons in the notched ring (`IconRing`).
- **Logo:** approved 2026 artwork only, never redrawn or recoloured. Minimum width 120 px; clear space is one third of the logo height.

## Brand assets

`public/brand/**`, `src/app/icon.png`, `apple-icon.png`, `favicon.ico`, `opengraph-image.png`, `twitter-image.png` and
`components/ui/shapePaths.ts` are **generated** by `npm run assets` from the brand masters (`BRAND_SRC`, default
`C:\Users\mwaif\OneDrive\Documents\Openavii Technologies Limited\BRANDING\Openavii`). Never commit the masters. `assets.test.ts`
enforces byte budgets, dimensions and that nothing outdated remains. Add photos only from the approved brand set.

## Out of scope (follow-ups)

Per-service and per-sector pages, case studies and testimonials (none exist), a server-side contact form, consent-based analytics,
Privacy/Terms pages (recommended before any data is stored; Zambia's Data Protection Act 2021), an SVG logo swap, a video hero, multi-language.
