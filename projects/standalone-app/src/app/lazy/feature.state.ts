import {
  createActionGroup,
  createFeature,
  createReducer,
  emptyProps,
} from '@ngrx/store';

export const FeatureActions = createActionGroup({
  source: 'Feature Page',
  events: {
    init: emptyProps(),
  },
});

export interface FeatureState {
  loaded: boolean;
}

export const initialState: FeatureState = {
  loaded: true,
};

export const feature = createFeature({
  name: 'feature',
  reducer: createReducer(initialState),
});
