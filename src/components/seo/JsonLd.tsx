/**
 * JsonLd
 * Injects structured data as a JSON-LD script. "<" is escaped so no value can
 * ever close the script element early (the standard defence for inline JSON).
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export default JsonLd;
