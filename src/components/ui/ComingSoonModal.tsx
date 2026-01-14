/**
 * Coming Soon Modal Component
 * A simple modal to inform users that a feature is coming soon.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { Modal } from './Modal';
import { Button } from './Button';

interface ComingSoonModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Feature name that's coming soon */
  featureName: string;
}

/**
 * Modal to display coming soon message for unimplemented features.
 */
export function ComingSoonModal({ isOpen, onClose, featureName }: ComingSoonModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6 text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Coming Soon
        </h3>

        {/* Message */}
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Our <span className="font-semibold text-violet-600 dark:text-violet-400">{featureName}</span> page
          is currently under development. We&apos;re working hard to bring you the best experience!
        </p>

        {/* Action */}
        <Button onClick={onClose} fullWidth>
          Got it!
        </Button>
      </div>
    </Modal>
  );
}

export default ComingSoonModal;
