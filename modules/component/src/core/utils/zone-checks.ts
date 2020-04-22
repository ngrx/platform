import { getGlobalThis } from './get-global-this';

/**
 * envZonePatched
 *
 * @description
 *
 * This function checks if the Browser API is patched by `zone.js`.
 *
 * @return {boolean} - true if `zone.js` patched the API.
 *
 */
export function envZonePatched(): boolean {
  return getGlobalThis().Zone !== undefined;
}
