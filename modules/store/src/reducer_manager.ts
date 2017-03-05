import { Injectable, Inject, OnDestroy, Provider } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Action, ActionReducer, ActionReducerMap, ActionReducerFactory, StoreFeature } from './models';
import { INITIAL_STATE, INITIAL_REDUCERS, REDUCER_FACTORY } from './tokens';
import { omit } from './utils';
import { ActionsSubject } from './actions_subject';


export abstract class ReducerObservable extends Observable<ActionReducer<any, any>> { }

@Injectable()
export class ReducerManager extends BehaviorSubject<ActionReducer<any, any>> implements OnDestroy {
  static readonly UPDATE = '@ngrx/store/update-reducers';

  constructor(
    private dispatcher: ActionsSubject,
    @Inject(INITIAL_STATE) private initialState: any,
    @Inject(INITIAL_REDUCERS) private reducers: ActionReducerMap<any, any>,
    @Inject(REDUCER_FACTORY) private reducerFactory: ActionReducerFactory<any, any>
  ) {
    super(reducerFactory(reducers, initialState));
  }

  addFeature({ reducers, reducerFactory, initialState, key }: StoreFeature<any, any>) {
    const reducer = reducerFactory(reducers, initialState);

    this.addReducer(key, reducer);
  }

  removeFeature({ key }: StoreFeature<any, any>) {
    this.removeReducer(key);
  }

  addReducer(key: string, reducer: ActionReducer<any, any>) {
    this.reducers = { ...this.reducers, [key]: reducer };

    this.updateReducers();
  }

  removeReducer(key: string) {
    this.reducers = omit(this.reducers, key);

    this.updateReducers();
  }

  private updateReducers() {
    this.next(this.reducerFactory(this.reducers, this.initialState));
    this.dispatcher.next({ type: ReducerManager.UPDATE });
  }

  ngOnDestroy() {
    this.complete();
  }
}

export const REDUCER_MANAGER_PROVIDERS: Provider[] = [
  ReducerManager,
  { provide: ReducerObservable, useExisting: ReducerManager },
];
