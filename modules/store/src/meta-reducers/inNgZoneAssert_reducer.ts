import * as ngCore from '@angular/core';
import { Action, ActionReducer } from '../models';
import { RUNTIME_CHECK_URL } from './utils';

export function inNgZoneAssertMetaReducer(
  reducer: ActionReducer<any, Action>,
  checks: { action: (action: Action) => boolean }
) {
  return function (state: any, action: Action) {
    if (checks.action(action) && !ngCore.NgZone.isInAngularZone()) {
      throw new Error(
        `Action '${action.type}' running outside NgZone. ${RUNTIME_CHECK_URL}#strictactionwithinngzone`
      );
    }
    return reducer(state, action);
  };
}
