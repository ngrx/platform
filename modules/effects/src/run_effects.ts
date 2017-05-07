import {
  APP_INITIALIZER,
  Provider,
  Optional,
  Type,
  Injector,
} from '@angular/core';
import { EffectsRunner } from './effects_runner';
import { EffectSources } from './effect_sources';
import { BOOTSTRAP_EFFECTS, ROOT_EFFECTS } from './tokens';

export function createRunEffects(
  effectSources: EffectSources,
  runner: EffectsRunner,
  rootEffects: any[],
) {
  return function() {
    runner.start();

    rootEffects.forEach(effectSourceInstance =>
      effectSources.addEffects(effectSourceInstance),
    );
  };
}

export const RUN_EFFECTS: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  deps: [EffectSources, EffectsRunner, ROOT_EFFECTS],
  useFactory: createRunEffects,
};
