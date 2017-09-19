import { NgModule, Inject, Optional } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsRootModule } from './effects_root_module';
import { FEATURE_EFFECTS } from './tokens';

@NgModule({})
export class EffectsFeatureModule {
  constructor(
    private root: EffectsRootModule,
    @Inject(FEATURE_EFFECTS) effectSourceGroups: any[][],
    @Optional() storeModule: StoreModule
  ) {
    effectSourceGroups.forEach(group =>
      group.forEach(effectSourceInstance =>
        root.addEffects(effectSourceInstance)
      )
    );
  }
}
