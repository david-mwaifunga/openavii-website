/**
 * Sitemap
 * One page today (per-service and per-sector pages are a planned follow-up).
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
