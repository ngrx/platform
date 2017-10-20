import { ActionReducer, Action } from '@ngrx/store';
import { StoreDevtoolsConfig } from '../';

describe('StoreDevtoolsOptions', () => {
  it('can be initialized', () => {
    const options = new StoreDevtoolsConfig();
    const monitor = {} as ActionReducer<any, any>;
    options.name = 'my instance';
    options.maxAge = 23;
    options.monitor = monitor;
    expect(options.name).toBe('my instance');
    expect(options.maxAge).toBe(23);
    expect(options.monitor).toEqual(monitor);
  });
  it('can be initialized with actionSanitizer', () => {
    const options = new StoreDevtoolsConfig();
    function sanitizer(action: Action, id: number): Action {
      return action;
    }
    options.actionSanitizer = sanitizer;
    expect(options.actionSanitizer).toEqual(sanitizer);
  });
  it('can be initialized with stateSanitizer', () => {
    const options = new StoreDevtoolsConfig();
    function stateSanitizer(state: any, index: number): any {
      return state;
    }
    options.actionSanitizer = stateSanitizer;
    expect(options.actionSanitizer).toEqual(stateSanitizer);
  });
});
