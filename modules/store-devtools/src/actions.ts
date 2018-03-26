import { Action } from '@ngrx/store';

export const PERFORM_ACTION = 'PERFORM_ACTION';
export const RESET = 'RESET';
export const ROLLBACK = 'ROLLBACK';
export const COMMIT = 'COMMIT';
export const SWEEP = 'SWEEP';
export const TOGGLE_ACTION = 'TOGGLE_ACTION';
export const SET_ACTIONS_ACTIVE = 'SET_ACTIONS_ACTIVE';
export const JUMP_TO_STATE = 'JUMP_TO_STATE';
export const JUMP_TO_ACTION = 'JUMP_TO_ACTION';
export const IMPORT_STATE = 'IMPORT_STATE';

export class PerformAction implements Action {
  readonly type = PERFORM_ACTION;

  constructor(public action: Action, public timestamp: number) {
    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
          'Have you misspelled a constant?'
      );
    }
  }
}

export class Reset implements Action {
  readonly type = RESET;

  constructor(public timestamp: number) {}
}

export class Rollback implements Action {
  readonly type = ROLLBACK;

  constructor(public timestamp: number) {}
}

export class Commit implements Action {
  readonly type = COMMIT;

  constructor(public timestamp: number) {}
}

export class Sweep implements Action {
  readonly type = SWEEP;
}

export class ToggleAction implements Action {
  readonly type = TOGGLE_ACTION;

  constructor(public id: number) {}
}

export class SetActionsActive implements Action {
  readonly type = SET_ACTIONS_ACTIVE;

  constructor(
    public start: number,
    public end: number,
    public active: boolean = true
  ) {}
}

export class JumpToState implements Action {
  readonly type = JUMP_TO_STATE;

  constructor(public index: number) {}
}

export class JumpToAction implements Action {
  readonly type = JUMP_TO_ACTION;

  constructor(public actionId: number) {}
}

export class ImportState implements Action {
  readonly type = IMPORT_STATE;

  constructor(public nextLiftedState: any) {}
}

export type All =
  | PerformAction
  | Reset
  | Rollback
  | Commit
  | Sweep
  | ToggleAction
  | SetActionsActive
  | JumpToState
  | JumpToAction
  | ImportState;
