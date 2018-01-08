import { Action } from '@ngrx/store';

export enum ActionTypes {
  ImportState = '[NgRx Store Devtools] Import State',
  Dispatch = '[NgRx Store Devtools] Dispatch',
  TimeTravel = '[NgRx Store Devtools] TimeTravel',
  Resume = '[NgRx Store Devtools] Resume',
  Commit = '[NgRx Store Devtools] Commit',
}

export interface ImportStateAction extends Action {
  type: ActionTypes.ImportState;
  state: any;
}

export function createImportStateAction(state: any): ImportStateAction {
  return {
    type: ActionTypes.ImportState,
    state,
  };
}

export interface DispatchAction extends Action {
  type: ActionTypes.Dispatch;
  action: Action;
}

export function createDispatchAction(action: any): DispatchAction {
  return {
    type: ActionTypes.Dispatch,
    action,
  };
}

export interface TimeTravelAction extends Action {
  type: ActionTypes.TimeTravel;
  index: number;
}

export function createTimeTravelAction(index: number): TimeTravelAction {
  return {
    type: ActionTypes.TimeTravel,
    index,
  };
}

export interface ResumeAction extends Action {
  type: ActionTypes.Resume;
}

export function createResumeAction(): ResumeAction {
  return {
    type: ActionTypes.Resume,
  };
}

export interface CommitAction extends Action {
  type: ActionTypes.Commit;
}

export function createCommitAction(): CommitAction {
  return {
    type: ActionTypes.Commit,
  };
}

export type Actions =
  | ImportStateAction
  | DispatchAction
  | TimeTravelAction
  | ResumeAction
  | CommitAction;
