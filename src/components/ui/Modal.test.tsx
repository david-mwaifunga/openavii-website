/**
 * Modal tests (Prompt §4.6, §7)
 * An accessible dialog: focus moves in, is trapped, Esc closes, focus returns
 * to the trigger, the rest of the page is inert and does not scroll.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

function Harness({ onClose = () => {} }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div data-testid="app">
        <button onClick={() => setOpen(true)}>Open dialog</button>
        <a href="#elsewhere">Outside link</a>
      </div>
      <Modal
        isOpen={open}
        onClose={() => {
          onClose();
          setOpen(false);
        }}
        title="Request a Quote"
      >
        <input aria-label="First field" />
        <button>Second action</button>
      </Modal>
    </>
  );
}

const open = async () => {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Open dialog' }));
  return user;
};

describe('Modal', () => {
  it('renders nothing while closed', () => {
    render(<Harness />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('is a labelled modal dialog, portalled out of the page content', async () => {
    render(<Harness />);
    await open();
    const dialog = screen.getByRole('dialog', { name: 'Request a Quote' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByTestId('app').contains(dialog)).toBe(false);
  });

  it('moves focus into the dialog when it opens', async () => {
    render(<Harness />);
    await open();
    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
  });

  it('traps Tab and Shift+Tab inside the dialog', async () => {
    render(<Harness />);
    const user = await open();
    const dialog = screen.getByRole('dialog');
    const focusables = [
      screen.getByRole('button', { name: 'Close' }),
      screen.getByLabelText('First field'),
      screen.getByRole('button', { name: 'Second action' }),
    ];
    focusables[0].focus();
    await user.tab();
    expect(document.activeElement).toBe(focusables[1]);
    await user.tab();
    expect(document.activeElement).toBe(focusables[2]);
    await user.tab(); // wraps to the start, never to the page behind
    expect(document.activeElement).toBe(focusables[0]);
    await user.tab({ shift: true }); // wraps backwards to the end
    expect(document.activeElement).toBe(focusables[2]);
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('closes on Escape and returns focus to the control that opened it', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    const user = await open();
    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('closes from the close button and from the backdrop, but not from inside the dialog', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    let user = await open();
    await user.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);

    user = await open();
    await user.click(screen.getByTestId('modal-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('closes when the press lands on the dialog layer itself: a real browser cannot deliver clicks to the (inert) backdrop, so it sends them here', async () => {
    // jsdom has no hit-testing and ignores `inert`, which is why the backdrop test above passes while the
    // real thing failed: the page-wide inert pass also silences the backdrop, and a click on the dim area
    // then reaches its parent. Press the parent to model what Chrome, Safari and Firefox actually do.
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    const user = await open();
    const layer = screen.getByTestId('modal-backdrop').parentElement as HTMLElement;
    await user.click(layer);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('does not close when a press starts inside the dialog and is released outside it (selecting text in a field)', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    await open();
    const layer = screen.getByTestId('modal-backdrop').parentElement as HTMLElement;
    fireEvent.pointerDown(screen.getByLabelText('First field'));
    fireEvent.click(layer); // the browser fires the click on the common ancestor of the press and the release
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('makes the rest of the page inert while open, and restores it after', async () => {
    render(<Harness />);
    const user = await open();
    // `inert` is hierarchical: it is set on the ancestor wrapping the whole app,
    // which makes everything inside it (like the trigger and the link) unreachable.
    expect(screen.getByTestId('app').closest('[inert]')).not.toBeNull();
    await user.keyboard('{Escape}');
    expect(screen.getByTestId('app').closest('[inert]')).toBeNull();
  });

  it('locks background scrolling while open, and unlocks it after', async () => {
    render(<Harness />);
    const user = await open();
    expect(document.body.style.overflow).toBe('hidden');
    await user.keyboard('{Escape}');
    expect(document.body.style.overflow).toBe('');
  });

  it('names its close button from the text it is given (content layer), "Close" by default', () => {
    const { rerender } = render(
      <Modal isOpen onClose={() => {}} title="One">
        x
      </Modal>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    rerender(
      <Modal isOpen onClose={() => {}} title="One" closeLabel="Shut this window">
        x
      </Modal>,
    );
    expect(screen.getByRole('button', { name: 'Shut this window' })).toBeInTheDocument();
  });

  it('gives every dialog its own title id, so several can exist without clashes', () => {
    render(
      <>
        <Modal isOpen onClose={() => {}} title="One">
          x
        </Modal>
        <Modal isOpen onClose={() => {}} title="Two">
          y
        </Modal>
      </>,
    );
    const [one, two] = screen.getAllByRole('dialog');
    expect(one.getAttribute('aria-labelledby')).not.toBe(two.getAttribute('aria-labelledby'));
  });
});
