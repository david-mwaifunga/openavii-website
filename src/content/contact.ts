/**
 * Closing call to action, footer and enquiry-form copy
 * The closing headline is the brand's cover line (Digest §1). The enquiry
 * form opens the visitor's own email app (no backend), so its note says
 * exactly that. Visible text says "enquiry" (British English); code
 * identifiers keep the established "inquiry" name.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { newCopy } from './copy';

export const closingCta = {
  eyebrow: "LET'S TALK",
  /** Two lines: the second is set in bright cyan. */
  heading: ['Turning Bright Ideas', 'into Digital Reality.'],
  sub: newCopy(
    'contact.sub',
    "Is your business ready for the digital shift? Tell us the challenge — we'll start by understanding it.",
  ), // COPY-NEW
  actions: {
    quote: 'Get a Quote',
    whatsapp: 'WhatsApp',
    call: 'Call',
    email: 'Email',
  },
  /** Pre-filled WhatsApp message. */
  whatsappMessage: newCopy(
    'contact.whatsapp',
    'Hello Openavii Technologies, I would like to discuss a project.',
  ), // COPY-NEW
} as const;

export const contactLabels = {
  mobile: 'Mobile',
  email: 'Email',
  website: 'Website',
  address: 'Address',
} as const;

export const footerCopy = {
  exploreHeading: 'Explore',
  servicesHeading: 'What We Do',
  contactHeading: 'Contact',
  backToTop: 'Back to top',
} as const;

/** Visible text of the enquiry dialog. No placeholders: the labels do the work. */
export const inquiryCopy = {
  titles: {
    package: 'Request a Quote',
    service: 'Request a Quote',
    custom: 'Discuss Your Project',
  },
  bannerLabels: {
    package: 'Selected package',
    service: 'Selected service',
    custom: 'Enquiry type',
  },
  customBannerValue: 'Custom project',
  fields: {
    name: { label: 'Full name', required: true, autoComplete: 'name' },
    email: { label: 'Email address', required: true, autoComplete: 'email' },
    phone: { label: 'Phone number', required: false, autoComplete: 'tel' },
    company: { label: 'Business name', required: false, autoComplete: 'organization' },
    message: { label: 'Additional details', required: false, autoComplete: 'off' },
  },
  requiredNote: 'Required fields are marked',
  submit: 'Send Enquiry',
  cancel: 'Cancel',
  close: 'Close',
  note: newCopy(
    'inquiry.note',
    'Sending opens your email app with these details pre-filled. This website does not store them.',
  ), // COPY-NEW
} as const;
