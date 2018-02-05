import { Action } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

import { LiftedState } from '../';
import {
  DevtoolsExtension,
  ReduxDevtoolsExtension,
  ReduxDevtoolsExtensionConnection,
} from '../src/extension';
import {
  createConfig,
  noActionSanitizer,
  noMonitor,
  noStateSanitizer,
} from '../src/instrument';

describe('DevtoolsExtension', () => {
  let reduxDevtoolsExtension: ReduxDevtoolsExtension;
  let devtoolsExtension: DevtoolsExtension;
  let devToolConnection: ReduxDevtoolsExtensionConnection;

  beforeEach(() => {
    reduxDevtoolsExtension = jasmine.createSpyObj('reduxDevtoolsExtension', [
      'send',
      'connect',
    ]);
    devToolConnection = jasmine.createSpyObj('devToolConnection', ['send']);
    (reduxDevtoolsExtension.connect as jasmine.Spy).and.returnValue(of({}));
    spyOn(Date, 'now').and.returnValue('1509655064369');
  });

  describe('notify', () => {
    it('should send notification with default options', () => {
      devtoolsExtension = new DevtoolsExtension(
        reduxDevtoolsExtension,
        createConfig({})
      );

      devtoolsExtension.devToolConnection = devToolConnection;

      const defaultOptions = {
        maxAge: false,
        monitor: noMonitor,
        serialize: false,
        instanceId: 'ngrx-store-1509655064369',
        name: 'NgRx Store DevTools',
        logOnly: false,
        features: false,
      };

      const action = {} as Action;
      const state = {} as LiftedState;

      devtoolsExtension.notify(action, state);

      expect(reduxDevtoolsExtension.send).toHaveBeenCalledWith(
        null,
        {},
        defaultOptions
      );

      expect(devToolConnection.send).toHaveBeenCalledWith(action, state);
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

      devtoolsExtension.devToolConnection = devToolConnection;

      const defaultOptions = {
        maxAge: false,
        monitor: noMonitor,
        serialize: false,
        instanceId: 'ngrx-store-1509655064369',
        name: 'ngrx-store-devtool-todolist',
        logOnly: false,
        features: false,
        actionSanitizer: myActionSanitizer,
        stateSanitizer: myStateSanitizer,
      };

      const action = {} as Action;
      const state = {} as LiftedState;
      devtoolsExtension.notify(action, state);

      expect(reduxDevtoolsExtension.send).toHaveBeenCalledWith(
        null,
        {},
        defaultOptions
      );

      expect(devToolConnection.send).toHaveBeenCalledWith(action, state);
    });
  });
});
