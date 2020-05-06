import { isNgrxMockEnvironment, setNgrxMockEnvironment } from '../src/flags';

describe(`Store flags`, () => {
  describe(`isNgrxMockEnvironment()`, () => {
    it(`should return false by default`, () => {
      expect(isNgrxMockEnvironment()).toBe(false);
    });

    it(`should return the correct flag`, () => {
      setNgrxMockEnvironment(true);
      expect(isNgrxMockEnvironment()).toBe(true);

      setNgrxMockEnvironment(false);
      expect(isNgrxMockEnvironment()).toBe(false);
    });
  });
});
