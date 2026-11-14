/**
 * useDialogBehaviour
 * The accessibility behaviour every modal surface needs, in one place:
 *   - focus moves into the dialog when it opens (to `[data-autofocus]` if
 *     present, otherwise the first focusable element)
 *   - Tab and Shift+Tab are trapped inside the dialog
 *   - Escape closes it
 *   - everything else on the page is made `inert` (unreachable by keyboard,
 *     pointer or assistive technology), including when the dialog is not
 *     portalled to <body>
 *   - background scrolling is locked
 *   - on close, focus returns to the control that opened it
 *
 * Used by the enquiry Modal and by the full-screen navigation sheet.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/** Focusable descendants in DOM order, skipping anything hidden from users. */
function focusableIn(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true',
  );
}

/**
 * Mark every element outside `container` inert, walking from the container up to
 * <body> so a dialog nested inside a header is as well supported as a portalled one.
 * Returns a function that undoes exactly what was changed.
 */
function inertEverythingElse(container: HTMLElement): () => void {
  const changed: Element[] = [];
  let node: HTMLElement = container;
  while (node !== document.body && node.parentElement) {
    const parent: HTMLElement = node.parentElement;
    for (const sibling of Array.from(parent.children)) {
      if (sibling !== node && !sibling.hasAttribute('inert')) {
        sibling.setAttribute('inert', '');
        changed.push(sibling);
      }
    }
    node = parent;
  }
  return () => changed.forEach((el) => el.removeAttribute('inert'));
}

interface DialogBehaviourOptions {
  isOpen: boolean;
  onClose: () => void;
  /** The dialog element (role="dialog"). */
  containerRef: RefObject<HTMLElement | null>;
}

export function useDialogBehaviour({ isOpen, onClose, containerRef }: DialogBehaviourOptions) {
  // Always call the latest onClose without re-running the effect (which would
  // reset focus every time a parent re-renders with a new callback).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!isOpen || !container) return;

    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const restoreInert = inertEverythingElse(container);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const initial =
      container.querySelector<HTMLElement>('[data-autofocus]') ?? focusableIn(container)[0] ?? container;
    initial.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusableIn(container);
      if (items.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const outside = !container.contains(active);
      if (event.shiftKey && (active === first || outside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || outside)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      restoreInert();
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [isOpen, containerRef]);
}
