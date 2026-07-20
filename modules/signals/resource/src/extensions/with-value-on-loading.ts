import { Resource, untracked } from '@angular/core';
import { LOADING_EXTENSION_TYPE } from '../consts';
import { ResourceExtension } from '../models';

/**
 * @experimental
 * @description
 *
 * Creates a resource extension that returns a specific fallback value while
 * the resource is loading, instead of resetting `value()` to `undefined`.
 *
 * @usageNotes
 *
 * ```ts
 * import { httpResource } from '@angular/common/http';
 * import { extendResource, withValueOnLoading } from '@ngrx/signals/resource';
 *
 * const todosResource = extendResource(
 *   httpResource<Todo[]>(() => `/api/todos`),
 *   withValueOnLoading([])
 * );
 *
 * // `value()` returns `[]` on initial load and on every subsequent reload.
 * ```
 */
export function withValueOnLoading<R extends Resource<unknown>>(
  value: R extends Resource<infer V> ? V : never
): ResourceExtension<R> {
  return {
    type: LOADING_EXTENSION_TYPE,
    apply: (resource) => {
      Object.defineProperty(resource, 'value', {
        value: new Proxy(resource.value, {
          apply(target, thisArg, args) {
            if (untracked(resource.isLoading)) {
              return value;
            }
            return Reflect.apply(target, thisArg, args);
          },
        }),
        configurable: true,
        enumerable: true,
        writable: true,
      });
    },
  };
}
