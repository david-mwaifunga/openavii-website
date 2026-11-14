/**
 * Photography and logo manifest
 * Every image the site shows, declared once with factual alt text and the
 * intrinsic pixel size of the optimised file (so next/image can reserve space
 * and layout never shifts). photos.test.ts checks every size against the file.
 * Files are produced by scripts/prepare-brand-assets.mjs.
 *
 * Alt text describes what each photograph shows; decorative devices (ring,
 * waves, numerals) use empty alt and aria-hidden instead.
 *
 * Note: two photographs (partnership-handshake, greenhouse-smile) have file
 * names that look like stock-library downloads. Confirm licence terms and any
 * attribution duty with the owner.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

export const photos = {
  'commuter-laptop': {
    src: '/brand/photo/commuter-laptop.webp',
    width: 2400,
    height: 1428,
    alt: 'A man works on a laptop on an evening train, warm light against blue-teal windows',
  },
  'delighted-phone': {
    src: '/brand/photo/delighted-phone.webp',
    width: 2400,
    height: 1262,
    alt: 'A woman reacts with delight to good news on her phone in a modern office',
  },
  'office-win': {
    src: '/brand/photo/office-win.webp',
    width: 2400,
    height: 1599,
    alt: 'A man in a blue shirt celebrates a win at his laptop in a bright office',
  },
  'cafe-sunlight': {
    src: '/brand/photo/cafe-sunlight.webp',
    width: 2400,
    height: 1600,
    alt: 'A smiling man works on a laptop under a sunlit pergola',
  },
  'field-tablet': {
    src: '/brand/photo/field-tablet.webp',
    width: 2400,
    height: 1263,
    alt: 'A farm manager records data on a tablet in a greenhouse field',
  },
  'phone-coffee': {
    src: '/brand/photo/phone-coffee.webp',
    width: 2400,
    height: 1599,
    alt: 'A man in an orange sweater smiles at his phone over coffee',
  },
  'home-laptop': {
    src: '/brand/photo/home-laptop.webp',
    width: 2400,
    height: 1349,
    alt: 'A mother works on a laptop at home while holding her baby',
  },
  'partnership-handshake': {
    src: '/brand/photo/partnership-handshake.webp',
    width: 2400,
    height: 2297,
    alt: 'Business partners shake hands to seal an agreement',
  },
  'greenhouse-smile': {
    src: '/brand/photo/greenhouse-smile.webp',
    width: 2400,
    height: 1598,
    alt: 'A smiling woman in work overalls stands in a greenhouse',
  },
} as const;

export type PhotoId = keyof typeof photos;

/**
 * Approved 2026 logo artwork (trimmed to the content box). `minWidth` is the
 * smallest width the brand guideline allows on screen (120 px for the logo).
 * `colour` is for light surfaces, `white` for dark and brand surfaces.
 */
export const logos = {
  full: {
    colour: '/brand/logo/openavii-logo.png',
    white: '/brand/logo/openavii-logo-white.png',
    width: 960,
    height: 280,
    minWidth: 120,
    alt: 'Openavii Technologies',
  },
  extended: {
    colour: '/brand/logo/openavii-extended.png',
    white: '/brand/logo/openavii-extended-white.png',
    width: 1440,
    height: 255,
    minWidth: 120,
    alt: 'Openavii Technologies, Illuminating Your Digital Journey',
  },
  mark: {
    colour: '/brand/logo/openavii-mark.png',
    white: '/brand/logo/openavii-mark-white.png',
    width: 512,
    height: 499,
    minWidth: 24,
    alt: 'Openavii',
  },
} as const;

export type LogoVariant = keyof typeof logos;
