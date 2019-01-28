import { Injectable } from '@angular/core';
import { Actions, Effect<% if (feature) { %>, ofType<% } %> } from '@ngrx/effects';
<% if (feature && api) { %>import { catchError, map, concatMap } from 'rxjs/operators';<% } %>
<% if (feature && api) { %>import { EMPTY, of } from 'rxjs';<% } %>
<% if (feature && api) { %>import { Load<%= classify(name) %>sFailure, Load<%= classify(name) %>sSuccess, <%= classify(name) %>ActionTypes, <%= classify(name) %>Actions } from '<%= featurePath(group, flat, "actions", dasherize(name)) %><%= dasherize(name) %>.actions';<% } %>
<% if (feature && !api) { %>import { <%= classify(name) %>ActionTypes } from '<%= featurePath(group, flat, "actions", dasherize(name)) %><%= dasherize(name) %>.actions';<% } %>

@Injectable()
export class <%= classify(name) %>Effects {
<% if (feature && api) { %>
  @Effect()
  load<%= classify(name) %>s$ = this.actions$.pipe(
    ofType(<%= classify(name) %>ActionTypes.Load<%= classify(name) %>s),
    concatMap(() =>
      /** An EMPTY observable only emits completion. Replace with your own observable API request */
      EMPTY.pipe(
        map(data => new Load<%= classify(name) %>sSuccess({ data })),
        catchError(error => of(new Load<%= classify(name) %>sFailure({ error }))))
    )
  );
<% } %>
<% if (feature && !api) { %>
  @Effect()
  load<%= classify(name) %>s$ = this.actions$.pipe(ofType(<%= classify(name) %>ActionTypes.Load<%= classify(name) %>s));
<% } %>
<% if (feature && api) { %>
  constructor(private actions$: Actions<<%= classify(name) %>Actions>) {}
<% } else { %>
  constructor(private actions$: Actions) {}
<% } %>
}
