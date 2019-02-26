import { Injectable } from '@angular/core';
import { Actions, Effect<% if (feature) { %>, ofType<% } %> } from '@ngrx/effects';
<% if (feature && api) { %>import { catchError, map, concatMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { Load<%= classify(name) %>sFailure, Load<%= classify(name) %>sSuccess, <%= classify(name) %>ActionTypes, <%= classify(name) %>Actions } from '<%= featurePath(group, flat, "actions", dasherize(name)) %><%= dasherize(name) %>.actions';
<% } %>
<% if (feature && !api) { %>import { concatMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { <%= classify(name) %>ActionTypes, <%= classify(name) %>Actions } from '<%= featurePath(group, flat, "actions", dasherize(name)) %><%= dasherize(name) %>.actions';
<% } %>

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
  );<% } %>
<% if (feature && !api) { %>
  @Effect()
  load<%= classify(name) %>s$ = this.actions$.pipe(
    ofType(<%= classify(name) %>ActionTypes.Load<%= classify(name) %>s),
    /** An EMPTY observable only emits completion. Replace with your own observable API request */
    concatMap(() => EMPTY)
  );
<% } %>
<% if (feature) { %>
  constructor(private actions$: Actions<<%= classify(name) %>Actions>) {}
<% } else { %>
  constructor(private actions$: Actions) {}
<% } %>
}
