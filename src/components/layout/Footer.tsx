/**
 * Footer
 * Always the dark brand surface. Extended white logo (with its clear space),
 * the tagline, navigation, the 15 services grouped by cluster, working contact
 * links (all from content/site), the legal name, the PACRA registration and the
 * designer credit. Social icons render only for URLs present in content/site -
 * there are none yet, so there are no dead buttons.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { footerCopy } from '@/content/contact';
import { serviceClusters, services } from '@/content/services';
import { site } from '@/content/site';

const LINK = 'inline-flex min-h-11 items-center text-small text-muted transition-colors hover:text-accent-text';
const HEADING = 'mb-4 text-overline uppercase text-heading';

export function Footer() {
  return (
    <footer data-surface="dark" className="border-t border-line pb-10 pt-20">
      <div className="wrap">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            {/* The clear space is built into the logo box; pull the box out so the artwork itself lines up with the text. */}
            <div className="-ml-[18px] -mt-[18px]">
              <Logo variant="extended" tone="white" width={300} clearSpace eager={false} />
            </div>
            <p className="mt-4 max-w-xs text-lead font-light text-muted">{site.tagline}</p>
          </div>

          <nav aria-label="Explore" className="lg:col-span-2">
            <h2 className={HEADING}>{footerCopy.exploreHeading}</h2>
            <ul>
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={LINK}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services" className="lg:col-span-4">
            <h2 className={HEADING}>{footerCopy.servicesHeading}</h2>
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {serviceClusters.map((cluster) => (
                <div key={cluster.id}>
                  <h3 className="mb-1 text-small font-bold text-fg">{cluster.title}</h3>
                  <ul>
                    {services
                      .filter((service) => service.cluster === cluster.id)
                      .map((service) => (
                        <li key={service.slug}>
                          <a href={`#service-${service.slug}`} className={`${LINK} leading-snug`}>
                            {service.title}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          <div className="lg:col-span-2">
            <h2 className={HEADING}>{footerCopy.contactHeading}</h2>
            <ul className="space-y-1">
              {site.contact.phones.map((phone) => (
                <li key={phone.e164}>
                  <a href={`tel:${phone.e164}`} className={LINK} aria-label={phone.display}>
                    {phone.display}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.contact.email}`} className={LINK}>
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contact.supportEmail}`} className={LINK}>
                  {site.contact.supportEmail}
                </a>
              </li>
              <li>
                <a href={site.url} className={LINK}>
                  {site.domain}
                </a>
              </li>
            </ul>
            {/* A div, not a p: <address> is flow content and cannot sit inside a paragraph. */}
            <div className="mt-3 flex items-start gap-2 text-small text-muted">
              <Icon name="MapPin" size={18} className="mt-1 shrink-0" />
              <address className="not-italic">{site.address.oneLine}</address>
            </div>
            {site.socialLinks.length > 0 && (
              <ul className="mt-4 flex gap-3">
                {site.socialLinks.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className={LINK}>
                      {link.platform}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-small text-muted md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p>{site.registrationLine}</p>
            <p>{site.copyright}</p>
            <p>{site.credit}</p>
          </div>
          <a href="#home" className={`${LINK} font-bold text-fg`}>
            {footerCopy.backToTop}
            <Icon name="ArrowUpRight" size={18} className="ml-1" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
