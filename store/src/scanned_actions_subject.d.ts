import { Provider, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Action } from './models';
export declare class ScannedActionsSubject extends Subject<Action> implements OnDestroy {
    ngOnDestroy(): void;
}
export declare const SCANNED_ACTIONS_SUBJECT_PROVIDERS: Provider[];
