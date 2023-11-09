import { NgModule, Inject, Optional } from '@angular/core';
import { Store, StoreRootModule, StoreFeatureModule } from '@ngrx/store';
import { EffectsRunner } from './effects_runner';
import { EffectSources } from './effect_sources';
import {
  EFFECTS_ERROR_HANDLER,
  _ROOT_EFFECTS_GUARD,
  _ROOT_EFFECTS_INSTANCES,
} from './tokens';
import { ROOT_EFFECTS_INIT } from './effects_actions';
import { defaultEffectsErrorHandler } from './effects_error_handler';
import { Actions } from './actions';

@NgModule({
  providers: [
    EffectSources,
    EffectsRunner,
    Actions,
    {
      provide: EFFECTS_ERROR_HANDLER,
      useFactory: () => defaultEffectsErrorHandler,
    },
  ],
})
export class EffectsRootModule {
  constructor(
    private sources: EffectSources,
    runner: EffectsRunner,
    store: Store,
    @Inject(_ROOT_EFFECTS_INSTANCES) rootEffectsInstances: unknown[],
    @Optional() storeRootModule: StoreRootModule,
    @Optional() storeFeatureModule: StoreFeatureModule,
    @Optional()
    @Inject(_ROOT_EFFECTS_GUARD)
    guard: unknown
  ) {
    runner.start();

    for (const effectsInstance of rootEffectsInstances) {
      sources.addEffects(effectsInstance);
    }

    store.dispatch({ type: ROOT_EFFECTS_INIT });
  }

  addEffects(effectsInstance: unknown): void {
    this.sources.addEffects(effectsInstance);
  }
}
