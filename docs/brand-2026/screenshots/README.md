# Visual evidence: the 2026 build

Every section of the home page, at four viewport widths, in the light and dark themes. They were taken from the production build (`npm run build`, `npm run start`) in real Chrome, after the whole page had been scrolled once so that every scroll reveal had fired, every lazy image had loaded and the hero sequence and process timeline had finished.

## Layout

```
{width}/{theme}/{NN}-{name}.avif
```

- **width**: `375`, `768`, `1280`, `1920` (the viewport the page was captured at), plus `1440` (a 1440 x 900 viewport: the first two screens, which is where the brief's "at least five brand devices" check is made).
- **theme**: `light` or `dark`.
- **NN-name**:

| File | What it shows |
|---|---|
| `00-top-of-page` | the first viewport, header over the hero |
| `01-home` ... `10-contact` | the ten sections in page order: home, problems, who-we-are, services, approach, sectors, why, team, packages, contact |
| `11-footer` | the footer |
| `12-header-scrolled` | the solid header once the page has scrolled |
| `13-menu-open` | the full-screen menu sheet (below the `xl` breakpoint only) |
| `14-enquiry-dialog` | the enquiry dialog |

`1440/{theme}/00-first-screen` and `01-second-screen` are the two screens of the distinctiveness check.

## Format

AVIF, quality 28, to keep the whole set under about 3 MB (the same set as WebP would be 3.5 MB at quality 40). The 375 px captures are stored at their captured size; the 768 px captures are stored at 640 px wide, and the 1280, 1440 and 1920 px captures at 800 px wide. They are evidence of layout, colour and composition, not pixel-level proof; small print on the widest captures is below legibility by design.

The raw captures (about 47 MB as PNG) are not committed.
