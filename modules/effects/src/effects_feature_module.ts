import { NgModule, Inject, Type } from '@angular/core';
import { EffectsRootModule } from './effects_root_module';
import { FEATURE_EFFECTS } from './tokens';

@NgModule({})
export class EffectsFeatureModule {
  constructor(
    private root: EffectsRootModule,
    @Inject(FEATURE_EFFECTS) effectSourceGroups: any[][]
  ) {
    effectSourceGroups.forEach(group =>
      group.forEach(effectSourceInstance =>
        root.addEffects(effectSourceInstance)
      )
    );
  }
}
