import { capitalize, isDictionary } from '../src/helpers';

describe('helpers', () => {
  describe('capitalize', () => {
    it('should capitalize the text', () => {
      expect(capitalize('marko')).toEqual('Marko');
    });

    it('should return an empty string when the text is an empty string', () => {
      expect(capitalize('')).toEqual('');
    });
  });

  describe('isDictionary', () => {
    it('should return true when argument is a dictionary', () => {
      expect(isDictionary({ foo: 'bar' })).toBe(true);
    });

    it('should return false when argument is a primitive value', () => {
      expect(isDictionary(1)).toBe(false);
    });

    it('should return false when argument is null', () => {
      expect(isDictionary(null)).toBe(false);
    });

    it('should return false when argument is an array', () => {
      expect(isDictionary(['foo', 'bar'])).toBe(false);
    });

    it('should return false when argument is a date object', () => {
      expect(isDictionary(new Date())).toBe(false);
    });
  });
});
