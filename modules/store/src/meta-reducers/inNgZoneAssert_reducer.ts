import * as ngCore from '@angular/core';
import { ActionReducer, Action } from '../models';

export function inNgZoneAssertMetaReducer(
  reducer: ActionReducer<any, Action>,
  checks: { action: (action: Action) => boolean }
) {
  return function(state: any, action: Action) {
    if (checks.action(action) && !ngCore.NgZone.isInAngularZone()) {
      throw new Error(
        `Action '${
          action.type
        }' running outside NgZone. ChangeDetection will not be triggered by any event in this call stack.`
      );
    }
    return reducer(state, action);
  };
}
