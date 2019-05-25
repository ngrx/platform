import { stateImmutabilityCheckMetaReducer } from '../../src/meta-reducers';

describe('stateImmutabilityCheckMetaReducer:', () => {
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
    stateImmutabilityCheckMetaReducer(state => reduce(state))(
      { numbers: [1, 2, 3] },
      { type: 'invoke' }
    );
  }
});
