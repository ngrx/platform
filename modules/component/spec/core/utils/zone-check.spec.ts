import { isNgZone } from '../../../src/core/utils';
import {
  manualInstanceNgZone,
  manualInstanceNoopNgZone,
} from '../../fixtures/fixtures';

describe('envZonePatched', () => {
  it('should return true if `zone.js` did patch the global API', () => {
    expect(isNgZone(manualInstanceNgZone)).toBe(true);
  });

  it('should return false if `zone.js` did not patch the global API', () => {
    expect(isNgZone(manualInstanceNoopNgZone)).toBe(false);
  });
});
