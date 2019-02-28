import { Action } from '@ngrx/store';

export enum <%= classify(name) %>ActionTypes {
  Load<%= classify(name) %>s = '[<%= classify(name) %>] Load <%= classify(name) %>s',
  <% if (api) { %>Load<%= classify(name) %>sSuccess = '[<%= classify(name) %>] Load <%= classify(name) %>s Success',<% } %>
  <% if (api) { %>Load<%= classify(name) %>sFailure = '[<%= classify(name) %>] Load <%= classify(name) %>s Failure',<% } %>
}

export class Load<%= classify(name) %>s implements Action {
  readonly type = <%= classify(name) %>ActionTypes.Load<%= classify(name) %>s;
}
<% if (api) { %>
export class Load<%= classify(name) %>sSuccess implements Action {
  readonly type = <%= classify(name) %>ActionTypes.Load<%= classify(name) %>sSuccess;
  constructor(public payload: { data: any }) { }
}

export class Load<%= classify(name) %>sFailure implements Action {
  readonly type = <%= classify(name) %>ActionTypes.Load<%= classify(name) %>sFailure;
  constructor(public payload: { error: any }) { }
}
<% } %>
<% if (api) { %>export type <%= classify(name) %>Actions = Load<%= classify(name) %>s | Load<%= classify(name) %>sSuccess | Load<%= classify(name) %>sFailure;<% } %>
<% if (!api) { %>export type <%= classify(name) %>Actions = Load<%= classify(name) %>s;<% } %>
