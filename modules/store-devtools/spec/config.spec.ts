import { ActionReducer, Action } from '@ngrx/store';
import { StoreDevtoolsConfig } from '../';

describe('StoreDevtoolsOptions', () => {
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
