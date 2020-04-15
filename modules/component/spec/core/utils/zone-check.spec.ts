import { apiZonePatched, getGlobalThis } from '../../../src/core/utils';
import { mockPromise } from '../../fixtures/fixtures';

describe('apiZonePatched', () => {
  it('should return true if `zone.js` did patch the Promise API', () => {
    getGlobalThis().__zone_symbol__Promise = mockPromise;
    expect(apiZonePatched('Promise')).toBe(true);
  });

  it('should return false if `zone.js` did not patch the Promise API', () => {
    getGlobalThis().__zone_symbol__Promise = undefined;
    expect(apiZonePatched('Promise')).toBe(false);
  });
});
