import { ActionReducer } from '@ngrx/store';
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
});
