/**
 * SkipLink
 * The first focusable element on the page: lets keyboard and screen-reader
 * users jump past the navigation to <main id="main">. Visually hidden until it
 * receives focus.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-pill bg-brand-white px-5 py-3 font-bold text-navy focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
    >
      Skip to main content
    </a>
  );
}

export default SkipLink;
