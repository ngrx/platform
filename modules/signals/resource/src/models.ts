import { Resource } from '@angular/core';

/**
 * @experimental
 */
export type ResourceExtension<R extends Resource<unknown>> = {
  type: symbol;
  apply: (resource: R) => void;
};
