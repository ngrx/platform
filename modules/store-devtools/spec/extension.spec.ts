import {
  StoreDevtools,
  StoreDevtoolsModule,
  LiftedState,
  StoreDevtoolsConfig,
  StoreDevtoolsOptions,
} from '../';
import {
  StoreModule,
  Store,
  StateObservable,
  ActionReducer,
  Action,
  ReducerManager,
} from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { createConfig, noMonitor } from '../src/instrument';
import { DevtoolsExtension, ReduxDevtoolsExtension } from '../src/extension';

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
        name: 'NgRx Store DevTools',
        serialize: false,
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
    it('should send notification with given options', () => {
      devtoolsExtension = new DevtoolsExtension(
        reduxDevtoolsExtension,
        createConfig({
          name: 'ngrx-store-devtool-todolist',
        })
      );
      const defaultOptions = {
        maxAge: false,
        monitor: noMonitor,
        name: 'ngrx-store-devtool-todolist',
        serialize: false,
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
