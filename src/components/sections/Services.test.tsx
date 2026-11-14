/**
 * "What We Do" tests (Prompt §3.2)
 * The 15 services as a colour-blocked mosaic in four clusters. Each tile has an
 * anchor id, a thin-line icon, the Profile title and first-sentence summary,
 * and a Get a Quote action that opens the enquiry dialog with that service.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { photos } from '@/content/photos';
import { serviceClusters, services, servicesSection } from '@/content/services';
import { renderWithProviders } from '@/test/render';
import { Services } from './Services';

describe('Services', () => {
  it('is the "services" section on the brand band with ghost numeral 02', () => {
    const { container } = renderWithProviders(<Services />);
    const section = container.querySelector('section#services');
    expect(section).toHaveAttribute('data-surface', 'brand');
    expect(section?.querySelector('[data-ghost-numeral]')).toHaveTextContent('02');
    expect(screen.getByRole('heading', { level: 2, name: servicesSection.heading })).toBeInTheDocument();
    expect(screen.getByText(servicesSection.lead)).toBeInTheDocument();
  });

  it('groups the tiles under the four cluster headings', () => {
    renderWithProviders(<Services />);
    for (const cluster of serviceClusters) {
      expect(screen.getByRole('heading', { level: 3, name: cluster.title })).toBeInTheDocument();
    }
  });

  it('shows all 15 services with their anchor ids, titles and summaries', () => {
    renderWithProviders(<Services />);
    const tiles = screen.getAllByRole('article');
    expect(tiles).toHaveLength(15);
    services.forEach((service, i) => {
      expect(tiles[i]).toHaveAttribute('id', `service-${service.slug}`);
      expect(within(tiles[i]).getByRole('heading', { level: 4, name: service.title })).toBeInTheDocument();
      expect(within(tiles[i]).getByText(service.summary)).toBeInTheDocument();
    });
  });

  it('colour-blocks the tiles in the Profile palette, never white text on cyan', () => {
    renderWithProviders(<Services />);
    const tiles = screen.getAllByRole('article');
    services.forEach((service, i) => {
      expect(tiles[i]).toHaveAttribute('data-tone', service.tone);
      expect(tiles[i]).toHaveClass('tile');
    });
    // The cyan tone gets near-black text through the tile tokens, not a white class.
    for (const tile of tiles) expect(tile.className).not.toMatch(/text-(white|brand-white)/);
  });

  it('opens the enquiry dialog for the service, from its tile', async () => {
    renderWithProviders(<Services />);
    const tile = screen.getByRole('article', { name: services[6].title });
    await userEvent.click(within(tile).getByRole('button', { name: /Get a Quote/ }));
    const dialog = screen.getByRole('dialog', { name: 'Request a Quote' });
    expect(dialog).toHaveTextContent(services[6].title);
    expect(dialog).toHaveTextContent('Selected service');
  });

  it('interleaves brand photographs between the tiles, with factual alt text', () => {
    renderWithProviders(<Services />);
    for (const id of ['phone-coffee', 'partnership-handshake'] as const) {
      expect(screen.getByRole('img', { name: photos[id].alt })).toBeInTheDocument();
    }
  });

  it('gives each tile a decorative thin-line icon ring that opens on hover (CSS)', () => {
    const { container } = renderWithProviders(<Services />);
    expect(container.querySelectorAll('.ring-path')).toHaveLength(15);
    for (const svg of container.querySelectorAll('article svg')) {
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    }
  });
});
