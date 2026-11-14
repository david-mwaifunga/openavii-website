/**
 * Header
 * Fixed navigation. Over the hero it is transparent and scoped to the dark
 * brand surface (white logo, light text); once the page scrolls it becomes a
 * solid bar that follows the theme. From the xl breakpoint it shows the
 * navigation, the theme toggle and "Get a Quote"; below that, a menu button
 * opens a full-screen sheet with large type. The sheet is a proper modal
 * dialog (aria-expanded / aria-controls on its button, focus trapped and
 * returned, Escape closes, the page behind it inert).
 *
 * Navigation links are plain in-page anchors: they work without JavaScript,
 * update the URL, and smooth-scroll only when the visitor has not asked for
 * reduced motion (CSS).
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { useCallback, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { site } from '@/content/site';
import { useInquiry } from '@/context/InquiryContext';
import { useDialogBehaviour } from '@/hooks/useDialogBehaviour';
import { useScrolled } from '@/hooks/useScrolled';
import { cn } from '@/lib/cn';

export function Header() {
  const scrolled = useScrolled(24);
  const [menuOpen, setMenuOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetId = useId();
  const { openInquiry } = useInquiry();
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useDialogBehaviour({ isOpen: menuOpen, onClose: closeMenu, containerRef: sheetRef });

  const quote = () => {
    closeMenu();
    openInquiry({ type: 'custom' });
  };

  return (
    <header
      data-surface={scrolled ? undefined : 'dark'}
      className={cn(
        'hero-nav fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-200',
        scrolled ? 'border-b border-line bg-page' : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
        <a href="#home" aria-label={`${site.name}, home`} className="shrink-0 rounded-tile">
          <Logo variant="full" className="w-36 sm:w-44" />
        </a>

        <nav aria-label="Primary" className="hidden items-center xl:flex">
          <ul className="flex items-center gap-1">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-pill px-4 text-small font-bold text-fg transition-colors hover:text-accent-text"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button size="sm" className="hidden sm:inline-flex" onClick={quote}>
            {site.navCta}
          </Button>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls={sheetId}
            onClick={() => setMenuOpen(true)}
            className="grid size-11 shrink-0 place-items-center rounded-pill border border-line text-fg transition-colors hover:bg-alt xl:hidden"
          >
            <Icon name="Menu" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          ref={sheetRef}
          id={sheetId}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          tabIndex={-1}
          data-surface="dark"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto"
        >
          <div className="wrap flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <Logo variant="full" tone="white" className="w-36 sm:w-44" eager={false} />
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMenu}
              className="grid size-11 place-items-center rounded-pill border border-line text-fg transition-colors hover:bg-alt"
            >
              <Icon name="X" />
            </button>
          </div>

          <nav aria-label="Sections" className="wrap flex-1 py-8">
            <ul>
              {site.nav.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <a
                    href={item.href}
                    onClick={closeMenu}
                    className="flex min-h-11 items-center justify-between py-4 text-h2 text-heading transition-colors hover:text-accent-text"
                  >
                    {item.label}
                    <Icon name="ArrowUpRight" size={32} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="wrap space-y-5 pb-10">
            <Button size="lg" className="w-full" onClick={quote}>
              {site.navCta}
            </Button>
            <p className="text-small text-muted">
              <a href={`tel:${site.contact.phones[0].e164}`} className="font-bold text-fg">
                {site.contact.phones[0].display}
              </a>
              {' · '}
              <a href={`mailto:${site.contact.email}`} className="font-bold text-fg">
                {site.contact.email}
              </a>
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
