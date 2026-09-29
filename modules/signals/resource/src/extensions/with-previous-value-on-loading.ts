import { Resource, untracked } from '@angular/core';
import { LOADING_EXTENSION_TYPE } from '../consts';
import { ResourceExtension } from '../models';

/**
 * @experimental
 * @description
 *
 * Creates a resource extension that keeps the last resolved value while the
 * resource is reloading, instead of resetting `value()` to `undefined`.
 *
 * @usageNotes
 *
 * ```ts
 * import { httpResource } from '@angular/common/http';
 * import {
 *   extendResource,
 *   withPreviousValueOnLoading,
 * } from '@ngrx/signals/resource';
 *
 * const todosResource = extendResource(
 *   httpResource<Todo[]>(() => `/api/todos?page=${this.page()}`),
 *   withPreviousValueOnLoading()
 * );
 *
 * // `value()` returns the previous page's data while the next page is loading,
 * // rather than `undefined`.
 * ```
 */
export function withPreviousValueOnLoading<
  R extends Resource<unknown>,
>(): ResourceExtension<R> {
  return {
    type: LOADING_EXTENSION_TYPE,
    apply: (resource) => {
      let value = resource.hasValue() ? resource.value() : undefined;

      Object.defineProperty(resource, 'value', {
        value: new Proxy(resource.value, {
          apply(target, thisArg, args) {
            if (!untracked(resource.isLoading)) {
              value = Reflect.apply(target, thisArg, args);
            }
            return value;
          },
        }),
        configurable: true,
        enumerable: true,
        writable: true,
      });
    },
  };
}
