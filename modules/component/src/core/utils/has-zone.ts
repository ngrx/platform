import { NgZone } from '@angular/core';

/**
 * @description
 *
 * Determines if the application uses `NgZone` or `NgNoopZone` as ngZone service instance.
 *
 * It works by detecting if `apply()` is called on a function passed to `runOutsideAngular()`.
 * The `NgZone` does that while the `NgNoopZone` doesn't do it.
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
