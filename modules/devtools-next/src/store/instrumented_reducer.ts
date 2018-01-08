import { Action, ActionReducer, createSelector } from '@ngrx/store';
import { Actions, ActionTypes } from './actions';

export interface LiftedState {
  stateActionPairs: [any, Action][];
  currentIndex: number | null;
}

export const selectStateActionPairs = (state: LiftedState) =>
  state.stateActionPairs;
export const selectLastStateActionPair = createSelector(
  selectStateActionPairs,
  stateActionPairs => stateActionPairs[stateActionPairs.length - 1]
);
export const selectLastState = createSelector(
  selectLastStateActionPair,
  ([state]) => state
);
export const selectCurrentIndex = (state: LiftedState) => state.currentIndex;
export const selectCurrentState = createSelector(
  selectCurrentIndex,
  selectStateActionPairs,
  selectLastState,
  (currentIndex, stateActionPairs, lastState) => {
    return currentIndex !== null
      ? stateActionPairs[currentIndex][0]
      : lastState;
  }
);

export const instrument = (maxAge: number) => (
  state: LiftedState | undefined,
  action: Actions,
  reducer: ActionReducer<any>
): LiftedState => {
  if (state === undefined) {
    return {
      stateActionPairs: [reducer(undefined, action)],
      currentIndex: null,
    };
  }

  switch (action.type) {
    case ActionTypes.ImportState: {
      return {
        stateActionPairs: push(
          state.stateActionPairs,
          maxAge,
          createStateActionPair(action.state, action)
        ),
        currentIndex: null,
      };
    }

    case ActionTypes.Dispatch: {
      const nextState = reducer(selectLastState(state), action.action);

      return {
        stateActionPairs: push(
          state.stateActionPairs,
          maxAge,
          createStateActionPair(nextState, action)
        ),
        currentIndex: null,
      };
    }

    case ActionTypes.TimeTravel: {
      return {
        ...state,
        currentIndex: action.index,
      };
    }

    case ActionTypes.Resume: {
      return {
        ...state,
        currentIndex: null,
      };
    }

    case ActionTypes.Commit: {
      return {
        stateActionPairs: [
          createStateActionPair(selectLastState(state), action),
        ],
        currentIndex: null,
      };
    }

    default: {
      const nextState = reducer(selectLastState(state), action);

      return {
        stateActionPairs: push(
          state.stateActionPairs,
          maxAge,
          createStateActionPair(nextState, action)
        ),
        currentIndex:
          state.currentIndex !== null
            ? clamp(0, maxAge - 1, state.currentIndex - 1)
            : null,
      };
    }
  }
};

function clamp(min: number, max: number, value: number): number {
  return Math.max(min, Math.min(max, value));
}

function push<V>(items: V[], max: number, next: V): V[] {
  const result = [...items, next];

  if (result.length > max) {
    return result.slice(1);
  }

  return result;
}

function createStateActionPair(state: any, action: Action): [any, Action] {
  return [state, action];
}
