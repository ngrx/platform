import * as ngCore from '@angular/core';
import { ActionReducer } from '../models';

export function inNgZoneAssertMetaReducer(
  reducer: ActionReducer<any, any>,
  checks: { action: boolean }
) {
  return function(state: any, action: any) {
    if (checks.action && !ngCore.NgZone.isInAngularZone()) {
      throw new Error('Action not running in NgZone');
    }
    return reducer(state, action);
  };
}
