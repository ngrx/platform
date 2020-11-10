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

  addFeature(feature: any) {
    /* noop */
  }

  addFeatures(feature: any) {
    /* noop */
  }

  removeFeature(feature: any) {
    /* noop */
  }

  removeFeatures(features: any) {
    /* noop */
  }

  addReducer(key: any, reducer: any) {
    /* noop */
  }

  addReducers(reducers: any) {
    /* noop */
  }

  removeReducer(featureKey: any) {
    /* noop */
  }

  removeReducers(featureKeys: any) {
    /* noop */
  }
}
