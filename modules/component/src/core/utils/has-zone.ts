import { NgZone } from '@angular/core';

export function hasZone(z: NgZone): boolean {
  return z.constructor.name !== 'NoopNgZone';
}
