import { getGlobalThis, hasZone } from '../../../src/core/utils';

describe('isZoneLess', () => {
  it('should return false if something else than noop zone is passed', () => {
    expect(!hasZone()).toBe(false);
  });

  it('should return true if a noop zone is passed', () => {
    getGlobalThis().Zone = {};
    expect(!hasZone()).toBe(true);
  });
});
