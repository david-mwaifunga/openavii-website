/**
 * robots.txt
 * Everything may be crawled; the sitemap is declared.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
