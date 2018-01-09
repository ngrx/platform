import { Observable } from 'rxjs/Observable';
import { Notification } from 'rxjs/Notification';
import { Action } from '@ngrx/store';
import { ErrorHandler } from '@angular/core';

export interface EffectNotification {
  effect: Observable<any> | (() => Observable<any>);
  propertyName: string;
  sourceName: string;
  sourceInstance: any;
  notification: Notification<Action | null | undefined>;
}

export function verifyOutput(
  output: EffectNotification,
  reporter: ErrorHandler
) {
  reportErrorThrown(output, reporter);
  reportInvalidActions(output, reporter);
}

function reportErrorThrown(output: EffectNotification, reporter: ErrorHandler) {
  if (output.notification.kind === 'E') {
    reporter.handleError(output.notification.error);
  }
}

function reportInvalidActions(
  output: EffectNotification,
  reporter: ErrorHandler
) {
  if (output.notification.kind === 'N') {
    const action = output.notification.value;
    const isInvalidAction = !isAction(action);

    if (isInvalidAction) {
      reporter.handleError(
        new Error(
          `Effect ${getEffectName(output)} dispatched an invalid action: ${
            action
          }`
        )
      );
    }
  }
}

function isAction(action: any): action is Action {
  return action && action.type && typeof action.type === 'string';
}

function getEffectName({
  propertyName,
  sourceInstance,
  sourceName,
}: EffectNotification) {
  const isMethod = typeof sourceInstance[propertyName] === 'function';

  return `"${sourceName}.${propertyName}${isMethod ? '()' : ''}"`;
}
