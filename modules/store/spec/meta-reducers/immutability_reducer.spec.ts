import { immutabilityCheckMetaReducer } from '../../src/meta-reducers';

describe('immutabilityCheckMetaReducer:', () => {
  describe('actions:', () => {
    it('should not throw if left untouched', () => {
      expect(() => invokeReducer((action: any) => action)).not.toThrow();
    });

    it('should throw when mutating an action', () => {
      expect(() =>
        invokeReducer((action: any) => {
          action.foo = '123';
        })
      ).toThrow();
      expect(() =>
        invokeReducer((action: any) => {
          action.numbers.push(4);
        })
      ).toThrow();
    });

    function invokeReducer(reduce: Function) {
      immutabilityCheckMetaReducer((state, action) => {
        reduce(action);
        return state;
      })({}, { type: 'invoke', numbers: [1, 2, 3], fun: function() {} });
    }
  });

  describe('state:', () => {
    it('should not throw if left untouched', () => {
      expect(() =>
        invokeReducer((state: any) => ({ ...state, foo: 'bar' }))
      ).not.toThrow();
    });

    it('should throw when mutating state', () => {
      expect(() =>
        invokeReducer((state: any) => {
          state.foo = '123';
        })
      ).toThrow();
      expect(() =>
        invokeReducer((state: any) => {
          state.numbers.push(4);
        })
      ).toThrow();
    });

    function invokeReducer(reduce: Function) {
      immutabilityCheckMetaReducer(state => reduce(state))(
        { numbers: [1, 2, 3] },
        { type: 'invoke' }
      );
    }
  });
});
