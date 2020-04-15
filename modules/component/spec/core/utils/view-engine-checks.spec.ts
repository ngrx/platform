import { getGlobalThis, isIvy } from '../../../src/core';

describe('isIvy', () => {
  describe('in ViewEngine Angular 8 + 9', () => {
    it('should return false if ng is defined with probe', () => {
      getGlobalThis().ng = { probe: true };
      expect(isIvy()).toBe(false);
    });
  });
  describe('in Ivy Angular 9', () => {
    it('should return true if ng is undefined', () => {
      getGlobalThis().ng = undefined;
      expect(isIvy()).toBe(true);
    });

    it('should return true if ng.probe is set', () => {
      getGlobalThis().ng = { probe: undefined };
      expect(isIvy()).toBe(true);
    });
  });
});
