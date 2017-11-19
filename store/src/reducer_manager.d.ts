import { OnDestroy, Provider } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ActionReducer, ActionReducerMap, ActionReducerFactory, StoreFeature } from './models';
import { ActionsSubject } from './actions_subject';
export declare abstract class ReducerObservable extends Observable<ActionReducer<any, any>> {
}
export declare abstract class ReducerManagerDispatcher extends ActionsSubject {
}
export declare const UPDATE: "@ngrx/store/update-reducers";
export declare class ReducerManager extends BehaviorSubject<ActionReducer<any, any>> implements OnDestroy {
    private dispatcher;
    private initialState;
    private reducers;
    private reducerFactory;
    constructor(dispatcher: ReducerManagerDispatcher, initialState: any, reducers: ActionReducerMap<any, any>, reducerFactory: ActionReducerFactory<any, any>);
    addFeature({reducers, reducerFactory, metaReducers, initialState, key}: StoreFeature<any, any>): void;
    removeFeature({key}: StoreFeature<any, any>): void;
    addReducer(key: string, reducer: ActionReducer<any, any>): void;
    removeReducer(key: string): void;
    private updateReducers();
    ngOnDestroy(): void;
}
export declare const REDUCER_MANAGER_PROVIDERS: Provider[];
