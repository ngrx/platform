import { Resource, untracked } from '@angular/core';

export function overrideHasValueOnError(resource: Resource<unknown>): void {
  Object.defineProperty(resource, 'hasValue', {
    value: new Proxy(resource.hasValue, {
      apply(target, thisArg, args) {
        if (untracked(resource.status) === 'error') {
          return resource.value() !== undefined;
        }

        return Reflect.apply(target, thisArg, args);
      },
    }),
    configurable: true,
    enumerable: true,
    writable: true,
  });
}
