import { Injectable } from '@angular/core';
import {
  StateObservable,
  Store,
  ReducerManager,
  ActionsSubject,
} from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MockStore<T> extends Store<T> {
  private stateSubject = new BehaviorSubject<T>({} as T);

  constructor(
    state$: StateObservable,
    actionsObserver: ActionsSubject,
    reducerManager: ReducerManager
  ) {
    super(state$, actionsObserver, reducerManager);
    this.source = this.stateSubject.asObservable();
  }

  nextMock(nextState: T): void {
    this.stateSubject.next(nextState);
  }

  spyOnDispatch(spyFactory: Function): void {
    this.dispatch = spyFactory(this.dispatch);
  }
}

export function provideMockStore() {
  return {
    provide: Store,
    useClass: MockStore,
  };
}
