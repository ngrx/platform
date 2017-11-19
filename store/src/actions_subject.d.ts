import { OnDestroy, Provider } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Action } from './models';
export declare const INIT: "@ngrx/store/init";
export declare class ActionsSubject extends BehaviorSubject<Action> implements OnDestroy {
    constructor();
    next(action: Action): void;
    complete(): void;
    ngOnDestroy(): void;
}
export declare const ACTIONS_SUBJECT_PROVIDERS: Provider[];
