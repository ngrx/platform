import { NgModule, Inject, Type } from '@angular/core';
import { EffectSources } from './effect_sources';
import { FEATURE_EFFECTS } from './tokens';

@NgModule({})
export class EffectsFeatureModule {
  constructor(
    private effectSources: EffectSources,
    @Inject(FEATURE_EFFECTS) effectSourceGroups: any[][],
  ) {
    effectSourceGroups.forEach(group =>
      group.forEach(effectSourceInstance =>
        effectSources.addEffects(effectSourceInstance),
      ),
    );
  }
}
