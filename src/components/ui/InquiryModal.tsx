/**
 * InquiryModal
 * The enquiry form. The site has no backend and stores nothing: sending opens
 * the visitor's own mail app with the details pre-filled, addressed to the
 * company mailbox (lib/mailto). Works for a package, a service or a custom
 * project. Name and email are required, validated here with clear messages
 * (never colour alone: the invalid field gets a heavier border and a message).
 * Field ids come from useId, so several forms can never clash.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { closingCta, inquiryCopy } from '@/content/contact';
import { site } from '@/content/site';
import {
  INQUIRY_LIMITS,
  buildMailto,
  validateInquiry,
  type InquiryDetails,
  type InquiryErrors,
  type InquiryType,
} from '@/lib/mailto';
import { cn } from '@/lib/cn';
import { Button } from './Button';
import { Modal } from './Modal';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: InquiryType;
  /** Package or service name shown in the banner and used in the e-mail. */
  subjectName?: string;
  /** Indicative price range, for packages. */
  priceRange?: string;
  /** How to open the mail app. Defaults to setting `window.location.href`; injectable for tests. */
  navigate?: (url: string) => void;
}

const defaultNavigate = (url: string) => {
  window.location.href = url;
};

const EMPTY: InquiryDetails = { name: '', email: '', phone: '', company: '', message: '' };

const FIELD =
  'w-full rounded-tile border border-fg/60 bg-page px-4 py-3 text-body text-fg aria-[invalid=true]:border-2 aria-[invalid=true]:border-fg';

export function InquiryModal({
  isOpen,
  onClose,
  type,
  subjectName,
  priceRange,
  navigate = defaultNavigate,
}: InquiryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={inquiryCopy.titles[type]} closeLabel={inquiryCopy.close}>
      {/* The form lives inside the modal, so its state resets every time the dialog opens. */}
      <InquiryForm
        type={type}
        subjectName={subjectName}
        priceRange={priceRange}
        onClose={onClose}
        navigate={navigate}
      />
    </Modal>
  );
}

function InquiryForm({
  type,
  subjectName,
  priceRange,
  onClose,
  navigate,
}: Required<Pick<InquiryModalProps, 'type' | 'onClose' | 'navigate'>> &
  Pick<InquiryModalProps, 'subjectName' | 'priceRange'>) {
  const uid = useId();
  const [values, setValues] = useState<InquiryDetails>(EMPTY);
  const [errors, setErrors] = useState<InquiryErrors>({});
  // True once the mail app has been asked to open: the dialog then stays up (see submit).
  const [sent, setSent] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const change =
    (field: keyof InquiryDetails) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((current) => ({ ...current, [field]: event.target.value }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const found = validateInquiry(values);
    setErrors(found);
    if (found.name) return nameRef.current?.focus();
    if (found.email) return emailRef.current?.focus();
    navigate(buildMailto({ type, subjectName, priceRange, details: values }));
    // The dialog does NOT close. A visitor with no mail app set up sees nothing happen, and closing
    // here would throw away what they typed; instead say what happened and how else to reach us.
    setSent(true);
  };

  const whatsappUrl = `${site.contact.whatsapp.url}?text=${encodeURIComponent(closingCta.whatsappMessage)}`;
  const LINK = 'font-bold text-heading underline underline-offset-4 hover:text-accent-text';
  // The copy carries {email} and {whatsapp} tokens; they become links to the company's own contact facts.
  const fallback = inquiryCopy.sentFallback.split(/(\{email\}|\{whatsapp\})/).map((part, index) => {
    if (part === '{email}') {
      return (
        <a key={index} href={`mailto:${site.contact.email}`} className={LINK}>
          {site.contact.email}
        </a>
      );
    }
    if (part === '{whatsapp}') {
      return (
        <a key={index} href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
          {closingCta.actions.whatsapp}
        </a>
      );
    }
    return part;
  });

  const f = inquiryCopy.fields;
  const label = (text: string, required: boolean) => (
    <>
      {text}
      {required && <span aria-hidden="true"> *</span>}
    </>
  );

  return (
    <form onSubmit={submit} noValidate className="space-y-5 p-6">
      <div className="rounded-tile border border-line bg-alt p-4">
        <p className="text-small text-muted">{inquiryCopy.bannerLabels[type]}</p>
        <p className="text-h4">{subjectName ?? inquiryCopy.customBannerValue}</p>
        {priceRange && <p className="text-small font-bold text-accent-text">{priceRange}</p>}
      </div>

      <p className="text-small text-muted">
        {inquiryCopy.requiredNote} <span aria-hidden="true">*</span>
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className="mb-1.5 block text-small font-bold">
            {label(f.name.label, f.name.required)}
          </label>
          <input
            ref={nameRef}
            id={`${uid}-name`}
            data-autofocus=""
            type="text"
            required
            autoComplete={f.name.autoComplete}
            maxLength={INQUIRY_LIMITS.name}
            value={values.name}
            onChange={change('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${uid}-name-error` : undefined}
            className={FIELD}
          />
          {errors.name && (
            <p id={`${uid}-name-error`} className="mt-1.5 text-small font-bold">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className="mb-1.5 block text-small font-bold">
            {label(f.email.label, f.email.required)}
          </label>
          <input
            ref={emailRef}
            id={`${uid}-email`}
            type="email"
            required
            autoComplete={f.email.autoComplete}
            maxLength={INQUIRY_LIMITS.email}
            value={values.email}
            onChange={change('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${uid}-email-error` : undefined}
            className={FIELD}
          />
          {errors.email && (
            <p id={`${uid}-email-error`} className="mt-1.5 text-small font-bold">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className="mb-1.5 block text-small font-bold">
            {label(f.phone.label, f.phone.required)}
          </label>
          <input
            id={`${uid}-phone`}
            type="tel"
            autoComplete={f.phone.autoComplete}
            maxLength={INQUIRY_LIMITS.phone}
            value={values.phone}
            onChange={change('phone')}
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor={`${uid}-company`} className="mb-1.5 block text-small font-bold">
            {label(f.company.label, f.company.required)}
          </label>
          <input
            id={`${uid}-company`}
            type="text"
            autoComplete={f.company.autoComplete}
            maxLength={INQUIRY_LIMITS.company}
            value={values.company}
            onChange={change('company')}
            className={FIELD}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${uid}-message`} className="mb-1.5 block text-small font-bold">
          {label(f.message.label, f.message.required)}
        </label>
        <textarea
          id={`${uid}-message`}
          rows={4}
          maxLength={INQUIRY_LIMITS.message}
          value={values.message}
          onChange={change('message')}
          className={cn(FIELD, 'resize-y')}
        />
      </div>

      {/* Always in the page, so assistive technology announces what is put into it. */}
      <div role="status" className={sent ? 'rounded-tile border border-line bg-alt p-4 text-small' : undefined}>
        {sent && (
          <>
            <p className="font-bold">{inquiryCopy.sent}</p>
            <p className="mt-1 text-muted">{fallback}</p>
          </>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onClose}>
          {sent ? inquiryCopy.close : inquiryCopy.cancel}
        </Button>
        <Button type="submit" iconAfter="Mail">
          {inquiryCopy.submit}
        </Button>
      </div>

      <p className="text-small text-muted">{inquiryCopy.note}</p>
    </form>
  );
}

export default InquiryModal;
