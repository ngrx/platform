import { Action } from '@ngrx/store';
export declare const PERFORM_ACTION = "PERFORM_ACTION";
export declare const RESET = "RESET";
export declare const ROLLBACK = "ROLLBACK";
export declare const COMMIT = "COMMIT";
export declare const SWEEP = "SWEEP";
export declare const TOGGLE_ACTION = "TOGGLE_ACTION";
export declare const SET_ACTIONS_ACTIVE = "SET_ACTIONS_ACTIVE";
export declare const JUMP_TO_STATE = "JUMP_TO_STATE";
export declare const IMPORT_STATE = "IMPORT_STATE";
export declare class PerformAction implements Action {
    action: Action;
    timestamp: number;
    readonly type: string;
    constructor(action: Action, timestamp?: number);
}
export declare class Reset implements Action {
    timestamp: number;
    readonly type: string;
    constructor(timestamp?: number);
}
export declare class Rollback implements Action {
    timestamp: number;
    readonly type: string;
    constructor(timestamp?: number);
}
export declare class Commit implements Action {
    timestamp: number;
    readonly type: string;
    constructor(timestamp?: number);
}
export declare class Sweep implements Action {
    readonly type: string;
}
export declare class ToggleAction implements Action {
    id: number;
    readonly type: string;
    constructor(id: number);
}
export declare class SetActionsActive implements Action {
    start: number;
    end: number;
    active: boolean;
    readonly type: string;
    constructor(start: number, end: number, active?: boolean);
}
export declare class JumpToState implements Action {
    index: number;
    readonly type: string;
    constructor(index: number);
}
export declare class ImportState implements Action {
    nextLiftedState: any;
    readonly type: string;
    constructor(nextLiftedState: any);
}
export declare type All = PerformAction | Reset | Rollback | Commit | Sweep | ToggleAction | SetActionsActive | JumpToState | ImportState;
