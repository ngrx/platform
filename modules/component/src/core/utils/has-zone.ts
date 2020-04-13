import { NgZone } from '@angular/core';

/**
 * @description
 *
 * Determines if the application uses `NgZone` or `NgNoopZone` as ngZone service instance.
 *
 * @param {NgZone} z - The zone service to check.
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
export function hasZone(z: NgZone): boolean {
  return z.constructor.name !== 'NoopNgZone';
}
