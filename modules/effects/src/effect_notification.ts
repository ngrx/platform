import { Observable } from 'rxjs/Observable';
import { Notification } from 'rxjs/Notification';
import { Action } from '@ngrx/store';
import {
  ErrorReporter,
  EffectError,
  InvalidActionError,
} from './error_reporter';

export interface EffectNotification {
  effect: Observable<any> | (() => Observable<any>);
  propertyName: string;
  sourceName: string;
  sourceInstance: any;
  notification: Notification<Action | null | undefined>;
}

export function verifyOutput(
  output: EffectNotification,
  reporter: ErrorReporter
) {
  reportErrorThrown(output, reporter);
  reportInvalidActions(output, reporter);
}

function reportErrorThrown(
  output: EffectNotification,
  reporter: ErrorReporter
) {
  if (output.notification.kind === 'E') {
    const errorReason = new Error(
      `Effect ${getEffectName(output)} threw an error`
    ) as EffectError;

    errorReason.Source = output.sourceInstance;
    errorReason.Effect = output.effect;
    errorReason.Error = output.notification.error;
    errorReason.Notification = output.notification;

    reporter.handleError(errorReason);
  }
}

function reportInvalidActions(
  output: EffectNotification,
  reporter: ErrorReporter
) {
  if (output.notification.kind === 'N') {
    const action = output.notification.value;
    const isInvalidAction = !isAction(action);

    if (isInvalidAction) {
      const errorReason = new Error(
        `Effect ${getEffectName(output)} dispatched an invalid action`
      ) as InvalidActionError;

      errorReason.Source = output.sourceInstance;
      errorReason.Effect = output.effect;
      errorReason.Dispatched = action;
      errorReason.Notification = output.notification;

      reporter.handleError(errorReason);
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
