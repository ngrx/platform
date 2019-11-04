import { ErrorHandler } from '@angular/core';
import { Action } from '@ngrx/store';
import { Notification, Observable } from 'rxjs';

export interface EffectNotification {
  effect: Observable<any> | (() => Observable<any>);
  propertyName: PropertyKey;
  sourceName: string;
  sourceInstance: any;
  notification: Notification<Action | null | undefined>;
}

export function reportInvalidActions(
  output: EffectNotification,
  reporter: ErrorHandler
) {
  if (output.notification.kind === 'N') {
    const action = output.notification.value;
    const isInvalidAction = !isAction(action);

    if (isInvalidAction) {
      reporter.handleError(
        new Error(
          `Effect ${getEffectName(
            output
          )} dispatched an invalid action: ${stringify(action)}`
        )
      );
    }
  }
}

function isAction(action: any): action is Action {
  return (
    typeof action !== 'function' &&
    action &&
    action.type &&
    typeof action.type === 'string'
  );
}

function getEffectName({
  propertyName,
  sourceInstance,
  sourceName,
}: EffectNotification) {
  const isMethod = typeof sourceInstance[propertyName] === 'function';

  return `"${sourceName}.${String(propertyName)}${isMethod ? '()' : ''}"`;
}

function stringify(action: Action | null | undefined) {
  try {
    return JSON.stringify(action);
  } catch {
    return action;
  }
}
