import { actionImmutabilityCheckMetaReducer } from '../../src/meta-reducers';

describe('actionImmutabilityCheckMetaReducer:', () => {
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
    actionImmutabilityCheckMetaReducer((state, action) => {
      reduce(action);
      return state;
    })({}, { type: 'invoke', numbers: [1, 2, 3], fun: function() {} });
  }
});
