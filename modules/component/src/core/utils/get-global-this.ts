// Returns a reference to global this
// - Browser
// - SSR
// - Tests
export function getGlobalThis(): any {
  return ((globalThis as any) || (self as any) || (window as any)) as any;
}
