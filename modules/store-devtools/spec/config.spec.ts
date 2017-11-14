import { ActionReducer, Action } from '@ngrx/store';
import { StoreDevtoolsConfig } from '../';

describe('StoreDevtoolsOptions', () => {
  it('can be initialized with name', () => {
    const options = new StoreDevtoolsConfig();
    options.name = 'my instance';
    expect(options.name).toBe('my instance');
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
    options.stateSanitizer = stateSanitizer;
    expect(options.stateSanitizer).toEqual(stateSanitizer);
  });
});
