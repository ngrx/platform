/**
 * @description
 *
 * A fallback for the new `globalThis` reference.
 *
 *  It should be used to replace `window` due to different environments in:
 *  - SSR (Server Side Rendering)
 *  - Tests
 *  - Browser
 *
 *  @return - A reference to globalThis. `window` in the Browser.
 */
export function getGlobalThis(): any {
  return ((globalThis as any) || (self as any) || (window as any)) as any;
}
