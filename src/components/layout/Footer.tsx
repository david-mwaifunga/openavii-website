/**
 * Footer Component
 * A comprehensive footer with company info, quick links, and contact details.
 * Features gradient accents and smooth hover animations.
 * Theme-responsive with mobile-first design.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button, ComingSoonModal } from '@/components/ui';
import { useTheme } from '@/context';
import { useMounted } from '@/hooks';

/** Contact information */
const CONTACT_EMAIL = 'mwaifungad@gmail.com';
const WHATSAPP_LINK = 'https://wa.me/260967223048';

/** Footer navigation links */
const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Packages', href: '#packages' },
  { label: 'Add-ons', href: '#addons' },
];

const serviceLinks = [
  { label: 'Startup Websites', href: '#packages' },
  { label: 'Business Websites', href: '#packages' },
  { label: 'Growth Solutions', href: '#packages' },
  { label: 'Custom Projects', href: '#contact' },
];

/**
 * Main footer component with company branding and navigation.
 * Adapts to both light and dark themes.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  const mounted = useMounted();
  const { resolvedTheme } = useTheme();
  const [comingSoonModal, setComingSoonModal] = useState({ isOpen: false, feature: '' });

  // Determine which logo to show based on theme
  const logoSrc = mounted && resolvedTheme === 'dark'
    ? '/Openavii-Light.png'
    : '/Openavii-Dark.png';

  // Handle social icon click
  const handleSocialClick = (platform: string) => {
    setComingSoonModal({ isOpen: true, feature: platform });
  };

  // Handle email button click
  const handleEmailClick = () => {
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=Website Inquiry&body=Hello Openavii Technologies,%0A%0AI am interested in your website development services.%0A%0APlease get in touch with me.%0A%0ABest regards`;
  };

  // Handle WhatsApp button click
  const handleWhatsAppClick = () => {
    window.open(WHATSAPP_LINK, '_blank');
  };

  return (
    <footer id="contact" className="relative bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/50">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-100/5 dark:via-violet-950/5 to-transparent pointer-events-none" />

      {/* Contact CTA Section */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4">
            Ready to Build Your{' '}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Digital Presence
            </span>
            ?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Let&apos;s discuss your project and find the perfect package for your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Button size="lg" className="w-full sm:w-auto" onClick={handleEmailClick}>
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Us
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={handleWhatsAppClick}>
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              WhatsApp Us
            </Button>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="mb-4">
              {mounted ? (
                <Image
                  src={logoSrc}
                  alt="Openavii Technologies"
                  width={280}
                  height={80}
                  className="h-12 w-auto sm:h-14 md:h-16"
                />
              ) : (
                <div className="h-12 w-44 sm:h-14 sm:w-52 md:h-16 md:w-60 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md text-sm md:text-base">
              <strong className="text-violet-600 dark:text-violet-400">Open</strong> (Open) +{' '}
              <strong className="text-violet-600 dark:text-violet-400">avi</strong> (Light) +{' '}
              <strong className="text-violet-600 dark:text-violet-400">i</strong> (International)
              <br />
              Bringing open, illuminating solutions to businesses worldwide.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {['LinkedIn', 'Twitter', 'Instagram', 'GitHub'].map((social) => (
                <button
                  key={social}
                  onClick={() => handleSocialClick(social)}
                  className="
                    w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl
                    bg-slate-100 dark:bg-slate-800/50
                    border border-slate-200 dark:border-slate-700/50
                    flex items-center justify-center
                    text-slate-500 dark:text-slate-400
                    hover:bg-violet-100 dark:hover:bg-violet-600/20
                    hover:border-violet-300 dark:hover:border-violet-500/50
                    hover:text-violet-600 dark:hover:text-violet-400
                    transition-all duration-300
                    cursor-pointer
                  "
                  aria-label={social}
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    {social === 'LinkedIn' && (
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    )}
                    {social === 'Twitter' && (
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    )}
                    {social === 'Instagram' && (
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    )}
                    {social === 'GitHub' && (
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    )}
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4 text-sm md:text-base">Quick Links</h3>
            <ul className="space-y-2 md:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-300 text-sm md:text-base"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4 text-sm md:text-base">Services</h3>
            <ul className="space-y-2 md:space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-300 text-sm md:text-base"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200 dark:border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <p className="text-slate-500 dark:text-slate-500 text-xs md:text-sm">
              &copy; {currentYear} Openavii Technologies. All rights reserved.
            </p>
            <p className="text-slate-500 dark:text-slate-600 text-xs md:text-sm">
              Designed & Developed by{' '}
              <span className="text-violet-600 dark:text-violet-400">David Mwaifunga</span>
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={comingSoonModal.isOpen}
        onClose={() => setComingSoonModal({ isOpen: false, feature: '' })}
        featureName={comingSoonModal.feature}
      />
    </footer>
  );
}

export default Footer;
