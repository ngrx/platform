import { Injectable, Inject, OnDestroy, ErrorHandler } from '@angular/core';
import {
  Action,
  ActionReducer,
  ActionsSubject,
  INITIAL_STATE,
  ReducerObservable,
  ScannedActionsSubject,
} from '@ngrx/store';
import {
  merge,
  Observable,
  Observer,
  queueScheduler,
  ReplaySubject,
  Subscription,
} from 'rxjs';
import { map, observeOn, scan, skip, withLatestFrom } from 'rxjs/operators';

import * as Actions from './actions';
import { STORE_DEVTOOLS_CONFIG, StoreDevtoolsConfig } from './config';
import { DevtoolsExtension } from './extension';
import { LiftedState, liftInitialState, liftReducerWith } from './reducer';
import { liftAction, unliftState } from './utils';

@Injectable()
export class DevtoolsDispatcher extends ActionsSubject {}

@Injectable()
export class StoreDevtools implements Observer<any> {
  private stateSubscription: Subscription;
  public dispatcher: ActionsSubject;
  public liftedState: Observable<LiftedState>;
  public state: Observable<any>;

  constructor(
    dispatcher: DevtoolsDispatcher,
    actions$: ActionsSubject,
    reducers$: ReducerObservable,
    extension: DevtoolsExtension,
    scannedActions: ScannedActionsSubject,
    errorHandler: ErrorHandler,
    @Inject(INITIAL_STATE) initialState: any,
    @Inject(STORE_DEVTOOLS_CONFIG) config: StoreDevtoolsConfig
  ) {
    const liftedInitialState = liftInitialState(initialState, config.monitor);
    const liftReducer = liftReducerWith(
      initialState,
      liftedInitialState,
      errorHandler,
      config.monitor,
      config
    );

    const liftedAction$ = merge(
      merge(actions$.asObservable().pipe(skip(1)), extension.actions$).pipe(
        map(liftAction)
      ),
      dispatcher,
      extension.liftedActions$
    ).pipe(observeOn(queueScheduler));

    const liftedReducer$ = reducers$.pipe(map(liftReducer));

    const liftedStateSubject = new ReplaySubject<LiftedState>(1);

    const liftedStateSubscription = liftedAction$
      .pipe(
        withLatestFrom(liftedReducer$),
        scan<
          [any, ActionReducer<LiftedState, Actions.All>],
          {
            state: LiftedState;
            action: any;
          }
        >(
          ({ state: liftedState }, [action, reducer]) => {
            const reducedLiftedState = reducer(liftedState, action);

            // // Extension should be sent the sanitized lifted state
            extension.notify(action, reducedLiftedState);

            return { state: reducedLiftedState, action };
          },
          { state: liftedInitialState, action: null as any }
        )
      )
      .subscribe(({ state, action }) => {
        liftedStateSubject.next(state);

        if (action.type === Actions.PERFORM_ACTION) {
          const unliftedAction = (action as Actions.PerformAction).action;

          scannedActions.next(unliftedAction);
        }
      });

    const liftedState$ = liftedStateSubject.asObservable() as Observable<
      LiftedState
    >;
    const state$ = liftedState$.pipe(map(unliftState));

    this.stateSubscription = liftedStateSubscription;
    this.dispatcher = dispatcher;
    this.liftedState = liftedState$;
    this.state = state$;
  }

  dispatch(action: Action) {
    this.dispatcher.next(action);
  }

  next(action: any) {
    this.dispatcher.next(action);
  }

  error(error: any) {}

  complete() {}

  performAction(action: any) {
    this.dispatch(new Actions.PerformAction(action));
  }

  reset() {
    this.dispatch(new Actions.Reset());
  }

  rollback() {
    this.dispatch(new Actions.Rollback());
  }

  commit() {
    this.dispatch(new Actions.Commit());
  }

  sweep() {
    this.dispatch(new Actions.Sweep());
  }

  toggleAction(id: number) {
    this.dispatch(new Actions.ToggleAction(id));
  }

  jumpToAction(actionId: number) {
    this.dispatch(new Actions.JumpToAction(actionId));
  }

  jumpToState(index: number) {
    this.dispatch(new Actions.JumpToState(index));
  }

  importState(nextLiftedState: any) {
    this.dispatch(new Actions.ImportState(nextLiftedState));
  }
}
