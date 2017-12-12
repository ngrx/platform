import { Tree } from '@angular-devkit/schematics';

export function createReducers(tree: Tree, path?: string) {
  tree.create(
    path || '/src/app/reducers/index.ts',
    `
    import {
      ActionReducer,
      ActionReducerMap,
      createFeatureSelector,
      createSelector,
      MetaReducer
    } from '@ngrx/store';
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
