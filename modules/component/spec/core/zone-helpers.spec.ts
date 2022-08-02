import { isNgZone } from '../../src/core/zone-helpers';
import { ngZoneMock, noopNgZoneMock } from '../fixtures/fixtures';

describe('isNgZone', () => {
  it('should return true with NgZone instance', () => {
    expect(isNgZone(ngZoneMock)).toBe(true);
  });

  it('should return false with NoopNgZone instance', () => {
    expect(isNgZone(noopNgZoneMock)).toBe(false);
  });
});
