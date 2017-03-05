import { Injectable, Inject, OnDestroy, Provider } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { queue } from 'rxjs/scheduler/queue';
import { observeOn } from 'rxjs/operator/observeOn';
import { startWith } from 'rxjs/operator/startWith';
import { withLatestFrom } from 'rxjs/operator/withLatestFrom';
import { scan } from 'rxjs/operator/scan';
import { ActionsSubject } from './actions_subject';
import { Action, ActionReducer } from './models';
import { INITIAL_STATE } from './tokens';
import { ReducerObservable } from './reducer_manager';
import { ScannedActionsSubject } from './scanned_actions_subject';


export abstract class StateObservable extends Observable<any> { }

@Injectable()
export class State extends BehaviorSubject<any> implements OnDestroy {
  static readonly INIT = '@ngrx/store/init';

  private stateSubscription: Subscription;

  constructor(
    actions$: ActionsSubject,
    reducer$: ReducerObservable,
    scannedActions: ScannedActionsSubject,
    @Inject(INITIAL_STATE) initialState: any
  ) {
    super(initialState);

    const actionsOnQueue$: Observable<Action> = observeOn.call(actions$, queue);
    const withLatestReducer$: Observable<[ Action, ActionReducer<any, Action> ]> = withLatestFrom.call(actionsOnQueue$, reducer$);
    const stateAndAction$: Observable<{ state: any, action: Action }> = scan.call(withLatestReducer$, reduceState, initialState);

    this.stateSubscription = stateAndAction$.subscribe({
      next: ({ state, action }) => {
        this.next(state);
        scannedActions.next(action);
      }
    });
  }

  ngOnDestroy() {
    this.stateSubscription.unsubscribe();
    this.complete();
  }
}

export type StateActionPair<T, V extends Action> = { state: T | undefined, action?: V };
export function reduceState<T, V extends Action>(
  { state }: StateActionPair<T, V> = { state: undefined },
  [ action, reducer ]: [ V, ActionReducer<T, V> ]
): StateActionPair<T, V> {
  return { state: reducer(state, action), action };
}

export const STATE_PROVIDERS: Provider[] = [
  State,
  { provide: StateObservable, useExisting: State },
];
