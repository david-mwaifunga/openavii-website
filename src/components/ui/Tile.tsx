/**
 * Tile and Panel
 * Flat, crisp containers (6 px radius, solid fills, no frosted effects, no glow shadows).
 *  - Tile: a colour-blocked tile from the Company Profile mosaic. `tone` picks a
 *    fixed palette pair (navy, deep, teal, cyan); on hover or focus it steps one
 *    palette colour lighter and its text steps with it (see .tile in globals.css).
 *    Cyan tiles carry near-black text, never white.
 *  - Panel: a flat surface with a hairline border, following the theme.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type TileTone = 'navy' | 'deep' | 'teal' | 'cyan';
type ContainerTag = 'div' | 'article' | 'li' | 'section';

interface TileProps extends HTMLAttributes<HTMLElement> {
  tone: TileTone;
  as?: ContainerTag;
}

export function Tile({ tone, as: Tag = 'div', className, children, ...rest }: TileProps) {
  return (
    <Tag className={cn('tile rounded-tile', className)} data-tone={tone} {...rest}>
      {children}
    </Tag>
  );
}

interface PanelProps extends HTMLAttributes<HTMLElement> {
  as?: ContainerTag;
}

export function Panel({ as: Tag = 'div', className, children, ...rest }: PanelProps) {
  return (
    <Tag className={cn('rounded-tile border border-line bg-surface', className)} {...rest}>
      {children}
    </Tag>
  );
}
