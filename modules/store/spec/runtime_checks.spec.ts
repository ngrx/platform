import * as ngCore from '@angular/core';
import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import {
  Store,
  StoreModule,
  META_REDUCERS,
  USER_RUNTIME_CHECKS,
  createAction,
} from '..';
import { createActiveRuntimeChecks } from '../src/runtime_checks';
import { RuntimeChecks, Action } from '../src/models';
import * as metaReducers from '../src/meta-reducers';
import {
  REGISTERED_ACTION_TYPES,
  resetRegisteredActionTypes,
} from '../src/globals';

describe('Runtime checks:', () => {
  describe('createActiveRuntimeChecks:', () => {
    it('should enable immutability checks by default', () => {
      expect(createActiveRuntimeChecks()).toEqual({
        strictStateSerializability: false,
        strictActionSerializability: false,
        strictActionImmutability: true,
        strictStateImmutability: true,
        strictActionWithinNgZone: false,
        strictActionTypeUniqueness: false,
      });
    });

    it('should allow the user to override the config', () => {
      expect(
        createActiveRuntimeChecks({
          strictStateSerializability: true,
          strictActionSerializability: true,
          strictActionImmutability: false,
          strictStateImmutability: false,
          strictActionWithinNgZone: true,
          strictActionTypeUniqueness: true,
        })
      ).toEqual({
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionImmutability: false,
        strictStateImmutability: false,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      });
    });

    it('should disable runtime checks in production by default', () => {
      spyOn(ngCore, 'isDevMode').and.returnValue(false);

      expect(createActiveRuntimeChecks()).toEqual({
        strictStateSerializability: false,
        strictActionSerializability: false,
        strictActionImmutability: false,
        strictStateImmutability: false,
        strictActionWithinNgZone: false,
        strictActionTypeUniqueness: false,
      });
    });

    it('should disable runtime checks in production even if opted in to enable', () => {
      spyOn(ngCore, 'isDevMode').and.returnValue(false);

      expect(
        createActiveRuntimeChecks({
          strictStateSerializability: true,
          strictActionSerializability: true,
          strictActionWithinNgZone: true,
          strictActionTypeUniqueness: true,
        })
      ).toEqual({
        strictStateSerializability: false,
        strictActionSerializability: false,
        strictActionImmutability: false,
        strictStateImmutability: false,
        strictActionWithinNgZone: false,
        strictActionTypeUniqueness: false,
      });
    });
  });

  xdescribe('USER_RUNTIME_CHECKS Token', () => {
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

      const _store = TestBed.inject(Store);
      expect(serializationCheckMetaReducerSpy).toHaveBeenCalled();
    });

    it('should not create a meta reducer if not desired', () => {
      const serializationCheckMetaReducerSpy = spyOn(
        metaReducers,
        'serializationCheckMetaReducer'
      ).and.callThrough();
      const inNgZoneAssertMetaReducerSpy = spyOn(
        metaReducers,
        'inNgZoneAssertMetaReducer'
      ).and.callThrough();

      TestBed.configureTestingModule({
        imports: [StoreModule.forRoot({})],
        providers: [
          {
            provide: USER_RUNTIME_CHECKS,
            useValue: {
              strictStateSerializability: false,
              strictActionWithinNgZone: false,
            },
          },
        ],
      });

      const _store = TestBed.inject(Store);
      expect(serializationCheckMetaReducerSpy).not.toHaveBeenCalled();
      expect(inNgZoneAssertMetaReducerSpy).not.toHaveBeenCalled();
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

      const _store = TestBed.inject(Store);
      expect(serializationCheckMetaReducerSpy).not.toHaveBeenCalled();
      expect(immutabilityCheckMetaReducerSpy).toHaveBeenCalled();
    });
  });

  describe('Registering custom meta-reducers:', () => {
    it('should invoke internal meta reducers before user defined meta reducers', () => {
      let logs: string[] = [];
      function metaReducerFactory(logMessage: string) {
        return function metaReducer(reducer: any) {
          return function (state: any, action: any) {
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

      const store = TestBed.inject(Store);
      const expected = ['internal-single-one', 'internal-single-two', 'user'];

      expect(logs).toEqual(expected);
      logs = [];

      store.dispatch({ type: 'foo' });
      expect(logs).toEqual(expected);
    });
  });

  describe('State Serialization:', () => {
    const invalidAction = () => ({ type: ErrorTypes.UnserializableState });

    it('should throw when enabled', fakeAsync(() => {
      const store = setupStore({ strictStateSerializability: true });

      expect(() => {
        store.dispatch(invalidAction());
        flush();
      }).toThrowError(/Detected unserializable state/);
    }));

    it('should not throw when disabled', fakeAsync(() => {
      const store = setupStore({ strictStateSerializability: false });

      expect(() => {
        store.dispatch(invalidAction());
        flush();
      }).not.toThrow();
    }));

    it('should not throw for NgRx actions', fakeAsync(() => {
      const store = setupStore({ strictStateSerializability: true });

      expect(() => {
        store.dispatch(makeNgrxAction(invalidAction()));
        flush();
      }).not.toThrow();
    }));
  });

  describe('Action Serialization:', () => {
    const invalidAction = () => ({
      type: ErrorTypes.UnserializableAction,
      invalid: new Date(),
    });

    it('should throw when enabled', fakeAsync(() => {
      const store = setupStore({ strictActionSerializability: true });

      expect(() => {
        store.dispatch(invalidAction());
        flush();
      }).toThrowError(/Detected unserializable action/);
    }));

    it('should not throw when disabled', fakeAsync(() => {
      const store = setupStore({ strictActionSerializability: false });

      expect(() => {
        store.dispatch(invalidAction());
        flush();
      }).not.toThrow();
    }));
  });

  describe('State Mutations', () => {
    const invalidAction = () => ({
      type: ErrorTypes.MutateState,
    });

    it('should throw when enabled', fakeAsync(() => {
      const store = setupStore({ strictStateImmutability: true });

      expect(() => {
        store.dispatch(invalidAction());
        flush();
      }).toThrowError(/Cannot add property/);
    }));

    it('should not throw when disabled', fakeAsync(() => {
      const store = setupStore({ strictStateImmutability: false });

      expect(() => {
        store.dispatch(invalidAction());
        flush();
      }).not.toThrow();
    }));
  });

  describe('Action Mutations', () => {
    const invalidAction = () => ({
      type: ErrorTypes.MutateAction,
      foo: 'foo',
    });

    it('should throw when enabled', fakeAsync(() => {
      const store = setupStore({ strictActionImmutability: true });

      expect(() => {
        store.dispatch(invalidAction());
        flush();
      }).toThrowError(/Cannot assign to read only property/);
    }));

    it('should not throw when disabled', fakeAsync(() => {
      const store = setupStore({ strictActionImmutability: false });

      expect(() => {
        store.dispatch(invalidAction());
        flush();
      }).not.toThrow();
    }));

    it('should not throw for NgRx actions', fakeAsync(() => {
      const store = setupStore({ strictActionImmutability: true });

      expect(() => {
        store.dispatch(makeNgrxAction(invalidAction()));
        flush();
      }).not.toThrow();
    }));
  });

  describe('Action in NgZone', () => {
    const invalidAction = () => ({ type: ErrorTypes.OutOfNgZoneAction });

    it('should throw when running outside ngZone', fakeAsync(() => {
      ngCore.NgZone.isInAngularZone = jasmine
        .createSpy('isInAngularZone')
        .and.returnValue(false);
      const store = setupStore({ strictActionWithinNgZone: true });
      expect(() => {
        store.dispatch(invalidAction());
        flush();
      }).toThrowError(
        "Action 'Action triggered outside of NgZone' running outside NgZone. https://ngrx.io/guide/store/configuration/runtime-checks#strictactionwithinngzone"
      );
    }));

    it('should not throw when running in ngZone', fakeAsync(() => {
      ngCore.NgZone.isInAngularZone = jasmine
        .createSpy('isInAngularZone')
        .and.returnValue(true);
      const store = setupStore({ strictActionWithinNgZone: true });
      expect(() => {
        store.dispatch(invalidAction());
        flush();
      }).not.toThrowError();

      expect(ngCore.NgZone.isInAngularZone).toHaveBeenCalled();
    }));

    it('should not be called when disabled', fakeAsync(() => {
      const store = setupStore({ strictActionWithinNgZone: false });
      ngCore.NgZone.isInAngularZone = jasmine.createSpy('isInAngularZone');
      expect(() => {
        store.dispatch(invalidAction());
        flush();
      }).not.toThrow();

      expect(ngCore.NgZone.isInAngularZone).not.toHaveBeenCalled();
    }));
  });
});

describe('ActionType uniqueness', () => {
  beforeEach(() => {
    // Clear before each test because action types are registered during tests
    resetRegisteredActionTypes();
  });

  it('should throw when having duplicate action types', () => {
    createAction('action 1');
    createAction('action 1');

    expect(() => {
      setupStore({ strictActionTypeUniqueness: true });
    }).toThrowError(/Action types are registered more than once/);
  });

  it('should not throw when having no duplicate action types', () => {
    createAction('action 1');
    createAction('action 2');

    expect(() => {
      setupStore({ strictActionTypeUniqueness: true });
    }).not.toThrowError();
  });

  it('should not throw when disabled', () => {
    createAction('action 1');
    createAction('action 1');

    expect(() => {
      setupStore({ strictActionTypeUniqueness: false });
    }).not.toThrowError();
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

  return TestBed.inject(Store);
}

enum ErrorTypes {
  UnserializableState = 'Action type producing unserializable state',
  UnserializableAction = 'Action type producing unserializable action',
  MutateAction = 'Action type producing action mutation',
  MutateState = 'Action type producing state mutation',
  OutOfNgZoneAction = 'Action triggered outside of NgZone',
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

export function makeNgrxAction(action: Action) {
  action.type = '@ngrx ' + action.type;
  return action;
}
