import { immutabilityCheckMetaReducer } from '../../src/meta-reducers';

describe('immutabilityCheckMetaReducer:', () => {
  describe('actions:', () => {
    it('should not throw if left untouched', () => {
      expect(() => invokeActionReducer((state: any) => state)).not.toThrow();
    });

    it('should throw when mutating an action', () => {
      expect(() =>
        invokeActionReducer((state: any, action: any) => {
          action.foo = '123';
          return state;
        })
      ).toThrow();
      expect(() =>
        invokeActionReducer((state: any, action: any) => {
          action.numbers.push(4);
          return state;
        })
      ).toThrow();
    });

    it('should throw when mutating action outside of reducer', () => {
      let dispatchedAction: any;
      invokeActionReducer((state: any, action: any) => {
        dispatchedAction = action;
        return state;
      });

      expect(() => {
        dispatchedAction.foo = '123';
      }).toThrow();
    });

    it('should not throw on ivy properties (because these are ignored)', () => {
      let dispatchedAction: any;
      expect(() =>
        invokeActionReducer((state: any, action: any) => {
          dispatchedAction = action;
          return state;
        })
      ).not.toThrow();

      expect(() => {
        dispatchedAction.ɵIvyProperty.value = 2;
      }).not.toThrow();
    });

    it('should not throw when check is off', () => {
      expect(() =>
        invokeActionReducer((state: any, action: any) => {
          action.foo = '123';
          return state;
        }, false)
      ).not.toThrow();
    });

    function invokeActionReducer(reduce: Function, checkIsOn = true) {
      immutabilityCheckMetaReducer((state, action) => reduce(state, action), {
        action: () => checkIsOn,
        state: () => false,
      })(
        {},
        {
          type: 'invoke',
          numbers: [1, 2, 3],
          fun: function () {},
          ɵIvyProperty: { value: 1 },
        }
      );
    }
  });

  describe('state:', () => {
    it('should not throw if left untouched', () => {
      expect(() =>
        invokeStateReducer((state: any) => ({ ...state, foo: 'bar' }))
      ).not.toThrow();
    });

    it('should throw when mutating state', () => {
      expect(() =>
        invokeStateReducer((state: any) => {
          state.foo = '123';
          return state;
        })
      ).toThrow();
      expect(() =>
        invokeStateReducer((state: any) => {
          state.numbers.push(4);
          return state;
        })
      ).toThrow();
    });

    it('should throw when mutating state outside of reducer', () => {
      const nextState = invokeStateReducer((state: any) => state);
      expect(() => {
        nextState.foo = '123';
      }).toThrow();
    });

    it('should not throw when check is off', () => {
      expect(() =>
        invokeStateReducer((state: any) => {
          state.foo = '123';
          return state;
        }, false)
      ).not.toThrow();
    });

    function invokeStateReducer(reduce: Function, checkIsOn = true) {
      const reducer = immutabilityCheckMetaReducer(
        (state, action) => {
          if (action.type === 'init') return state;
          return reduce(state, action);
        },
        {
          state: () => checkIsOn,
          action: () => false,
        }
      );

      // dispatch init noop action because it's the next state that is frozen
      const state = reducer({ numbers: [1, 2, 3] }, { type: 'init' });
      return reducer(state, { type: 'invoke' });
    }
  });
});
