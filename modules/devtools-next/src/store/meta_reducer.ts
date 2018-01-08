import { MetaReducer } from '@ngrx/store';
import { ActionTypes, Actions } from './actions';
import { StoreState } from './store_state';
import {
  LiftedState,
  instrument,
  selectCurrentState,
} from './instrumented_reducer';

export function createMetaReducer(
  storeState: StoreState,
  maxAge: number
): MetaReducer<any> {
  const instrumentedReducer = instrument(maxAge);

  return reducer => (state: any, action: Actions) => {
    const nextState = instrumentedReducer(
      storeState.getCurrentState(),
      action,
      reducer
    );

    try {
      return selectCurrentState(nextState);
    } finally {
      storeState.setNextState(nextState);
    }
  };
}
