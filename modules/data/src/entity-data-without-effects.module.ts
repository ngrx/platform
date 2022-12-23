import { ModuleWithProviders, NgModule } from '@angular/core';
import { EntityDataModuleConfig } from './entity-data-config';
import {
  BASE_ENTITY_DATA_PROVIDERS,
  provideEntityDataConfig,
} from './provide-entity-data';

/**
 * Module without effects or dataservices which means no HTTP calls
 * This module helpful for internal testing.
 * Also helpful for apps that handle server access on their own and
 * therefore opt-out of @ngrx/effects for entities
 */
@NgModule({
  providers: [BASE_ENTITY_DATA_PROVIDERS],
})
export class EntityDataModuleWithoutEffects {
  static forRoot(
    config: EntityDataModuleConfig
  ): ModuleWithProviders<EntityDataModuleWithoutEffects> {
    return {
      ngModule: EntityDataModuleWithoutEffects,
      providers: [provideEntityDataConfig(config)],
    };
  }
}
