import {
  getUnserializable,
  throwIfUnserializable,
} from '../../src/meta-reducers/utils';

describe('getUnserializable:', () => {
  describe('serializable value:', () => {
    it('should not throw', () => {
      expect(getUnserializable(1)).toBe(false);
      expect(getUnserializable(true)).toBe(false);
      expect(getUnserializable('string')).toBe(false);
      expect(getUnserializable([1, 2, 3])).toBe(false);
      expect(getUnserializable({})).toBe(false);
      expect(
        getUnserializable({
          nested: { number: 1, undefined: undefined, null: null },
        })
      ).toBe(false);
    });
  });

  describe('unserializable value:', () => {
    it('should throw', () => {
      class TestClass {}

      expect(getUnserializable()).toEqual({ value: undefined, path: ['root'] });
      expect(getUnserializable(null)).toEqual({ value: null, path: ['root'] });

      const date = new Date();
      expect(getUnserializable({ date })).toEqual({
        value: date,
        path: ['date'],
      });
      expect(getUnserializable({ set: new Set([]) })).toEqual({
        value: new Set([]),
        path: ['set'],
      });
      expect(getUnserializable({ map: new Map([]) })).toEqual({
        value: new Map([]),
        path: ['map'],
      });
      expect(getUnserializable({ class: new TestClass() })).toEqual({
        value: new TestClass(),
        path: ['class'],
      });
      expect(
        getUnserializable({
          nested: { valid: true, class: new TestClass(), alsoValid: '' },
          valid: [3],
        })
      ).toEqual({ value: new TestClass(), path: ['nested', 'class'] });
    });
  });
});

describe('throwIfUnserializable', () => {
  describe('serializable', () => {
    it('should not throw an error', () => {
      expect(() => throwIfUnserializable(false, 'state')).not.toThrow();
    });
  });

  describe('unserializable', () => {
    it('should throw an error', () => {
      expect(() =>
        throwIfUnserializable({ path: ['root'], value: undefined }, 'state')
      ).toThrowError(`Detected unserializable state at "root"`);
      expect(() =>
        throwIfUnserializable({ path: ['date'], value: new Date() }, 'action')
      ).toThrowError(`Detected unserializable action at "date"`);
      expect(() =>
        throwIfUnserializable(
          {
            path: ['one', 'two', 'three'],
            value: new Date(),
          },
          'state'
        )
      ).toThrowError(`Detected unserializable state at "one.two.three"`);
    });
  });
});
