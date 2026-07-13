/**
 * Header Component
 * A sophisticated navigation header with glassmorphism effect.
 * Features smooth scroll navigation, theme toggle, and responsive logo.
 * Mobile-first design with theme-responsive styling.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button, ThemeToggle } from '@/components/ui';
import { useTheme } from '@/context';
import { useMounted } from '@/hooks';

/** Navigation link interface */
interface NavLink {
  label: string;
  href: string;
}

/** Available navigation links */
const navLinks: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Packages', href: '#packages' },
  { label: 'Add-ons', href: '#addons' },
  { label: 'Contact', href: '#contact' },
];

/**
 * Main navigation header with scroll-aware styling.
 * Transforms from transparent to glassmorphism on scroll.
 * Includes theme toggle and responsive logo that adapts to current theme.
 */
export function Header() {
  // Track scroll position for header styling
  const [isScrolled, setIsScrolled] = useState(false);
  // Mobile menu open state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Mounted state for hydration
  const mounted = useMounted();
  // Theme context
  const { resolvedTheme } = useTheme();

  // Listen for scroll events to update header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  // Determine which logo to show based on theme
  const logoSrc = mounted && resolvedTheme === 'dark'
    ? '/Openavii-Light.png'
    : '/Openavii-Dark.png';

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isScrolled
          ? `bg-surface/80
             backdrop-blur-2xl backdrop-saturate-[180%]
             border-b border-line
             shadow-[0_4px_30px_-8px_rgba(22,34,53,0.10)]
             dark:shadow-[0_4px_30px_-8px_rgba(0,0,0,0.4)]
             py-3 md:py-4`
          : 'bg-transparent py-4 md:py-6'
        }
      `}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#home');
            }}
            className="group flex items-center gap-2"
          >
            {/* Logo Image - switches based on theme */}
            {mounted ? (
              <Image
                src={logoSrc}
                alt="Openavii Technologies"
                width={280}
                height={80}
                className="h-10 w-auto sm:h-12 md:h-14 lg:h-16"
                priority
              />
            ) : (
              /* Skeleton placeholder during SSR */
              <div className="h-10 w-36 sm:h-12 sm:w-44 md:h-14 md:w-52 lg:h-16 lg:w-60 bg-surface-tint rounded animate-pulse" />
            )}
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className="
                    relative px-4 py-2 text-sm font-medium
                    text-heading/80
                    hover:text-accent
                    transition-colors duration-300
                    after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
                    after:w-0 after:h-0.5 after:bg-accent
                    after:transition-all after:duration-300 hover:after:w-full
                  "
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right side actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* CTA Button - hidden on mobile */}
            <div className="hidden md:block">
              <Button
                size="sm"
                onClick={() => scrollToSection('#contact')}
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="
                lg:hidden relative w-10 h-10 flex items-center justify-center
                rounded-xl
                bg-surface-muted
                border border-line
                transition-colors duration-300
              "
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-4 flex flex-col justify-between">
                <span
                  className={`
                    block h-0.5 rounded-full transition-all duration-300
                    bg-heading
                    ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}
                  `}
                />
                <span
                  className={`
                    block h-0.5 rounded-full transition-all duration-300
                    bg-heading
                    ${isMobileMenuOpen ? 'opacity-0 scale-0' : ''}
                  `}
                />
                <span
                  className={`
                    block h-0.5 rounded-full transition-all duration-300
                    bg-heading
                    ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}
                  `}
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`
            lg:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${isMobileMenuOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="
            bg-surface/90
            backdrop-blur-2xl backdrop-saturate-[180%]
            rounded-2xl
            border border-line
            shadow-[0_8px_32px_-8px_rgba(22,34,53,0.12)]
            dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.45)]
            p-4
          ">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="
                      block px-4 py-3 rounded-xl
                      text-fg-muted
                      hover:text-heading
                      bg-surface-muted
                      hover:bg-navy-tint
                      transition-all duration-300
                    "
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mt-2">
                <Button fullWidth onClick={() => scrollToSection('#contact')}>
                  Get Started
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
