import { Resource, untracked } from '@angular/core';
import { ERROR_EXTENSION_TYPE } from '../consts';
import { ResourceExtension } from '../models';
import { overrideHasValueOnError } from './utils';

/**
 * @experimental
 * @description
 *
 * Creates a resource extension that returns a specific fallback value when the
 * resource enters the error state, instead of throwing when `value()` is read.
 *
 * @usageNotes
 *
 * ```ts
 * import { httpResource } from '@angular/common/http';
 * import { extendResource, withValueOnError } from '@ngrx/signals/resource';
 *
 * const todosResource = extendResource(
 *   httpResource<Todo[]>(() => `/api/todos`),
 *   withValueOnError([])
 * );
 *
 * // If the request fails, `value()` returns `[]` instead of throwing.
 * ```
 */
export function withValueOnError<R extends Resource<unknown>>(
  value: R extends Resource<infer V> ? V : never
): ResourceExtension<R> {
  return {
    type: ERROR_EXTENSION_TYPE,
    apply: (resource) => {
      Object.defineProperty(resource, 'value', {
        value: new Proxy(resource.value, {
          apply(target, thisArg, args) {
            try {
              return Reflect.apply(target, thisArg, args);
            } catch (error) {
              if (untracked(resource.status) === 'error') {
                return value;
              }
              throw error;
            }
          },
        }),
        configurable: true,
        enumerable: true,
        writable: true,
      });

      overrideHasValueOnError(resource);
    },
  };
}
