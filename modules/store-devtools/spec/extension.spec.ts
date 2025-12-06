import { ComputedState, LiftedAction, LiftedActions } from './../src/reducer';
import { PERFORM_ACTION, PerformAction } from './../src/actions';
import {
  ExtensionActionTypes,
  REDUX_DEVTOOLS_EXTENSION,
  ReduxDevtoolsExtensionConfig,
  ReduxDevtoolsExtensionConnection,
} from './../src/extension';
import { Action } from '@ngrx/store';

import { DevtoolsExtension, ReduxDevtoolsExtension } from '../src/extension';
import {
  createConfig,
  DevToolsFeatureOptions,
  STORE_DEVTOOLS_CONFIG,
  StoreDevtoolsConfig,
} from '../src/config';
import { unliftState } from '../src/utils';
import { TestBed } from '@angular/core/testing';
import { DevtoolsDispatcher } from '../src/devtools-dispatcher';
import { Mock, vi } from 'vitest';

function createOptions(
  name = 'NgRx Store DevTools',
  features: DevToolsFeatureOptions = {
    pause: true,
    lock: true,
    persist: true,
    export: true,
    import: 'custom',
    jump: true,
    skip: true,
    reorder: true,
    dispatch: true,
    test: true,
  },
  serialize: boolean | undefined = false,
  maxAge: false | number = false,
  autoPause = false,
  trace = false,
  traceLimit = 75
) {
  const options: ReduxDevtoolsExtensionConfig = {
    name,
    features,
    serialize,
    autoPause,
    trace,
    traceLimit,
  };
  if (maxAge !== false /* support === 0 */) {
    options.maxAge = maxAge;
  }
  return options;
}

function createState(
  actionsById?: LiftedActions,
  computedStates?: ComputedState[],
  isLocked = false,
  isPaused = false
) {
  return {
    monitorState: null,
    nextActionId: 1,
    actionsById: actionsById || {
      0: { type: PERFORM_ACTION, action: { type: 'SOME_ACTION' } },
    },
    stagedActionIds: [0],
    skippedActionIds: [],
    committedState: { count: 0 },
    currentStateIndex: 0,
    computedStates: computedStates || [
      {
        state: 1,
        error: null,
      },
    ],
    connectInZone: false,
    isLocked,
    isPaused,
  };
}

const testSetup = (options: { config: StoreDevtoolsConfig }) => {
  const reduxDevtoolsExtension = {
    send: vi.fn(() => {}),
    connect: vi.fn(() => {}),
  };

  const extensionConnection = {
    init: vi.fn(() => {}),
    subscribe: vi.fn(() => {}),
    unsubscribe: vi.fn(() => {}),
    send: vi.fn(() => {}),
    error: vi.fn(() => {}),
  };

  reduxDevtoolsExtension.connect.mockReturnValue(extensionConnection);

  TestBed.configureTestingModule({
    // Provide both the service-to-test and its (spy) dependency
    providers: [
      DevtoolsExtension,
      { provide: REDUX_DEVTOOLS_EXTENSION, useValue: reduxDevtoolsExtension },
      { provide: STORE_DEVTOOLS_CONFIG, useValue: options.config },
      { provide: DevtoolsDispatcher, useValue: <any>null },
    ],
  });

  return {
    extensionConnection,
    reduxDevtoolsExtension,
    devtoolsExtension: TestBed.inject(DevtoolsExtension),
  };
};

