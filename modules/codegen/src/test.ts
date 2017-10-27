import { Action } from '@ngrx/store';

export interface AddAction extends Action {
  type: '[Math] Add';
  amount: number;
}

export interface SubtractAction extends Action {
  type: '[Math] Subtract';
  amount: number;
}

export interface ComputeErrorAction extends Action {
  type: '[Math] Error';
  errors?: any[];
}
