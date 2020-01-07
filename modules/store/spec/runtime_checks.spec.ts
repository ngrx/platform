import * as ngCore from '@angular/core';
import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { Store, StoreModule, META_REDUCERS, USER_RUNTIME_CHECKS } from '..';
import { createActiveRuntimeChecks } from '../src/runtime_checks';
import { RuntimeChecks } from '../src/models';
import * as metaReducers from '../src/meta-reducers';

describe('Runtime checks:', () => {
  describe('createActiveRuntimeChecks:', () => {
    it('should enable immutability checks by default', () => {
      expect(createActiveRuntimeChecks()).toEqual({
        strictStateSerializability: false,
        strictActionSerializability: false,
        strictActionImmutability: true,
        strictStateImmutability: true,
      });
    });

    it('should allow the user to override the config', () => {
      expect(
        createActiveRuntimeChecks({
          strictStateSerializability: true,
          strictActionSerializability: true,
          strictActionImmutability: false,
          strictStateImmutability: false,
        })
      ).toEqual({
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionImmutability: false,
        strictStateImmutability: false,
      });
    });

    it('should disable runtime checks in production by default', () => {
      spyOn(ngCore, 'isDevMode').and.returnValue(false);

      expect(createActiveRuntimeChecks()).toEqual({
        strictStateSerializability: false,
        strictActionSerializability: false,
        strictActionImmutability: false,
        strictStateImmutability: false,
      });
    });

    it('should disable runtime checks in production even if opted in to enable', () => {
      spyOn(ngCore, 'isDevMode').and.returnValue(false);

      expect(
        createActiveRuntimeChecks({
          strictStateSerializability: true,
          strictActionSerializability: true,
        })
      ).toEqual({
        strictStateSerializability: false,
        strictActionSerializability: false,
        strictActionImmutability: false,
        strictStateImmutability: false,
      });
    });
  });

  describe('USER_RUNTIME_CHECKS Token', () => {
    it('should be possible to toggle runtime reducers via the Injection Token', () => {
      const serializationCheckMetaReducerSpy = spyOn(
        metaReducers,
        'serializationCheckMetaReducer'
      ).and.callThrough();

      TestBed.configureTestingModule({
        imports: [StoreModule.forRoot({})],
        providers: [
          {
            provide: USER_RUNTIME_CHECKS,
            useValue: {
              strictStateSerializability: true,
            },
          },
        ],
      });

      const _store = TestBed.get<Store<any>>(Store);
      expect(serializationCheckMetaReducerSpy).toHaveBeenCalled();
    });

    it('should not create a meta reducer if not desired', () => {
      const serializationCheckMetaReducerSpy = spyOn(
        metaReducers,
        'serializationCheckMetaReducer'
      ).and.callThrough();

      TestBed.configureTestingModule({
        imports: [StoreModule.forRoot({})],
        providers: [
          {
            provide: USER_RUNTIME_CHECKS,
            useValue: {
              strictStateSerializability: false,
            },
          },
        ],
      });

      const _store = TestBed.get<Store<any>>(Store);
      expect(serializationCheckMetaReducerSpy).not.toHaveBeenCalled();
    });

    it('should create immutability meta reducer without config', () => {
      const serializationCheckMetaReducerSpy = spyOn(
        metaReducers,
        'serializationCheckMetaReducer'
      ).and.callThrough();
      const immutabilityCheckMetaReducerSpy = spyOn(
        metaReducers,
        'immutabilityCheckMetaReducer'
      ).and.callThrough();

      TestBed.configureTestingModule({
        imports: [StoreModule.forRoot({})],
        providers: [
          {
            provide: USER_RUNTIME_CHECKS,
            useValue: {},
          },
        ],
      });

      const _store = TestBed.get<Store<any>>(Store);
      expect(serializationCheckMetaReducerSpy).not.toHaveBeenCalled();
      expect(immutabilityCheckMetaReducerSpy).toHaveBeenCalled();
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
        const store = setupStore({ strictStateImmutability: true });

        expect(() => {
          store.dispatch(invalidAction());
          flush();
        }).toThrowError(/Cannot add property/);
      })
    );

    it(
      'should not throw when disabled',
      fakeAsync(() => {
        const store = setupStore({ strictStateImmutability: false });

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
        const store = setupStore({ strictActionImmutability: true });

        expect(() => {
          store.dispatch(invalidAction());
          flush();
        }).toThrowError(/Cannot assign to read only property/);
      })
    );

    it(
      'should not throw when disabled',
      fakeAsync(() => {
        const store = setupStore({ strictActionImmutability: false });

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
