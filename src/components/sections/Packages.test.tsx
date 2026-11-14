/**
 * Packages and add-ons tests (Prompt §3.2)
 * Three flat package cards with the owner's data and ZMW ranges, a "Beyond
 * Websites" card, the add-ons (no prices) and the pricing terms. Every quote
 * action opens the shared enquiry dialog with the right package or service.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { addons, addonsSection, featuredAddon } from '@/content/addons';
import { photos } from '@/content/photos';
import { beyondWebsites, finePrint, packages, packagesSection, trustFacts } from '@/content/packages';
import { renderWithProviders } from '@/test/render';
import { Packages } from './Packages';

describe('Packages', () => {
  it('is the "packages" section on the alt surface with ghost numeral 07', () => {
    const { container } = renderWithProviders(<Packages />);
    const section = container.querySelector('section#packages');
    expect(section).not.toHaveAttribute('data-surface');
    expect(section?.querySelector('[data-ghost-numeral]')).toHaveTextContent('07');
    expect(screen.getByRole('heading', { level: 2, name: packagesSection.heading })).toBeInTheDocument();
    expect(screen.getByText(packagesSection.sub)).toBeInTheDocument();
  });

  it('shows the three packages with name, tagline, audience, delivery and indicative ZMW range', () => {
    renderWithProviders(<Packages />);
    const cards = screen.getAllByRole('article', { name: /Website|Starter/ });
    expect(cards).toHaveLength(3);
    const prices = ['ZMW 3,500 – 6,000', 'ZMW 7,000 – 12,000', 'ZMW 12,000 – 20,000'];
    packages.forEach((pkg, i) => {
      expect(within(cards[i]).getByRole('heading', { level: 3, name: pkg.name })).toBeInTheDocument();
      expect(within(cards[i]).getByText(pkg.tagline)).toBeInTheDocument();
      expect(within(cards[i]).getByText(pkg.suitableFor)).toBeInTheDocument();
      expect(within(cards[i]).getByText(prices[i])).toBeInTheDocument();
      expect(within(cards[i]).getByText(pkg.deliveryTime)).toBeInTheDocument();
      for (const feature of pkg.features) expect(within(cards[i]).getByText(feature)).toBeInTheDocument();
    });
  });

  it('tones the cards navy, teal and cyan, with no "most popular" claim', () => {
    const { container } = renderWithProviders(<Packages />);
    const tones = [...container.querySelectorAll('[data-package]')].map((c) => c.getAttribute('data-tone'));
    expect(tones).toEqual(['navy', 'teal', 'cyan']);
    expect(screen.queryByText(/most popular|best value|recommended/i)).toBeNull();
  });

  it('keeps every line of a package head at full strength (faded white on the teal head measures 4.2:1, below AA for 12 px text)', () => {
    const { container } = renderWithProviders(<Packages />);
    const heads = container.querySelectorAll('[data-package] > div:first-child');
    expect(heads).toHaveLength(3);
    for (const head of heads) {
      for (const el of head.querySelectorAll('*')) {
        expect(el.className, `"${el.textContent}" must not be faded with an opacity utility`).not.toMatch(/\bopacity-/);
      }
    }
  });

  it('opens the enquiry dialog for a package with its price range', async () => {
    renderWithProviders(<Packages />);
    const card = screen.getByRole('article', { name: packages[1].name });
    await userEvent.click(within(card).getByRole('button', { name: 'Get a Quote' }));
    const dialog = screen.getByRole('dialog', { name: 'Request a Quote' });
    expect(dialog).toHaveTextContent(packages[1].name);
    expect(dialog).toHaveTextContent('ZMW 7,000 – 12,000');
    expect(dialog).toHaveTextContent('Selected package');
  });

  it('offers custom work through the Beyond Websites card', async () => {
    renderWithProviders(<Packages />);
    const card = screen.getByRole('group', { name: beyondWebsites.title });
    expect(within(card).getByRole('heading', { level: 3, name: beyondWebsites.title })).toBeInTheDocument();
    expect(within(card).getByText(beyondWebsites.text)).toBeInTheDocument();
    await userEvent.click(within(card).getByRole('button', { name: beyondWebsites.cta }));
    expect(screen.getByRole('dialog', { name: 'Discuss Your Project' })).toBeInTheDocument();
  });

  it('states the pricing terms and four checkable facts instead of vague claims', () => {
    renderWithProviders(<Packages />);
    expect(screen.getByText(finePrint)).toBeInTheDocument();
    const list = screen.getByRole('list', { name: 'What every package includes' });
    expect(within(list).getAllByRole('listitem').map((li) => li.textContent)).toEqual([...trustFacts]);
    expect(screen.queryByText(/secure payment|free support/i)).toBeNull();
  });

  it('keeps the photograph that illustrates simplicity', () => {
    renderWithProviders(<Packages />);
    expect(screen.getByRole('img', { name: photos['delighted-phone'].alt })).toBeInTheDocument();
  });
});

describe('Add-ons (inside Packages, anchored #addons)', () => {
  it('keeps the #addons anchor and lists the four add-ons with tightened copy', () => {
    const { container } = renderWithProviders(<Packages />);
    const block = container.querySelector(`#${addonsSection.anchorId}`) as HTMLElement;
    expect(block).not.toBeNull();
    expect(within(block).getByRole('heading', { level: 3, name: addonsSection.heading })).toBeInTheDocument();
    expect(within(block).getByText(addonsSection.lead)).toBeInTheDocument();
    for (const addon of addons) {
      expect(within(block).getByRole('heading', { level: 4, name: addon.name })).toBeInTheDocument();
      expect(within(block).getByText(addon.description)).toBeInTheDocument();
    }
  });

  it('features Monthly Maintenance and Support and opens a service enquiry for it', async () => {
    const { container } = renderWithProviders(<Packages />);
    const block = container.querySelector(`#${addonsSection.anchorId}`) as HTMLElement;
    expect(within(block).getByRole('heading', { level: 4, name: featuredAddon.name })).toBeInTheDocument();
    await userEvent.click(within(block).getByRole('button', { name: featuredAddon.cta }));
    const dialog = screen.getByRole('dialog', { name: 'Request a Quote' });
    expect(dialog).toHaveTextContent(featuredAddon.name);
  });

  it('shows no prices in the add-ons', () => {
    const { container } = renderWithProviders(<Packages />);
    const block = container.querySelector(`#${addonsSection.anchorId}`) as HTMLElement;
    expect(block.textContent).not.toMatch(/ZMW|kwacha|\bK\s?\d|\d{3,}/);
  });
});
