import { Action, ReducerObservable, ActionsSubject, ScannedActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { DevtoolsExtension } from './extension';
import { LiftedState } from './reducer';
import { StoreDevtoolsConfig } from './config';
export declare class DevtoolsDispatcher extends ActionsSubject {
}
export declare class StoreDevtools implements Observer<any> {
    private stateSubscription;
    dispatcher: ActionsSubject;
    liftedState: Observable<LiftedState>;
    state: Observable<any>;
    constructor(dispatcher: DevtoolsDispatcher, actions$: ActionsSubject, reducers$: ReducerObservable, extension: DevtoolsExtension, scannedActions: ScannedActionsSubject, initialState: any, config: StoreDevtoolsConfig);
    dispatch(action: Action): void;
    next(action: any): void;
    error(error: any): void;
    complete(): void;
    performAction(action: any): void;
    reset(): void;
    rollback(): void;
    commit(): void;
    sweep(): void;
    toggleAction(id: number): void;
    jumpToState(index: number): void;
    importState(nextLiftedState: any): void;
}
