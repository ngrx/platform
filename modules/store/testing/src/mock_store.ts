import { Inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  Action,
  ActionsSubject,
  INITIAL_STATE,
  ReducerManager,
  Store,
} from '@ngrx/store';
import { MockState } from './mock_state';

@Injectable()
export class MockStore<T> extends Store<T> {
  public scannedActions$: Observable<Action>;

  constructor(
    private state$: MockState<T>,
    actionsObserver: ActionsSubject,
    reducerManager: ReducerManager,
    @Inject(INITIAL_STATE) private initialState: T
  ) {
    super(state$, actionsObserver, reducerManager);
    this.state$.next(this.initialState);
    this.scannedActions$ = actionsObserver.asObservable();
  }

  setState(nextState: T): void {
    this.state$.next(nextState);
  }

  addReducer() {
    /* noop */
  }

  removeReducer() {
    /* noop */
  }
}
