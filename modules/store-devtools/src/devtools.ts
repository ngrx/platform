import { Injectable, Inject, OnDestroy } from '@angular/core';
import {
  State,
  Action,
  INITIAL_STATE,
  ReducerObservable,
  ActionsSubject,
  ScannedActionsSubject,
} from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { map, observeOn, scan, skip, withLatestFrom } from 'rxjs/operators';
import { queue } from 'rxjs/scheduler/queue';
import { merge } from 'rxjs/observable/merge';
import { DevtoolsExtension } from './extension';
import { liftAction, unliftAction, unliftState, applyOperators } from './utils';
import {
  liftReducerWith,
  liftInitialState,
  LiftedState,
  ComputedState,
} from './reducer';
import * as Actions from './actions';
import {
  StoreDevtoolsConfig,
  STORE_DEVTOOLS_CONFIG,
  StateSanitizer,
  ActionSanitizer,
} from './config';

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
    @Inject(INITIAL_STATE) initialState: any,
    @Inject(STORE_DEVTOOLS_CONFIG) config: StoreDevtoolsConfig
  ) {
    const liftedInitialState = liftInitialState(initialState, config.monitor);
    const liftReducer = liftReducerWith(
      initialState,
      liftedInitialState,
      config.monitor,
      config
    );

    const liftedAction$ = merge(
      extension.actions$,
      actions$
        .asObservable()
        .pipe(skip(1))
        .pipe(map(liftAction), observeOn(queue))
    );

    const liftedReducer$ = reducers$.pipe(map(liftReducer));

    const liftedStateSubject = new ReplaySubject<LiftedState>(1);
    const liftedStateSubscription = liftedAction$
      .pipe(
        withLatestFrom(liftedReducer$),
        scan(
          ({ state: liftedState }: any, [action, reducer]: any) => {
            const reducedLiftedState = reducer(liftedState, action);

            // Extension should be sent the sanitized lifted state
            extension.notify(action, reducedLiftedState);

            //TODO(robwormald): rework this any
            return { state: reducedLiftedState, action } as any;
          },
          { state: liftedInitialState, action: null }
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
