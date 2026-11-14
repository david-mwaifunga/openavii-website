/**
 * Closing call to action
 * The brand's cover line as the last headline ("Turning Bright Ideas into
 * Digital Reality."), four ways to get in touch - a quote, WhatsApp, a call or
 * an email - and the full contact grid. Every number, address and link comes
 * from content/site (one source of facts). The WhatsApp link opens a chat with a
 * pre-filled opening line; the others are plain tel: and mailto: links.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { Button } from '@/components/ui/Button';
import { RingMark } from '@/components/ui/RingMark';
import { Section } from '@/components/ui/Section';
import { ShapedPhoto } from '@/components/ui/ShapedPhoto';
import { closingCta, contactLabels } from '@/content/contact';
import { site } from '@/content/site';
import { useInquiry } from '@/context/InquiryContext';

const LINK = 'font-bold text-heading underline-offset-4 hover:text-accent-text hover:underline';

export function ContactCta() {
  const { openInquiry } = useInquiry();
  const whatsapp = `${site.contact.whatsapp.url}?text=${encodeURIComponent(closingCta.whatsappMessage)}`;

  return (
    <Section
      id="contact"
      surface="dark"
      numeral="08"
      labelledBy="contact-heading"
      topCurve={{ tone: 'alt', variant: 'swoosh' }}
      className="pb-24 pt-[calc(var(--spacing-section)+3rem)]"
      padded={false}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center opacity-80"
        style={{ backgroundImage: 'url(/brand/bg/wave-dark.webp)' }}
      />
      <RingMark className="-bottom-[20%] -right-[12%] -z-10 w-[min(60vw,720px)] opacity-[0.05]" />

      <div className="wrap">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-3 text-overline uppercase text-accent-text">
              <span aria-hidden="true" className="h-px w-8 bg-accent-fill" />
              {closingCta.eyebrow}
            </p>
            <h2 id="contact-heading" className="mt-6 text-balance text-h2">
              <span data-line="" className="block">
                {closingCta.heading[0]}
              </span>{' '}
              <span data-line="" className="block text-accent-text">
                {closingCta.heading[1]}
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-lead font-light text-muted">{closingCta.sub}</p>

            <div role="group" aria-label="Get in touch" className="mt-10 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => openInquiry({ type: 'custom' })}>
                {closingCta.actions.quote}
              </Button>
              <Button size="lg" variant="secondary" href={whatsapp} external iconAfter="MessageCircle">
                {closingCta.actions.whatsapp}
              </Button>
              <Button size="lg" variant="secondary" href={`tel:${site.contact.phones[0].e164}`} iconAfter="Phone">
                {closingCta.actions.call}
              </Button>
              <Button size="lg" variant="secondary" href={`mailto:${site.contact.email}`} iconAfter="Mail">
                {closingCta.actions.email}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <ShapedPhoto photo="cafe-sunlight" shape="shape-5" sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
        </div>

        <ul
          aria-label="Contact details"
          className="mt-20 grid gap-8 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          <li>
            <p className="text-overline uppercase text-accent-text">{contactLabels.mobile}</p>
            <ul className="mt-3 space-y-1">
              {site.contact.phones.map((phone) => (
                <li key={phone.e164}>
                  <a href={`tel:${phone.e164}`} className={LINK}>
                    {phone.display}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <p className="text-overline uppercase text-accent-text">{contactLabels.email}</p>
            <ul className="mt-3 space-y-1">
              {[site.contact.email, site.contact.supportEmail].map((email) => (
                <li key={email}>
                  <a href={`mailto:${email}`} className={LINK}>
                    {email}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <p className="text-overline uppercase text-accent-text">{contactLabels.website}</p>
            <p className="mt-3">
              <a href={site.url} className={LINK}>
                {site.domain}
              </a>
            </p>
          </li>
          <li>
            <p className="text-overline uppercase text-accent-text">{contactLabels.address}</p>
            <address className="mt-3 not-italic text-heading">{site.address.oneLine}</address>
          </li>
        </ul>
      </div>
    </Section>
  );
}

export default ContactCta;
