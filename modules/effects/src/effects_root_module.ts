import { NgModule, Inject, Optional } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';
import { EffectsRunner } from './effects_runner';
import { EffectSources } from './effect_sources';
import { ROOT_EFFECTS } from './tokens';

export const ROOT_EFFECTS_INIT = '@ngrx/store/root effects init' as '@ngrx/store/root effects init';

@NgModule({})
export class EffectsRootModule {
  constructor(
    private sources: EffectSources,
    runner: EffectsRunner,
    store: Store<any>,
    @Inject(ROOT_EFFECTS) rootEffects: any[],
    @Optional() storeModule: StoreModule
  ) {
    runner.start();
    store.dispatch({ type: ROOT_EFFECTS_INIT });

    rootEffects.forEach(effectSourceInstance =>
      sources.addEffects(effectSourceInstance)
    );
  }

  addEffects(effectSourceInstance: any) {
    this.sources.addEffects(effectSourceInstance);
  }
}
