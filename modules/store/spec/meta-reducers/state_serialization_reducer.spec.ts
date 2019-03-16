import { stateSerializationCheckMetaReducer } from '../../src/meta-reducers';

describe('stateSerializationCheckMetaReducer:', () => {
  describe('valid next state:', () => {
    it('should not throw', () => {
      expect(() =>
        invokeReducer({
          nested: { number: 1, null: null },
        })
      ).not.toThrow();
    });
  });

  describe('invalid next state:', () => {
    it('should throw', () => {
      expect(() => invokeReducer({ nested: { class: new Date() } })).toThrow();
    });
  });

  function invokeReducer(nextState?: any) {
    stateSerializationCheckMetaReducer(() => nextState)(undefined, {
      type: 'invokeReducer',
    });
  }
});
