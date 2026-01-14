/**
 * Modal Component
 * A reusable modal dialog component with animations and accessibility features.
 * Theme-responsive with mobile-first design.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { useEffect, useCallback, ReactNode } from 'react';

interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal content */
  children: ReactNode;
  /** Modal title */
  title?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable modal dialog component with animations.
 * Supports keyboard navigation and click-outside-to-close.
 */
export function Modal({ isOpen, onClose, children, title, size = 'md' }: ModalProps) {
  // Handle escape key press
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Add/remove escape key listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={`
          relative w-full ${sizeClasses[size]}
          bg-white dark:bg-slate-900
          rounded-2xl shadow-2xl
          border border-slate-200 dark:border-slate-700
          animate-fade-in-up
          max-h-[90vh] overflow-y-auto
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 id="modal-title" className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="
                w-8 h-8 rounded-lg
                flex items-center justify-center
                text-slate-400 hover:text-slate-600 dark:hover:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition-colors duration-200
              "
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className={title ? '' : 'pt-4 md:pt-6'}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
