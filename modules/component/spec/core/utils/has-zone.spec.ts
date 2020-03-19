import { hasZone } from '../../../src/core/utils';
import { NgZone } from '@angular/core';

class NoopNgZone {}

describe('isZoneLess', () => {
  it('should return false if something else than noop zone is passed', () => {
    expect(!hasZone({} as NgZone)).toBe(false);
  });

  it('should return true if a noop zone is passed', () => {
    expect(!hasZone(new NoopNgZone() as NgZone)).toBe(true);
  });
});
