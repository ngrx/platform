import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {ReflectiveInjector} from '@angular/core';
import { createInjector } from './helpers/injector';
import { StoreModule, Store } from '../';


describe('ngRx State', () => {
  const initialState = 123;
  const reducer = jasmine.createSpy('reducer').and.returnValue(initialState);
  let injector: ReflectiveInjector;

  beforeEach(() => {
    injector = createInjector(StoreModule.forRoot({ key: reducer }, { initialState: { key: initialState } }));
  });

  it('should call the reducer to scan over the dispatcher', function() {
    injector.get(Store);

    expect(reducer).toHaveBeenCalledWith(initialState, { type: '@ngrx/store/init' });
  });

});
