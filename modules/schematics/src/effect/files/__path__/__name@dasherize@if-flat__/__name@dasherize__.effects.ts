import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
<% if(feature) { %>import { <%= classify(name) %>Actions, <%= classify(name) %>ActionTypes } from './<%= dasherize(name) %>.actions';<% } %>

@Injectable()
export class <%= classify(name) %>Effects {
<% if(feature) { %>
  @Effect()
  effect$ = this.actions$.ofType(<%= classify(name) %>ActionTypes.<%= classify(name) %>Action);
<% } %>
  constructor(private actions$: Actions) {}
}
