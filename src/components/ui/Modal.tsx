/**
 * Modal
 * An accessible dialog: role="dialog" with aria-modal, labelled by its title,
 * portalled to <body>. Focus moves in and is trapped, Escape and the backdrop
 * close it, the rest of the page is `inert` and does not scroll, and focus
 * returns to the control that opened it (all in useDialogBehaviour).
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useDialogBehaviour } from '@/hooks/useDialogBehaviour';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Visible title; also the dialog's accessible name. */
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = { sm: 'sm:max-w-sm', md: 'sm:max-w-md', lg: 'sm:max-w-xl' } as const;

export function Modal({ isOpen, onClose, title, children, size = 'lg' }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogBehaviour({ isOpen, onClose, containerRef: dialogRef });

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        data-testid="modal-backdrop"
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-depth/75"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative max-h-[92dvh] w-full overflow-y-auto rounded-t-tile border border-line bg-surface text-fg shadow-2xl sm:rounded-tile',
          SIZES[size],
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
          <h2 id={titleId} className="text-h4">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-11 shrink-0 place-items-center rounded-pill text-fg transition-colors hover:bg-alt"
          >
            <Icon name="X" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
