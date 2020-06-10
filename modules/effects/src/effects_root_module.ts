import { NgModule, Inject, Optional } from '@angular/core';
import {
  createAction,
  StoreModule,
  Store,
  StoreRootModule,
  StoreFeatureModule,
} from '@ngrx/store';
import { EffectsRunner } from './effects_runner';
import { EffectSources } from './effect_sources';
import { ROOT_EFFECTS, _ROOT_EFFECTS_GUARD } from './tokens';

export const ROOT_EFFECTS_INIT = '@ngrx/effects/init';
export const rootEffectsInit = createAction(ROOT_EFFECTS_INIT);

@NgModule({})
export class EffectsRootModule {
  constructor(
    private sources: EffectSources,
    runner: EffectsRunner,
    store: Store<any>,
    @Inject(ROOT_EFFECTS) rootEffects: any[],
    @Optional() storeRootModule: StoreRootModule,
    @Optional() storeFeatureModule: StoreFeatureModule,
    @Optional()
    @Inject(_ROOT_EFFECTS_GUARD)
    guard: any
  ) {
    runner.start();

    rootEffects.forEach((effectSourceInstance) =>
      sources.addEffects(effectSourceInstance)
    );

    store.dispatch({ type: ROOT_EFFECTS_INIT });
  }

  addEffects(effectSourceInstance: any) {
    this.sources.addEffects(effectSourceInstance);
  }
}
