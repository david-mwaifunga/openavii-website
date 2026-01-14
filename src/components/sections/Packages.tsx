/**
 * Packages Section Component
 * Displays all website development packages in an organized grid.
 * Features background image, scroll animations, and responsive layout.
 * Theme-responsive with mobile-first design.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PackageCard, type PackageData } from './PackageCard';
import { InquiryModal } from '@/components/ui';
import { useScrollAnimation } from '@/hooks';

/**
 * All available website development packages
 * Data structured according to Openavii Technologies' offerings
 */
const packages: PackageData[] = [
  {
    id: 'P1',
    name: 'Basic Startup Website',
    tagline: 'Simple & Professional',
    suitableFor: 'Early-stage startups requiring a simple online presence',
    features: [
      'Up to 3 website pages (Home, About, Contact)',
      'Modern, responsive design',
      'Mobile and desktop optimization',
      'Contact form with email notifications',
      'Basic performance optimization',
      'Deployment to live hosting',
      'One (1) round of revisions',
    ],
    deliveryTime: '5 – 7 working days',
    priceRange: {
      min: 3500,
      max: 6000,
    },
    accentColor: 'violet',
  },
  {
    id: 'P2',
    name: 'Standard Business Website',
    tagline: 'Stronger Online Presence',
    suitableFor: 'Businesses seeking a stronger online presence',
    features: [
      'Up to 5 website pages',
      'All features from Basic package',
      'Basic SEO setup (titles & meta descriptions)',
      'Social media & WhatsApp integration',
      'Simple animations and transitions',
      'Google Analytics integration',
      'Two (2) rounds of revisions',
    ],
    deliveryTime: '7 – 10 working days',
    priceRange: {
      min: 7000,
      max: 12000,
    },
    accentColor: 'indigo',
  },
  {
    id: 'P3',
    name: 'Starter Plus (Growth-Ready)',
    tagline: 'Built for Growth',
    suitableFor: 'Businesses planning marketing and future growth',
    features: [
      'Up to 6 website pages',
      'All features from Standard package',
      'Blog / News section',
      'Content Management System (CMS)',
      'Lead capture forms',
      'Performance optimization',
      'Two (2) rounds of revisions',
    ],
    deliveryTime: '10 – 14 working days',
    priceRange: {
      min: 12000,
      max: 20000,
    },
    accentColor: 'purple',
  },
];

/**
 * Formats a number as ZMW currency
 */
function formatPrice(amount: number): string {
  return `ZMW ${amount.toLocaleString()}`;
}

/**
 * Packages section displaying all available website development packages.
 * Features a responsive grid layout with animated cards.
 * Adapts to both light and dark themes.
 */
export function Packages() {
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>();
  const [packagesRef, packagesVisible] = useScrollAnimation<HTMLDivElement>();
  const [trustRef, trustVisible] = useScrollAnimation<HTMLDivElement>();

  // Handle package quote request
  const handleRequestQuote = (pkg: PackageData) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  return (
    <section id="packages" className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/slide-images/8.jpg"
          alt="Professional workspace"
          fill
          className="object-cover object-center"
          quality={85}
        />
      </div>

      {/* Theme-Responsive Overlays */}
      {/* Light Mode Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-slate-50/95 via-white/92 to-slate-50/95 dark:from-transparent dark:via-transparent dark:to-transparent" />

      {/* Dark Mode Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-transparent dark:from-slate-900/95 dark:via-slate-950/93 dark:to-slate-900/95" />

      {/* Decorative gradient orbs */}
      <div className="absolute top-1/3 left-0 w-64 md:w-96 h-64 md:h-96 bg-violet-400/10 dark:bg-violet-600/15 rounded-full blur-3xl animate-float z-[2]" />
      <div className="absolute bottom-1/3 right-0 w-48 md:w-80 h-48 md:h-80 bg-indigo-400/10 dark:bg-indigo-600/15 rounded-full blur-3xl animate-float-delayed z-[2]" />

      {/* Section borders */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent z-[3]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`max-w-3xl mx-auto text-center mb-10 md:mb-16 scroll-animate reveal-up ${headerVisible ? 'is-visible' : ''}`}
        >
          <span className="text-violet-600 dark:text-violet-400 font-semibold text-sm uppercase tracking-widest mb-4 block">
            Our Packages
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6">
            Website Development{' '}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Packages
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg px-4 py-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/30">
            Choose the perfect package for your business needs. Each package is designed
            to deliver exceptional value and quality, tailored to different stages of growth.
          </p>
        </div>

        {/* Packages Grid */}
        <div
          ref={packagesRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-6 max-w-6xl mx-auto scroll-animate reveal-up ${packagesVisible ? 'is-visible' : ''}`}
        >
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <PackageCard package={pkg} onRequestQuote={handleRequestQuote} />
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div
          ref={trustRef}
          className={`mt-10 md:mt-16 text-center scroll-animate reveal-up ${trustVisible ? 'is-visible' : ''}`}
        >
          <div className="inline-flex flex-wrap justify-center items-center gap-4 md:gap-6 text-xs md:text-sm text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/50 dark:border-slate-700/30">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Secure Payment</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Free Support</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Revision Rounds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal - rendered outside of package cards */}
      {selectedPackage && (
        <InquiryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          packageName={selectedPackage.name}
          priceRange={`${formatPrice(selectedPackage.priceRange.min)} – ${formatPrice(selectedPackage.priceRange.max)}`}
        />
      )}
    </section>
  );
}

export default Packages;
