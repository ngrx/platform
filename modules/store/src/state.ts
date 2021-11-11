import { Inject, Injectable, OnDestroy, Provider } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  queueScheduler,
  Subscription,
} from 'rxjs';
import { observeOn, scan, withLatestFrom } from 'rxjs/operators';

import { ActionsSubject, INIT } from './actions_subject';
import { Action, ActionReducer } from './models';
import { ReducerObservable } from './reducer_manager';
import { ScannedActionsSubject } from './scanned_actions_subject';
import { INITIAL_STATE } from './tokens';

export abstract class StateObservable extends Observable<any> {}

@Injectable()
export class State<T> extends BehaviorSubject<any> implements OnDestroy {
  static readonly INIT = INIT;

  private stateSubscription: Subscription;

  constructor(
    actions$: ActionsSubject,
    reducer$: ReducerObservable,
    scannedActions: ScannedActionsSubject,
    @Inject(INITIAL_STATE) initialState: any
  ) {
    super(initialState);

    const actionsOnQueue$: Observable<Action> = actions$.pipe(
      observeOn(queueScheduler)
    );
    const withLatestReducer$: Observable<[Action, ActionReducer<any, Action>]> =
      actionsOnQueue$.pipe(withLatestFrom(reducer$));

    const seed: StateActionPair<T> = { state: initialState };
    const stateAndAction$: Observable<{
      state: any;
      action?: Action;
    }> = withLatestReducer$.pipe(
      scan<[Action, ActionReducer<T, Action>], StateActionPair<T>>(
        reduceState,
        seed
      )
    );

    this.stateSubscription = stateAndAction$.subscribe(({ state, action }) => {
      this.next(state);
      scannedActions.next(action as Action);
    });
  }

  ngOnDestroy() {
    this.stateSubscription.unsubscribe();
    this.complete();
  }
}

export type StateActionPair<T, V extends Action = Action> = {
  state: T | undefined;
  action?: V;
};
export function reduceState<T, V extends Action = Action>(
  stateActionPair: StateActionPair<T, V> = { state: undefined },
  [action, reducer]: [V, ActionReducer<T, V>]
): StateActionPair<T, V> {
  const { state } = stateActionPair;
  return { state: reducer(state, action), action };
}

export const STATE_PROVIDERS: Provider[] = [
  State,
  { provide: StateObservable, useExisting: State },
];
