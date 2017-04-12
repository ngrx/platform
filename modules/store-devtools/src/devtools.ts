import { Injectable, Inject, OnDestroy } from '@angular/core';
import { State, Action, INITIAL_STATE, ReducerObservable, ActionsSubject, ScannedActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/operator/map';
import { merge } from 'rxjs/operator/merge';
import { observeOn } from 'rxjs/operator/observeOn';
import { scan } from 'rxjs/operator/scan';
import { skip } from 'rxjs/operator/skip';
import { withLatestFrom } from 'rxjs/operator/withLatestFrom';
import { queue } from 'rxjs/scheduler/queue';

import { DevtoolsExtension } from './extension';
import { liftAction, unliftAction, unliftState, applyOperators } from './utils';
import { liftReducerWith, liftInitialState, LiftedState } from './reducer';
import * as Actions from './actions';
import { StoreDevtoolsConfig, STORE_DEVTOOLS_CONFIG } from './config';

@Injectable()
export class DevtoolsDispatcher extends ActionsSubject { }

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
    const liftReducer = liftReducerWith(initialState, liftedInitialState, config.monitor,
      config.maxAge ? { maxAge: config.maxAge } : { });

    const liftedAction$ = applyOperators(actions$.asObservable(), [
      [ skip, 1 ],
      [ merge, extension.actions$ ],
      [ map, liftAction ],
      [ merge, dispatcher, extension.liftedActions$ ],
      [ observeOn, queue ]
    ]);

    const liftedReducer$ = map.call(reducers$, liftReducer);

    const liftedStateSubject = new ReplaySubject(1);
    const liftedStateSubscription = applyOperators(liftedAction$, [
      [ withLatestFrom, liftedReducer$ ],
      [ scan, ({ state: liftedState }: any, [ action, reducer ]: any) => {
        const state = reducer(liftedState, action);

        extension.notify(action, state);

        return { state, action };
      }, { state: liftedInitialState, action: null }]
    ]).subscribe(({ state, action }) => {
      liftedStateSubject.next(state);

      if (action.type === Actions.PERFORM_ACTION) {
        const unlifedAction = (action as Actions.PerformAction).action;

        scannedActions.next(unlifedAction);
      }
    });

    const liftedState$ = liftedStateSubject.asObservable();
    const state$ = map.call(liftedState$, unliftState);

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

  error(error: any) { }

  complete() { }

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

  jumpToState(index: number) {
    this.dispatch(new Actions.JumpToState(index));
  }

  importState(nextLiftedState: any) {
    this.dispatch(new Actions.ImportState(nextLiftedState));
  }
}
