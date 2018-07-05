import { Observable } from 'rxjs';

import { EffectNotification } from './effect_notification';
import { getSourceForInstance } from './effects_metadata';

export type onRunEffectsFn = (
  resolvedEffects$: Observable<EffectNotification>
) => Observable<EffectNotification>;

export interface OnRunEffects {
  ngrxOnRunEffects: onRunEffectsFn;
}

export const onRunEffectsKey: keyof OnRunEffects = 'ngrxOnRunEffects';

export function isOnRunEffects(sourceInstance: {
  [onRunEffectsKey]?: onRunEffectsFn;
}): sourceInstance is OnRunEffects {
  const source = getSourceForInstance(sourceInstance);

  return (
    onRunEffectsKey in source && typeof source[onRunEffectsKey] === 'function'
  );
}
