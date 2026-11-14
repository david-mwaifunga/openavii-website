// @vitest-environment node
/**
 * Add-ons contract (Prompt §3.2)
 * Four optional add-ons plus the featured monthly maintenance service. The
 * owner removed prices from this section, so no price may reappear.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { addons, addonsSection, featuredAddon } from './addons';

describe('add-ons', () => {
  it('keeps the four add-ons by name, in order', () => {
    expect(addons.map((a) => a.name)).toEqual([
      'Additional Page',
      'Blog / CMS Setup',
      'Content Writing',
      'Logo and Branding',
    ]);
    for (const a of addons) {
      expect(a.description.length).toBeGreaterThan(20);
      expect(a.icon).toBeTruthy();
    }
  });

  it('features Monthly Maintenance and Support', () => {
    expect(featuredAddon.name).toBe('Monthly Maintenance and Support');
    expect(featuredAddon.label).toBe('Recurring service');
    expect(featuredAddon.description.length).toBeGreaterThan(40);
  });

  it('shows no prices anywhere in the add-ons', () => {
    const everything = JSON.stringify({ addons, featuredAddon, addonsSection });
    expect(everything).not.toMatch(/ZMW|kwacha|price|priceRange|\bK\s?\d/i);
    expect(everything).not.toMatch(/\d{3,}/);
    for (const a of [...addons, featuredAddon]) {
      expect(a).not.toHaveProperty('price');
      expect(a).not.toHaveProperty('priceRange');
      expect(a).not.toHaveProperty('priceLabel');
    }
  });

  it('keeps the in-page anchor id "addons"', () => {
    expect(addonsSection.anchorId).toBe('addons');
  });
});
