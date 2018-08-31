import { Injectable } from '@angular/core';
import { Actions, Effect<% if (feature) { %>, ofType<% } %> } from '@ngrx/effects';
<% if (feature) { %>import { <%= classify(name) %>ActionTypes } from '<%= featurePath(group, flat, "actions", dasherize(name)) %><%= dasherize(name) %>.actions';<% } %>

@Injectable()
export class <%= classify(name) %>Effects {
<% if (feature) { %>
  @Effect()
  loadFoos$ = this.actions$.pipe(ofType(<%= classify(name) %>ActionTypes.Load<%= classify(name) %>s));
<% } %>
  constructor(private actions$: Actions) {}
}
