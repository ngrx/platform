import {
  NgModule,
  ModuleWithProviders,
  Type,
  Optional,
  SkipSelf,
} from '@angular/core';
import { EffectSources } from './effect_sources';
import { Actions } from './actions';
import { ROOT_EFFECTS, FEATURE_EFFECTS, _ROOT_EFFECTS_GUARD } from './tokens';
import { EffectsFeatureModule } from './effects_feature_module';
import { EffectsRootModule } from './effects_root_module';
import { EffectsRunner } from './effects_runner';

@NgModule({})
export class EffectsModule {
  static forFeature(
    featureEffects: Type<any>[]
  ): ModuleWithProviders<EffectsFeatureModule> {
    return {
      ngModule: EffectsFeatureModule,
      providers: [
        featureEffects,
        {
          provide: FEATURE_EFFECTS,
          multi: true,
          deps: featureEffects,
          useFactory: createSourceInstances,
        },
      ],
    };
  }

  static forRoot(
    rootEffects: Type<any>[]
  ): ModuleWithProviders<EffectsRootModule> {
    return {
      ngModule: EffectsRootModule,
      providers: [
        {
          provide: _ROOT_EFFECTS_GUARD,
          useFactory: _provideForRootGuard,
          deps: [[EffectsRunner, new Optional(), new SkipSelf()]],
        },
        EffectsRunner,
        EffectSources,
        Actions,
        rootEffects,
        {
          provide: ROOT_EFFECTS,
          deps: rootEffects,
          useFactory: createSourceInstances,
        },
      ],
    };
  }
}

export function createSourceInstances(...instances: any[]) {
  return instances;
}

export function _provideForRootGuard(runner: EffectsRunner): any {
  if (runner) {
    throw new TypeError(
      `EffectsModule.forRoot() called twice. Feature modules should use EffectsModule.forFeature() instead.`
    );
  }
  return 'guarded';
}
