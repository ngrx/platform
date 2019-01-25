import { Injectable } from '@angular/core';
import { Actions, Effect<% if (feature) { %>, ofType<% } %> } from '@ngrx/effects';
<% if (feature) { %>import { catchError, map, switchMap } from 'rxjs/operators';<% } %>
<% if (feature) { %>import { Load<%= classify(name) %>sFailure, Load<%= classify(name) %>sSuccess, <%= classify(name) %>ActionTypes } from '<%= featurePath(group, flat, "actions", dasherize(name)) %><%= dasherize(name) %>.actions';<% } %>

@Injectable()
export class <%= classify(name) %>Effects {
<% if (feature) { %>

  private _testObservable = of([
    { myDataProperty: 1000, myOtherDataProperty: 'some-text' },
    { myDataProperty: 1100, myOtherDataProperty: 'more-text' }]
  )
    .pipe(
      delay(1000), // simulate latency of 1 second
      // (_ => { throw new Error('oops'); }) // uncomment to test error handling
    );

  @Effect()
  load<%= classify(name) %>s$ = this.actions$.pipe(
    ofType(<%= classify(name) %>ActionTypes.Load<%= classify(name) %>),
    switchMap(() =>
      this._testObservable.pipe(
        map(data => new Load<%= classify(name) %>sSuccess({ data })),
        catchError(error => of(new Load<%= classify(name) %>sFailure({ error }))))
    )
  );
<% } %>

  constructor(private actions$: Actions) {}
}
