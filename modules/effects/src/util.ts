import { Action, ActionWithPayload } from '@ngrx/store';

export function toPayload<T = any>(action: ActionWithPayload<T> | Action): T {
  return (action as any).payload;
}
