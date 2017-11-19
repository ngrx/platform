import { Observable } from 'rxjs/Observable';
import { Notification } from 'rxjs/Notification';
import { Action } from '@ngrx/store';
import { ErrorReporter } from './error_reporter';
export interface EffectNotification {
    effect: Observable<any> | (() => Observable<any>);
    propertyName: string;
    sourceName: string;
    sourceInstance: any;
    notification: Notification<Action | null | undefined>;
}
export declare function verifyOutput(output: EffectNotification, reporter: ErrorReporter): void;
