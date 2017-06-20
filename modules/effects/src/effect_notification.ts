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

export function verifyOutput(output: EffectNotification, reporter: ErrorReporter) {
  reportErrorThrown(output, reporter);
  reportInvalidActions(output, reporter);
}

function reportErrorThrown(output: EffectNotification, reporter: ErrorReporter) {
  if (output.notification.kind === 'E') {
    const errorReason = `Effect ${getEffectName(output)} threw an error`;

    reporter.report(errorReason, {
      Source: output.sourceInstance,
      Effect: output.effect,
      Error: output.notification.error,
      Notification: output.notification,
    });
  }
}

function reportInvalidActions(output: EffectNotification, reporter: ErrorReporter) {
  if (output.notification.kind === 'N') {
    const action = output.notification.value;
    const isInvalidAction = !isAction(action);

    if (isInvalidAction) {
      const errorReason = `Effect ${getEffectName(output)} dispatched an invalid action`;

      reporter.report(errorReason, {
        Source: output.sourceInstance,
        Effect: output.effect,
        Dispatched: action,
        Notification: output.notification,
      });
    }
  }
}

function isAction(action: any): action is Action {
  return action && action.type && typeof action.type === 'string';
}

function getEffectName({ propertyName, sourceInstance, sourceName }: EffectNotification) {
  const isMethod = typeof sourceInstance[propertyName] === 'function';

  return `"${sourceName}.${propertyName}${isMethod ? '()' : ''}"`;
}
