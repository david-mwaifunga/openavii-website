# Prompt — Rebuild the Openavii website to the 2026 brand

> **For the human.** Open a fresh Claude Code session at the repo root and say:
> *"Read and execute `docs/brand-2026/website-update-prompt.md`."* Everything the agent needs is in this file and in
> `docs/brand-2026/brand-source-of-truth.md` (the **Digest**). Decisions that only you can make are listed in §10 with safe
> defaults, so the agent will not stall. Nothing is pushed; work lands on a feature branch.
>
> **PROMPT START** ↓

---

## 0. Role, outcome and the bar

You are a senior product engineer and brand/UI designer. Update the Openavii Technologies marketing site
(Next.js 16 App Router · React 19 · TypeScript strict · Tailwind CSS 4) so that it **expresses the 2026 brand** instead of
looking like a generic agency template. Follow the repo's `CLAUDE.md` and the owner's global rules (TDD, verify before
"done"). Use your full craft in styling and animation — inside the guardrails below.

**Required reading before touching code:** `docs/brand-2026/brand-source-of-truth.md` — all of it. Brand files live in
`BRAND_SRC = C:\Users\mwaif\OneDrive\Documents\Openavii Technologies Limited\BRANDING\Openavii`.
If that folder is not readable, request access to it; do **not** substitute other images or logos.
(The `Read` tool cannot render PDFs on this machine; you do not need the PDFs — the Digest contains everything.)

### The posture, translated

| Word | What it means on the page |
|---|---|
| **Professional** | Navy-led palette, strict grid, evidence not adjectives, registration and contact details visible, zero template tells. |
| **Bold** | Oversized tightly-tracked Geist, solid colour blocks, giant ghost numerals, curved-edge panels, full-bleed photography, decisive problem-first headlines. |
| **Confident** | Declarative sentences, no hedging, no filler, every claim true and traceable to the Digest. Show, don't claim. |
| **Human** | Real African professionals, plain business language, a named team, Lusaka stated openly. |

### The three tests every section must pass

