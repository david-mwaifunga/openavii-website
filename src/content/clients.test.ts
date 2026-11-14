// @vitest-environment node
/**
 * Clients contract (Digest §1)
 * Only the two documented clients may be named. No logo files have been
 * supplied, so they are shown typographically until the owner provides them.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { clients, clientsSection } from './clients';

describe('clients', () => {
  it('names only Wagzy Wales and Ashbron Consultancy', () => {
    expect(clients.length).toBeLessThanOrEqual(2);
    expect(clients.map((c) => c.name)).toEqual(['Wagzy Wales', 'Ashbron Consultancy']);
  });

  it('has no logo files yet (typographic fallback)', () => {
    for (const client of clients) expect(client.logo).toBeUndefined();
  });

  it('labels the strip "Client Portfolio"', () => {
    expect(clientsSection.label).toBe('Client Portfolio');
  });
});
