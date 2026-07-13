/**
 * Add-ons Section Component
 * Displays optional add-on services that complement the main packages.
 * Features background image, scroll animations, and responsive layout.
 * Theme-responsive with mobile-first design.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, Button, InquiryModal } from '@/components/ui';
import { useScrollAnimation } from '@/hooks';

/** Add-on service data structure */
interface Addon {
  /** Service name */
  name: string;
  /** Brief description */
  description: string;
  /** Icon component */
  icon: React.ReactNode;
  /** Accent color */
  color: 'violet' | 'indigo' | 'purple' | 'emerald';
}

/**
 * All available add-on services
 */
const addons: Addon[] = [
  {
    name: 'Additional Page',
    description: 'Expand your website with extra pages tailored to your content needs.',
    color: 'violet',
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    name: 'Blog / CMS Setup',
    description: 'Enable content management capabilities with a custom blog or news section.',
    color: 'indigo',
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    name: 'Content Writing',
    description: 'Professional copywriting services to craft compelling content for your website.',
    color: 'purple',
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    name: 'Logo & Branding',
    description: 'Logo refresh or basic branding package to elevate your visual identity.',
    color: 'emerald',
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
];

/** Monthly maintenance service */
const maintenanceService = {
  name: 'Monthly Maintenance & Support',
  description: 'Ongoing website and application maintenance, security updates, content changes, and priority support to keep your product running smoothly.',
};

/**
 * Color theme configurations for add-on cards - light and dark mode
 */
const colorThemes = {
  // Data keys preserved; resolved onto the approved Openavii palette.
  // Icon chips share a neutral navy-tint container; only the glyph hue
  // varies (electric blue / navy / cyan) for subtle brand tiering.
  violet: {
    iconBg: 'from-navy-tint to-navy-tint',
    iconBorder: 'border-line',
    iconColor: 'text-accent',
    hoverBorder: 'hover:border-accent/50',
  },
  indigo: {
    iconBg: 'from-navy-tint to-navy-tint',
    iconBorder: 'border-line',
    iconColor: 'text-heading',
    hoverBorder: 'hover:border-accent/50',
  },
  purple: {
    iconBg: 'from-navy-tint to-navy-tint',
    iconBorder: 'border-line',
    iconColor: 'text-cyan-strong',
    hoverBorder: 'hover:border-accent/50',
  },
  emerald: {
    iconBg: 'from-navy-tint to-navy-tint',
    iconBorder: 'border-line',
    iconColor: 'text-accent',
    hoverBorder: 'hover:border-accent/50',
  },
};

/**
 * Add-ons section displaying optional services with pricing.
 * Features background image and scroll animations.
 */
export function Addons() {
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [customProjectModalOpen, setCustomProjectModalOpen] = useState(false);

  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>();
  const [addonsRef, addonsVisible] = useScrollAnimation<HTMLDivElement>();
  const [maintenanceRef, maintenanceVisible] = useScrollAnimation<HTMLDivElement>();
  const [ctaRef, ctaVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <section id="addons" className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/slide-images/2.jpg"
          alt="Creative workspace"
          fill
          className="object-cover object-center"
          quality={85}
        />
      </div>

      {/* Theme-Responsive Overlays */}
      {/* Light Mode Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white/95 via-surface-muted/92 to-white/95 dark:from-transparent dark:via-transparent dark:to-transparent" />

      {/* Dark Mode Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-transparent dark:from-navy-dark/95 dark:via-navy-dark/93 dark:to-navy-dark/95" />

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/4 w-48 md:w-64 h-48 md:h-64 bg-accent/10 dark:bg-accent/10 rounded-full blur-3xl animate-float z-[2]" />
      <div className="absolute top-1/3 right-1/4 w-36 md:w-48 h-36 md:h-48 bg-cyan/10 dark:bg-cyan/10 rounded-full blur-3xl animate-float-delayed z-[2]" />

      {/* Section borders */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent z-[3]" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent z-[3]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`max-w-3xl mx-auto text-center mb-10 md:mb-16 scroll-animate reveal-up ${headerVisible ? 'is-visible' : ''}`}
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest mb-4 block">
            Enhance Your Package
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-heading mb-4 md:mb-6">
            Optional{' '}
            <span className="text-gradient-accent">
              Add-On Services
            </span>
          </h2>
          <p className="text-fg-muted text-base md:text-lg px-4 py-3 rounded-2xl bg-surface/60 backdrop-blur-sm border border-line">
            Customize your package with additional services to maximize your online impact.
            Each add-on is designed to complement and enhance your website - pricing is
            tailored to your needs, so get in touch for a quote.
          </p>
        </div>

        {/* Add-ons Grid */}
        <div
          ref={addonsRef}
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto mb-8 md:mb-12 scroll-animate reveal-up ${addonsVisible ? 'is-visible' : ''}`}
        >
          {addons.map((addon, index) => {
            const theme = colorThemes[addon.color];
            return (
              <Card
                key={index}
                variant="glass"
                className={`group ${theme.hoverBorder} bg-surface/70 backdrop-blur-md border-line hover:-translate-y-1 transition-all duration-300`}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-3 md:gap-4">
                    {/* Icon */}
                    <div
                      className={`
                        flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl
                        bg-gradient-to-br ${theme.iconBg}
                        border ${theme.iconBorder}
                        flex items-center justify-center
                        ${theme.iconColor}
                        group-hover:scale-110 transition-transform duration-300
                      `}
                    >
                      {addon.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-semibold text-heading mb-1 group-hover:text-accent transition-colors duration-300">
                        {addon.name}
                      </h3>
                      <p className="text-fg-muted text-xs md:text-sm leading-relaxed">
                        {addon.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Maintenance Service - Featured Card */}
        <div
          ref={maintenanceRef}
          className={`max-w-4xl mx-auto scroll-animate reveal-scale ${maintenanceVisible ? 'is-visible' : ''}`}
        >
          <Card variant="featured" className="overflow-visible bg-surface/80 backdrop-blur-md">
            <CardContent className="p-6 md:p-8 lg:p-10">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                {/* Icon and Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    {/* Recurring icon */}
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-brand-gradient flex items-center justify-center shadow-lg shadow-navy/25">
                      <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-accent text-xs md:text-sm font-semibold uppercase tracking-wider">
                        Recurring Service
                      </span>
                      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-heading">
                        {maintenanceService.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-fg-muted text-sm md:text-base leading-relaxed mb-4 md:mb-6 lg:mb-0">
                    {maintenanceService.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center md:items-end justify-center md:pl-6 lg:pl-8 md:border-l md:border-line">
                  <Button className="w-full sm:w-auto" onClick={() => setMaintenanceModalOpen(true)}>
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom Project CTA */}
        <div
          ref={ctaRef}
          className={`mt-10 md:mt-16 text-center scroll-animate reveal-up ${ctaVisible ? 'is-visible' : ''}`}
        >
          <p className="text-fg-muted text-sm md:text-base mb-3 md:mb-4">
            Need a custom web application, platform, or a larger project?
          </p>
          <Button variant="outline" size="lg" className="w-full sm:w-auto bg-surface/70 backdrop-blur-sm" onClick={() => setCustomProjectModalOpen(true)}>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Discuss Custom Project
          </Button>
        </div>
      </div>

      {/* Maintenance Service Modal */}
      <InquiryModal
        isOpen={maintenanceModalOpen}
        onClose={() => setMaintenanceModalOpen(false)}
        inquiryType="service"
        serviceName={maintenanceService.name}
      />

      {/* Custom Project Modal */}
      <InquiryModal
        isOpen={customProjectModalOpen}
        onClose={() => setCustomProjectModalOpen(false)}
        inquiryType="custom"
        serviceName="Custom Project"
        title="Discuss Your Project"
      />
    </section>
  );
}

export default Addons;
