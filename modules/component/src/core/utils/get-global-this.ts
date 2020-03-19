// Returns a reference to global thin
// - Browser
// - SSR
// - Tests
export function getGlobalThis(): any {
  return ((globalThis as any) || (self as any) || (window as any)) as any;
}
