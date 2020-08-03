import { UnitTestTree } from '@angular-devkit/schematics/testing';

export function createReducers(
  tree: UnitTestTree,
  path?: string,
  project = 'bar'
) {
  tree.create(
    path || `/projects/${project}/src/app/reducers/index.ts`,
    `
    import {
      ActionReducer,
      ActionReducerMap,
      createFeatureSelector,
      createSelector,
      MetaReducer
    } from '@ngrx/${'store'}';
    import { environment } from '../../environments/environment';
    
    export interface State {
    
    }
    
    export const reducers: ActionReducerMap<State> = {
    
    };
    
    
    export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
  `
  );

  return tree;
}
