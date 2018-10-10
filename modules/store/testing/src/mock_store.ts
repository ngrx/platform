import { Inject, Injectable } from '@angular/core';
import {
  Action,
  ActionsSubject,
  INITIAL_STATE,
  ReducerManager,
  StateObservable,
  Store,
} from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MockStore<T> extends Store<T> {
  private stateSubject = new BehaviorSubject<T>({} as T);
  public scannedActions$: Observable<Action>;

  constructor(
    private state$: StateObservable,
    actionsObserver: ActionsSubject,
    reducerManager: ReducerManager,
    @Inject(INITIAL_STATE) private initialState: T
  ) {
    super(state$, actionsObserver, reducerManager);
    (<BehaviorSubject<T>>this.state$).next(this.initialState);
    this.scannedActions$ = actionsObserver.asObservable();
  }

  setState(nextState: T): void {
    (<BehaviorSubject<T>>this.state$).next(nextState);
  }

  addReducer() {
    /* noop */
  }

  removeReducer() {
    /* noop */
  }
}
