import { NgZone } from '@angular/core';

/**
 * Checks if the provided value is an instance of NgZone.
 *
 * @param zone - The value to check.
 * @returns True if the value is an NgZone instance.
 *
 * @public
 */
export function isNgZone(zone: unknown): zone is NgZone {
  return zone instanceof NgZone;
}
