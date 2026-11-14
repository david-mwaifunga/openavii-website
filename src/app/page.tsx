/**
 * Home Page
 * The single-page site: skip link, header, the sections (added in the next
 * phase), and the footer. <ShapeDefs /> supplies the brand-shape clip paths
 * used by framed photographs anywhere on the page.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { Footer, Header, SkipLink } from '@/components/layout';
import { ShapeDefs } from '@/components/ui';

export default function Home() {
  return (
    <>
      <SkipLink />
      <ShapeDefs />
      <Header />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {/* Sections are assembled here in page order. */}
      </main>
      <Footer />
    </>
  );
}
