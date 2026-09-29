import { inject, Resource } from '@angular/core';
import { ResourceExtension } from './models';
import { RESOURCE_EXTENSIONS } from './provide-resource-extensions';

/**
 * @experimental
 * @description
 *
 * Applies extensions to a resource and returns it with its original type
 * preserved.
 *
 * Extensions registered for the current injector scope via
 * `provideResourceExtensions` are applied first, followed by the extensions
 * passed as arguments. When multiple extensions share the same `type`, the
 * last one wins.
 *
 * @usageNotes
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { httpResource } from '@angular/common/http';
 * import {
 *   extendResource,
 *   withPreviousValueOnLoading,
 *   withValueOnError,
 * } from '@ngrx/signals/resource';
 *
 * \@Component({
 *   // ...
 * })
 * export class TodoList {
 *   readonly todosResource = extendResource(
 *     httpResource<Todo[]>(() => `/api/todos`),
 *     withPreviousValueOnLoading(),
 *     withValueOnError(undefined)
 *   );
 * }
 * ```
 *
 * When global extensions are registered, passing the resource alone is enough
 * to apply them:
 *
 * ```ts
 * readonly todosResource = extendResource(
 *   httpResource<Todo[]>(() => `/api/todos`)
 * );
 * ```
 */
export function extendResource<R extends Resource<unknown>>(
  resource: R,
  ...extensions: ResourceExtension<NoInfer<R>>[]
): R {
  const providedExtensions =
    inject(RESOURCE_EXTENSIONS, { optional: true }) ?? [];
  const allExtensions = [...providedExtensions, ...extensions];
  const uniqueExtensions = new Map(
    allExtensions.map((ext) => [ext.type, ext])
  ).values();

  for (const extension of uniqueExtensions) {
    extension.apply(resource);
  }

  return resource;
}
