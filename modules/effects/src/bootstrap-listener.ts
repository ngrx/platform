import { Injector, OpaqueToken } from '@angular/core';
import { EffectsSubscription } from './effects-subscription';


export const afterBootstrapEffects = new OpaqueToken('ngrx:effects: Bootstrap Effects');

export function runAfterBootstrapEffects(injector: Injector, subscription: EffectsSubscription) {
  return () => {
    const effectInstances = injector.get(afterBootstrapEffects, false);

    if (effectInstances) {
      subscription.addEffects(effectInstances);
    }
  };
}
