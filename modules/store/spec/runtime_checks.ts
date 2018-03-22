import { TestBed } from '@angular/core/testing';
import { Store, StoreModule, RuntimeChecks } from '@ngrx/store';

export enum Types {
  MutateState = 'Action type causing a state mutation',
  MutateAction = 'Action type causing an action mutation',
  ProduceUnserializableState = 'Action type producing unserializable state',
}

describe('Runtime Checks', () => {
  describe('For Immutability', () => {
    describe('When Enabled', () => {
      it('should throw errors when mutating state', () => {
        const store = disableChecks([]);

        const shouldThrow = () => store.dispatch({ type: Types.MutateState });

        expect(shouldThrow).toThrowError();
      });

      it('should throw errors when mutating actions', () => {
        const store = disableChecks([]);

        const shouldThrow = () => store.dispatch({ type: Types.MutateAction });

        expect(shouldThrow).toThrowError();
      });
    });

    describe('When Disabled', () => {
      it('should not throw errors when mutating state', () => {
        const store = disableChecks([RuntimeChecks.Immutability]);

        const shouldNotThrow = () =>
          store.dispatch({ type: Types.MutateState });

        expect(shouldNotThrow).not.toThrowError();
      });

      it('should throw errors when mutating actions', () => {
        const store = disableChecks([RuntimeChecks.Immutability]);

        const shouldNotThrow = () =>
          store.dispatch({ type: Types.MutateAction });

        expect(shouldNotThrow).not.toThrowError();
      });
    });
  });

  describe('For Serializability', () => {});
});

function reducerWithBugs(state: any = {}, action: any) {
  switch (action.type) {
    case Types.MutateState: {
      state.amount = 123;

      return state;
    }

    case Types.MutateAction: {
      action.amount = 'a lot';

      return state;
    }

    case Types.ProduceUnserializableState: {
      return new Map([['unserializable', 'indeed']]);
    }

    default: {
      return state;
    }
  }
}

export function disableChecks(
  disabledRuntimeChecks: RuntimeChecks[]
): Store<any> {
  TestBed.configureTestingModule({
    imports: [
      StoreModule.forRoot(
        {
          state: reducerWithBugs,
        },
        { dangerouslyDisableRuntimeChecks: disabledRuntimeChecks }
      ),
    ],
  });

  return TestBed.get(Store);
}
