/**
 * Clients
 * The "Client Portfolio" strip. Only the two clients named in the Company
 * Profile may appear. Until the owner supplies logo files (and permission to
 * display them) the names are set typographically; a client with a `logo` path
 * in content/clients shows the image instead.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import Image from 'next/image';
import { clients, clientsSection } from '@/content/clients';

export function Clients() {
  return (
    <div className="mt-20 border-t border-line pt-10">
      <p className="text-overline uppercase text-muted">{clientsSection.label}</p>
      <ul aria-label={clientsSection.label} className="mt-6 flex flex-wrap items-center gap-x-14 gap-y-5">
        {clients.map((client) => (
          <li key={client.name} className="text-h3 text-heading">
            {client.logo ? (
              <Image src={client.logo} alt={client.name} width={220} height={80} className="h-12 w-auto" />
            ) : (
              client.name
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Clients;
