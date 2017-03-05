import 'rxjs/add/operator/take';
import { zip } from 'rxjs/observable/zip';
import { ReflectiveInjector } from '@angular/core';
import { createInjector, createChildInjector } from './helpers/injector';
import { StoreModule, Store } from '../';


describe('Nested Store Modules', () => {
  let store: Store<any>;

  beforeEach(() => {
    const parentReducers = { stateKey: () => 'root' };
    const featureReducers = { stateKey: () => 'child' };

    const rootInjector = createInjector(StoreModule.forRoot(parentReducers));
    const featureInjector = createChildInjector(rootInjector, StoreModule.forFeature('inner', featureReducers));

    store = rootInjector.get(Store);
  });

  it('should nest the child module in the root store object', () => {
    store.take(1).subscribe(state => {
      expect(state).toEqual({
        stateKey: 'root',
        inner: {
          stateKey: 'child'
        }
      });
    });
  });
});

