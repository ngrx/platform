import { createAction } from '@ngrx/store';

/**
 * Load Collection Action
 */
export const loadCollection = createAction('[Collection Page] Load Collection');

export type CollectionPageActionsUnion = ReturnType<typeof loadCollection>;
