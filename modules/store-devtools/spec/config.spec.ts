import { ActionReducer, Action } from '@ngrx/store';
import {
  createConfig,
  StoreDevtoolsConfig,
  noMonitor,
  DEFAULT_NAME,
} from '../src/config';

describe('StoreDevtoolsOptions', () => {
  it('creates default options with empty object given', () => {
    const config = createConfig({});
    expect(config).toEqual({
      maxAge: false,
      monitor: noMonitor,
      actionSanitizer: undefined,
      stateSanitizer: undefined,
      name: DEFAULT_NAME,
      serialize: false,
      logOnly: false,
      features: false,
    });
  });

  it('creates options that contain passed in options', () => {
    function stateSanitizer(state: any, index: number): any {
      return state;
    }
    function actionSanitizer(action: Action, id: number): Action {
      return action;
    }
    const config = createConfig({
      maxAge: 20,
      actionSanitizer,
      stateSanitizer,
      name: 'ABC',
      serialize: true,
      features: {
        test: true,
      },
    });
    expect(config).toEqual({
      maxAge: 20,
      monitor: noMonitor,
      actionSanitizer,
      stateSanitizer,
      name: 'ABC',
      serialize: true,
      logOnly: false,
      features: {
        test: true,
      },
    });
  });

  it('can be initialized with a function returning options', () => {
    const config = createConfig(() => ({ maxAge: 15 }));
    expect(config).toEqual({
      maxAge: 15,
      monitor: noMonitor,
      actionSanitizer: undefined,
      stateSanitizer: undefined,
      name: DEFAULT_NAME,
      serialize: false,
      logOnly: false,
      features: false,
    });
  });

  it('logOnly will set features', () => {
    const config = createConfig({
      logOnly: true,
    });
    expect(config).toEqual({
      maxAge: false,
      monitor: noMonitor,
      actionSanitizer: undefined,
      stateSanitizer: undefined,
      name: DEFAULT_NAME,
      serialize: false,
      logOnly: true,
      features: {
        pause: true,
        export: true,
        test: true,
      },
    });
  });
});
