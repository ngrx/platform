import {
  Injector,
  ModuleWithProviders,
  NgModule,
  Optional,
  Self,
  SkipSelf,
  Type,
} from '@angular/core';
import { Actions } from './actions';
import { EffectSources } from './effect_sources';
import { EffectsFeatureModule } from './effects_feature_module';
import { defaultEffectsErrorHandler } from './effects_error_handler';
import { EffectsRootModule } from './effects_root_module';
import { EffectsRunner } from './effects_runner';
import {
  _FEATURE_EFFECTS,
  _ROOT_EFFECTS,
  _ROOT_EFFECTS_GUARD,
  EFFECTS_ERROR_HANDLER,
  FEATURE_EFFECTS,
  ROOT_EFFECTS,
  USER_PROVIDED_EFFECTS,
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
          provide: _FEATURE_EFFECTS,
          multi: true,
          useValue: featureEffects,
        },
        {
          provide: USER_PROVIDED_EFFECTS,
          multi: true,
          useValue: [],
        },
        {
          provide: FEATURE_EFFECTS,
          multi: true,
          useFactory: createEffects,
          deps: [Injector, _FEATURE_EFFECTS, USER_PROVIDED_EFFECTS],
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
          provide: EFFECTS_ERROR_HANDLER,
          useValue: defaultEffectsErrorHandler,
        },
        EffectsRunner,
        EffectSources,
        Actions,
        rootEffects,
        {
          provide: _ROOT_EFFECTS,
          useValue: [rootEffects],
        },
        {
          provide: _ROOT_EFFECTS_GUARD,
          useFactory: _provideForRootGuard,
          deps: [
            [EffectsRunner, new Optional(), new SkipSelf()],
            [_ROOT_EFFECTS, new Self()],
          ],
        },
        {
          provide: USER_PROVIDED_EFFECTS,
          multi: true,
          useValue: [],
        },
        {
          provide: ROOT_EFFECTS,
          useFactory: createEffects,
          deps: [Injector, _ROOT_EFFECTS, USER_PROVIDED_EFFECTS],
        },
      ],
    };
  }
}

export function createEffects(
  injector: Injector,
  effectGroups: Type<any>[][],
  userProvidedEffectGroups: Type<any>[][]
): any[] {
  const mergedEffects: Type<any>[] = [];

  for (const effectGroup of effectGroups) {
    mergedEffects.push(...effectGroup);
  }

  for (const userProvidedEffectGroup of userProvidedEffectGroups) {
    mergedEffects.push(...userProvidedEffectGroup);
  }

  return createEffectInstances(injector, mergedEffects);
}

export function createEffectInstances(
  injector: Injector,
  effects: Type<any>[]
): any[] {
  return effects.map((effect) => injector.get(effect));
}

export function _provideForRootGuard(
  runner: EffectsRunner,
  rootEffects: any[][]
): any {
  // check whether any effects are actually passed
  const hasEffects = !(rootEffects.length === 1 && rootEffects[0].length === 0);
  if (hasEffects && runner) {
    throw new TypeError(
      `EffectsModule.forRoot() called twice. Feature modules should use EffectsModule.forFeature() instead.`
    );
  }
  return 'guarded';
}
