import { inject, ModuleWithProviders, NgModule, Type } from '@angular/core';
import { EffectsFeatureModule } from './effects_feature_module';
import { EffectsRootModule } from './effects_root_module';
import { EffectsRunner } from './effects_runner';
import {
  _FEATURE_EFFECTS,
  _ROOT_EFFECTS,
  _ROOT_EFFECTS_GUARD,
  FEATURE_EFFECTS,
  ROOT_EFFECTS,
  USER_PROVIDED_EFFECTS,
} from './tokens';

@NgModule({})
export class EffectsModule {
  static forFeature(
    featureEffects: Type<unknown>[] = []
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
          deps: [_FEATURE_EFFECTS, USER_PROVIDED_EFFECTS],
        },
      ],
    };
  }

  static forRoot(
    rootEffects: Type<unknown>[] = []
  ): ModuleWithProviders<EffectsRootModule> {
    return {
      ngModule: EffectsRootModule,
      providers: [
        rootEffects,
        {
          provide: _ROOT_EFFECTS,
          useValue: [rootEffects],
        },
        {
          provide: _ROOT_EFFECTS_GUARD,
          useFactory: _provideForRootGuard,
        },
        {
          provide: USER_PROVIDED_EFFECTS,
          multi: true,
          useValue: [],
        },
        {
          provide: ROOT_EFFECTS,
          useFactory: createEffects,
          deps: [_ROOT_EFFECTS, USER_PROVIDED_EFFECTS],
        },
      ],
    };
  }
}

function createEffects(
  effectGroups: Type<unknown>[][],
  userProvidedEffectGroups: Type<unknown>[][]
): unknown[] {
  const mergedEffects: Type<unknown>[] = [];

  for (const effectGroup of effectGroups) {
    mergedEffects.push(...effectGroup);
  }

  for (const userProvidedEffectGroup of userProvidedEffectGroups) {
    mergedEffects.push(...userProvidedEffectGroup);
  }

  return createEffectInstances(mergedEffects);
}

function createEffectInstances(effects: Type<unknown>[]): unknown[] {
  return effects.map((effect) => inject(effect));
}

function _provideForRootGuard(): unknown {
  const runner = inject(EffectsRunner, { optional: true, skipSelf: true });
  const rootEffects = inject(_ROOT_EFFECTS, { self: true });

  // check whether any effects are actually passed
  const hasEffects = !(rootEffects.length === 1 && rootEffects[0].length === 0);
  if (hasEffects && runner) {
    throw new TypeError(
      `EffectsModule.forRoot() called twice. Feature modules should use EffectsModule.forFeature() instead.`
    );
  }
  return 'guarded';
}
