import { isDevMode } from '@angular/core';
import { IdSelector } from './models';

export function selectIdValue<T>(entity: T, selectId: IdSelector<T>) {
  const key = selectId(entity);

  if (isDevMode() && key === undefined) {
    console.warn(
      '@ngrx/entity: The entity passed to the `selectId` implementation returned undefined.',
      'You should probably provide your own `selectId` implementation.',
      'The entity that was passed:',
      entity,
      'The `selectId` implementation:',
      selectId.toString()
    );
  }

  return key;
}
