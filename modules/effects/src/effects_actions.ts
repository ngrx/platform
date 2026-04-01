import { createAction } from '@ngrx/store';

export const ROOT_EFFECTS_INIT = '@ngrx/effects/init';
export const rootEffectsInit = createAction(ROOT_EFFECTS_INIT);

export const FEATURE_EFFECTS_INIT = '@ngrx/effects/feature/init';
export const featureEffectsInit = createAction(FEATURE_EFFECTS_INIT);
