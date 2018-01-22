import { Injectable } from '@angular/core';
import { ActionsSubject } from './actions_subject';
import { ActionReducer } from './models';
import { ReducerManager } from './reducer_manager';
import { State } from './state';
import { combineReducers, omit } from './utils';

export enum LocalStateActionTypes {
  Update = '@ngrx/store/local-state/update',
}

export interface LocalStateUpdateAction {
  type: LocalStateActionTypes.Update;
  name: string;
  reason: string;
  id: number;
  update: any;
}

export type LocalStoreOptions<T> = {
  name: string;
  initialState: T;
  reducer?: ActionReducer<T>;
};

function createLocalStateReducer(
  id: number,
  initialState: any,
  innerReducer: (state: any, action: any) => any = v => v
) {
  return function(state: any = initialState, action: LocalStateUpdateAction) {
    if (action.type === LocalStateActionTypes.Update && action.id === id) {
      return action.update;
    }

    return innerReducer(state, action);
  };
}

@Injectable()
export class LocalState<S> {
  private id: number;
  private reducerKey: string;
  private reducers: { [id: string]: ActionReducer<any, any> };

  constructor(
    private reducerManager: ReducerManager,
    private state: State<S>,
    private actionsSubject: ActionsSubject
  ) {
    this.id = 0;
    this.reducerKey = `local-states-${this.getCurrentTimestamp()}`;
    this.reducers = {};
  }

  private update() {
    this.reducerManager.addReducer(
      this.reducerKey,
      combineReducers(this.reducers)
    );
  }

  private getNextId() {
    return ++this.id;
  }

  private getCurrentTimestamp() {
    return Date.now();
  }

  createLocalStore<T>(options: LocalStoreOptions<T>) {
    const id = this.getNextId();
    const localStateKey = `${options.name} - ${id}`;
    const reducer = createLocalStateReducer(
      id,
      options.initialState,
      options.reducer
    );

    const selector = (state: S) =>
      (state as any)[this.reducerKey][localStateKey] as T;
    const dispose = () => {
      this.reducers = omit(this.reducers, localStateKey) as any;
      this.update();
    };
    const update = (reason: string, computeState: (localState: T) => T) => {
      const localState: T = selector(this.state.getValue());
      const nextLocalState = computeState(localState);
      const updateAction: LocalStateUpdateAction = {
        type: LocalStateActionTypes.Update,
        id,
        name: options.name,
        reason,
        update: nextLocalState,
      };

      this.actionsSubject.next(updateAction);
    };

    this.reducers = {
      ...this.reducers,
      [localStateKey]: reducer,
    };

    this.update();

    return {
      selector,
      update,
      dispose,
    };
  }
}
