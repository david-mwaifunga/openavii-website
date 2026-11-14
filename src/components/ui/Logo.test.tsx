/**
 * Logo tests (brand guideline slides 24 and 29, Prompt §4.4)
 * Approved artwork only. The colour and white versions are both in the markup
 * and switched by CSS, so there is no skeleton, flash or layout shift. The
 * guideline's 120 px minimum width and clear space of one third of the logo
 * height are enforced.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { logos } from '@/content/photos';
import { Logo } from './Logo';

describe('Logo', () => {
  it('names the company in the alt text', () => {
    render(<Logo variant="full" />);
    for (const img of screen.getAllByRole('img', { name: 'Openavii Technologies' })) {
      expect(img).toBeInTheDocument();
    }
  });

  it('renders both tone images in the markup so CSS can switch them (tone "auto")', () => {
    const { container } = render(<Logo variant="full" />);
    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(2);
    const sources = [...images].map((img) => decodeURIComponent(img.getAttribute('src') ?? ''));
    expect(sources.some((s) => s.includes('openavii-logo.png'))).toBe(true);
    expect(sources.some((s) => s.includes('openavii-logo-white.png'))).toBe(true);
    expect(container.querySelector('.logo-on-light')).not.toBeNull();
    expect(container.querySelector('.logo-on-dark')).not.toBeNull();
  });

  it('loads both images eagerly (a lazy hidden logo would pop in late)', () => {
    const { container } = render(<Logo variant="full" />);
    for (const img of container.querySelectorAll('img')) {
      expect(img).not.toHaveAttribute('loading', 'lazy');
    }
  });

  it('renders a single image when the tone is fixed', () => {
    const white = render(<Logo variant="extended" tone="white" />);
    expect(white.container.querySelectorAll('img')).toHaveLength(1);
    expect(decodeURIComponent(white.container.querySelector('img')?.getAttribute('src') ?? '')).toContain(
      'openavii-extended-white.png',
    );
    white.unmount();
    const colour = render(<Logo variant="extended" tone="colour" />);
    expect(colour.container.querySelectorAll('img')).toHaveLength(1);
  });

  it('has no loading skeleton, spinner or pulse', () => {
    const { container } = render(<Logo variant="full" />);
    expect(container.querySelector('[class*="animate-pulse"]')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('never renders below the 120 px minimum width, whatever is asked for', () => {
    const { container, rerender } = render(<Logo variant="full" width={80} />);
    const widthOf = () => (container.querySelector('img') as HTMLImageElement).style.width;
    expect(widthOf()).toBe('120px');
    rerender(<Logo variant="full" width={240} />);
    expect(widthOf()).toBe('240px');
    // Even when sized purely by a class, the guideline minimum holds.
    rerender(<Logo variant="extended" className="w-10" />);
    expect((container.querySelector('img') as HTMLImageElement).style.minWidth).toBe('120px');
  });

  it('keeps the true proportions of the artwork (no stretching)', () => {
    const { container } = render(<Logo variant="extended" width={300} />);
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img.style.height).toBe('auto');
    expect(img.getAttribute('width')).toBe(String(logos.extended.width));
    expect(img.getAttribute('height')).toBe(String(logos.extended.height));
  });

  it('adds clear space of one third of the logo height on every side', () => {
    const { container } = render(<Logo variant="full" width={300} clearSpace />);
    const wrapper = container.firstElementChild as HTMLElement;
    const height = 300 * (logos.full.height / logos.full.width);
    expect(parseFloat(wrapper.style.padding)).toBeCloseTo(height / 3, 1);
  });

  it('can be a decorative mark with no accessible name, hidden from assistive technology', () => {
    const { container } = render(<Logo variant="mark" decorative />);
    for (const img of container.querySelectorAll('img')) {
      expect(img).toHaveAttribute('alt', '');
      expect(img.closest('[aria-hidden="true"]')).not.toBeNull();
    }
  });

  it('is exposed to assistive technology when it is not decorative', () => {
    const { container } = render(<Logo variant="full" />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });
});
