import { Action } from '@ngrx/store';
import { <%= classify(name) %> } from './<%= dasherize(name) %>.model';

export enum <%= classify(name) %>ActionTypes {
  Load<%= classify(name) %>s = '[<%= classify(name) %>] Load <%= classify(name) %>s',
  Add<%= classify(name) %> = '[<%= classify(name) %>] Add <%= classify(name) %>',
  Add<%= classify(name) %>s = '[<%= classify(name) %>] Add <%= classify(name) %>s',
  Update<%= classify(name) %> = '[<%= classify(name) %>] Update <%= classify(name) %>',
  Update<%= classify(name) %>s = '[<%= classify(name) %>] Update <%= classify(name) %>s',
  Delete<%= classify(name) %> = '[<%= classify(name) %>] Delete <%= classify(name) %>',
  Delete<%= classify(name) %>s = '[<%= classify(name) %>] Delete <%= classify(name) %>s',
  Clear<%= classify(name) %>s = '[<%= classify(name) %>] Clear <%= classify(name) %>s'
}

export class Load<%= classify(name) %>s implements Action {
  readonly type = <%= classify(name) %>ActionTypes.Load<%= classify(name) %>s;

  constructor(public payload: { <%= lowercase(name) %>s: <%= classify(name) %>[] }) {}
}

export class Add<%= classify(name) %> implements Action {
  readonly type = <%= classify(name) %>ActionTypes.Add<%= classify(name) %>;

  constructor(public payload: { <%= lowercase(name) %>: <%= classify(name) %> }) {}
}

export class Add<%= classify(name) %>s implements Action {
  readonly type = <%= classify(name) %>ActionTypes.Add<%= classify(name) %>s;

  constructor(public payload: { <%= lowercase(name) %>s: <%= classify(name) %>[] }) {}
}

export class Update<%= classify(name) %> implements Action {
  readonly type = <%= classify(name) %>ActionTypes.Update<%= classify(name) %>;

  constructor(public payload: { <%= lowercase(name) %>: { id: string, changes: <%= classify(name) %> } }) {}
}

export class Update<%= classify(name) %>s implements Action {
  readonly type = <%= classify(name) %>ActionTypes.Update<%= classify(name) %>s;

  constructor(public payload: { <%= lowercase(name) %>s: { id: string, changes: <%= classify(name) %> }[] }) {}
}

export class Delete<%= classify(name) %> implements Action {
  readonly type = <%= classify(name) %>ActionTypes.Delete<%= classify(name) %>;

  constructor(public payload: { id: string }) {}
}

export class Delete<%= classify(name) %>s implements Action {
  readonly type = <%= classify(name) %>ActionTypes.Delete<%= classify(name) %>s;

  constructor(public payload: { ids: string[] }) {}
}

export class Clear<%= classify(name) %>s implements Action {
  readonly type = <%= classify(name) %>ActionTypes.Clear<%= classify(name) %>s;
}

export type <%= classify(name) %>Actions =
 Load<%= classify(name) %>s
 | Add<%= classify(name) %>
 | Add<%= classify(name) %>s
 | Update<%= classify(name) %>
 | Update<%= classify(name) %>s
 | Delete<%= classify(name) %>
 | Delete<%= classify(name) %>s
 | Clear<%= classify(name) %>s;
