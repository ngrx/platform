import { getGlobalThis } from './get-global-this';

/**
 * apiZonePatched
 *
 * @description
 *
 * This function checks if a specific Browser API is patched by `zone.js`.
 *
 * @param name {string} - The name of the API to check.
 * @return {boolean} - true if `zone.js` patched the API in question.
 *
 */
export function apiZonePatched(name: string): boolean {
  return getGlobalThis()['__zone_symbol__' + name] !== undefined;
}
