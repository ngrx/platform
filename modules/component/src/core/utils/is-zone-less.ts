export function isZoneLess(z: any): boolean {
  return z.constructor.name === 'NoopNgZone';
}
