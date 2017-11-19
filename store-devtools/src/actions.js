/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
export const /** @type {?} */ PERFORM_ACTION = 'PERFORM_ACTION';
export const /** @type {?} */ RESET = 'RESET';
export const /** @type {?} */ ROLLBACK = 'ROLLBACK';
export const /** @type {?} */ COMMIT = 'COMMIT';
export const /** @type {?} */ SWEEP = 'SWEEP';
export const /** @type {?} */ TOGGLE_ACTION = 'TOGGLE_ACTION';
export const /** @type {?} */ SET_ACTIONS_ACTIVE = 'SET_ACTIONS_ACTIVE';
export const /** @type {?} */ JUMP_TO_STATE = 'JUMP_TO_STATE';
export const /** @type {?} */ IMPORT_STATE = 'IMPORT_STATE';
export class PerformAction {
    /**
     * @param {?} action
     * @param {?=} timestamp
     */
    constructor(action, timestamp) {
        this.action = action;
        this.timestamp = timestamp;
        this.type = PERFORM_ACTION;
        if (typeof action.type === 'undefined') {
            throw new Error('Actions may not have an undefined "type" property. ' +
                'Have you misspelled a constant?');
        }
    }
}
function PerformAction_tsickle_Closure_declarations() {
    /** @type {?} */
    PerformAction.prototype.type;
    /** @type {?} */
    PerformAction.prototype.action;
    /** @type {?} */
    PerformAction.prototype.timestamp;
}
export class Reset {
    /**
     * @param {?=} timestamp
     */
    constructor(timestamp) {
        this.timestamp = timestamp;
        this.type = RESET;
    }
}
function Reset_tsickle_Closure_declarations() {
    /** @type {?} */
    Reset.prototype.type;
    /** @type {?} */
    Reset.prototype.timestamp;
}
export class Rollback {
    /**
     * @param {?=} timestamp
     */
    constructor(timestamp) {
        this.timestamp = timestamp;
        this.type = ROLLBACK;
    }
}
function Rollback_tsickle_Closure_declarations() {
    /** @type {?} */
    Rollback.prototype.type;
    /** @type {?} */
    Rollback.prototype.timestamp;
}
export class Commit {
    /**
     * @param {?=} timestamp
     */
    constructor(timestamp) {
        this.timestamp = timestamp;
        this.type = COMMIT;
    }
}
function Commit_tsickle_Closure_declarations() {
    /** @type {?} */
    Commit.prototype.type;
    /** @type {?} */
    Commit.prototype.timestamp;
}
export class Sweep {
    constructor() {
        this.type = SWEEP;
    }
}
function Sweep_tsickle_Closure_declarations() {
    /** @type {?} */
    Sweep.prototype.type;
}
export class ToggleAction {
    /**
     * @param {?} id
     */
    constructor(id) {
        this.id = id;
        this.type = TOGGLE_ACTION;
    }
}
function ToggleAction_tsickle_Closure_declarations() {
    /** @type {?} */
    ToggleAction.prototype.type;
    /** @type {?} */
    ToggleAction.prototype.id;
}
export class SetActionsActive {
    /**
     * @param {?} start
     * @param {?} end
     * @param {?=} active
     */
    constructor(start, end, active = true) {
        this.start = start;
        this.end = end;
        this.active = active;
        this.type = SET_ACTIONS_ACTIVE;
    }
}
function SetActionsActive_tsickle_Closure_declarations() {
    /** @type {?} */
    SetActionsActive.prototype.type;
    /** @type {?} */
    SetActionsActive.prototype.start;
    /** @type {?} */
    SetActionsActive.prototype.end;
    /** @type {?} */
    SetActionsActive.prototype.active;
}
export class JumpToState {
    /**
     * @param {?} index
     */
    constructor(index) {
        this.index = index;
        this.type = JUMP_TO_STATE;
    }
}
function JumpToState_tsickle_Closure_declarations() {
    /** @type {?} */
    JumpToState.prototype.type;
    /** @type {?} */
    JumpToState.prototype.index;
}
export class ImportState {
    /**
     * @param {?} nextLiftedState
     */
    constructor(nextLiftedState) {
        this.nextLiftedState = nextLiftedState;
        this.type = IMPORT_STATE;
    }
}
function ImportState_tsickle_Closure_declarations() {
    /** @type {?} */
    ImportState.prototype.type;
    /** @type {?} */
    ImportState.prototype.nextLiftedState;
}
//# sourceMappingURL=actions.js.map