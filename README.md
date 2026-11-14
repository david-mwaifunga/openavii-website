# Openavii Technologies: website

The marketing site for **Openavii Technologies Limited**, Lusaka, Zambia. *Illuminating Your Digital Journey.*

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Vitest. No backend, no analytics, no cookies.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | development server |
| `npm run build` / `npm start` | production build / serve it |
| `npm run lint` | ESLint (kept clean, no warnings) |
| `npm test` | the Vitest suite, once (`npm run test:watch` to watch) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run assets` | regenerate the optimised brand images (see below) |

A change is done when `npm run lint`, `npm test` and `npm run build` are all green.

## Project structure

```
src/app/          layout, the page, globals.css (the design tokens), manifest, sitemap, robots, icons
src/content/      every word and fact on the site, as typed data
src/components/   ui/ (primitives) · layout/ (header, footer) · sections/ (the ten page sections) · seo/
src/context/      theme and the shared enquiry dialog
src/lib/          contrast engine, mailto builder, SEO metadata, theme script
scripts/          prepare-brand-assets.mjs
docs/brand-2026/  the brand Digest and the brief the site was built from
public/brand/     optimised logos, backgrounds, photos, team cut-outs (generated)
```

## Editing content

Copy and facts live in `src/content/`, not in components:

- **Contact details, address, registration, navigation** → `content/site.ts` (the only place they exist).
- **Services, process, sectors, reasons, team** → `services.ts`, `process.ts`, `sectors.ts`, `why.ts`, `team.ts`. Most of it is
  verbatim from the Company Profile; the tests compare it with `docs/brand-2026/brand-source-of-truth.md`, so a change to a
  documented sentence will fail a test unless the Digest changes too.
- **Packages and prices** → `packages.ts` (ZMW ranges). **Add-ons** → `addons.ts` (no prices, by decision).
- **A new sentence the brand documents do not contain** → wrap it in `newCopy('module.field', '...')` and add `// COPY-NEW`.
  The full list is exported as `copyNew` so the owner can approve it.
- **Social links** → add real URLs to `site.socialLinks`; icons appear only for URLs that exist. **Client logos** → add a file
  under `public/` and set `logo` in `content/clients.ts`.

Never invent statistics, years in business, project counts, testimonials, awards or extra team members.

## Brand assets pipeline

The site ships only optimised derivatives. The masters (8334 px logos, multi-megabyte photographs) are not in the repository.

```bash
BRAND_SRC="C:\path\to\BRANDING\Openavii" npm run assets
npm run assets -- --only=photos,team     # a subset: logos | backgrounds | photos | team | icons | shapes | social
```

It trims and resizes the logos (plus the approved all-white versions), converts the gradients and photographs to WebP within byte
budgets, builds the favicon, app icons and the 1200 × 630 social card (Geist ExtraBold, composed with sharp), and traces the six brand
shapes into SVG paths. It is idempotent, prints a size report and exits non-zero if a budget is exceeded.

## Testing

Tests sit next to the code. Highlights: `app/tokens.test.ts` (palette, semantic tokens and WCAG AA contrast in light, dark, dark-surface and
brand-surface contexts), `content/*` (copy compared against the Digest; banned filler, American spellings, invented claims),
`app/page.test.tsx` (section order, headings, alt text, anchors, axe in light and dark), `app/ssr.test.tsx` (the real server HTML), and
`assets.test.ts` (image budgets). The test setup fails any test that logs an unexpected `console.error`.

## Brand sources

The 2026 Brand Guideline and Company Profile are summarised, with confidence tags, in
[`docs/brand-2026/brand-source-of-truth.md`](docs/brand-2026/brand-source-of-truth.md). The brief for this rebuild is
[`docs/brand-2026/website-update-prompt.md`](docs/brand-2026/website-update-prompt.md).

*Designed and developed by David Mwaifunga.*
