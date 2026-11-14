/**
 * Inquiry Context
 * One shared enquiry dialog for the whole page. Any button calls
 * `openInquiry({ type, name?, priceRange? })`; the provider renders the single
 * dialog. (The previous site mounted a separate modal in several sections.)
 * The dialog unmounts on close, so focus returns to the button that opened it.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { InquiryModal } from '@/components/ui/InquiryModal';
import type { InquiryType } from '@/lib/mailto';

/** What to enquire about. */
export interface InquiryRequest {
  type: InquiryType;
  /** Package or service name (omit for a custom project). */
  name?: string;
  /** Indicative price range, for packages. */
  priceRange?: string;
}

interface InquiryContextValue {
  openInquiry: (request: InquiryRequest) => void;
}

const InquiryContext = createContext<InquiryContextValue | undefined>(undefined);

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<InquiryRequest | null>(null);
  const openInquiry = useCallback((next: InquiryRequest) => setRequest(next), []);
  const close = useCallback(() => setRequest(null), []);
  const value = useMemo(() => ({ openInquiry }), [openInquiry]);

  return (
    <InquiryContext.Provider value={value}>
      {children}
      {request && (
        <InquiryModal
          isOpen
          onClose={close}
          type={request.type}
          subjectName={request.name}
          priceRange={request.priceRange}
        />
      )}
    </InquiryContext.Provider>
  );
}

/**
 * Open the shared enquiry dialog.
 * @throws if used outside an InquiryProvider
 */
export function useInquiry(): InquiryContextValue {
  const context = useContext(InquiryContext);
  if (context === undefined) {
    throw new Error('useInquiry must be used within an InquiryProvider');
  }
  return context;
}