1. **Logo-swap test** — replace our logo with a competitor's: the section should stop making sense.
2. **Paste test** — if a competitor could paste a sentence onto their site unchanged, rewrite it with a specific from the Digest.
3. **Four-question test (the brand's own)** — the page answers: *What challenge does the client face? How does Openavii solve it? What measurable value does it create? Why trust Openavii?*

---

## 1. Non-negotiables

1. **Logo** — use only the approved 2026 artwork (Digest §4.1). Never redraw, recolour, stretch, rotate, outline, shadow or separate it. Minimum width 120 px. Clear space = ⅓ of the logo height. Never on a low-contrast or cluttered background. **The logos currently in `public/` are outdated — delete them.**
2. **Palette** — only the Digest §4.2 colours and §4.3 gradients. No electric blue `#2563eb`, no violet/indigo, no new hues; tints only via `color-mix()` of palette colours. Green and orange are **not** UI colours. No hex literals in components — tokens only.
3. **Typeface** — Geist only (variable). Remove Geist Mono. Weights per Digest §4.4.
4. **Never fabricate** — statistics, years in business, project counts, testimonials, case studies, awards, certifications, response-time promises, extra clients, extra team members, bios, surnames (only "David Mwaifunga" is known), social URLs. Registrations "Awaiting Approval" must never be shown as achieved. Do **not** publish the TPIN. Vision ("To become Africa's most trusted technology partner") is a vision, never a present claim.
5. **Copy** — British English; brand voice (Digest §3); banned filler list in Digest §3. Use Digest copy **verbatim** where it exists. Any new sentence is tagged `// COPY-NEW` in its content module and listed in your final report for approval.
6. **Accessibility** — WCAG 2.2 AA is a requirement, not polish (§4.6). Contrast is tested, not eyeballed.
7. **Speed is a brand principle** — performance budget in §6.5. No raw brand masters in `public/`.
8. **Preserve behaviour** — theme toggle (+ `localStorage` key `openavii-theme`), in-page anchors, the inquiry modal flows, no backend, **no analytics, trackers or cookies**.
9. **Repo conventions** — every component has JSDoc with `@author David Mwaifunga` and `@company Openavii Technologies`; barrel `index.ts` exports; `@/` alias; component-based architecture; no `any`; comments that explain *why*.
10. **TDD** (owner's global rule) — red → green → refactor for every behaviour change; never weaken or delete an assertion to get green; show test counts. Content and CSS tokens **are** behaviour here (§7). Exempt only: pure renames, doc/formatting-only edits, mechanical file moves.
11. **Git** — work on branch `feat/brand-2026`; one commit per phase; **do not push or open a PR**. Never commit originals from `BRAND_SRC`.
12. **Stop-and-ask triggers** — (a) a section would need invented facts, (b) a brand rule conflicts with accessibility (propose the compliant alternative, record the deviation), (c) an asset is missing or unusable. Batch questions; otherwise proceed with the defaults in §10.

---

## 2. What is wrong today → what to do

| Area | Finding in the current repo | Fix |
|---|---|---|
| Logo / icons | `public/Openavii-Dark.png` (959 KB) and `Openavii-Light.png` (1.2 MB) are an **outdated** wordmark (thin letter-spaced "TECHNOLOGIES", no notched ring). Favicon, `icon-512`, `apple-touch-icon` use it. | Replace with 2026 artwork, trimmed and optimised (§5); new icons from the Mark. |
| Palette | `globals.css` claims to "mirror the brand guidelines exactly" but uses electric blue `#2563eb`, cyan `#06b6d4`, navy `#233550`; lacks `#1D4A68` and `#146F91`. `CLAUDE.md` still says violet/indigo. Hex literals in components (`from-[#0e7490]`, `from-[#5b9bf8]`). | Rebuild tokens from Digest §4.2–4.3; update `CLAUDE.md`. |
| Style language | Glassmorphism, blurred floating orbs, particle dots, grid overlay, pulsing "Available for New Projects", gradient text on every H2 — a generic "SaaS template" look. | Remove. Use the brand's devices (Digest §4.5). |
| Photography | 8 generic desk/laptop stock images, ≈ 14.9 MB, used as blurred backgrounds and a slideshow. | Replace with the 9 brand photos (§5). No carousel. |
| Copy | "captivate your audience and drive real results", "Fast Delivery", "Mobile First", "Pixel-Perfect", "Lightning Fast"; American spelling; web-dev-only positioning vs 15 services; process "Discover/Design/Develop/Deploy" (brand: *Discover. Design. Develop. Deliver. Evolve.*). | Rewrite from the Digest. |
| Facts | Contact email `bmanagerapplication@gmail.com` (hard-coded twice). No phone, address or registration. Footer says "Openavii Technologies" not the legal name. 4 dead social buttons open a "Coming soon" modal. "Free Support" and "Secure Payment" are unverified claims. | `info@openavii.com`, both phones, address, PACRA no., legal name. Remove dead buttons. Replace unverifiable trust claims with facts from package data. |
| Missing | Team, vision/mission/values, services catalogue, sectors, why-us, clients, registration, OG image, `metadataBase`, sitemap, robots, structured data, manifest. | Build / add (§3, §6.4). |
| Theme | `ThemeProvider` defaults to `light`, applies the class after mount (flash); logo shows a pulsing skeleton until mounted (layout shift). | Pre-hydration theme script; default `system`; CSS-switched logos, no skeleton. |
| Accessibility | `ImageSlideshow` binds Arrow keys **on `window`** and auto-plays with no pause control; `Modal` has no focus trap or focus return; mobile menu button lacks `aria-expanded`; no skip link; `* { scroll-behavior: smooth }` ignores reduced motion; `.scroll-animate` is `opacity:0` with no no-JS fallback; hover-only affordances. | Fix all (§4.6). |
| Process | No tests, no test runner. | Add Vitest + RTL (§7). |
| Weight | 14.9 MB of slide images; 2 MB of logos. | Budget §6.5. |

---

## 3. Target experience

### 3.1 Page architecture (single page; keep it a single route in this pass)

Ghost numerals follow the brand's chapter-divider device (Digest §4.5). **Surfaces**: `page` and `alt` follow the theme; `dark` (wave artwork on `#111111`) and `brand` (navy gradient band with ghost numeral) are fixed brand surfaces that look the same in both themes.

| Order | `id` | Section | Numeral | Surface (light theme → dark theme) |
|---|---|---|---|---|
| 0 | `home` | **Hero** | — | `dark` → `dark` (wave artwork) |
| 1 | `problems` | **Find the Fix** (problem band) | — | page → page |
| 2 | `who-we-are` | **Who We Are** | 01 | alt → alt |
| 3 | `services` | **What We Do** | 02 | `brand` → `brand` |
| 4 | `approach` | **How We Work** | 03 | page → page |
| 5 | `sectors` | **Who We Serve** | 04 | alt → alt |
| 6 | `why` | **Why Openavii** | 05 | `brand` → `brand` |
| 7 | `team` | **Our Team** (+ clients strip) | 06 | page → page |
| 8 | `packages` | **Packages** (+ add-ons) | 07 | alt → alt |
| 9 | `contact` | **Closing CTA + Footer** | 08 | `dark` → `dark` |

Rhythm rules: never two adjacent sections with the same surface; at least three **curved dividers** (Digest §4.5-3) between surfaces; hero, closing CTA and footer are always dark brand surfaces. Implement surface scoping with `data-surface="dark|brand"` that **locally redefines the semantic tokens** (`page`/`alt` sections simply inherit the theme), so one component is correct on every surface (and tested per surface).

Nav (≥ `xl`): **Who We Are · What We Do · How We Work · Team · Packages · Contact** + primary button **Get a Quote** + theme toggle. Below `xl`: full-screen sheet menu with large type (`aria-expanded`, focus-managed, Esc closes). Transparent over the hero (white logo); after scroll: solid bar, logo variant chosen by surface/theme.

### 3.2 Section specs

Copy marked **[Digest §x]** is verbatim from the Digest. Everything else is new copy → tag `COPY-NEW`.

#### Hero `#home` — Inspirational tone

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ [logo]      Who We Are  What We Do  How We Work  Team  Packages  Contact  ◐ [Get a Quote] │
│                                                                                │
│  OPENAVII TECHNOLOGIES · LUSAKA, ZAMBIA                       ╭─────────────╮  │
│  The Right Technology                                         │ photo, brand│  │
│  Changes Everything. (bright cyan)                            │ shape + ring│  │
│  Better customer experiences. Faster operations.              │ arc, bleeds │  │
│  body line                                                    ╰─────────────╯  │
│  [ Get a Quote ]  [ See What We Do ]                                           │
│ ▁▁▁▁▁▁▁▁▁▁▁▁ concave curve ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁│
│  We Understand │ We Simplify │ We Build │ We Partner   (pillar strip)          │
└────────────────────────────────────────────────────────────────────────────────┘
```
- **H1:** `The Right Technology` / `Changes Everything.` (second line bright cyan; ExtraBold; tracking −0.04 em; `text-wrap: balance`). **[Digest §1]**
- **Sub:** `Better customer experiences. Faster operations.` (Light 300, large). **[Digest §1]**
- **Eyebrow:** `OPENAVII TECHNOLOGIES · LUSAKA, ZAMBIA`.
- **Body:** *Openavii Technologies is a Lusaka-based technology partner. We turn complex business challenges into practical, secure and scalable digital solutions — websites, custom software, automation and the strategy behind them.* (COPY-NEW; derived from Digest §2 positioning.)
- **CTAs:** primary **Get a Quote** (opens inquiry modal, type `custom`) · secondary **See What We Do** (→ `#services`).
- **Pillar strip** (**We Understand · We Simplify · We Build · We Partner** — Digest §3), each with a one-liner (COPY-NEW, paraphrasing Digest §2): *We start with your business problem, not the software.* · *We remove complexity instead of adding to it.* · *Secure, scalable solutions built around your workflows.* · *We work alongside you — and stay after launch.*
- **Visuals:** `wave-dark` artwork as background (slow CSS drift, 40 s, transform-only); photo `commuter-laptop` in a brand shape (Shape 1 or 3 as mask or SVG clip-path) bleeding off the right edge on ≥ 1024 px, below the text on mobile; oversized, cropped, translucent ring-mark arc behind the headline (approved Mark only). Remove the "Available for New Projects" badge, orbs, particles, grid overlay and the bouncing mouse indicator. *Optional signature:* a small ring-shaped scroll-progress indicator (the Mark's open ring that fills as you scroll) bottom-right.
- **Motion:** staged load reveal — nav fades, H1 reveals line-by-line through a mask (60–80 ms stagger), sub and CTAs fade up, photo wipes in from its chamfer. Transform/opacity only. Reduced-motion → final state, no drift.
- **LCP:** the hero photo is the LCP element: one preloaded image, correct `sizes`, no layout shift.

#### Find the Fix `#problems` — Educational tone

- **Eyebrow** `FIND THE FIX` · **H2** `Your Business Has a Technology Problem.` (two-tone: "Technology Problem." in accent) · **Lead** *Slow systems, outdated tools and manual processes quietly cost your business time and money. Let's find the fix.* **[Digest §7.1 #2]**
- **Six problem→fix cards**, each = headline + body (verbatim **[Digest §7.1]**) + CTA label (verbatim) linking to `#service-<slug>`:

| Digest §7.1 | CTA | Links to |
|---|---|---|
| #5 Late Nights Should Be for Strategy, Not Spreadsheets. | Automate Your Workflow | `automation` |
| #11 Outdated Technology Has a Cost | Upgrade Your Business | `custom-software`, `maintenance-support` |
| #7 Your Team Doesn't Need More Apps | Work Smarter | `integration-apis` |
| #8 Better Technology. Better Decisions. | Make Data Work for You | `dashboards` |
| #3 Your Business Is Growing. Is Your Technology Advancing? | Prepare to Scale | `solution-architecture`, `database-design` |
| #9 Don't Let Tech Problems Become Business Problems | Get Tech Support | `maintenance-support`, `security-performance` |

- Linked service tiles get a **`:target` highlight** (cyan outline + glow — "illumination"), pure CSS. For multi-target cards, link to the first and mark the others via `data-related` highlighting on card hover/focus.
- **Pull-quote row:** `Don't Just Buy Software. Explore Solutions.` + *The newest software isn't always the right software. Start with the business problem, then choose the technology.* + CTA **Find Your Solution** → `#approach`. **[Digest §7.1 #12]**
- Card look: solid navy/teal tile, thin cyan top rule that grows on hover/focus, large headline. No glass.

#### 01 Who We Are `#who-we-are` — Professional tone

- Ghost numeral **01**; **H2** `Technology Should Simplify Challenges, Not Create Them.` (from the About text, Digest §7.4).
- Body: the two Profile paragraphs **[Digest §7.4]** + *Unlike many other technology providers that simply deliver software, Openavii begins by understanding the underlying business problem.* **[Digest §2]**
- Photo `home-laptop` or `partnership-handshake` in a brand shape.
- **Our name, our mark** — the approved Mark shown large and unaltered with three captions **[Digest §1, name rationale]**: *Open — openness, accessibility and trust.* · *Avi — light: illuminating complexity, guiding smarter decisions.* · *i — ideas: every meaningful innovation begins with a single insight.* Footnote line: *The open ring: nothing is hidden.*
- **Vision · Mission · Purpose** as three statements, thin-line icons (atom / target / shield-check), thin vertical cyan rules **[Digest §2]**. Vision carries the label "Our vision".
- **Values** as six chips (names only) + the **Promise** sentence **[Digest §2]**.
- **Three principles** (Technology with Purpose / Innovation through Simplicity / Partnership for Growth) with their one-liners **[Digest §2]**.

#### 02 What We Do `#services` — Professional tone

- Ghost numeral **02** on a `brand` band; **H2** `Built Around Your Business.` **[Profile section title]** · Lead (COPY-NEW from Digest §7.6 #4): *From websites and custom software to automation, integration and security — one accountable partner from discovery to long-term support.*
- **15 service tiles** in four labelled clusters **Build (5) · Automate and Connect (3) · Architect and Advise (4) · Secure and Sustain (3)**, in the Profile's **colour-blocked mosaic** (Digest §4.5-7) with three photo tiles interleaved. Title = exact Profile title; summary = **first sentence** of the Profile description **[Digest §7.2]**.
- Tile fills: Primary `#223450`, Secondary `#1D4A68`, Supporting `#146F91` with **white** text; Accent `#099CC1` tiles only with **`#111111`** text. Never white on `#099CC1`.
- Each tile: thin-line icon, title (`<h3>`), summary, **Get a Quote →** button (opens the inquiry modal, type `service`, with the service name). Anchor `id="service-<slug>"`. Grid 1 / 2 / 3 columns. Hover/focus: the tile steps one palette colour lighter and its icon ring "opens" (stroke-dash animation); no hover-only content.
- Slugs (fixed): `websites`, `saas`, `custom-software`, `web-mobile-apps`, `cms-content-branding` · `automation`, `integration-apis`, `dashboards` · `solution-architecture`, `code-reviews`, `ux-assessments`, `database-design` · `auth-rbac`, `security-performance`, `maintenance-support`.

#### 03 How We Work `#approach` — Educational tone

- Ghost numeral **03**; **H2** `Understand First. Build Second. Improve Continuously.` (three lines, each reveals in sequence) + the approach paragraph **[Digest §7.3]**.
- **Process timeline** headed `Discover. Design. Develop. Deliver. Evolve.` — five phase nodes on a line, the seven stage cards hung beneath their phase (mapping in Digest §7.3), copy verbatim. Horizontal ≥ 1024 px, vertical below. **Illumination motion:** as the section scrolls into view, the line fills cyan and each node "lights" in sequence (IntersectionObserver; progressive `animation-timeline: view()` enhancement allowed).
- Closing statement **[Digest §7.3]** + CTA **Start Your Digital Journey** (modal, type `custom`).

#### 04 Who We Serve `#sectors` — Professional tone

- Ghost numeral **04**; **H2** `A Technology Partner for Every Stage.` + the "Every organisation has unique challenges…" paragraph **[Digest §7.5]**.
- **Seven sector cards**: SMEs · Corporate Organisations · Government Institutions · Educational Institutions · Healthcare Providers · Financial Service Providers · NGOs — copy **[Digest §7.5]**; NGO line is COPY-NEW. Two photos (`field-tablet`, `greenhouse-smile`) as visual anchors, chamfered.
- Closing paragraph "Whether you're launching a new solution…" **[Digest §7.5]**.

#### 05 Why Openavii `#why` — Professional tone

- `brand` band + ghost numeral **05**; **H2** `Why Choose Openavii?` (two-tone); six reasons in a 2 × 3 grid with thin-line icons, copy **[Digest §7.6]** (slugs: `business-first`, `tailored`, `secure-scalable`, `end-to-end`, `innovation-practicality`, `long-term-support`).
- Pull-statement: *Our relationship doesn't end at launch.* **[Digest §7.6 #6]**

#### 06 Our Team (+ clients) `#team` — Human tone

- Ghost numeral **06**; **H2** `A Team Built on Expertise, Integrity and Execution.` (key words in accent) **[Digest §7.7]**.
- Three cards: transparent cut-outs on `#099CC1` (or navy) tiles, as in the Profile; name in Bold navy, title in teal: **David — Chief Visionary Officer · Chanda — Director, Operations · Walasi — Director, Finance**. No bios, no surnames except "David Mwaifunga" in metadata/footer credit.
- **Clients strip** labelled `Client Portfolio`: logos of **Wagzy Wales** and **Ashbron Consultancy** if the owner supplies files; otherwise typographic names. Never add others.

#### 07 Packages `#packages` — Supportive tone

- Ghost numeral **07**; **H2** `Digital Doesn't Mean Complicated.` **[Digest §7.1 #6]** · Sub (COPY-NEW): *Three website packages with a clear scope, a stated delivery time and indicative pricing. Need something bigger? We build that too — see What We Do.*
- **Keep the existing package data and ZMW ranges exactly** (P1 Basic Startup Website 3,500–6,000 · P2 Standard Business Website 7,000–12,000 · P3 Starter Plus (Growth-Ready) 12,000–20,000, with their features and delivery times); move them to `src/content/packages.ts`; only British-ise spelling ("optimisation"). Replace the legacy `accentColor: 'violet'|'indigo'|'purple'` keys with `tone: 'navy'|'teal'|'cyan'`. Restyle as flat solid cards (no glass), crisp corners, price in large Bold navy. Quote button → inquiry modal (type `package`).
- **"Beyond websites" card** replacing the old Custom Application/Consultancy cards (they now live in What We Do): *Custom software, SaaS, automation, integration or consultancy? Scope it with us.* → **Get a Quote** (type `custom`).
- **Add-ons** (keep: Additional Page, Blog / CMS Setup, Content Writing, Logo and Branding; featured **Monthly Maintenance and Support**) — keep meanings, tighten copy, **no prices** (the owner removed them). Keep `id="addons"`.
- **Fine print:** *Prices are indicative, in Zambian kwacha (ZMW). Your written proposal confirms scope, timeline and price.* (COPY-NEW; matches the "Proposal: clear, transparent" journey stage.)
- **Trust row** — replace "Secure Payment / Free Support / Revision Rounds" with facts already in the data: **Fixed scope per package · Delivery time stated up front · Revision rounds included · Support after launch available**.

#### 08 Closing CTA + Footer `#contact` — Inspirational → Supportive

- `dark` wave band. **H2** `Turning Bright Ideas into Digital Reality.` (second line bright cyan) **[Digest §1]** · Sub (COPY-NEW): *Is your business ready for the digital shift? Tell us the challenge — we'll start by understanding it.* **[§7.1 #10 echo]**
- Actions: **Get a Quote** (modal) · **WhatsApp** (`https://wa.me/260967223048?text=…`, `target="_blank" rel="noopener noreferrer"`) · **Call** (`tel:+260967223048`) · **Email** (`mailto:info@openavii.com`).
- Contact grid (numbers are `tel:` links, addresses `mailto:` links): Mobile (+260) 967 223 048 (`tel:+260967223048`) · (+260) 972 147 626 (`tel:+260972147626`) · Email info@openavii.com · support@openavii.com · Website www.openavii.com · Address No. 20 Buchi Close, Northmead, Lusaka — all from one `site.ts`.
- **Footer** (always `#111111`): Extended-Mark white logo (clear space respected), tagline, nav, services by cluster, **Registered in Zambia · PACRA No. 120261049958**, `© 2026 Openavii Technologies Limited. All rights reserved.`, `Designed & developed by David Mwaifunga`. Social icons **only** for URLs present in `site.ts` (none by default) — delete `ComingSoonModal` usage.
- Inquiry modal note (replace): *Sending opens your email app with these details pre-filled. This website does not store them.*

---

## 4. Design system

### 4.1 Tokens (single source: `src/app/globals.css`)

Raw brand tokens (never used directly by components) → semantic tokens (components use these) → Tailwind `@theme inline` mappings.

```css
:root {
  /* RAW — Digest §4.2 / §4.3 */
  --brand-navy:#223450; --brand-deep:#1D4A68; --brand-teal:#146F91; --brand-cyan:#099CC1;
  --brand-cyan-bright:#00C0EC; --brand-white:#FEFEFE; --brand-mist:#F2F2F2; --brand-depth:#111111;
  --brand-green:#02AF17; /* decorative sustainability only — fails AA with white */
  --grad-divider: linear-gradient(90deg,#233550 0%,#1D4F6C 20%,#156C8C 40%,#0E88AB 60%,#07A5CB 80%,#01BFE7 100%);
  --grad-panel: radial-gradient(120% 100% at 100% 0%, #0A94B9 0%, transparent 55%),
                linear-gradient(180deg,#146B8D 0%,#185A7A 50%,#203653 100%);

  /* SEMANTIC (light) — starting values; tests enforce ratios, tune mixes to pass */
  --page:var(--brand-white); --surface:var(--brand-white); --surface-alt:var(--brand-mist);
  --fg:var(--brand-navy);
  --fg-muted:color-mix(in srgb,var(--brand-navy) 78%,var(--brand-white));
  --heading:var(--brand-navy);
  --accent-text:var(--brand-teal);     /* small accent text/links on light */
  --accent-fill:var(--brand-cyan);     /* fills, rules, large display accents */
  --on-accent:var(--brand-depth);      /* text on accent fills */
  --btn-primary-bg:var(--brand-navy); --btn-primary-fg:var(--brand-white); --btn-primary-hover:var(--brand-teal);
  --line:color-mix(in srgb,var(--brand-navy) 14%,var(--brand-white));
  --focus:var(--brand-teal);
}
.dark, [data-surface="dark"], [data-surface="brand"] {
  --page:var(--brand-depth);
  --surface:color-mix(in srgb,var(--brand-navy) 40%,var(--brand-depth));
  --surface-alt:color-mix(in srgb,var(--brand-navy) 22%,var(--brand-depth));
  --fg:var(--brand-white);
  --fg-muted:color-mix(in srgb,var(--brand-white) 72%,var(--brand-navy));
  --heading:var(--brand-white);
  --accent-text:var(--brand-cyan-bright); --accent-fill:var(--brand-cyan-bright); --on-accent:var(--brand-depth);
  --btn-primary-bg:var(--brand-cyan-bright); --btn-primary-fg:var(--brand-depth); --btn-primary-hover:var(--brand-white);
  --line:color-mix(in srgb,var(--brand-white) 14%,transparent);
  --focus:var(--brand-cyan-bright);
}
/* [data-surface="brand"] shares the dark text/accent/button tokens above; its background is
   --grad-divider or --grad-panel (set on the band, with the ghost numeral). */
```
Required semantic names (tests assert they exist): `--page --surface --surface-alt --fg --fg-muted --heading --accent-text --accent-fill --on-accent --btn-primary-bg --btn-primary-fg --btn-primary-hover --line --focus`. Delete the legacy aliases (`--color-accent`, `--accent-solid`, `--cyan`, `--glass-*`, `.glass*`, orb/float/particle keyframes) once nothing references them.

**Required contrast pairs** (test, AA text ≥ 4.5; large/UI ≥ 3.0) in each of four contexts — light theme, dark theme, `data-surface="dark"`, `data-surface="brand"` (use the band's own background for the last): `fg/page`, `fg/surface`, `fg/surface-alt`, `fg-muted/page`, `fg-muted/surface-alt`, `heading/page`, `accent-text/page`, `accent-text/surface-alt`, `btn-primary-fg/btn-primary-bg`, `on-accent/accent-fill`, `focus/page` (≥ 3.0). Digest §4.2 lists measured baselines.

### 4.2 Typography

- Geist via `next/font/google` (variable; `display: 'swap'`; latin). **Roles:** H1/H2 ExtraBold 800 · H3/H4 Bold 700 · body Regular 400 · lead lines and text-style CTAs Light 300 (≥ 18 px) · **button labels Bold 700** (documented deviation, Digest §4.4).
- Fluid scale (starting values): H1 `clamp(2.75rem, 1.2rem + 6.2vw, 6.5rem)` / 0.98 / −0.04 em · H2 `clamp(2.25rem, 1.2rem + 3.6vw, 4.75rem)` / 1.02 / −0.035 em · H3 `clamp(1.5rem, 1.1rem + 1.4vw, 2.25rem)` / 1.15 / −0.02 em · lead `clamp(1.125rem, 1rem + .6vw, 1.5rem)` · body 1.0625 rem / 1.65 · overline 0.75 rem Bold uppercase +0.18 em. Measure ≤ 68 ch. `text-wrap: balance` on headings.
- **Two-tone headings** (navy/white + accent key words) replace the old gradient-text H2s. Title Case headlines.

### 4.3 Shape and layout language

Container max 1280 px (full-bleed bands), gutters 16/24/40, section padding `clamp(4.5rem, 3rem + 7vw, 9rem)`. Cards/tiles: crisp (≤ 6 px radius), solid fills, hairline `--line` borders, no backdrop blur, no glow shadows. Buttons: pill. Photos: brand shapes (Shapes 1–6 as CSS `mask-image` or SVG `clipPath` with `objectBoundingBox` units — shapes are not logos, re-drawing is allowed) with a navy scrim on the text side. Curved dividers: concave/convex arcs (`<CurveDivider variant="concave|convex|swoosh">`, fill = next section's surface, `preserveAspectRatio="none"`). Add `overflow: clip` to sections containing ghost numerals so nothing causes horizontal scroll.

### 4.4 Components (create/restyle; barrels updated)

`ui/`: `Logo` (variants `full|extended|mark` × tone `auto|colour|white`; CSS-switched, both images eager, correct `alt`, no skeleton) · `Button` (primary/secondary/ghost/inverse × sm/md/lg) · `Chip` (replaces `Badge`) · `Tile` / `Panel` (replace glass `Card`) · `SectionHeader` (eyebrow + ghost numeral + two-tone H2 + lead) · `GhostNumeral` · `CurveDivider` · `ShapedPhoto` · `RingMark` (watermark device, approved Mark only) · `Icon` (single set: `lucide-react`, stroke 1.5, round caps — the **only** runtime dependency you may add; or hand-rolled in the same style) · `Modal` (focus trap, `inert` background, Esc, focus return, scroll lock) · `InquiryModal` · `ThemeToggle`.
`layout/`: `Header`, `Footer`, `SkipLink`.
`sections/`: `Hero`, `ProblemBand`, `WhoWeAre`, `Services`, `Approach`, `Sectors`, `Why`, `Team`, `Clients`, `Packages` (+ `PackageCard`), `Addons`, `ContactCta`.
Delete: `ImageSlideshow`, `ComingSoonModal`, `Showcase`, old `Badge`/glass `Card` once unreferenced.

### 4.5 Motion — the "illumination" principle (*avi* = light)

Things move from dim to lit: low-opacity navy → bright cyan accents as they enter the viewport. Rules: animate **transform and opacity only**; interactions 150–200 ms; reveals 600–800 ms `cubic-bezier(.16,1,.3,1)`; stagger ≤ 80 ms; once-only reveals (existing `useScrollAnimation`, keep `triggerOnce`); one ambient animation allowed (wave drift) and it must be transform-only and ≥ 30 s. CSS + IntersectionObserver only — no animation libraries. **Progressive enhancement:** add a `js` class to `<html>` in the pre-hydration script and gate `.scroll-animate { opacity:0 }` behind `.js` so no-JS and crawler views see all content. `prefers-reduced-motion: reduce` → final states, no drift, `scroll-behavior: auto`, JS `scrollIntoView` uses `behavior: 'auto'`.

### 4.6 Accessibility requirements

Skip link as the first focusable element · one `<h1>`, ordered headings · landmarks (`header`, `nav aria-label`, `main`, `footer`) · visible focus ring 2 px `--focus` + 2 px offset on every interactive element · touch targets ≥ 44 × 44 px · `aria-expanded`/`aria-controls` on the menu button · dialog: `role="dialog"`, `aria-modal`, labelled, focus trapped and returned, background `inert` · no content only on hover · no auto-playing media · alt text: meaningful for informational photos (suggested alts in §5), `alt=""` + `aria-hidden` for decorative devices (ring, numerals, waves) · colour never the sole indicator · form fields labelled with unique ids · `<html lang="en-ZM">` · links say where they go · usable at 200 % zoom and 320 px width, no horizontal scroll.

---

## 5. Asset pipeline

Write **`scripts/prepare-brand-assets.mjs`** (Node + `sharp`, already in `node_modules`; Pillow is an acceptable alternative) that reads from `BRAND_SRC` and writes **only optimised derivatives** to `public/brand/`. It must be idempotent, take `BRAND_SRC` from an env var with the path above as default, print a size report, and be documented in the README. Do not commit `BRAND_SRC` originals.

| Output (`public/brand/…`) | From (`BRAND_SRC\…`) | Processing | Budget |
|---|---|---|---|
| `logo/openavii-logo.png` | `Brand Identity\Logo Files\Main Logo@300x.png` | trim to alpha bbox (content 4975×1453), resize to 960 w | ≤ 40 KB |
| `logo/openavii-logo-white.png` | same | trim; set RGB to white, keep alpha (the approved Alternative) | ≤ 40 KB |
| `logo/openavii-extended.png` / `-white.png` | `Extended Mark@300x.png` | trim (5155×912), 1440 w; white variant as above | ≤ 50 KB |
| `logo/openavii-mark.png` / `-white.png` | `Mark@300x.png` | trim (4381×4271), 512 w | ≤ 40 KB |
| `bg/wave-dark.webp` | `Gradients\300ppi\Gradient 6.jpg` | resize 2560 w, q≈78 | ≤ 200 KB |
| `bg/wave-navy.webp` | `Gradient 5.jpg` | same | ≤ 200 KB |
| `bg/wave-light.webp` | `Gradient 4.jpg` | same | ≤ 150 KB |
| `bg/panel-brand.webp` | `Gradient 2.jpg` | same | ≤ 150 KB |
| `shapes/shape-1..6.png` | `Brand Identity\Shapes\Shape N@300x.png` | trim, ≤ 1200 w (CSS masks) — or redraw as SVG | ≤ 40 KB each |
| `photo/*.webp` (9) | `Images\Website Images\…` | flatten alpha edge, crop ~6 px border, ≤ 2400 w, q≈80 | ≤ 350 KB each |
| `team/{david,chanda,walasi}.webp` | `Images\Team Photos\{David,Chanda,Walasi Image}.png` | keep alpha, ≤ 1000 px tall | ≤ 120 KB each |
| `src/app/icon.png`, `apple-icon.png`, `favicon.ico`, `public/brand/icons/icon-192.png`, `icon-512.png` | `Logo Files\Mark Alternative@300x-100.jpg` (white ring on the brand gradient; opaque square) | resize 512 / 180 / 192; ICO 16-32-48 | small |
| `src/app/opengraph-image.png` (+ `twitter-image.png`) | compose: `Gradient 6` crop + white Extended logo bottom-left (clear space) + `www.openavii.com` bottom-right + headline "The Right Technology Changes Everything." in **Geist ExtraBold** (`Brand Identity\Fonts\Geist\Geist-ExtraBold.ttf`) | 1200 × 630 | ≤ 200 KB |

**Photo manifest (suggested use / alt)** — all alts are factual descriptions:

| Source | Output | Suggested use | Alt |
|---|---|---|---|
| `Asset 2.png` | `commuter-laptop` | **Hero** | A man works on a laptop on an evening train, warm light against blue-teal windows |
| `Asset 3.png` | `delighted-phone` | Packages / simplicity | A woman reacts with delight to good news on her phone in a modern office |
| `Asset 4.png` | `office-win` | Why Openavii | A man in a blue shirt celebrates a win at his laptop in a bright office |
| `Asset 5.png` | `cafe-sunlight` | Closing CTA | A smiling man works on a laptop under a sunlit pergola |
| `Asset 6.png` | `field-tablet` | Sectors, Services mosaic | A farm manager records data on a tablet in a greenhouse field |
| `Asset 7.png` | `phone-coffee` | Services mosaic | A man in an orange sweater smiles at his phone over coffee |
| `Image 1.png` | `home-laptop` | Who We Are | A mother works on a laptop at home while holding her baby |
| `business-partners-shaking-hands-agreement.jpg` | `partnership-handshake` | Who We Are / Approach | Business partners shake hands to seal an agreement |
| `front-view-smiley-woman-working.jpg` | `greenhouse-smile` | Sectors | A smiling woman in work overalls stands in a greenhouse |

Then **delete**: `public/Openavii-Dark.png`, `Openavii-Light.png`, `favicon.png`, `favicon.ico` (replaced), `icon-512.png`, `apple-touch-icon.png`, `public/slide-images/`, `file.svg`, `globe.svg`, `next.svg`, `window.svg`.

---

## 6. Technical spec

### 6.1 Layout of the code

```
src/
  app/        layout.tsx  page.tsx  globals.css  icon.png  apple-icon.png  favicon.ico
              opengraph-image.png  twitter-image.png  manifest.ts  sitemap.ts  robots.ts
  content/    site.ts  services.ts  problems.ts  process.ts  sectors.ts  values.ts
              team.ts  why.ts  packages.ts  addons.ts  clients.ts  index.ts   (+ *.test.ts beside each)
  components/ ui/  layout/  sections/        (+ *.test.tsx beside each)
  context/ hooks/ lib/                       (lib: mailto.ts, contrast.ts for tests)
scripts/prepare-brand-assets.mjs
```
**Content as typed data** (no copy inline in components). Each content module exports `as const` data plus TypeScript types; `site.ts` is the **only** place for the company name, legal name, phones, emails, address, URLs, registration and (optional) social links.

### 6.2 Theme

Inline pre-hydration script in `<head>`: read `openavii-theme` (`light|dark|system`, default **`system`**), set `html.dark`/`html.light`, `color-scheme`, and add `html.js`. `ThemeProvider` initialises from the DOM class (no flash, no hydration warning), keeps the same storage key and `setTheme`/`toggleTheme`/`resolvedTheme` API, reacts to system changes when `system`. Header/Footer logos switch with CSS (`dark:hidden` / `hidden dark:block`), never with a `mounted` skeleton.

### 6.3 Inquiry flow

Keep `mailto:` (no backend), sending to `site.contact.email` (**`info@openavii.com`**). Types `package | service | custom`; subject/body built by a pure function in `lib/mailto.ts` (tested). Replace the duplicated constants. Labels use unique ids.

### 6.4 SEO and metadata

- `metadataBase: new URL('https://www.openavii.com')` (assumed from the brand docs — see §10), canonical, `title.default` `Openavii Technologies | Illuminating Your Digital Journey`, template `%s | Openavii Technologies`, description ≤ 160 chars (e.g. *Lusaka-based technology partner. Websites, custom software, automation and consultancy that turn complex business challenges into practical, scalable solutions.*), Open Graph (`en_GB`, `siteName`, image) and Twitter card. Drop the obsolete `keywords`, and remove the `icons` block from `metadata` — Next's file conventions (`icon.png`, `apple-icon.png`, `favicon.ico` in `src/app/`) supply the icons.
- JSON-LD `Organization` (name, `legalName` "Openavii Technologies Limited", url, logo, `slogan`, `address` PostalAddress Lusaka / ZM, telephones, e-mails/contactPoints; `sameAs` only if `site.ts` has real URLs) rendered from `site.ts`.
- `manifest.ts` (name "Openavii Technologies", `theme_color` `#223450`, `background_color` `#111111`, icons), `sitemap.ts`, `robots.ts`.
- `next.config.ts`: `images.formats: ['image/avif','image/webp']`, keep `qualities` to the values actually used, plus `headers()` → `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `X-Frame-Options: DENY`. (HSTS belongs to the host.)

### 6.5 Performance budget

LCP < 2.5 s and CLS < 0.05 on mobile; Lighthouse mobile ≥ 90 performance, ≥ 95 accessibility/best-practices/SEO; above-the-fold image bytes ≤ 600 KB; whole-page image bytes ≤ 2.5 MB at first load; no file in `public/` > 400 KB; first-load JS as small as the sections allow (report the number). Exactly one image preloaded (the hero photo). Check the installed Next 16.1 docs for the current LCP prop (`priority` vs `preload`) and use whichever is not deprecated.

### 6.6 Dependencies

Allowed additions: `lucide-react` (icons, optional) and dev-only `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `vite-tsconfig-paths`, `vitest-axe`. Anything else needs a one-line justification in your report.

---

## 7. Test plan (TDD — write these first, watch them fail for the right reason)

Add `"test": "vitest run"`, `"test:watch": "vitest"` to `package.json`. Tests live beside the code.

| Test file | Asserts (the contract) |
|---|---|
| `content/site.test.ts` | phones `+260967223048` & `+260972147626`; emails `info@`/`support@openavii.com`; address; PACRA no. `120261049958`; legal name; **no** `gmail.com` anywhere in `src/`; **TPIN absent**; only PACRA in `registrations`; `socialLinks` all have `https://` URLs (empty array allowed). |
| `content/services.test.ts` | exactly 15; slugs equal the fixed list in §3.2; cluster sizes 5/3/4/3; unique slugs; titles equal Profile titles; each summary non-empty, ≤ 220 chars. |
| `content/problems.test.ts` | 6 cards; headline/body/cta equal Digest §7.1 rows; every `targets` slug exists in services. |
| `content/process.test.ts` | phases `Discover, Design, Develop, Deliver, Evolve`; 7 stages map to exactly one phase each. |
| `content/{sectors,why,values,team,clients}.test.ts` | counts 7 / 6 / 6 / 3 / ≤ 2; team names + titles exactly as Digest §7.7; no bios; client names only the two documented. |
| `content/copy-rules.test.ts` | across **all** content strings: no banned filler (Digest §3); no American spellings (`organiz`, `optimiz`, `customiz`, `digitiz`, `color` outside tokens, `center`); no "Awaiting Approval"; every `COPY-NEW` item is exported in a `copyNew` list (used by your report). |
| `content/packages.test.ts` | P1/P2/P3 price ranges unchanged (3500–6000, 7000–12000, 12000–20000); `tone` ∈ navy/teal/cyan (no legacy keys); add-ons have no price fields. |
| `app/tokens.test.ts` | parses `globals.css`: required semantic names exist on light/dark/surfaces; raw palette hexes match Digest §4.2 exactly; **no** `#2563eb`, `#06b6d4`, `violet`, `indigo` etc.; contrast pairs in §4.1 meet thresholds in all four contexts; no `backdrop-filter`/`.glass` left. |
| `assets.test.ts` | every `src` referenced in content/components exists under `public/`; no file in `public/` > 400 KB; deleted legacy files really gone; required icons exist. |
| `components/ui/Logo.test.tsx` | correct `alt`; both tone images present; width ≥ 120 px enforced via prop type or runtime guard; no skeleton element. |
| `components/ui/Modal.test.tsx` | focus moves in, is trapped, Esc closes, focus returns to trigger, background `inert`. |
| `components/ui/InquiryModal.test.tsx` + `lib/mailto.test.ts` | recipient is `info@openavii.com`; subject/body include service/package name; works for all three types; required fields. |
| `context/ThemeContext.test.tsx` | stored `dark` → `html.dark` immediately; default follows system; toggle persists to `openavii-theme`. |
| `components/layout/Header.test.tsx` | all nav hrefs resolve to ids rendered by `<Home />`; `aria-expanded` toggles; Esc closes menu; skip link first in tab order. |
| `app/page.test.tsx` | renders all section ids in order; exactly one `<h1>`; headings in order; every `<img>` has `alt` (empty only if decorative + `aria-hidden`); `vitest-axe` has no violations in light and dark. |
| `app/metadata.test.ts` | title/description lengths; canonical; OG/Twitter present; JSON-LD parses and matches `site.ts`; `sitemap`/`robots` shapes. |
| motion | `useScrollAnimation` reveals once; with `prefers-reduced-motion` the hero has no running timers and content is visible; `.scroll-animate` is gated by `.js`. |

Visual fidelity is **evidence, not a test**: take screenshots (see §9) and list them in your report.

---

## 8. Execution plan (phases; one commit each; show test/lint/build output at the end of each)

- **Phase 0 — Preflight.** Create `feat/brand-2026`. Record baseline `npm run lint` and `npm run build` results. Install the test tooling; add scripts; add a deliberately failing smoke test to prove the harness. *(Optional per the owner's global workflow: write a one-page implementation plan and run it past Codex with `/codex-loop`; skip gracefully if unavailable.)*
- **Phase 1 — Assets.** Write `assets.test.ts` (red) → `prepare-brand-assets.mjs` → generate → delete legacy files → green. Report the size table.
- **Phase 2 — Tokens and fonts.** `tokens.test.ts` (red) → rewrite `globals.css`, `layout.tsx` fonts (Geist only), pre-hydration theme script, reduced-motion fixes → green. Update `ThemeProvider` with its tests.
- **Phase 3 — Content layer.** All `content/*.test.ts` (red) → create `content/*` from the Digest → green.
- **Phase 4 — Primitives and shell.** Tests for `Logo`, `Modal`, `InquiryModal`, `Header`, `SkipLink` (red) → implement primitives, `Header`, `Footer`.
- **Phase 5 — Sections.** For each section in §3.1 order: structure/content test (red) → implement → green → screenshot at 375, 768, 1280, 1920 px in both themes (use the browser/preview tools against `npm run dev`). Fix issues before moving on.
- **Phase 6 — SEO and platform.** `metadata.test.ts` (red) → metadata, JSON-LD, manifest, sitemap, robots, OG/Twitter images, icons, headers → green.
- **Phase 7 — Polish and QA.** Motion pass (§4.5), performance pass (Lighthouse mobile or the best available equivalent), accessibility pass (axe + keyboard walk-through + 200 % zoom + reduced motion), copy audit (British English, banned list, claims), brand QA (§9). Update `CLAUDE.md` (design system, tokens, typography, assets, tests, `docs/brand-2026/`), replace the boilerplate `README.md` (setup, scripts, content editing guide, asset pipeline, brand sources).
- **Phase 8 — Review.** Run `codex exec review --uncommitted` if available; fix real findings; run the full bar one last time: `npm run lint`, `npm test`, `npm run build`.

---

## 9. Definition of done

**Automated (paste the real output):** `npm run lint` clean · `npm test` all green (state pass/fail counts) · `npm run build` succeeds · axe: 0 violations (light + dark) · token contrast tests green.

**Measured:** Lighthouse mobile scores and LCP/CLS vs §6.5 · first-load JS size · image byte totals · largest file in `public/`.

**Visual evidence:** screenshots of every section at 375 / 768 / 1280 / 1920 px in light and dark, saved under `docs/brand-2026/screenshots/` (do not commit more than ~3 MB).

**Brand QA — the guideline's own review checklist** (report ✅/❌ + note for each): Logo usage · Colour accuracy · Typography · Layout consistency · Brand messaging · Visual hierarchy · Accessibility · **and the final QA list:** grammar and spelling · image quality · responsive layouts · hyperlinks and contact information · file naming and export settings.

**Distinctiveness check:** at 1440 × 900 the first two screens show at least five brand devices (wave artwork, ring watermark, two-tone heading, curved panel, chamfered/shaped photo, ghost numeral); the logo-swap and paste tests pass for every section; no remaining trace of the old look (glass, orbs, particles, electric blue, stock desks, slideshow).

---

## 10. Open decisions (do not block — use the default, list them in your report)

| # | Question for the owner | Default used |
|---|---|---|
| 1 | Vector logo files (the PDFs were made in Illustrator, so SVG/AI exist). | Trimmed PNG derivatives. Ask for SVG and swap later. |
| 2 | Client logo files + permission to display Wagzy Wales and Ashbron Consultancy. | Typographic names only. |
| 3 | Real social URLs (`@openavii`, platform?). | No social icons rendered. |
| 4 | David's title: "Chief Visionary Officer" (Profile) vs "CEO" (sample business card). | Chief Visionary Officer. |
| 5 | Photo licences: two files look like stock-library downloads (`business-partners-shaking-hands-agreement.jpg`, `front-view-smiley-woman-working.jpg`) — attribution duty? | Used; flagged. If attribution is required, add a credits line to the footer. |
| 6 | Keep public ZMW package prices? | Keep unchanged. |
| 7 | Orange `#FF5B00` (Community Engagement) and green `#02AF17` (Sustainability) — any role in the UI? | Unused. |
| 8 | Publish the ZRA TPIN or the four "Awaiting Approval" registrations? | No. PACRA number only. |
| 9 | Canonical domain. | `https://www.openavii.com`. |
| 10 | Approve all `COPY-NEW` strings (listed by the agent), incl. the NGO line and the pillar one-liners. | Used as drafted. |
| 11 | Hero H1: "The Right Technology Changes Everything." (new) vs the current "Turning Bright Ideas into Digital Reality." | New H1; the old line becomes the closing CTA headline. |
| 12 | Web typography deviation: button labels Bold (brand says Light for "call to action"). | Bold, for legibility/contrast. |

**Explicitly out of scope (list as follow-ups):** per-service and per-sector pages (SEO), case studies/testimonials (none exist), a server-side contact form or e-mail API, analytics with consent, Privacy/Terms pages (recommended before any data is stored — Zambia's Data Protection Act 2021), SVG logo swap, motion/video hero, multi-language.

---

## 11. Final report format

1. **What changed** — by phase, with file paths.
2. **Verification** — lint / test (counts) / build / axe / Lighthouse numbers / image-byte totals.
3. **Screenshots** — paths.
4. **Brand QA table** (§9).
5. **Deviations** from this prompt, each with the reason.
6. **`COPY-NEW` list** for approval.
7. **Open decisions** (§10) with the default you applied.
8. **Follow-ups** (§10 out-of-scope + anything you found).
