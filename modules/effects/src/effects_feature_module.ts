import { NgModule, Inject, Optional } from '@angular/core';
import { StoreRootModule, StoreFeatureModule, Store } from '@ngrx/store';
import { EffectsRootModule } from './effects_root_module';
import { FEATURE_EFFECTS } from './tokens';
import { getSourceForInstance } from './effects_metadata';

export const UPDATE_EFFECTS = '@ngrx/effects/update-effects';
export type UpdateEffects = {
  type: typeof UPDATE_EFFECTS;
  effects: string[];
};

@NgModule({})
export class EffectsFeatureModule {
  constructor(
    root: EffectsRootModule,
    store: Store<any>,
    @Inject(FEATURE_EFFECTS) effectSourceGroups: any[][],
    @Optional() storeRootModule: StoreRootModule,
    @Optional() storeFeatureModule: StoreFeatureModule
  ) {
    effectSourceGroups.forEach(group => {
      let effectSourceNames: string[] = [];

      group.forEach(effectSourceInstance => {
        root.addEffects(effectSourceInstance);

        const { constructor } = getSourceForInstance(effectSourceInstance);
        effectSourceNames.push(constructor.name);
      });

      store.dispatch(<UpdateEffects>{
        type: UPDATE_EFFECTS,
        effects: effectSourceNames,
      });
    });
  }
}
