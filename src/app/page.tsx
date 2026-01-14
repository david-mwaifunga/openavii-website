/**
 * Home Page
 * Main landing page for Openavii Technologies website.
 * Assembles all section components into a cohesive, single-page experience.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { Header, Footer } from '@/components/layout';
import { Hero, About, Showcase, Packages, Addons } from '@/components/sections';

/**
 * Home page component
 * Renders the complete single-page website with all sections
 */
export default function Home() {
  return (
    <>
      {/* Navigation Header - Fixed position */}
      <Header />

      {/* Main Content */}
      <main>
        {/* Hero Section - Full viewport introduction */}
        <Hero />

        {/* About Section - Company story and values */}
        <About />

        {/* Showcase Section - Work samples slideshow */}
        <Showcase />

        {/* Packages Section - Website development packages */}
        <Packages />

        {/* Add-ons Section - Optional services */}
        <Addons />
      </main>

      {/* Footer with contact CTA */}
      <Footer />
    </>
  );
}
