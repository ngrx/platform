import { Resource, untracked } from '@angular/core';
import { ERROR_EXTENSION_TYPE } from '../consts';
import { ResourceExtension } from '../models';
import { overrideHasValueOnError } from './utils';

/**
 * @experimental
 * @description
 *
 * Creates a resource extension that returns the last successfully resolved
 * value when the resource enters the error state, instead of throwing when
 * `value()` is read.
 *
 * @usageNotes
 *
 * ```ts
 * import { httpResource } from '@angular/common/http';
 * import {
 *   extendResource,
 *   withPreviousValueOnError,
 * } from '@ngrx/signals/resource';
 *
 * const todosResource = extendResource(
 *   httpResource<Todo[]>(() => `/api/todos`),
 *   withPreviousValueOnError()
 * );
 *
 * // If the request fails, `value()` returns whatever was successfully loaded
 * // before, rather than throwing an error.
 * ```
 */
export function withPreviousValueOnError<
  R extends Resource<unknown>,
>(): ResourceExtension<R> {
  return {
    type: ERROR_EXTENSION_TYPE,
    apply: (resource) => {
      let value = resource.hasValue() ? resource.value() : undefined;

      Object.defineProperty(resource, 'value', {
        value: new Proxy(resource.value, {
          apply(target, thisArg, args) {
            try {
              const result = Reflect.apply(target, thisArg, args);
              if (!untracked(resource.isLoading)) {
                value = result;
              }
              return result;
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
