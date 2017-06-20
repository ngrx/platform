import { Observable } from 'rxjs/Observable';
import { getSourceForInstance } from './effects_metadata';
import { EffectNotification } from './effect_notification';

export interface OnRunEffects {
  ngrxOnRunEffects(
    resolvedEffects$: Observable<EffectNotification>,
  ): Observable<EffectNotification>;
}

const onRunEffectsKey: keyof OnRunEffects = 'ngrxOnRunEffects';

export function isOnRunEffects(
  sourceInstance: Object,
): sourceInstance is OnRunEffects {
  const source = getSourceForInstance(sourceInstance);

  return (
    onRunEffectsKey in source && typeof source[onRunEffectsKey] === 'function'
  );
}
