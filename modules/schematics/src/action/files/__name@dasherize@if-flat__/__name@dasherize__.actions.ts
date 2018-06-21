import { Action } from '@ngrx/store';

export enum <%= classify(name) %>ActionTypes {
  Load<%= classify(name) %>s = '[<%= classify(name) %>] Load <%= classify(name) %>s'
}

export class <%= classify(name) %> implements Action {
  readonly type = <%= classify(name) %>ActionTypes.Load<%= classify(name) %>s;
}

export type <%= classify(name) %>Actions = <%= classify(name) %>;
