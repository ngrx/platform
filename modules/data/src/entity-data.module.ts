import { ModuleWithProviders, NgModule } from '@angular/core';

import { EffectsModule, EffectSources } from '@ngrx/effects';

import { EntityCacheEffects } from './effects/entity-cache-effects';
import { EntityEffects } from './effects/entity-effects';

import { EntityDataModuleWithoutEffects } from './entity-data-without-effects.module';
import {
  EntityDataModuleConfig,
  _provideEntityData,
} from './provide_entity_data';

/**
 * entity-data main module includes effects and HTTP data services
 * Configure with `forRoot`.
 * No `forFeature` yet.
 */
@NgModule({
  imports: [
    EntityDataModuleWithoutEffects,
    EffectsModule, // do not supply effects because can't replace later
  ],
})
export class EntityDataModule {
  static forRoot(
    config: EntityDataModuleConfig
  ): ModuleWithProviders<EntityDataModule> {
    return {
      ngModule: EntityDataModule,
      providers: [..._provideEntityData(config)],
    };
  }

  constructor(
    private effectSources: EffectSources,
    entityCacheEffects: EntityCacheEffects,
    entityEffects: EntityEffects
  ) {
    // We can't use `forFeature()` because, if we did, the developer could not
    // replace the entity-data `EntityEffects` with a custom alternative.
    // Replacing that class is an extensibility point we need.
    //
    // The FEATURE_EFFECTS token is not exposed, so can't use that technique.
    // Warning: this alternative approach relies on an undocumented API
    // to add effect directly rather than through `forFeature()`.
    // The danger is that EffectsModule.forFeature evolves and we no longer perform a crucial step.
    this.addEffects(entityCacheEffects);
    this.addEffects(entityEffects);
  }

  /**
   * Add another class instance that contains effects.
   * @param effectSourceInstance a class instance that implements effects.
   * Warning: undocumented @ngrx/effects API
   */
  addEffects(effectSourceInstance: any) {
    this.effectSources.addEffects(effectSourceInstance);
  }
}
