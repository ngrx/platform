import { stateSerializationCheckMetaReducer } from '../..';

describe('stateSerializationCheckMetaReducer:', () => {
  describe('valid next state:', () => {
    it('should not throw', () => {
      expect(() => invokeReducer(1)).not.toThrow();
      expect(() => invokeReducer(true)).not.toThrow();
      expect(() => invokeReducer('string')).not.toThrow();
      expect(() => invokeReducer([1, 2, 3])).not.toThrow();
      expect(() => invokeReducer({})).not.toThrow();
      expect(() =>
        invokeReducer({
          nested: { number: 1, undefined: undefined, null: null },
        })
      ).not.toThrow();
    });
  });

  describe('invalid next state:', () => {
    it('should throw', () => {
      expect(() => invokeReducer()).toThrow();
      expect(() => invokeReducer(null)).toThrow();
      expect(() => invokeReducer({ date: new Date() })).toThrow();
      expect(() => invokeReducer({ set: new Set([]) })).toThrow();
      expect(() => invokeReducer({ map: new Map([]) })).toThrow();
      expect(() => invokeReducer({ class: new TestClass() })).toThrow();
      expect(() =>
        invokeReducer({ nested: { class: new TestClass() } })
      ).toThrow();

      class TestClass {}
    });

    it('should provide the path of the invalid state', () => {
      expect(() => invokeReducer()).toThrowError(
        `Detected unserializable state at "root"`
      );
      expect(() => invokeReducer({ date: new Date() })).toThrowError(
        `Detected unserializable state at "date"`
      );
      expect(() =>
        invokeReducer({
          one: { two: 2, three: { date: new Date() }, four: 'four' },
        })
      ).toThrowError(`Detected unserializable state at "one.three.date"`);
    });
  });

  function invokeReducer(nextState?: any) {
    stateSerializationCheckMetaReducer(() => nextState)(undefined, {
      type: 'invokeReducer',
    });
  }
});
