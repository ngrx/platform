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
export const UPDATE = '@ngrx/store/update-reducers' as const;

@Injectable()
export class ReducerManager
  extends BehaviorSubject<ActionReducer<any, any>>
  implements OnDestroy {
  get currentReducers(): ActionReducerMap<any, any> {
    return this.reducers;
  }

  constructor(
    private dispatcher: ReducerManagerDispatcher,
    @Inject(INITIAL_STATE) private initialState: any,
    @Inject(INITIAL_REDUCERS) private reducers: ActionReducerMap<any, any>,
    @Inject(REDUCER_FACTORY)
    private reducerFactory: ActionReducerFactory<any, any>
  ) {
    super(reducerFactory(reducers, initialState));
  }

  addFeature(feature: StoreFeature<any, any>) {
    this.addFeatures([feature]);
  }

  addFeatures(features: StoreFeature<any, any>[]) {
    const reducers = features.reduce(
      (
        reducerDict,
        { reducers, reducerFactory, metaReducers, initialState, key }
      ) => {
        const reducer =
          typeof reducers === 'function'
            ? createFeatureReducerFactory(metaReducers)(reducers, initialState)
            : createReducerFactory(reducerFactory, metaReducers)(
                reducers,
                initialState
              );

        reducerDict[key] = reducer;
        return reducerDict;
      },
      {} as { [key: string]: ActionReducer<any, any> }
    );

    this.addReducers(reducers);
  }

  removeFeature(feature: StoreFeature<any, any>) {
    this.removeFeatures([feature]);
  }

  removeFeatures(features: StoreFeature<any, any>[]) {
    this.removeReducers(features.map((p) => p.key));
  }

  addReducer(key: string, reducer: ActionReducer<any, any>) {
    this.addReducers({ [key]: reducer });
  }

  addReducers(reducers: { [key: string]: ActionReducer<any, any> }) {
    this.reducers = { ...this.reducers, ...reducers };
    this.updateReducers(Object.keys(reducers));
  }

  removeReducer(featureKey: string) {
    this.removeReducers([featureKey]);
  }

  removeReducers(featureKeys: string[]) {
    featureKeys.forEach((key) => {
      this.reducers = omit(this.reducers, key) /*TODO(#823)*/ as any;
    });
    this.updateReducers(featureKeys);
  }

  private updateReducers(featureKeys: string[]) {
    this.next(this.reducerFactory(this.reducers, this.initialState));
    this.dispatcher.next(<Action>{
      type: UPDATE,
      features: featureKeys,
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
