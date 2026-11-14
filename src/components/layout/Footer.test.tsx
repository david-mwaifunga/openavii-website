/**
 * Footer tests (Prompt §3.2 closing)
 * Always a dark brand surface: extended white logo, the legal name,
 * registration, working contact links, services by cluster, and no dead
 * social buttons.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { serviceClusters, services } from '@/content/services';
import { site } from '@/content/site';
import { renderWithProviders } from '@/test/render';
import { Footer } from './Footer';

describe('Footer', () => {
  it('is the page\'s contentinfo landmark on the dark brand surface', () => {
    renderWithProviders(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveAttribute('data-surface', 'dark');
  });

  it('shows the approved extended logo in white', () => {
    renderWithProviders(<Footer />);
    const footer = screen.getByRole('contentinfo');
    const sources = [...footer.querySelectorAll('img')].map((i) => decodeURIComponent(i.getAttribute('src') ?? ''));
    expect(sources.some((s) => s.includes('openavii-extended-white.png'))).toBe(true);
    expect(sources.some((s) => /openavii-extended\.png/.test(s))).toBe(false);
  });

  it('states the legal name, registration and credit exactly', () => {
    renderWithProviders(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByText(site.copyright)).toBeInTheDocument();
    expect(within(footer).getByText(site.registrationLine)).toBeInTheDocument();
    expect(within(footer).getByText(site.credit)).toBeInTheDocument();
    expect(within(footer).getByText(site.tagline)).toBeInTheDocument();
  });

  it('has working phone and email links, from the single source of facts', () => {
    renderWithProviders(<Footer />);
    const footer = screen.getByRole('contentinfo');
    for (const phone of site.contact.phones) {
      expect(within(footer).getByRole('link', { name: phone.display })).toHaveAttribute('href', `tel:${phone.e164}`);
    }
    expect(within(footer).getByRole('link', { name: site.contact.email })).toHaveAttribute(
      'href',
      `mailto:${site.contact.email}`,
    );
    expect(within(footer).getByRole('link', { name: site.contact.supportEmail })).toHaveAttribute(
      'href',
      `mailto:${site.contact.supportEmail}`,
    );
    expect(within(footer).getByText(site.address.oneLine)).toBeInTheDocument();
    expect(footer.innerHTML).not.toMatch(/gmail/i);
  });

  it('lists all 15 services under their four clusters, linking to the service tiles', () => {
    renderWithProviders(<Footer />);
    const footer = screen.getByRole('contentinfo');
    for (const cluster of serviceClusters) {
      expect(within(footer).getByText(cluster.title)).toBeInTheDocument();
    }
    for (const service of services) {
      expect(within(footer).getByRole('link', { name: service.title })).toHaveAttribute(
        'href',
        `#service-${service.slug}`,
      );
    }
  });

  it('links the main sections', () => {
    renderWithProviders(<Footer />);
    const footer = screen.getByRole('contentinfo');
    for (const item of site.nav) {
      expect(within(footer).getAllByRole('link', { name: item.label })[0]).toHaveAttribute('href', item.href);
    }
  });

  it('shows no social icons: none have real URLs yet', () => {
    renderWithProviders(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).queryByRole('link', { name: /facebook|instagram|linkedin|twitter|x\.com|tiktok/i })).toBeNull();
    expect(site.socialLinks).toHaveLength(0);
  });

  it('offers a way back to the top', () => {
    renderWithProviders(<Footer />);
    expect(screen.getByRole('link', { name: 'Back to top' })).toHaveAttribute('href', '#home');
  });
});
