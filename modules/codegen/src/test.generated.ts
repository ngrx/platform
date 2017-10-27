import { AddAction, SubtractAction, ComputeErrorAction } from './test';

export enum MathActionType {
  Add = '[Math] Add',
  Subtract = '[Math] Subtract',
  Error = '[Math] Error',
}

export type MathActions = AddAction | SubtractAction | ComputeErrorAction;

export type MathActionLookup = {
  '[Math] Add': AddAction;
  '[Math] Subtract': SubtractAction;
  '[Math] Error': ComputeErrorAction;
};

export function createAddAction(amount: AddAction['amount']): AddAction {
  return { type: MathActionType.Add, amount };
}

export function createSubtractAction(
  amount: SubtractAction['amount']
): SubtractAction {
  return { type: MathActionType.Subtract, amount };
}

export function createComputeErrorAction(
  errors?: ComputeErrorAction['errors']
): ComputeErrorAction {
  return { type: MathActionType.Error, errors };
}
