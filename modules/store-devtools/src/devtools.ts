import { Injectable, Inject, ErrorHandler, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Action,
  ActionReducer,
  ActionsSubject,
  INITIAL_STATE,
  ReducerObservable,
  ScannedActionsSubject,
  StateObservable,
} from '@ngrx/store';
import {
  merge,
  MonoTypeOperatorFunction,
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
import {
  liftAction,
  unliftState,
  shouldFilterActions,
  filterLiftedState,
} from './utils';
import { DevtoolsDispatcher } from './devtools-dispatcher';
import { PERFORM_ACTION } from './actions';
import { ZoneConfig, injectZoneConfig } from './zone-config';

@Injectable()
export class StoreDevtools implements Observer<any>, OnDestroy {
  private liftedStateSubscription: Subscription;
  private extensionStartSubscription: Subscription;
  public dispatcher: ActionsSubject;
  public liftedState: Observable<LiftedState>;
  public state: StateObservable;

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

    const zoneConfig = injectZoneConfig(config.connectOutsideZone!);

    const liftedStateSubject = new ReplaySubject<LiftedState>(1);

    this.liftedStateSubscription = liftedAction$
      .pipe(
        withLatestFrom(liftedReducer$),
        // The extension would post messages back outside of the Angular zone
        // because we call `connect()` wrapped with `runOutsideAngular`. We run change
        // detection only once at the end after all the required asynchronous tasks have
        // been processed (for instance, `setInterval` scheduled by the `timeout` operator).
        // We have to re-enter the Angular zone before the `scan` since it runs the reducer
        // which must be run within the Angular zone.
        emitInZone(zoneConfig),
        scan<
          [any, ActionReducer<LiftedState, Actions.All>],
          {
            state: LiftedState;
            action: any;
          }
        >(
          ({ state: liftedState }, [action, reducer]) => {
            let reducedLiftedState = reducer(liftedState, action);
            // On full state update
            // If we have actions filters, we must filter completely our lifted state to be sync with the extension
            if (action.type !== PERFORM_ACTION && shouldFilterActions(config)) {
              reducedLiftedState = filterLiftedState(
                reducedLiftedState,
                config.predicate,
                config.actionsSafelist,
                config.actionsBlocklist
              );
            }
            // Extension should be sent the sanitized lifted state
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

    this.extensionStartSubscription = extension.start$
      .pipe(emitInZone(zoneConfig))
      .subscribe(() => {
        this.refresh();
      });

    const liftedState$ =
      liftedStateSubject.asObservable() as Observable<LiftedState>;
    const state$ = liftedState$.pipe(map(unliftState)) as StateObservable;
    Object.defineProperty(state$, 'state', {
      value: toSignal(state$, { manualCleanup: true, requireSync: true }),
    });

    this.dispatcher = dispatcher;
    this.liftedState = liftedState$;
    this.state = state$;
  }

  ngOnDestroy(): void {
    // Even though the store devtools plugin is recommended to be
    // used only in development mode, it can still cause a memory leak
    // in microfrontend applications that are being created and destroyed
    // multiple times during development. This results in excessive memory
    // consumption, as it prevents entire apps from being garbage collected.
    this.liftedStateSubscription.unsubscribe();
    this.extensionStartSubscription.unsubscribe();
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
    this.dispatch(new Actions.PerformAction(action, +Date.now()));
  }

  refresh() {
    this.dispatch(new Actions.Refresh());
  }

  reset() {
    this.dispatch(new Actions.Reset(+Date.now()));
  }

  rollback() {
    this.dispatch(new Actions.Rollback(+Date.now()));
  }

  commit() {
    this.dispatch(new Actions.Commit(+Date.now()));
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

  lockChanges(status: boolean) {
    this.dispatch(new Actions.LockChanges(status));
  }

  pauseRecording(status: boolean) {
    this.dispatch(new Actions.PauseRecording(status));
  }
}

/**
 * If the devtools extension is connected out of the Angular zone,
 * this operator will emit all events within the zone.
 */
function emitInZone<T>({
  ngZone,
  connectOutsideZone,
}: ZoneConfig): MonoTypeOperatorFunction<T> {
  return (source) =>
    connectOutsideZone
      ? new Observable<T>((subscriber) =>
          source.subscribe({
            next: (value) => ngZone.run(() => subscriber.next(value)),
            error: (error) => ngZone.run(() => subscriber.error(error)),
            complete: () => ngZone.run(() => subscriber.complete()),
          })
        )
      : source;
}
