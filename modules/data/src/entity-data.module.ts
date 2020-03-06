import { ModuleWithProviders, NgModule } from '@angular/core';

import { EffectsModule, EffectSources } from '@ngrx/effects';

import { DefaultDataServiceFactory } from './dataservices/default-data.service';

import {
  DefaultPersistenceResultHandler,
  PersistenceResultHandler,
} from './dataservices/persistence-result-handler.service';

import {
  DefaultHttpUrlGenerator,
  HttpUrlGenerator,
} from './dataservices/http-url-generator';

import { EntityCacheDataService } from './dataservices/entity-cache-data.service';
import { EntityCacheEffects } from './effects/entity-cache-effects';
import { EntityDataService } from './dataservices/entity-data.service';
import { EntityEffects } from './effects/entity-effects';

import { ENTITY_METADATA_TOKEN } from './entity-metadata/entity-metadata';

import {
  ENTITY_CACHE_META_REDUCERS,
  ENTITY_COLLECTION_META_REDUCERS,
} from './reducers/constants';
import { Pluralizer, PLURAL_NAMES_TOKEN } from './utils/interfaces';
import { DefaultPluralizer } from './utils/default-pluralizer';

import {
  EntityDataModuleConfig,
  EntityDataModuleWithoutEffects,
} from './entity-data-without-effects.module';

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
  providers: [
    DefaultDataServiceFactory,
    EntityCacheDataService,
    EntityDataService,
    EntityCacheEffects,
    EntityEffects,
    { provide: HttpUrlGenerator, useClass: DefaultHttpUrlGenerator },
    {
      provide: PersistenceResultHandler,
      useClass: DefaultPersistenceResultHandler,
    },
    { provide: Pluralizer, useClass: DefaultPluralizer },
  ],
})
export class EntityDataModule {
  static forRoot(
    config: EntityDataModuleConfig
  ): ModuleWithProviders<EntityDataModule> {
    return {
      ngModule: EntityDataModule,
      providers: [
        // TODO: Moved these effects classes up to EntityDataModule itself
        // Remove this comment if that was a mistake.
        // EntityCacheEffects,
        // EntityEffects,
        {
          provide: ENTITY_METADATA_TOKEN,
          multi: true,
          useValue: config.entityMetadata ? config.entityMetadata : [],
        },
        {
          provide: ENTITY_CACHE_META_REDUCERS,
          useValue: config.entityCacheMetaReducers
            ? config.entityCacheMetaReducers
            : [],
        },
        {
          provide: ENTITY_COLLECTION_META_REDUCERS,
          useValue: config.entityCollectionMetaReducers
            ? config.entityCollectionMetaReducers
            : [],
        },
        {
          provide: PLURAL_NAMES_TOKEN,
          multi: true,
          useValue: config.pluralNames ? config.pluralNames : {},
        },
      ],
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
