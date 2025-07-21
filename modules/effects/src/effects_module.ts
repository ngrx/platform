import {
  inject,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  Type,
} from '@angular/core';
import { EffectsFeatureModule } from './effects_feature_module';
import { EffectsRootModule } from './effects_root_module';
import { EffectsRunner } from './effects_runner';
import {
  _FEATURE_EFFECTS,
  _ROOT_EFFECTS,
  _ROOT_EFFECTS_GUARD,
  _FEATURE_EFFECTS_INSTANCE_GROUPS,
  _ROOT_EFFECTS_INSTANCES,
  USER_PROVIDED_EFFECTS,
} from './tokens';
import { FunctionalEffect } from './models';
import { getClasses, isToken } from './utils';

/**
 * @public
 */
@NgModule({})
export class EffectsModule {
  static forFeature(
    featureEffects: Array<Type<unknown> | Record<string, FunctionalEffect>>
  ): ModuleWithProviders<EffectsFeatureModule>;
  static forFeature(
    ...featureEffects: Array<Type<unknown> | Record<string, FunctionalEffect>>
  ): ModuleWithProviders<EffectsFeatureModule>;
  static forFeature(
    ...featureEffects:
      | Array<Type<unknown> | Record<string, FunctionalEffect>>
      | [Array<Type<unknown> | Record<string, FunctionalEffect>>]
  ): ModuleWithProviders<EffectsFeatureModule> {
    const effects = featureEffects.flat();
    const effectsClasses = getClasses(effects);
    return {
      ngModule: EffectsFeatureModule,
      providers: [
        effectsClasses,
        {
          provide: _FEATURE_EFFECTS,
          multi: true,
          useValue: effects,
        },
        {
          provide: USER_PROVIDED_EFFECTS,
          multi: true,
          useValue: [],
        },
        {
          provide: _FEATURE_EFFECTS_INSTANCE_GROUPS,
          multi: true,
          useFactory: createEffectsInstances,
          deps: [_FEATURE_EFFECTS, USER_PROVIDED_EFFECTS],
        },
      ],
    };
  }

  static forRoot(
    rootEffects: Array<Type<unknown> | Record<string, FunctionalEffect>>
  ): ModuleWithProviders<EffectsRootModule>;
  static forRoot(
    ...rootEffects: Array<Type<unknown> | Record<string, FunctionalEffect>>
  ): ModuleWithProviders<EffectsRootModule>;
  static forRoot(
    ...rootEffects:
      | Array<Type<unknown> | Record<string, FunctionalEffect>>
      | [Array<Type<unknown> | Record<string, FunctionalEffect>>]
  ): ModuleWithProviders<EffectsRootModule> {
    const effects = rootEffects.flat();
    const effectsClasses = getClasses(effects);
    return {
      ngModule: EffectsRootModule,
      providers: [
        effectsClasses,
        {
          provide: _ROOT_EFFECTS,
          useValue: [effects],
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
          provide: _ROOT_EFFECTS_INSTANCES,
          useFactory: createEffectsInstances,
          deps: [_ROOT_EFFECTS, USER_PROVIDED_EFFECTS],
        },
      ],
    };
  }
}

function createEffectsInstances(
  effectsGroups: Array<Type<unknown> | Record<string, FunctionalEffect>>[],
  userProvidedEffectsGroups: Array<Type<unknown> | InjectionToken<unknown>>[]
): unknown[] {
  const effects: Array<
    Type<unknown> | Record<string, FunctionalEffect> | InjectionToken<unknown>
  > = [];

  for (const effectsGroup of effectsGroups) {
    effects.push(...effectsGroup);
  }

  for (const userProvidedEffectsGroup of userProvidedEffectsGroups) {
    effects.push(...userProvidedEffectsGroup);
  }

  return effects.map((effectsTokenOrRecord) =>
    isToken(effectsTokenOrRecord)
      ? inject(effectsTokenOrRecord)
      : effectsTokenOrRecord
  );
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
