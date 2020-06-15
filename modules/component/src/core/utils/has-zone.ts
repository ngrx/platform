import { NgZone } from '@angular/core';

/**
 * @description
 *
 * Determines if the application uses `NgZone` or `NgNoopZone` as ngZone service instance.
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
  return z instanceof NgZone;
}
