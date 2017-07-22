import { Action, ActionWithPayload } from '@ngrx/store';

export function toPayload(action: Action): any {
  return (action as any).payload;
}

export function toPayloadTyped<T>(action: ActionWithPayload<T>): T {
  return action.payload;
}
