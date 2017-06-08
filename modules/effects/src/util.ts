import { Action } from '@ngrx/store';

export function toPayload(action: Action): any {
  return (action as any).payload;
}
