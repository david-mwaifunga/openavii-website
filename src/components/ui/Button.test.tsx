/**
 * Button tests
 * One component for actions (button) and navigation (anchor), pill-shaped,
 * Bold labels, with touch targets of at least 44 px.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders a real <button> that handles clicks', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Get a Quote</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Get a Quote' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('renders an anchor when given an href, so navigation is a link', () => {
    render(<Button href="#services">See What We Do</Button>);
    const link = screen.getByRole('link', { name: 'See What We Do' });
    expect(link).toHaveAttribute('href', '#services');
  });

  it('opens external links safely in a new tab', () => {
    render(
      <Button href="https://wa.me/260967223048" external>
        WhatsApp
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'WhatsApp' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('keeps every size at a 44 px minimum touch target, pill-shaped, with Bold labels', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const { unmount } = render(<Button size={size}>Label</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toMatch(/min-h-11/);
      expect(button.className).toMatch(/rounded-pill/);
      expect(button.className).toMatch(/font-bold/);
      unmount();
    }
  });

  it('uses the surface-aware primary tokens (navy on light, cyan on dark) rather than fixed colours', () => {
    render(<Button variant="primary">Primary</Button>);
    const { className } = screen.getByRole('button');
    expect(className).toContain('bg-btn');
    expect(className).toContain('text-on-btn');
    expect(className).not.toMatch(/#|blue|violet|indigo/);
  });

  it('supports secondary, ghost and inverse variants', () => {
    for (const variant of ['secondary', 'ghost', 'inverse'] as const) {
      const { unmount } = render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole('button').className.length).toBeGreaterThan(20);
      unmount();
    }
  });

  it('adds a decorative trailing icon without changing the accessible name', () => {
    render(<Button iconAfter="ArrowRight">Get a Quote</Button>);
    const button = screen.getByRole('button', { name: 'Get a Quote' });
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('can be disabled', () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
