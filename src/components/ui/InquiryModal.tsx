/**
 * Inquiry Modal Component
 * A modal for submitting inquiries via email.
 * Supports packages, services, and custom project inquiries.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { useState, FormEvent } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface InquiryModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Type of inquiry - determines banner style and email content */
  inquiryType?: 'package' | 'service' | 'custom';
  /** Service/Package name */
  serviceName: string;
  /** Price range (optional for custom inquiries) */
  priceRange?: string;
  /** Modal title override */
  title?: string;
}

/** Legacy props for backwards compatibility */
interface LegacyInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
  priceRange: string;
}

/** Contact email for inquiries */
const CONTACT_EMAIL = 'mwaifungad@gmail.com';

/**
 * Modal form for inquiries.
 * Opens email client with pre-filled subject and body.
 */
export function InquiryModal(props: InquiryModalProps | LegacyInquiryModalProps) {
  // Handle legacy props (packageName -> serviceName)
  const isOpen = props.isOpen;
  const onClose = props.onClose;
  const serviceName = 'serviceName' in props ? props.serviceName : props.packageName;
  const priceRange = 'priceRange' in props ? props.priceRange : undefined;
  const inquiryType = 'inquiryType' in props ? props.inquiryType : 'package';
  const title = 'title' in props ? props.title : (inquiryType === 'custom' ? 'Discuss Your Project' : 'Request a Quote');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Construct email subject based on inquiry type
    const subjectMap = {
      package: `Inquiry: ${serviceName} Package`,
      service: `Inquiry: ${serviceName} Service`,
      custom: 'Custom Project Inquiry',
    };
    const subject = encodeURIComponent(subjectMap[inquiryType || 'package']);

    // Construct intro line based on inquiry type
    const introMap = {
      package: `I am interested in the ${serviceName} package${priceRange ? ` (${priceRange})` : ''}.`,
      service: `I am interested in the ${serviceName} service${priceRange ? ` (${priceRange})` : ''}.`,
      custom: `I am interested in discussing a custom project.`,
    };

    // Construct email body with all details
    const body = encodeURIComponent(
`Hello Openavii Technologies,

${introMap[inquiryType || 'package']}

--- Client Information ---
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Business: ${formData.company || 'Not provided'}

--- Additional Message ---
${formData.message || 'No additional message.'}

---
Looking forward to hearing from you.

Best regards,
${formData.name}`
    );

    // Open email client
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    // Reset form and close modal
    setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    onClose();
  };

  // Banner label based on inquiry type
  const bannerLabelMap = {
    package: 'Selected Package',
    service: 'Selected Service',
    custom: 'Inquiry Type',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
        {/* Service/Package Info Banner */}
        <div className="bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-xl p-4 border border-violet-200 dark:border-violet-700/50">
          <p className="text-sm text-slate-600 dark:text-slate-400">{bannerLabelMap[inquiryType || 'package']}</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{serviceName}</p>
          {priceRange && (
            <p className="text-sm text-violet-600 dark:text-violet-400">{priceRange}</p>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="
                w-full px-4 py-2.5 rounded-lg
                bg-slate-50 dark:bg-slate-800
                border border-slate-200 dark:border-slate-700
                text-slate-900 dark:text-white
                placeholder-slate-400 dark:placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                transition-all duration-200
              "
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="
                w-full px-4 py-2.5 rounded-lg
                bg-slate-50 dark:bg-slate-800
                border border-slate-200 dark:border-slate-700
                text-slate-900 dark:text-white
                placeholder-slate-400 dark:placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                transition-all duration-200
              "
              placeholder="john@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="
                w-full px-4 py-2.5 rounded-lg
                bg-slate-50 dark:bg-slate-800
                border border-slate-200 dark:border-slate-700
                text-slate-900 dark:text-white
                placeholder-slate-400 dark:placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                transition-all duration-200
              "
              placeholder="+260 XXX XXX XXX"
            />
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Business Name
            </label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="
                w-full px-4 py-2.5 rounded-lg
                bg-slate-50 dark:bg-slate-800
                border border-slate-200 dark:border-slate-700
                text-slate-900 dark:text-white
                placeholder-slate-400 dark:placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                transition-all duration-200
              "
              placeholder="Your Company Ltd"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Additional Details
          </label>
          <textarea
            id="message"
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="
              w-full px-4 py-2.5 rounded-lg
              bg-slate-50 dark:bg-slate-800
              border border-slate-200 dark:border-slate-700
              text-slate-900 dark:text-white
              placeholder-slate-400 dark:placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
              transition-all duration-200
              resize-none
            "
            placeholder="Tell us about your project requirements, timeline, or any questions you have..."
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button type="submit" fullWidth className="sm:flex-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Inquiry
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="sm:w-auto">
            Cancel
          </Button>
        </div>

        {/* Note */}
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          This will open your email client with the inquiry details pre-filled.
        </p>
      </form>
    </Modal>
  );
}

export default InquiryModal;
