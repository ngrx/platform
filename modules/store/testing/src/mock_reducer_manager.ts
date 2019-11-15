import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActionReducer } from '@ngrx/store';
import {
  Action,
  ActionsSubject,
  INITIAL_STATE,
  ReducerManager,
  Store,
  createSelector,
  MemoizedSelectorWithProps,
  MemoizedSelector,
} from '@ngrx/store';

@Injectable()
export class MockReducerManager extends BehaviorSubject<
  ActionReducer<any, any>
> {
  constructor() {
    super(() => undefined);
  }
  
  addFeature(feature: any) {
    /* noop */
  }
  
  addFeatures(feature: any) {
    /* noop */
  }
}
