import { Injectable, Inject, OnDestroy, Provider } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { queue } from 'rxjs/scheduler/queue';
import { observeOn, withLatestFrom, scan } from 'rxjs/operators';
import { ActionsSubject, INIT } from './actions_subject';
import { Action, ActionReducer } from './models';
import { INITIAL_STATE } from './tokens';
import { ReducerObservable } from './reducer_manager';
import { ScannedActionsSubject } from './scanned_actions_subject';

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

    const actionsOnQueue$: Observable<Action> = actions$.pipe(observeOn(queue));
    const withLatestReducer$: Observable<
      [Action, ActionReducer<any, Action>]
    > = actionsOnQueue$.pipe(withLatestFrom(reducer$));
    //TODO(robwormald): is this StateActionPair correct?
    const stateAndAction$: Observable<
      StateActionPair<any, Action>
    > = withLatestReducer$.pipe(scan(reduceState, { state: initialState }));

    this.stateSubscription = stateAndAction$.subscribe(({ state, action }) => {
      this.next(state);
      scannedActions.next(action);
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
