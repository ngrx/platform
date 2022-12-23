import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  Type,
} from '@angular/core';
import {
  FEATURE_STATE_PROVIDER,
  ROOT_STORE_PROVIDER,
  Store,
} from '@ngrx/store';
import { EffectsRunner } from './effects_runner';
import { EffectSources } from './effect_sources';
import { rootEffectsInit as effectsInit } from './effects_actions';

/**
 * Runs the provided effects.
 * Can be called at the root and feature levels.
 */
export function provideEffects(effects: Type<unknown>[]): EnvironmentProviders;
/**
 * Runs the provided effects.
 * Can be called at the root and feature levels.
 */
export function provideEffects(
  ...effects: Type<unknown>[]
): EnvironmentProviders;
/**
 * @usageNotes
 *
 * ### Providing effects at the root level
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideEffects(RouterEffects)],
 * });
 * ```
 *
 * ### Providing effects at the feature level
 *
 * ```ts
 * const booksRoutes: Route[] = [
 *   {
 *     path: '',
 *     providers: [provideEffects(BooksApiEffects)],
 *     children: [
 *       { path: '', component: BookListComponent },
 *       { path: ':id', component: BookDetailsComponent },
 *     ],
 *   },
 * ];
 * ```
 */
export function provideEffects(
  ...effects: Type<unknown>[] | Type<unknown>[][]
): EnvironmentProviders {
  const effectsFlattened = effects.flat();
  return makeEnvironmentProviders([
    effectsFlattened,
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        inject(ROOT_STORE_PROVIDER);
        inject(FEATURE_STATE_PROVIDER, { optional: true });

        const effectsRunner = inject(EffectsRunner);
        const effectSources = inject(EffectSources);
        const shouldInitEffects = !effectsRunner.isStarted;

        if (shouldInitEffects) {
          effectsRunner.start();
        }

        for (const effectsClass of effectsFlattened) {
          const effectsInstance = inject(effectsClass);
          effectSources.addEffects(effectsInstance);
        }

        if (shouldInitEffects) {
          const store = inject(Store);
          store.dispatch(effectsInit());
        }
      },
    },
  ]);
}
