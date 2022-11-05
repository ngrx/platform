import { UnitTestTree } from '@angular-devkit/schematics/testing';

export function createReducers(
  tree: UnitTestTree,
  path?: string,
  project = 'bar'
) {
  tree.create(
    path || `/projects/${project}/src/app/reducers/index.ts`,
    `
    import { isDevMode } from '@angular/core';
    import {
      ActionReducer,
      ActionReducerMap,
      createFeatureSelector,
      createSelector,
      MetaReducer
    } from '@ngrx/${'store'}';

    export interface State {

    }

    export const reducers: ActionReducerMap<State> = {

    };


    export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
  `
  );

  return tree;
}
