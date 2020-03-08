export function getGlobalThis() {
  return ((globalThis as any) || (self as any) || (window as any)) as any;
}
