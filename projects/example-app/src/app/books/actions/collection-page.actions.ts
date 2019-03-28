import { createAction, union } from '@ngrx/store';

/**
 * Load Collection Action
 */
export const loadCollection = createAction('[Collection Page] Load Collection');

const all = union({ loadCollection });
export type CollectionPageActionsUnion = typeof all;
