import { NgModule, Inject, Optional } from '@angular/core';
import { StoreRootModule, StoreFeatureModule } from '@ngrx/store';
import { EffectsRootModule } from './effects_root_module';
import { _FEATURE_EFFECTS_INSTANCE_GROUPS } from './tokens';

/**
 * @public
 */
@NgModule({})
export class EffectsFeatureModule {
  constructor(
    effectsRootModule: EffectsRootModule,
    @Inject(_FEATURE_EFFECTS_INSTANCE_GROUPS)
    effectsInstanceGroups: unknown[][],
    @Optional() storeRootModule: StoreRootModule,
    @Optional() storeFeatureModule: StoreFeatureModule
  ) {
    const effectsInstances = effectsInstanceGroups.flat();
    for (const effectsInstance of effectsInstances) {
      effectsRootModule.addEffects(effectsInstance);
    }
  }
}
