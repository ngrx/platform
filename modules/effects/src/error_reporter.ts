import {
  ErrorHandler,
  Injectable,
  InjectionToken,
  Inject,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Notification } from 'rxjs/Notification';
import { Action } from '@ngrx/store';
import { CONSOLE } from './tokens';

export interface EffectError extends Error {
  Source: any;
  Effect: Observable<any> | (() => Observable<any>);
  Error: any;
  Notification: Notification<Action | null | undefined>;
}

export interface InvalidActionError extends Error {
  Source: any;
  Effect: Observable<any> | (() => Observable<any>);
  Dispatched: Action | null | undefined;
  Notification: Notification<Action | null | undefined>;
}

@Injectable()
export class ErrorReporter implements ErrorHandler {
  constructor(@Inject(CONSOLE) private console: any) {}

  handleError(error: any): void {
    this.console.group(error.message);

    for (let key in error) {
      this.console.error(`${key}:`, error[key]);
    }

    this.console.groupEnd();
  }
}