describe('DevtoolsExtension', () => {
  function myActionSanitizer(action: Action, idx: number) {
    return action;
  }

  function myStateSanitizer(state: any, idx: number) {
    return state;
  }

  it('should connect with default options', () => {
    const { devtoolsExtension, reduxDevtoolsExtension } = testSetup({
      config: createConfig({}),
    });
    // Subscription needed or else extension connection will not be established.
    devtoolsExtension.actions$.subscribe(() => null);
    const defaultOptions = createOptions();
    expect(reduxDevtoolsExtension.connect).toHaveBeenCalledWith(defaultOptions);
  });

  it('should connect with given options', () => {
    const { devtoolsExtension, reduxDevtoolsExtension } = testSetup({
      config: createConfig({
        name: 'ngrx-store-devtool-todolist',
        maxAge: 10,
        serialize: true,
        autoPause: true,
        // these two should not be added
        actionSanitizer: myActionSanitizer,
        stateSanitizer: myStateSanitizer,
        trace: true,
        traceLimit: 20,
      }),
    });
    // Subscription needed or else extension connection will not be established.
    devtoolsExtension.actions$.subscribe(() => null);
    const options = createOptions(
      'ngrx-store-devtool-todolist',
      undefined,
      true,
      10,
      true,
      true,
      20
    );
    expect(reduxDevtoolsExtension.connect).toHaveBeenCalledWith(options);
  });

  it('should connect with custom serializer', () => {
    const customSerializer = {
      replacer: (key: {}, value: any) => value,
    };

    const { devtoolsExtension, reduxDevtoolsExtension } = testSetup({
      config: createConfig({
        name: 'ngrx-store-devtool-todolist',
        serialize: customSerializer,
      }),
    });

    // Subscription needed or else extension connection will not be established.
    devtoolsExtension.actions$.subscribe(() => null);
    expect(reduxDevtoolsExtension.connect).toHaveBeenCalledWith(
      expect.objectContaining({ serialize: customSerializer })
    );
  });

  for (const { payload, name } of [
    {
      payload: "{type: '[Books] Rent', id: 5, customerId: 12}",
      name: 'evaluates payload because of string',
    },
    {
      payload: { type: '[Books] Rent', id: 5, customerId: 12 },
      name: 'passes payload through if not of type string',
    },
  ]) {
    it(`should handle an unlifted action (dispatched by DevTools) - ${name}`, () => {
      const { devtoolsExtension, extensionConnection } = testSetup({
        config: createConfig({}),
      });
      let unwrappedAction: Action | undefined = undefined;
      devtoolsExtension.actions$.subscribe((action) => {
        return (unwrappedAction = action);
      });

      const [callback] = extensionConnection.subscribe.mock.lastCall;
      callback({ type: ExtensionActionTypes.START });
      callback({ type: ExtensionActionTypes.ACTION, payload });
      expect(unwrappedAction).toEqual({
        type: '[Books] Rent',
        id: 5,
        customerId: 12,
      });
    });
  }

  describe('notify', () => {
    it('should send notification with default options', () => {
      const { devtoolsExtension, reduxDevtoolsExtension } = testSetup({
        config: createConfig({}),
      });
      const defaultOptions = createOptions();
      const action = {} as LiftedAction;
      const state = createState();
      devtoolsExtension.notify(action, state);
      expect(reduxDevtoolsExtension.send).toHaveBeenCalledWith(
        null,
        state,
        defaultOptions
      );
    });

    it('should send notification with given options', () => {
      const { devtoolsExtension, reduxDevtoolsExtension } = testSetup({
        config: createConfig({
          name: 'ngrx-store-devtool-todolist',
          maxAge: 10,
          serialize: true,
          // these two should not be added
          actionSanitizer: myActionSanitizer,
          stateSanitizer: myStateSanitizer,
        }),
      });

      const options = createOptions(
        'ngrx-store-devtool-todolist',
        undefined,
        true,
        10
      );
      const action = {} as LiftedAction;
      const state = createState();
      devtoolsExtension.notify(action, state);
      expect(reduxDevtoolsExtension.send).toHaveBeenCalledWith(
        null,
        state,
        options
      );
    });

    describe('[with Action and State Sanitizer]', () => {
      const UNSANITIZED_TOKEN = 'UNSANITIZED_ACTION';
      const SANITIZED_TOKEN = 'SANITIZED_ACTION';
      const SANITIZED_COUNTER = 42;

      function createPerformAction() {
        return new PerformAction({ type: UNSANITIZED_TOKEN }, 1234567);
      }

      function testActionSanitizer(action: Action, id: number) {
        return { type: SANITIZED_TOKEN };
      }

      function testStateSanitizer(state: any, index: number) {
        return SANITIZED_COUNTER;
      }

      describe('should function normally with no sanitizers', () => {
        let devtoolsExtension: DevtoolsExtension;
        let extensionConnection: ReduxDevtoolsExtensionConnection;
        let reduxDevtoolsExtension: ReduxDevtoolsExtension;

        beforeEach(() => {
          ({ devtoolsExtension, extensionConnection, reduxDevtoolsExtension } =
            testSetup({
              config: createConfig({}),
            }));

          // Subscription needed or else extension connection will not be established.
          devtoolsExtension.actions$.subscribe(() => null);
        });

        it('for normal action', () => {
          const action = createPerformAction();
          const state = createState();

          devtoolsExtension.notify(action, state);
          expect(extensionConnection.send).toHaveBeenCalledWith(
            action,
            unliftState(state)
          );
        });

        it('for action that requires full state update', () => {
          const options = createOptions();
          const action = {} as LiftedAction;
          const state = createState();

          devtoolsExtension.notify(action, state);
          expect(reduxDevtoolsExtension.send).toHaveBeenCalledWith(
            null,
            state,
            options
          );
        });
      });

      describe('should run the action sanitizer on actions', () => {
        let devtoolsExtension: DevtoolsExtension;
        let extensionConnection: ReduxDevtoolsExtensionConnection;
        let reduxDevtoolsExtension: ReduxDevtoolsExtension;
        beforeEach(() => {
          ({ devtoolsExtension, extensionConnection, reduxDevtoolsExtension } =
            testSetup({
              config: createConfig({
                actionSanitizer: testActionSanitizer,
              }),
            }));
          // Subscription needed or else extension connection will not be established.
          devtoolsExtension.actions$.subscribe(() => null);
        });

        it('for normal action', () => {
          const options = createOptions();
          const action = createPerformAction();
          const state = createState();
          const sanitizedAction = {
            ...action,
            action: testActionSanitizer(createPerformAction().action, 0),
          };

          devtoolsExtension.notify(action, state);
          expect(extensionConnection.send).toHaveBeenCalledWith(
            sanitizedAction,
            unliftState(state)
          );
        });

        it('for action that requires full state update', () => {
          const options = createOptions();
          const action = {} as LiftedAction;
          const state = createState();
          const sanitizedState = createState({
            0: { type: PERFORM_ACTION, action: { type: SANITIZED_TOKEN } },
          });

          devtoolsExtension.notify(action, state);
          expect(reduxDevtoolsExtension.send).toHaveBeenCalledWith(
            null,
            sanitizedState,
            options
          );
        });
      });

      describe('should run the state sanitizer on store state', () => {
        let devtoolsExtension: DevtoolsExtension;
        let extensionConnection: ReduxDevtoolsExtensionConnection;
        let reduxDevtoolsExtension: ReduxDevtoolsExtension;
        beforeEach(() => {
          ({ devtoolsExtension, extensionConnection, reduxDevtoolsExtension } =
            testSetup({
              config: createConfig({
                stateSanitizer: testStateSanitizer,
              }),
            }));

          // Subscription needed or else extension connection will not be established.
          devtoolsExtension.actions$.subscribe(() => null);
        });

        it('for normal action', () => {
          const action = createPerformAction();
          const state = createState();
          const sanitizedState = createState(undefined, [
            { state: SANITIZED_COUNTER, error: null },
          ]);

          devtoolsExtension.notify(action, state);
          expect(extensionConnection.send).toHaveBeenCalledWith(
            action,
            unliftState(sanitizedState)
          );
        });

        it('for action that requires full state update', () => {
          const options = createOptions();
          const action = {} as LiftedAction;
          const state = createState();
          const sanitizedState = createState(undefined, [
            { state: SANITIZED_COUNTER, error: null },
          ]);

          devtoolsExtension.notify(action, state);
          expect(reduxDevtoolsExtension.send).toHaveBeenCalledWith(
            null,
            sanitizedState,
            options
          );
        });
      });

      describe('sanitizers should not modify original state or actions', () => {
        let devtoolsExtension: DevtoolsExtension;
        let extensionConnection: ReduxDevtoolsExtensionConnection;
        let reduxDevtoolsExtension: ReduxDevtoolsExtension;
        beforeEach(() => {
          ({ devtoolsExtension, extensionConnection, reduxDevtoolsExtension } =
            testSetup({
              config: createConfig({
                actionSanitizer: testActionSanitizer,
                stateSanitizer: testStateSanitizer,
              }),
            }));

          // Subscription needed or else extension connection will not be established.
          devtoolsExtension.actions$.subscribe(() => null);
        });

        it('for normal action', () => {
          const action = createPerformAction();
          const state = createState();

          devtoolsExtension.notify(action, state);
          expect(state).toEqual(createState());
          expect(action).toEqual(createPerformAction());
        });

        it('for action that requires full state update', () => {
          const action = {} as LiftedAction;
          const state = createState();

          devtoolsExtension.notify(action, state);
          expect(state).toEqual(createState());
          expect(action).toEqual({} as LiftedAction);
        });
      });
    });

    describe('with Action and actionsBlocklist', () => {
      const NORMAL_ACTION = '[Test] NORMAL_ACTION';
      const BLOCKED_ACTION_1 = '[Test] BLOCKED_ACTION #1';
      const BLOCKED_ACTION_2 = '[Test] BLOCKED_ACTION #2';

      let devtoolsExtension: DevtoolsExtension;
      let extensionConnection: ReduxDevtoolsExtensionConnection;
      let reduxDevtoolsExtension: ReduxDevtoolsExtension;

      beforeEach(() => {
        ({ devtoolsExtension, extensionConnection, reduxDevtoolsExtension } =
          testSetup({
            config: createConfig({
              actionsBlocklist: [BLOCKED_ACTION_1, BLOCKED_ACTION_2],
            }),
          }));
        // Subscription needed or else extension connection will not be established.
        devtoolsExtension.actions$.subscribe(() => null);
      });

      it('should ignore the blocked action', () => {
        const options = createOptions();
        const state = createState();

        devtoolsExtension.notify(
          new PerformAction({ type: NORMAL_ACTION }, 1234567),
          state
        );
        devtoolsExtension.notify(
          new PerformAction({ type: NORMAL_ACTION }, 1234567),
          state
        );
        devtoolsExtension.notify(
          new PerformAction({ type: BLOCKED_ACTION_1 }, 1234567),
          state
        );
        devtoolsExtension.notify(
          new PerformAction({ type: BLOCKED_ACTION_2 }, 1234567),
          state
        );

        expect(extensionConnection.send).toHaveBeenCalledTimes(2);
      });
    });

    describe('with Action and actionsSafelist', () => {
      const NORMAL_ACTION = '[Test] NORMAL_ACTION';
      const SAFE_ACTION_1 = '[Test] SAFE_ACTION #1';
      const SAFE_ACTION_2 = '[Test] SAFE_ACTION #2';

      let devtoolsExtension: DevtoolsExtension;
      let extensionConnection: ReduxDevtoolsExtensionConnection;
      let reduxDevtoolsExtension: ReduxDevtoolsExtension;

      beforeEach(() => {
        ({ devtoolsExtension, extensionConnection, reduxDevtoolsExtension } =
          testSetup({
            config: createConfig({
              actionsSafelist: [SAFE_ACTION_1, SAFE_ACTION_2],
            }),
          }));

        // Subscription needed or else extension connection will not be established.
        devtoolsExtension.actions$.subscribe(() => null);
      });

      it('should only keep the safe action', () => {
        const options = createOptions();
        const state = createState();

        devtoolsExtension.notify(
          new PerformAction({ type: NORMAL_ACTION }, 1234567),
          state
        );
        devtoolsExtension.notify(
          new PerformAction({ type: NORMAL_ACTION }, 1234567),
          state
        );
        devtoolsExtension.notify(
          new PerformAction({ type: SAFE_ACTION_1 }, 1234567),
          state
        );
        devtoolsExtension.notify(
          new PerformAction({ type: SAFE_ACTION_2 }, 1234567),
          state
        );

        expect(extensionConnection.send).toHaveBeenCalledTimes(2);
      });
    });

    describe('with Action and predicate', () => {
      const NORMAL_ACTION = 'NORMAL_ACTION';
      const RANDOM_ACTION = 'RANDOM_ACTION';

      const predicate = vi.fn((state: any, action: Action) => {
        if (action.type === RANDOM_ACTION) {
          return false;
        }
        return true;
      });

      let devtoolsExtension: DevtoolsExtension;
      let extensionConnection: ReduxDevtoolsExtensionConnection;
      let reduxDevtoolsExtension: ReduxDevtoolsExtension;

      beforeEach(() => {
        ({ devtoolsExtension, extensionConnection, reduxDevtoolsExtension } =
          testSetup({
            config: createConfig({
              predicate,
            }),
          }));

        // Subscription needed or else extension connection will not be established.
        devtoolsExtension.actions$.subscribe(() => null);
      });

      it('should ignore action according to predicate', () => {
        const options = createOptions();
        const state = createState();

        devtoolsExtension.notify(
          new PerformAction({ type: NORMAL_ACTION }, 1234567),
          state
        );
        expect(predicate).toHaveBeenCalledWith(unliftState(state), {
          type: NORMAL_ACTION,
        });
        devtoolsExtension.notify(
          new PerformAction({ type: NORMAL_ACTION }, 1234567),
          state
        );
        devtoolsExtension.notify(
          new PerformAction({ type: RANDOM_ACTION }, 1234567),
          state
        );
        expect(predicate).toHaveBeenCalledTimes(3);
        expect(extensionConnection.send).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('with locked recording', () => {
    let devtoolsExtension: DevtoolsExtension;
    let extensionConnection: ReduxDevtoolsExtensionConnection;
    let reduxDevtoolsExtension: ReduxDevtoolsExtension;

    beforeEach(() => {
      ({ devtoolsExtension, extensionConnection, reduxDevtoolsExtension } =
        testSetup({
          config: createConfig({}),
        }));

      // Subscription needed or else extension connection will not be established.
      devtoolsExtension.actions$.subscribe(() => null);
    });

    it('should not notify extension of PERFORM_ACTIONs', () => {
      const action = new PerformAction({ type: 'ACTION' }, +Date.now());
      const state = createState(undefined, undefined, true);

      devtoolsExtension.notify(action, state);
      expect(extensionConnection.send).not.toHaveBeenCalled();
      expect(reduxDevtoolsExtension.send).not.toHaveBeenCalled();
    });

    it('should notify extension of actions that require full state update', () => {
      const action = {} as LiftedAction;
      const state = createState(undefined, undefined, true);
      const options = createOptions();

      devtoolsExtension.notify(action, state);
      expect(extensionConnection.send).not.toHaveBeenCalled();
      expect(reduxDevtoolsExtension.send).toHaveBeenCalledWith(
        null,
        state,
        options
      );
    });
  });

  describe('with paused recording', () => {
    let devtoolsExtension: DevtoolsExtension;
    let extensionConnection: ReduxDevtoolsExtensionConnection;
    let reduxDevtoolsExtension: ReduxDevtoolsExtension;

    beforeEach(() => {
      ({ devtoolsExtension, extensionConnection, reduxDevtoolsExtension } =
        testSetup({
          config: createConfig({}),
        }));
      // Subscription needed or else extension connection will not be established.
      devtoolsExtension.actions$.subscribe(() => null);
    });

    it('should not notify extension of PERFORM_ACTIONs', () => {
      const action = new PerformAction({ type: 'ACTION' }, +Date.now());
      const state = createState(undefined, undefined, undefined, true);

      devtoolsExtension.notify(action, state);
      expect(extensionConnection.send).not.toHaveBeenCalled();
      expect(reduxDevtoolsExtension.send).not.toHaveBeenCalled();
    });

    it('should notify extension of actions that require full state update', () => {
      const action = {} as LiftedAction;
      const state = createState(undefined, undefined, undefined, true);
      const options = createOptions();

      devtoolsExtension.notify(action, state);
      expect(extensionConnection.send).not.toHaveBeenCalled();
      expect(reduxDevtoolsExtension.send).toHaveBeenCalledWith(
        null,
        state,
        options
      );
    });
  });

  describe('error handling', () => {
    let consoleSpy: Mock;

    let devtoolsExtension: DevtoolsExtension;
    let extensionConnection: ReduxDevtoolsExtensionConnection;
    let reduxDevtoolsExtension: ReduxDevtoolsExtension;

    beforeEach(() => {
      ({ devtoolsExtension, extensionConnection, reduxDevtoolsExtension } =
        testSetup({
          config: createConfig({}),
        }));
      // Subscription needed or else extension connection will not be established.
      devtoolsExtension.actions$.subscribe();
      consoleSpy = vi.spyOn(console, 'warn');
    });

    it('for normal action', () => {
      (extensionConnection.send as Mock).mockImplementation(() => {
        throw new Error('uh-oh something went wrong');
      });

      const action = new PerformAction({ type: 'FOO' }, 1234567);
      const state = createState();

      devtoolsExtension.notify(action, state);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('for action that requires full state update', () => {
      (reduxDevtoolsExtension.send as Mock).mockImplementation(() => {
        throw new Error('uh-oh something went wrong');
      });

      const action = {} as LiftedAction;
      const state = createState();

      devtoolsExtension.notify(action, state);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
