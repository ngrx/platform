import {
  Injector,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
  Type,
} from '@angular/core';
import { Actions } from './actions';
import { EffectSources } from './effect_sources';
import { Actions } from './actions';
import {
  _FEATURE_EFFECTS,
  _ROOT_EFFECTS,
  _ROOT_EFFECTS_GUARD,
  FEATURE_EFFECTS,
  ROOT_EFFECTS,
  USER_PROVIDED_FEATURE_EFFECTS,
  USER_PROVIDED_ROOT_EFFECTS,
} from './tokens';
import { EffectsFeatureModule } from './effects_feature_module';
import { defaultEffectsErrorHandler } from './effects_error_handler';
import { EffectsRootModule } from './effects_root_module';
import { EffectsRunner } from './effects_runner';
import {
  _ROOT_EFFECTS_GUARD,
  EFFECTS_ERROR_HANDLER,
  FEATURE_EFFECTS,
  ROOT_EFFECTS,
} from './tokens';

@NgModule({})
export class EffectsModule {
  static forFeature(
    featureEffects: Type<any>[] = []
  ): ModuleWithProviders<EffectsFeatureModule> {
    return {
      ngModule: EffectsFeatureModule,
      providers: [
        featureEffects,
        {
          provide: USER_PROVIDED_FEATURE_EFFECTS,
          multi: true,
          useValue: [],
        },
        {
          provide: _FEATURE_EFFECTS,
          useValue: featureEffects,
        },
        {
          provide: FEATURE_EFFECTS,
          multi: true,
          useFactory: createEffects,
          deps: [Injector, _FEATURE_EFFECTS, USER_PROVIDED_FEATURE_EFFECTS],
        },
      ],
    };
  }

  static forRoot(
    rootEffects: Type<any>[] = []
  ): ModuleWithProviders<EffectsRootModule> {
    return {
      ngModule: EffectsRootModule,
      providers: [
        {
          provide: _ROOT_EFFECTS_GUARD,
          useFactory: _provideForRootGuard,
          deps: [[EffectsRunner, new Optional(), new SkipSelf()]],
        },
        {
          provide: EFFECTS_ERROR_HANDLER,
          useValue: defaultEffectsErrorHandler,
        },
        EffectsRunner,
        EffectSources,
        Actions,
        rootEffects,
        {
          provide: USER_PROVIDED_ROOT_EFFECTS,
          multi: true,
          useValue: [],
        },
        {
          provide: _ROOT_EFFECTS,
          useValue: rootEffects,
        },
        {
          provide: ROOT_EFFECTS,
          useFactory: createEffects,
          deps: [Injector, _ROOT_EFFECTS, USER_PROVIDED_ROOT_EFFECTS],
        },
      ],
    };
  }
}

export function createEffects(
  injector: Injector,
  effects: Type<any>[],
  userProvidedEffectGroups: Type<any>[][]
): any[] {
  const mergedEffects: Type<any>[] = effects;
  for (let userProvidedEffectGroup of userProvidedEffectGroups) {
    mergedEffects.push(...userProvidedEffectGroup);
  }
  return createEffectInstances(injector, mergedEffects);
}

export function createEffectInstances(
  injector: Injector,
  effects: Type<any>[]
): any[] {
  return effects.map(effect => injector.get(effect));
}

export function _provideForRootGuard(runner: EffectsRunner): any {
  if (runner) {
    throw new TypeError(
      `EffectsModule.forRoot() called twice. Feature modules should use EffectsModule.forFeature() instead.`
    );
  }
  return 'guarded';
}
