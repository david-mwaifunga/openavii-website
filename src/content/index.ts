/**
 * Content barrel
 * Typed content for the whole site. Components import from here and contain no
 * copy of their own. `copyNew` lists every piece of copy that is not verbatim
 * from the brand documents, for owner approval.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

export * from './site';
export * from './hero';
export * from './problems';
export * from './about';
export * from './values';
export * from './services';
export * from './process';
export * from './sectors';
export * from './why';
export * from './team';
export * from './clients';
export * from './packages';
export * from './addons';
export * from './contact';
export * from './photos';
export * from './icons';
export { copyNew, newCopy, type CopyNewEntry } from './copy';
