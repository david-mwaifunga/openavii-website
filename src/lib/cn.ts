/**
 * Class-name joiner
 * Joins truthy class names. Deliberately tiny: Tailwind utilities here come
 * from semantic tokens, so no conflict-resolving library is needed.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

export type ClassValue = string | false | null | undefined | 0;

export function cn(...parts: ClassValue[]): string {
  return parts.filter(Boolean).join(' ');
}
