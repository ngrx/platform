import * as ngCore from '@angular/core';
import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { Store, StoreModule, META_REDUCERS } from '..';
import { createActiveRuntimeChecks } from '../src/runtime_checks';
import { RuntimeChecks } from '../src/models';

describe('Runtime checks:', () => {
  describe('createActiveRuntimeChecks:', () => {
    it('should disable all checks by default', () => {
      expect(createActiveRuntimeChecks()).toEqual({
        strictStateSerializability: false,
        strictActionSerializability: false,
        strictImmutability: false,
      });
    });

    it('should log a warning in dev mode when no configuration is provided', () => {
      const spy = spyOn(console, 'warn');

      createActiveRuntimeChecks();

      expect(spy).toHaveBeenCalled();
    });

    it('should not log a warning in dev mode when configuration is provided', () => {
      const spy = spyOn(console, 'warn');

      createActiveRuntimeChecks({});

      expect(spy).not.toHaveBeenCalled();
    });

    it('should not log a warning when not dev mode when no configuration is provided', () => {
      spyOn(ngCore, 'isDevMode').and.returnValue(false);
      const spy = spyOn(console, 'warn');

      createActiveRuntimeChecks();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should allow the user to override the config', () => {
      expect(
        createActiveRuntimeChecks({
          strictStateSerializability: true,
          strictActionSerializability: true,
          strictImmutability: true,
        })
      ).toEqual({
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictImmutability: true,
      });
    });

    it('should disable runtime checks in production', () => {
      spyOn(ngCore, 'isDevMode').and.returnValue(false);

      expect(createActiveRuntimeChecks()).toEqual({
        strictStateSerializability: false,
        strictActionSerializability: false,
        strictImmutability: false,
      });
    });
  });

  describe('Registering custom meta-reducers:', () => {
    it('should invoke internal meta reducers before user defined meta reducers', () => {
      let logs: string[] = [];
      function metaReducerFactory(logMessage: string) {
        return function metaReducer(reducer: any) {
          return function(state: any, action: any) {
            logs.push(logMessage);
            return reducer(state, action);
          };
        };
      }

      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot(
            {},
            {
              metaReducers: [metaReducerFactory('user')],
            }
          ),
        ],
        providers: [
          {
            provide: META_REDUCERS,
            useValue: metaReducerFactory('internal-single-one'),
            multi: true,
          },
          {
            provide: META_REDUCERS,
            useValue: metaReducerFactory('internal-single-two'),
            multi: true,
          },
        ],
      });

      const store: Store<any> = TestBed.get(Store);
      const expected = ['internal-single-one', 'internal-single-two', 'user'];

      expect(logs).toEqual(expected);
      logs = [];

      store.dispatch({ type: 'foo' });
      expect(logs).toEqual(expected);
    });
  });

  describe('State Serialization:', () => {
    const invalidAction = () => ({ type: ErrorTypes.UnserializableState });

    it(
      'should throw when enabled',
      fakeAsync(() => {
        const store = setupStore({ strictStateSerializability: true });

        expect(() => {
          store.dispatch(invalidAction());
          flush();
        }).toThrowError(/Detected unserializable state/);
      })
    );

    it(
      'should not throw when disabled',
      fakeAsync(() => {
        const store = setupStore({ strictStateSerializability: false });

        expect(() => {
          store.dispatch(invalidAction());
          flush();
        }).not.toThrow();
      })
    );
  });

  describe('Action Serialization:', () => {
    const invalidAction = () => ({
      type: ErrorTypes.UnserializableAction,
      invalid: new Date(),
    });

    it(
      'should throw when enabled',
      fakeAsync(() => {
        const store = setupStore({ strictActionSerializability: true });

        expect(() => {
          store.dispatch(invalidAction());
          flush();
        }).toThrowError(/Detected unserializable action/);
      })
    );

    it(
      'should not throw when disabled',
      fakeAsync(() => {
        const store = setupStore({ strictActionSerializability: false });

        expect(() => {
          store.dispatch(invalidAction());
          flush();
        }).not.toThrow();
      })
    );
  });

  describe('State Mutations', () => {
    const invalidAction = () => ({
      type: ErrorTypes.MutateState,
    });

    it(
      'should throw when enabled',
      fakeAsync(() => {
        const store = setupStore({ strictImmutability: true });

        expect(() => {
          store.dispatch(invalidAction());
          flush();
        }).toThrowError(/Cannot add property/);
      })
    );

    it(
      'should not throw when disabled',
      fakeAsync(() => {
        const store = setupStore({ strictImmutability: false });

        expect(() => {
          store.dispatch(invalidAction());
          flush();
        }).not.toThrow();
      })
    );
  });

  describe('Action Mutations', () => {
    const invalidAction = () => ({
      type: ErrorTypes.MutateAction,
      foo: 'foo',
    });

    it(
      'should throw when enabled',
      fakeAsync(() => {
        const store = setupStore({ strictImmutability: true });

        expect(() => {
          store.dispatch(invalidAction());
          flush();
        }).toThrowError(/Cannot assign to read only property/);
      })
    );

    it(
      'should not throw when disabled',
      fakeAsync(() => {
        const store = setupStore({ strictImmutability: false });

        expect(() => {
          store.dispatch(invalidAction());
          flush();
        }).not.toThrow();
      })
    );
  });
});

function setupStore(runtimeChecks?: Partial<RuntimeChecks>): Store<any> {
  TestBed.configureTestingModule({
    imports: [
      StoreModule.forRoot(
        {
          state: reducerWithBugs,
        },
        { runtimeChecks }
      ),
    ],
  });

  return TestBed.get(Store);
}

enum ErrorTypes {
  UnserializableState = 'Action type producing unserializable state',
  UnserializableAction = 'Action type producing unserializable action',
  MutateAction = 'Action type producing action mutation',
  MutateState = 'Action type producing state mutation',
}

function reducerWithBugs(state: any = {}, action: any) {
  switch (action.type) {
    case ErrorTypes.UnserializableState:
      return {
        invalidSerializationState: true,
        invalid: new Date(),
      };

    case ErrorTypes.UnserializableAction: {
      return {
        invalidSerializationAction: true,
      };
    }

    case ErrorTypes.MutateAction: {
      action.foo = 'foo';
      return {
        invalidMutationAction: true,
      };
    }

    case ErrorTypes.MutateState: {
      state.invalidMutationState = true;
      return state;
    }

    default:
      return state;
  }
}
