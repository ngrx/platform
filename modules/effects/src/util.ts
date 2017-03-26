import { Action } from '@ngrx/store';


export function toPayload(action: Action) {
  return (<any>action).payload;
}
