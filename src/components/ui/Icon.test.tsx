/**
 * Icon tests
 * One thin-line set (Lucide, stroke 1.5, round caps). Decorative by default,
 * labelled when it carries meaning, and complete for every name the content
 * and the interface use.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CONTENT_ICONS, UI_ICONS } from '@/content/icons';
import { Icon } from './Icon';

describe('Icon', () => {
  it('draws thin round-capped strokes in the current text colour', () => {
    const { container } = render(<Icon name="Globe" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('stroke-width', '1.5');
    expect(svg).toHaveAttribute('stroke-linecap', 'round');
    expect(svg).toHaveAttribute('stroke-linejoin', 'round');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
  });

  it('is decorative (hidden from assistive tech) unless given a label', () => {
    const { container } = render(<Icon name="Globe" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('exposes a labelled icon as an image', () => {
    render(<Icon name="Phone" label="Call us" />);
    expect(screen.getByRole('img', { name: 'Call us' })).toBeInTheDocument();
  });

  it('sizes the icon', () => {
    const { container } = render(<Icon name="Globe" size={40} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '40');
    expect(svg).toHaveAttribute('height', '40');
  });

  it.each([...CONTENT_ICONS, ...UI_ICONS])('knows the %s icon', (name) => {
    const { container } = render(<Icon name={name} />);
    expect(container.querySelector('svg')).not.toBeNull();
  });
});
