import { Action } from '@ngrx/store';

import { createConfig, DEFAULT_NAME, noMonitor } from '../src/config';

const defaultFeatures = {
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
};

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
      autoPause: false,
      features: defaultFeatures,
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
      autoPause: true,
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
      autoPause: true,
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
      autoPause: false,
      features: defaultFeatures,
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
      autoPause: false,
      features: {
        pause: true,
        export: true,
        test: true,
      },
    });
  });
});
