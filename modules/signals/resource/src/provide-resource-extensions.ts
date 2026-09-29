import { inject, InjectionToken, Provider, Resource } from '@angular/core';
import { ResourceExtension } from './models';

/**
 * @experimental
 * @description
 *
 * Injection token that holds the resource extensions registered for the
 * current injector scope via `provideResourceExtensions`.
 */
export const RESOURCE_EXTENSIONS = new InjectionToken<
  ResourceExtension<Resource<unknown>>[]
>(typeof ngDevMode !== 'undefined' && ngDevMode ? 'RESOURCE_EXTENSIONS' : '');

/**
 * @experimental
 * @description
 *
 * Registers resource extensions for a given injector scope (application,
 * route, or component). Any resource wrapped with `extendResource` within
 * that scope automatically has these extensions applied.
 *
 * The provider is scope-aware and composes with extensions registered by
 * parent injectors, so defaults can be layered at the application level and
 * refined at the route or component level without discarding the parent
 * configuration.
 *
 * @usageNotes
 *
 * ```ts
 * import { bootstrapApplication } from '@angular/platform-browser';
 * import {
 *   provideResourceExtensions,
 *   withValueOnError,
 * } from '@ngrx/signals/resource';
 *
 * bootstrapApplication(App, {
 *   providers: [provideResourceExtensions(withValueOnError(undefined))],
 * });
 * ```
 */
export function provideResourceExtensions(
  ...extensions: ResourceExtension<Resource<unknown>>[]
): Provider {
  return {
    provide: RESOURCE_EXTENSIONS,
    useFactory: () => {
      const parentExtensions =
        inject(RESOURCE_EXTENSIONS, {
          optional: true,
          skipSelf: true,
        }) ?? [];

      return [...parentExtensions, ...extensions];
    },
  };
}
