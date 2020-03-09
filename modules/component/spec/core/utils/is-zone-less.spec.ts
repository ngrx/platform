import { isZoneLess } from '../../../src/core/utils';

class NoopNgZone {}

describe('isZoneLess', () => {
  it('should return false if something else than noop zone is passed', () => {
    expect(isZoneLess({})).toBe(false);
  });

  it('should return true if a noop zone is passed', () => {
    expect(isZoneLess(new NoopNgZone())).toBe(true);
  });
});
