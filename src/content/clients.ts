/**
 * Clients
 * Only the two clients shown in the Company Profile (p. 21) may be named.
 * Logo files exist only inside that PDF, so until the owner supplies them (and
 * permission to display them) the names are set typographically. Never add
 * another client here.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

/** A client. `logo` is a path under /public once the owner supplies the file. */
export interface Client {
  name: string;
  logo?: string;
}

export const clientsSection = {
  label: 'Client Portfolio',
} as const;

export const clients: readonly Client[] = [{ name: 'Wagzy Wales' }, { name: 'Ashbron Consultancy' }];
