import { Action } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

import { LiftedState } from '../';
import { DevtoolsExtension, ReduxDevtoolsExtension } from '../src/extension';
import { createConfig, noMonitor } from '../src/instrument';

describe('DevtoolsExtension', () => {
  let reduxDevtoolsExtension: ReduxDevtoolsExtension;
  let devtoolsExtension: DevtoolsExtension;

  beforeEach(() => {
    reduxDevtoolsExtension = jasmine.createSpyObj('reduxDevtoolsExtension', [
      'send',
      'connect',
    ]);
    (reduxDevtoolsExtension.connect as jasmine.Spy).and.returnValue(of({}));
    spyOn(Date, 'now').and.returnValue('1509655064369');
  });

  describe('notify', () => {
    it('should send notification with default options', () => {
      devtoolsExtension = new DevtoolsExtension(
        reduxDevtoolsExtension,
        createConfig({})
      );
      const defaultOptions = {
        maxAge: false,
        monitor: noMonitor,
        actionSanitizer: undefined,
        stateSanitizer: undefined,
        name: 'NgRx Store DevTools',
        serialize: false,
        logOnly: false,
        features: false,
      };
      const action = {} as Action;
      const state = {} as LiftedState;
      devtoolsExtension.notify(action, state);
      expect(reduxDevtoolsExtension.send).toHaveBeenCalledWith(
        null,
        {},
        defaultOptions,
        'ngrx-store-1509655064369'
      );
    });

    function myActionSanitizer() {
      return { type: 'sanitizer' };
    }
    function myStateSanitizer() {
      return { state: 'new state' };
    }

    it('should send notification with given options', () => {
      devtoolsExtension = new DevtoolsExtension(
        reduxDevtoolsExtension,
        createConfig({
          actionSanitizer: myActionSanitizer,
          stateSanitizer: myStateSanitizer,
          name: 'ngrx-store-devtool-todolist',
        })
      );
      const defaultOptions = {
        maxAge: false,
        monitor: noMonitor,
        actionSanitizer: myActionSanitizer,
        stateSanitizer: myStateSanitizer,
        name: 'ngrx-store-devtool-todolist',
        serialize: false,
        logOnly: false,
        features: false,
      };
      const action = {} as Action;
      const state = {} as LiftedState;
      devtoolsExtension.notify(action, state);
      expect(reduxDevtoolsExtension.send).toHaveBeenCalledWith(
        null,
        {},
        defaultOptions,
        'ngrx-store-1509655064369'
      );
    });
  });
});
