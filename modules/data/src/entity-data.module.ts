import { ModuleWithProviders, NgModule } from '@angular/core';

import { EffectsModule, EffectSources } from '@ngrx/effects';

import { EntityCacheEffects } from './effects/entity-cache-effects';
import { EntityEffects } from './effects/entity-effects';

import { EntityDataModuleConfig } from './entity-data-config';
import {
  ENTITY_DATA_PROVIDERS,
  ENTITY_DATA_WITHOUT_EFFECTS_PROVIDERS,
  initializeEntityData,
  provideRootEntityData,
  provideRootEntityDataWithoutEffects,
} from './provide-entity-data';

/**
 * entity-data main module includes effects and HTTP data services
 * Configure with `forRoot`.
 * No `forFeature` yet.
 */
@NgModule({
  providers: [ENTITY_DATA_WITHOUT_EFFECTS_PROVIDERS, ENTITY_DATA_PROVIDERS],
})
export class EntityDataModule {
  static forRoot(
    config: EntityDataModuleConfig
  ): ModuleWithProviders<EntityDataModule> {
    return {
      ngModule: EntityDataModule,
      providers: [
        provideRootEntityDataWithoutEffects(config),
        provideRootEntityData(config),
      ],
    };
  }

  constructor() {
    initializeEntityData();
  }
}
