import { Action } from '@ngrx/store';

export enum <%= classify(name) %>ActionTypes {
  <%= classify(name) %>Action = '[<%= classify(name) %>] Action'
}

export class <%= classify(name) %> implements Action {
  readonly type = <%= classify(name) %>ActionTypes.<%= classify(name) %>Action;
}

export type <%= classify(name) %>Actions = <%= classify(name) %>;
