import { NgModule, Inject, Optional } from '@angular/core';
import { Store, StoreRootModule, StoreFeatureModule } from '@ngrx/store';
import { FEATURE_EFFECTS_INIT } from './effects_actions';
import { EffectsRootModule } from './effects_root_module';
import { _FEATURE_EFFECTS_INSTANCE_GROUPS } from './tokens';

@NgModule({})
export class EffectsFeatureModule {
  constructor(
    effectsRootModule: EffectsRootModule,
    store: Store,
    @Inject(_FEATURE_EFFECTS_INSTANCE_GROUPS)
    effectsInstanceGroups: unknown[][],
    @Optional() storeRootModule: StoreRootModule,
    @Optional() storeFeatureModule: StoreFeatureModule
  ) {
    const effectsInstances = effectsInstanceGroups.flat();
    for (const effectsInstance of effectsInstances) {
      effectsRootModule.addEffects(effectsInstance);
    }

    store.dispatch({ type: FEATURE_EFFECTS_INIT });
  }
}
