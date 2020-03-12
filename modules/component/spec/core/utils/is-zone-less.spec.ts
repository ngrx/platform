import { hasZone } from '../../../src/core/utils';

class NoopNgZone {}

describe('isZoneLess', () => {
  it('should return false if something else than noop zone is passed', () => {
    expect(!hasZone({})).toBe(false);
  });

  it('should return true if a noop zone is passed', () => {
    expect(!hasZone(new NoopNgZone())).toBe(true);
  });
});
