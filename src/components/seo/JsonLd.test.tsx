/**
 * JsonLd tests
 * Structured data is injected as a JSON script. It must parse back to exactly
 * what was given and must never let data close the script tag early.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { JsonLd } from './JsonLd';

describe('JsonLd', () => {
  it('renders an application/ld+json script that parses back to the data', () => {
    const data = { '@context': 'https://schema.org', '@type': 'Organization', name: 'Openavii Technologies' };
    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    expect(script).not.toBeNull();
    expect(JSON.parse(script.textContent ?? '')).toEqual(data);
  });

  it('escapes "<" so data can never terminate the script element', () => {
    const { container } = render(<JsonLd data={{ name: '</script><script>alert(1)</script>' }} />);
    const script = container.querySelector('script') as HTMLScriptElement;
    expect(script.textContent).not.toContain('</script>');
    expect(JSON.parse(script.textContent ?? '').name).toBe('</script><script>alert(1)</script>');
  });
});
