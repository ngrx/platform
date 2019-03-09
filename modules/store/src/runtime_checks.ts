import { isDevMode, Provider } from '@angular/core';
import { stateSerializationCheckMetaReducer } from './meta-reducers';
import { RuntimeChecks, MetaReducer } from './models';
import {
  _USER_RUNTIME_CHECKS,
  _ACTIVE_RUNTIME_CHECKS,
  META_REDUCERS,
} from './tokens';

export function createActiveRuntimeChecks(
  runtimeChecks?: RuntimeChecks
): RuntimeChecks {
  if (isDevMode()) {
    return {
      strictStateSerializabilityChecks: true,
      ...runtimeChecks,
    };
  }

  return {
    strictStateSerializabilityChecks: false,
  };
}

export function createStateSerializationCheckMetaReducer({
  strictStateSerializabilityChecks: strictSerializabilityChecks,
}: RuntimeChecks): MetaReducer {
  return reducer =>
    strictSerializabilityChecks
      ? stateSerializationCheckMetaReducer(reducer)
      : reducer;
}

export function provideRuntimeChecks(
  runtimeChecks?: RuntimeChecks
): Provider[] {
  return [
    {
      provide: _USER_RUNTIME_CHECKS,
      useValue: runtimeChecks,
    },
    {
      provide: _ACTIVE_RUNTIME_CHECKS,
      deps: [_USER_RUNTIME_CHECKS],
      useFactory: createActiveRuntimeChecks,
    },
    {
      provide: META_REDUCERS,
      multi: true,
      deps: [_ACTIVE_RUNTIME_CHECKS],
      useFactory: createStateSerializationCheckMetaReducer,
    },
  ];
}
