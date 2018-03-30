import { Inject, Injectable, OnDestroy, Provider } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ActionsSubject } from './actions_subject';
import {
  Action,
  ActionReducer,
  ActionReducerFactory,
  ActionReducerMap,
  StoreFeature,
} from './models';
import { INITIAL_REDUCERS, INITIAL_STATE, REDUCER_FACTORY } from './tokens';
import {
  createFeatureReducerFactory,
  createReducerFactory,
  omit,
} from './utils';

export abstract class ReducerObservable extends Observable<
  ActionReducer<any, any>
> {}
export abstract class ReducerManagerDispatcher extends ActionsSubject {}
export const UPDATE = '@ngrx/store/update-reducers' as '@ngrx/store/update-reducers';

@Injectable()
export class ReducerManager extends BehaviorSubject<ActionReducer<any, any>>
  implements OnDestroy {
  constructor(
    private dispatcher: ReducerManagerDispatcher,
    @Inject(INITIAL_STATE) private initialState: any,
    @Inject(INITIAL_REDUCERS) private reducers: ActionReducerMap<any, any>,
    @Inject(REDUCER_FACTORY)
    private reducerFactory: ActionReducerFactory<any, any>
  ) {
    super(reducerFactory(reducers, initialState));
  }

  addFeature({
    reducers,
    reducerFactory,
    metaReducers,
    initialState,
    key,
  }: StoreFeature<any, any>) {
    const reducer =
      typeof reducers === 'function'
        ? createFeatureReducerFactory(metaReducers)(reducers, initialState)
        : createReducerFactory(reducerFactory, metaReducers)(
            reducers,
            initialState
          );

    this.addReducer(key, reducer);
  }

  removeFeature({ key }: StoreFeature<any, any>) {
    this.removeReducer(key);
  }

  addReducer(key: string, reducer: ActionReducer<any, any>) {
    this.reducers = { ...this.reducers, [key]: reducer };

    this.updateReducers(key);
  }

  removeReducer(key: string) {
    this.reducers = omit(this.reducers, key) /*TODO(#823)*/ as any;

    this.updateReducers(key);
  }

  private updateReducers(key: string) {
    this.next(this.reducerFactory(this.reducers, this.initialState));
    this.dispatcher.next(<Action & { feature: string }>{
      type: UPDATE,
      feature: key,
    });
  }

  ngOnDestroy() {
    this.complete();
  }
}

export const REDUCER_MANAGER_PROVIDERS: Provider[] = [
  ReducerManager,
  { provide: ReducerObservable, useExisting: ReducerManager },
  { provide: ReducerManagerDispatcher, useExisting: ActionsSubject },
];
