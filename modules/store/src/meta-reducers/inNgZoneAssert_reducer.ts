import * as ngCore from '@angular/core';
import { ActionReducer, Action } from '../models';

export function inNgZoneAssertMetaReducer(
  reducer: ActionReducer<any, Action>,
  checks: { action: (action: Action) => boolean }
) {
  return function(state: any, action: Action) {
    if (checks.action(action) && !ngCore.NgZone.isInAngularZone()) {
      throw new Error(
        `strictActionWithinNgZone: Action '${
          action.type
        }' running outside NgZone.`
      );
    }
    return reducer(state, action);
  };
}
