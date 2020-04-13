import { getGlobalThis } from './get-global-this';
/**
 * @description
 *
 * Determines if the application maintains a Zone instance.
 *
 * @returns {boolean} - true if the application runs with `NgZone`, false if the application runs with `NgNoopZone`
 *
 * @usageNotes
 *
 * The function can be just imported and used everywhere.
 *
 * ```ts
 * import { hasZone } from `utils/has-zone`;
 *
 * console.log(hasZone());
 * ```
 */
export function hasZone(): boolean {
  return typeof getGlobalThis().Zone === 'undefined';
}
