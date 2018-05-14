import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '<%= environmentsPath %>';

export interface <%= classify(stateInterface) %> {

}

export const reducers: ActionReducerMap<<%= classify(stateInterface) %>> = {

};


export const metaReducers: MetaReducer<<%= classify(stateInterface) %>>[] = !environment.production ? [] : [];
