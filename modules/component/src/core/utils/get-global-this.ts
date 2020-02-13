/**
 * @description
 *
 * This function returns a reference to globalThis in the following environments:
 * - Browser
 * - SSR (Server Side Rendering)
 * - Tests
 *
 * The function can be just imported and used everywhere.
 *
 * ```ts
 * import { getGlobalThis } from `utils/get-global-this`;
 *
 * console.log(getGlobalThis());
 * ```
 */
export function getGlobalThis(): any {
  return ((globalThis as any) || (self as any) || (window as any)) as any;
}
