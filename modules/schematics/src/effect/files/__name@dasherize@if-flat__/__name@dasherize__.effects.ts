import { Injectable } from '@angular/core';
import { Actions, Effect<% if(feature) { %>, ofType<% } %> } from '@ngrx/effects';
<% if (feature) { %>import { Load<%= classify(name) %>s, <%= classify(name) %>ActionTypes } from '<%= featurePath(group, flat, "actions", dasherize(name)) %><%= dasherize(name) %>.actions';<% } %>

@Injectable()
export class <%= classify(name) %>Effects {
<% if (feature) { %>
  @Effect()
  effect$ = this.actions$.pipe(ofType<Load<%= classify(name) %>s>(<%= classify(name) %>ActionTypes.Load<%= classify(name) %>s));
<% } %>
  constructor(private actions$: Actions) {}
}
