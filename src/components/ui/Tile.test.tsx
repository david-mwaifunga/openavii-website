/**
 * Tile, Panel, Chip and brand-device tests
 * Flat, crisp containers (no glass), colour-blocked tiles with a palette tone,
 * and the decorative ring watermark and ghost numeral.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Chip } from './Chip';
import { GhostNumeral } from './GhostNumeral';
import { Panel, Tile } from './Tile';
import { RingMark } from './RingMark';

describe('Tile', () => {
  it('is a colour-blocked tile with a palette tone', () => {
    const { container } = render(<Tile tone="teal">Content</Tile>);
    const tile = container.firstElementChild as HTMLElement;
    expect(tile).toHaveClass('tile');
    expect(tile).toHaveAttribute('data-tone', 'teal');
    expect(tile.className).toContain('rounded-tile');
  });

  it('renders the element it is asked to and keeps an anchor id', () => {
    render(
      <Tile as="article" tone="navy" id="service-websites">
        Hello
      </Tile>,
    );
    expect(screen.getByRole('article')).toHaveAttribute('id', 'service-websites');
  });

  it('never uses glass: no blur, no translucent glow', () => {
    const { container } = render(<Tile tone="deep">x</Tile>);
    expect((container.firstElementChild as HTMLElement).className).not.toMatch(/backdrop|blur|glass|shadow/);
  });
});

describe('Panel', () => {
  it('is a flat surface with a hairline border and crisp corners', () => {
    const { container } = render(<Panel>Body</Panel>);
    const panel = container.firstElementChild as HTMLElement;
    expect(panel.className).toContain('bg-surface');
    expect(panel.className).toContain('border-line');
    expect(panel.className).toContain('rounded-tile');
    expect(panel.className).not.toMatch(/backdrop|blur|glass/);
  });
});

describe('Chip', () => {
  it('is a small label with an outline or a solid look', () => {
    const outline = render(<Chip>Integrity</Chip>);
    expect(screen.getByText('Integrity')).toBeInTheDocument();
    outline.unmount();
    render(<Chip tone="solid">Impact</Chip>);
    expect(screen.getByText('Impact').className).toContain('bg-accent-fill');
    expect(screen.getByText('Impact').className).toContain('text-on-accent');
  });
});

describe('brand devices', () => {
  it('GhostNumeral is decorative text, hidden from assistive technology', () => {
    const { container } = render(<GhostNumeral value="02" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveTextContent('02');
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el.className).toContain('text-ghost');
    expect(el.className).toContain('pointer-events-none');
  });

  it('RingMark is the approved mark, used as a mask over a flat palette colour (decorative, never an <img>)', () => {
    const { container } = render(<RingMark tone="white" className="opacity-10" />);
    const ring = container.firstElementChild as HTMLElement;
    expect(ring).toHaveAttribute('aria-hidden', 'true');
    // A mask, not an image element: a huge faint <img> would be reported as the page's LCP element.
    expect(container.querySelector('img')).toBeNull();
    expect(ring.style.maskImage || ring.style.getPropertyValue('mask-image') || ring.getAttribute('style')).toContain(
      'openavii-mark-white.png',
    );
    expect(ring.className).toContain('bg-brand-white');
  });

  it('RingMark can be tinted only with palette colours', () => {
    for (const [tone, cls] of [
      ['white', 'bg-brand-white'],
      ['cyan', 'bg-cyan'],
      ['navy', 'bg-navy'],
    ] as const) {
      const { container, unmount } = render(<RingMark tone={tone} />);
      expect((container.firstElementChild as HTMLElement).className).toContain(cls);
      unmount();
    }
  });
});
