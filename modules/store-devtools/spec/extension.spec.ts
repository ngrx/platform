import { LiftedActions, ComputedState, LiftedAction } from './../src/reducer';
import { PerformAction, PERFORM_ACTION } from './../src/actions';
import { ActionSanitizer, StateSanitizer } from './../src/config';
import {
  ReduxDevtoolsExtensionConnection,
  ReduxDevtoolsExtensionConfig,
} from './../src/extension';
import { Action } from '@ngrx/store';

import { LiftedState } from '../';
import { DevtoolsExtension, ReduxDevtoolsExtension } from '../src/extension';
import { createConfig, noMonitor } from '../src/instrument';
import { unliftState } from '../src/utils';

function createOptions(
  name: string = 'NgRx Store DevTools',
  features: any = false,
  serialize: boolean = false,
  maxAge: false | number = false
) {
  const options: ReduxDevtoolsExtensionConfig = {
    instanceId: 'ngrx-store-1509655064369',
    name,
    features,
    serialize,
  };
  if (maxAge !== false /* support === 0 */) {
    options.maxAge = maxAge;
  }
  return options;
}

function createState(
  actionsById?: LiftedActions,
  computedStates?: ComputedState[]
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
  };
}

describe('DevtoolsExtension', () => {
  let reduxDevtoolsExtension: ReduxDevtoolsExtension;
  let extensionConnection: ReduxDevtoolsExtensionConnection;
  let devtoolsExtension: DevtoolsExtension;

  beforeEach(() => {
    extensionConnection = jasmine.createSpyObj(
      'reduxDevtoolsExtensionConnection',
      ['init', 'subscribe', 'unsubscribe', 'send']
    );
    reduxDevtoolsExtension = jasmine.createSpyObj('reduxDevtoolsExtension', [
      'send',
      'connect',
    ]);
    (reduxDevtoolsExtension.connect as jasmine.Spy).and.returnValue(
      extensionConnection
    );
    spyOn(Date, 'now').and.returnValue('1509655064369');
  });

  function myActionSanitizer(action: Action, idx: number) {
    return action;
  }

  function myStateSanitizer(state: any, idx: number) {
    return state;
  }

  it('should connect with default options', () => {
    devtoolsExtension = new DevtoolsExtension(
      reduxDevtoolsExtension,
      createConfig({})
    );
    // Subscription needed or else extension connection will not be established.
    devtoolsExtension.actions$.subscribe(() => null);
    const defaultOptions = createOptions();
    expect(reduxDevtoolsExtension.connect).toHaveBeenCalledWith(defaultOptions);
  });

  it('should connect with given options', () => {
    devtoolsExtension = new DevtoolsExtension(
      reduxDevtoolsExtension,
      createConfig({
        name: 'ngrx-store-devtool-todolist',
        features: 'some features',
        maxAge: 10,
        serialize: true,
        // these two should not be added
        actionSanitizer: myActionSanitizer,
        stateSanitizer: myStateSanitizer,
      })
    );
    // Subscription needed or else extension connection will not be established.
    devtoolsExtension.actions$.subscribe(() => null);
    const options = createOptions(
      'ngrx-store-devtool-todolist',
      'some features',
      true,
      10
    );
    expect(reduxDevtoolsExtension.connect).toHaveBeenCalledWith(options);
  });

  describe('notify', () => {
    it('should send notification with default options', () => {
      devtoolsExtension = new DevtoolsExtension(
        reduxDevtoolsExtension,
        createConfig({})
      );
      const defaultOptions = createOptions();
      const action = {} as LiftedAction;
      const state = createState();
      devtoolsExtension.notify(action, state);
      expect(reduxDevtoolsExtension.send).toHaveBeenCalledWith(
        null,
        state,
        defaultOptions,
        'ngrx-store-1509655064369'
      );
    });

    it('should send notification with given options', () => {
      devtoolsExtension = new DevtoolsExtension(
        reduxDevtoolsExtension,
        createConfig({
          name: 'ngrx-store-devtool-todolist',
          features: 'some features',
          maxAge: 10,
          serialize: true,
          // these two should not be added
          actionSanitizer: myActionSanitizer,
          stateSanitizer: myStateSanitizer,
        })
      );
      const options = createOptions(
        'ngrx-store-devtool-todolist',
        'some features',
        true,
        10
      );
      const action = {} as LiftedAction;
      const state = createState();
      devtoolsExtension.notify(action, state);
      expect(reduxDevtoolsExtension.send).toHaveBeenCalledWith(
        null,
        state,
        options,
        'ngrx-store-1509655064369'
      );
    });

    describe('[with Action and State Sanitizer]', () => {
      const UNSANITIZED_TOKEN = 'UNSANITIZED_ACTION';
      const SANITIZED_TOKEN = 'SANITIZED_ACTION';
      const SANITIZED_COUNTER = 42;

      function createPerformAction() {
        return new PerformAction({ type: UNSANITIZED_TOKEN }, +Date.now());
      }

      function testActionSanitizer(action: Action, id: number) {
        return { type: SANITIZED_TOKEN };
      }

      function testStateSanitizer(state: any, index: number) {
        return SANITIZED_COUNTER;
      }

      describe('should function normally with no sanitizers', () => {
        beforeEach(() => {
          devtoolsExtension = new DevtoolsExtension(
            reduxDevtoolsExtension,
            createConfig({})
          );
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
            options,
            'ngrx-store-1509655064369'
          );
        });
      });

      describe('should run the action sanitizer on actions', () => {
        beforeEach(() => {
          devtoolsExtension = new DevtoolsExtension(
            reduxDevtoolsExtension,
            createConfig({
              actionSanitizer: testActionSanitizer,
            })
          );
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
            options,
            'ngrx-store-1509655064369'
          );
        });
      });

      describe('should run the state sanitizer on store state', () => {
        beforeEach(() => {
          devtoolsExtension = new DevtoolsExtension(
            reduxDevtoolsExtension,
            createConfig({
              stateSanitizer: testStateSanitizer,
            })
          );
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
            options,
            'ngrx-store-1509655064369'
          );
        });
      });

      describe('sanitizers should not modify original state or actions', () => {
        beforeEach(() => {
          devtoolsExtension = new DevtoolsExtension(
            reduxDevtoolsExtension,
            createConfig({
              actionSanitizer: testActionSanitizer,
              stateSanitizer: testStateSanitizer,
            })
          );
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
  });
});
