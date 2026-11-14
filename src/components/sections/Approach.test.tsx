/**
 * "How We Work" tests (Prompt §3.2)
 * The approach statement, then the five-phase timeline with the Profile's
 * seven stages hung beneath their phases. The timeline lights up as it scrolls
 * into view and is fully visible without that.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { approach, phases, processClosing, processHeading, stages } from '@/content/process';
import { renderWithProviders } from '@/test/render';
import { installIntersectionObserver } from '@/test/utils';
import { Approach } from './Approach';

describe('Approach', () => {
  it('is the "approach" section on the page surface with ghost numeral 03', () => {
    const { container } = renderWithProviders(<Approach />);
    const section = container.querySelector('section#approach');
    expect(section).not.toHaveAttribute('data-surface');
    expect(section?.querySelector('[data-ghost-numeral]')).toHaveTextContent('03');
  });

  it('states the approach in three lines and a paragraph, verbatim', () => {
    renderWithProviders(<Approach />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(approach.lines.join(' '));
    expect(screen.getByText(approach.paragraph)).toBeInTheDocument();
  });

  it('heads the timeline with the five-phase line', () => {
    renderWithProviders(<Approach />);
    expect(screen.getByRole('heading', { level: 3, name: processHeading })).toBeInTheDocument();
  });

  it('shows five phases in order, each a numbered node', () => {
    const { container } = renderWithProviders(<Approach />);
    const nodes = container.querySelectorAll('[data-phase]');
    expect([...nodes].map((n) => n.getAttribute('data-phase'))).toEqual(phases.map((p) => p.id));
    for (const phase of phases) {
      expect(screen.getByRole('heading', { level: 4, name: phase.label })).toBeInTheDocument();
    }
  });

  it('hangs each of the seven stages, verbatim, under its own phase', () => {
    const { container } = renderWithProviders(<Approach />);
    for (const stage of stages) {
      const phase = container.querySelector(`[data-phase="${stage.phase}"]`) as HTMLElement;
      const card = within(phase).getByRole('heading', { level: 5, name: stage.title }).closest('li') as HTMLElement;
      expect(card).toHaveTextContent(stage.description);
    }
    expect(container.querySelectorAll('[data-phase] li')).toHaveLength(7);
  });

  it('lights the timeline once it scrolls into view, and keeps it lit', () => {
    const io = installIntersectionObserver();
    const { container } = renderWithProviders(<Approach />);
    const wrap = container.querySelector('.timeline-wrap') as HTMLElement;
    expect(wrap).not.toHaveClass('is-visible');
    act(() => io.trigger(wrap, true));
    expect(wrap).toHaveClass('is-visible');
    act(() => io.trigger(wrap, false));
    expect(wrap).toHaveClass('is-visible');
  });

  it('lights the timeline as soon as its top edge is on screen, not when a fifth of it is: a short viewport (a landscape phone, 400 % zoom) can never show a fifth of a timeline 1,500 px tall', () => {
    const io = installIntersectionObserver();
    const { container } = renderWithProviders(<Approach />);
    const wrap = container.querySelector('.timeline-wrap') as HTMLElement;
    const options = io.optionsFor(wrap);
    expect(options, 'the timeline must be observed').toBeDefined();
    expect(options?.threshold).toBe(0);
    // lit once its top has cleared the bottom band of the viewport, whatever the viewport's height
    expect(options?.rootMargin).toMatch(/-\d+%/);
  });

  it('closes with the transparency statement and a call to start the journey', async () => {
    renderWithProviders(<Approach />);
    expect(screen.getByText(processClosing.statement)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: new RegExp(processClosing.cta) }));
    expect(screen.getByRole('dialog', { name: 'Discuss Your Project' })).toBeInTheDocument();
  });
});
