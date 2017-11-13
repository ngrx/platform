import { ActionReducer, Action } from '@ngrx/store';
import { StoreDevtoolsConfig } from '../';

describe('StoreDevtoolsOptions', () => {
  it('can be initialized with name', () => {
    const options = new StoreDevtoolsConfig();
    options.name = 'my instance';
    expect(options.name).toBe('my instance');
  });
});
