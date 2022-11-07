import { ModuleWithProviders, NgModule } from '@angular/core';

import { EntityDataModuleConfig } from './entity-data-config';
import { EntityDataModuleWithoutEffects } from './entity-data-without-effects.module';
import {
  ENTITY_DATA_PROVIDERS,
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
  imports: [EntityDataModuleWithoutEffects],
  providers: [ENTITY_DATA_PROVIDERS],
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
