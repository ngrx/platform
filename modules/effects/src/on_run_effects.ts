import { Observable } from 'rxjs';

import { EffectNotification } from './effect_notification';
import { getSourceForInstance } from './effects_metadata';

export interface OnRunEffects {
  ngrxOnRunEffects(
    resolvedEffects$: Observable<EffectNotification>
  ): Observable<EffectNotification>;
}

const onRunEffectsKey: keyof OnRunEffects = 'ngrxOnRunEffects';

export function isOnRunEffects(
  sourceInstance: Object
): sourceInstance is OnRunEffects {
  const source = getSourceForInstance(sourceInstance);

  return (
    onRunEffectsKey in source && typeof source[onRunEffectsKey] === 'function'
  );
}
