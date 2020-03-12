export function hasZone(z: any): boolean {
  return z.constructor.name !== 'NoopNgZone';
}
