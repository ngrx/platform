import * as ngCore from '@angular/core';
import { ActionReducer } from '../models';

export function inNgZoneAssertMetaReducer(
  reducer: ActionReducer<any, any>,
  checks: { action: boolean }
) {
  return function(state: any, action: any) {
    if (checks.action && !ngCore.NgZone.isInAngularZone()) {
      throw new Error(
        'Action running outside of NgZone. ChangeDetection will not be run upon completion.'
      );
    }
    return reducer(state, action);
  };
}
