/**
 * SectionHeader
 * Eyebrow + H2 + lead. Headlines are Title Case, ExtraBold and tightly tracked,
 * and key words take the accent colour (two-tone headings, as in the Company
 * Profile). A heading is a plain string, a { plain, accent } pair, or
 * { lines } for statements revealed line by line.
 *
 * Accent text uses the `accent-text` token: teal on light surfaces, bright
 * cyan on dark ones - both pass AA, which the raw cyan does not on light grey.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { Fragment, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Reveal } from './Reveal';

export type HeadingContent =
  | string
  | { plain: string; accent: string }
  | { lines: readonly string[] };

interface SectionHeaderProps {
  eyebrow?: string;
  heading: HeadingContent;
  lead?: ReactNode;
  /** id of the <h2>, so a section can be labelled by it. */
  id?: string;
  align?: 'left' | 'center';
  className?: string;
}

function renderHeading(heading: HeadingContent): ReactNode {
  if (typeof heading === 'string') return heading;
  if ('lines' in heading) {
    return heading.lines.map((line, index) => (
      <Fragment key={line}>
        <Reveal as="span" delay={index * 80} className="block" data-line>
          {line}
        </Reveal>
        {/* A real space between the block lines, so copied text and crawlers read "First. Build". */}
        {index < heading.lines.length - 1 && ' '}
      </Fragment>
    ));
  }
  return (
    <>
      {heading.plain}{' '}
      <span data-accent className="text-accent-text">
        {heading.accent}
      </span>
    </>
  );
}

export function SectionHeader({
  eyebrow,
  heading,
  lead,
  id,
  align = 'left',
  className,
}: SectionHeaderProps) {
  const centred = align === 'center';
  return (
    <div className={cn('relative max-w-3xl', centred && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p
          className={cn(
            'mb-5 flex items-center gap-3 text-overline uppercase text-accent-text',
            centred && 'justify-center',
          )}
        >
          <span aria-hidden="true" className="h-px w-8 bg-accent-fill" />
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="text-balance text-h2 text-heading">
        {renderHeading(heading)}
      </h2>
      {lead && (
        <p className={cn('mt-6 max-w-2xl text-lead font-light text-muted', centred && 'mx-auto')}>{lead}</p>
      )}
    </div>
  );
}
