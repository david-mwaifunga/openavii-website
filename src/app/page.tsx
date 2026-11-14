/**
 * Home Page
 * The single-page site, assembled in the agreed order. The four brand surfaces
 * alternate so no two neighbours match (dark, page, alt, brand, page, alt,
 * brand, page, alt, dark), with curved dividers where fixed brand surfaces
 * meet the theme-following ones. <ShapeDefs /> supplies the brand-shape clip
 * paths used by framed photographs anywhere on the page.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { Footer, Header, SkipLink } from '@/components/layout';
import {
  Approach,
  ContactCta,
  Hero,
  Packages,
  ProblemBand,
  Sectors,
  Services,
  Team,
  WhoWeAre,
  Why,
} from '@/components/sections';
import { ShapeDefs } from '@/components/ui';

export default function Home() {
  return (
    <>
      <SkipLink />
      <ShapeDefs />
      <Header />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <ProblemBand />
        <WhoWeAre />
        <Services />
        <Approach />
        <Sectors />
        <Why />
        <Team />
        <Packages />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
