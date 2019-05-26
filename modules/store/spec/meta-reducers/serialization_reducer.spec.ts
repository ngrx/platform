import { serializationCheckMetaReducer } from '../../src/meta-reducers';

describe('serializationCheckMetaReducer:', () => {
  const serializables: Record<string, any> = {
    number: { value: 4 },
    boolean: { value: true },
    string: { value: 'foobar' },
    array: { value: [1, 2, 3] },
    object: { value: {} },
    nested: { value: { number: 7, array: ['n', 'g', 'r', 'x'] } },
    null: { value: null },
    undefined: { value: undefined },
  };

  const unSerializables: Record<string, any> = {
    date: { value: new Date() },
    map: { value: new Map() },
    set: { value: new Set() },
    class: { value: new class {}() },
    function: { value: () => {} },
  };

  describe('serializable:', () => {
    Object.keys(serializables).forEach(key => {
      it(`action with ${key} should not throw`, () => {
        expect(() =>
          invokeActionReducer({ type: 'valid', payload: serializables[key] })
        ).not.toThrow();
      });

      it(`state with ${key} should not throw`, () => {
        expect(() => invokeStateReducer(serializables[key])).not.toThrow();
      });
    });
  });

  describe('unserializable:', () => {
    Object.keys(unSerializables).forEach(key => {
      it(`action with ${key} should throw`, () => {
        expect(() =>
          invokeActionReducer({ type: 'valid', payload: unSerializables[key] })
        ).toThrow();
      });

      it(`state with ${key} should throw`, () => {
        expect(() => invokeStateReducer(unSerializables[key])).toThrow();
      });
    });
  });

  describe('actions: ', () => {
    it('should not throw if check is off', () => {
      expect(() =>
        invokeActionReducer({ type: 'valid', payload: unSerializables }, false)
      );
    });

    it('should log the path that is not serializable', () => {
      expect(() =>
        invokeActionReducer({
          type: 'valid',
          payload: { foo: { bar: unSerializables['date'] } },
        })
      ).toThrowError(
        /Detected unserializable action at "payload.foo.bar.value"/
      );
    });
  });

  describe('state: ', () => {
    it('should not throw if check is off', () => {
      expect(() => invokeStateReducer(unSerializables, false)).not.toThrow();
    });

    it('should log the path that is not serializable', () => {
      expect(() =>
        invokeStateReducer({
          foo: { bar: unSerializables['date'] },
        })
      ).toThrowError(/Detected unserializable state at "foo.bar.value"/);
    });

    it('should not throw if state is null', () => {
      expect(() => invokeStateReducer(null)).toThrowError(
        /Detected unserializable state at "root"/
      );
    });

    it('should not throw if state is undefined', () => {
      expect(() => invokeStateReducer(undefined)).toThrowError(
        /Detected unserializable state at "root"/
      );
    });
  });

  function invokeActionReducer(action: any, checkIsOn = true) {
    serializationCheckMetaReducer(state => state, {
      action: checkIsOn,
      state: false,
    })(undefined, action);
  }

  function invokeStateReducer(nextState?: any, checkIsOn = true) {
    serializationCheckMetaReducer(() => nextState, {
      state: checkIsOn,
      action: false,
    })(undefined, {
      type: 'invokeReducer',
    });
  }
});
