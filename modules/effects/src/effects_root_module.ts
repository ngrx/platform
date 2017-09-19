import { NgModule, Inject, Optional } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsRunner } from './effects_runner';
import { EffectSources } from './effect_sources';
import { ROOT_EFFECTS } from './tokens';

@NgModule({})
export class EffectsRootModule {
  constructor(
    private sources: EffectSources,
    runner: EffectsRunner,
    @Inject(ROOT_EFFECTS) rootEffects: any[],
    @Optional() storeModule: StoreModule
  ) {
    runner.start();

    rootEffects.forEach(effectSourceInstance =>
      sources.addEffects(effectSourceInstance)
    );
  }

  addEffects(effectSourceInstance: any) {
    this.sources.addEffects(effectSourceInstance);
  }
}
