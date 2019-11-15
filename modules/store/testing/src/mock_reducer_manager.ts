import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActionReducer } from '@ngrx/store';

@Injectable()
export class MockReducerManager extends BehaviorSubject<
  ActionReducer<any, any>
> {
  constructor() {
    super(() => undefined);
  }
  
  addFeature({
    reducers,
    reducerFactory,
    metaReducers,
    initialState,
    key,
  }: StoreFeature<any, any>) {
    /* noop */
  }
}
