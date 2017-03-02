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
export class State<T> extends BehaviorSubject<T> implements OnDestroy {
  static readonly INIT = '@ngrx/store/init';

  private stateSubscription: Subscription;

  constructor(
    actions$: ActionsSubject,
    reducer$: ReducerObservable,
    scannedActions: ScannedActionsSubject,
    @Inject(INITIAL_STATE) initialState: T
  ) {
    super(initialState);

    const actionsOnQueue$: Observable<Action> = observeOn.call(actions$, queue);
    const withInitialAction$: Observable<Action> = startWith.call(actionsOnQueue$, { type: State.INIT });
    const withLatestReducer$: Observable<[ Action, ActionReducer<T, Action> ]> = withLatestFrom.call(withInitialAction$, reducer$);
    const stateAndAction$: Observable<{ state: T, action: Action }> = scan.call(withLatestReducer$, reduceState, initialState);

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

export function reduceState<T, V extends Action>(state: T, [ action, reducer ]: [ V, ActionReducer<T, V> ]) {
  return { state: reducer(state, action), action };
}

export const STATE_PROVIDERS: Provider[] = [
  State,
  { provide: StateObservable, useExisting: State },
];
