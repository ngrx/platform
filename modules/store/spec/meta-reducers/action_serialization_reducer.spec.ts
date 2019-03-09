import { actionSerializationCheckMetaReducer } from '../../src/meta-reducers';

describe('actionSerializationCheckMetaReducer:', () => {
  describe('valid action:', () => {
    it('should not throw', () => {
      expect(() =>
        invokeReducer({ type: 'valid', payload: { id: 47 } })
      ).not.toThrow();
    });
  });

  describe('invalid action:', () => {
    it('should throw', () => {
      expect(() =>
        invokeReducer({ type: 'invalid', payload: { date: new Date() } })
      ).toThrow();
    });
  });

  function invokeReducer(action: any) {
    actionSerializationCheckMetaReducer(() => {})(undefined, action);
  }
});
