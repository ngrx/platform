# @ngrx/effects

Effects are an RxJS powered side effect model for [Store](guide/store). Effects use streams to provide [new sources](https://martinfowler.com/eaaDev/EventSourcing.html) of actions to reduce state based on external interactions such as network requests, web socket messages and time-based events.

## Introduction

In a service-based Angular application, components are responsible for interacting with external resources directly through services. Instead, effects provide a way to interact with those services and isolate them from the components. Effects are where you handle tasks such as fetching data, long-running tasks that produce multiple events, and other external interactions where your components don't need explicit knowledge of these interactions.

## Key Concepts

- Effects isolate side effects from components, allowing for more _pure_ components that select state and dispatch actions.
- Effects are long-running services that listen to an observable of _every_ action dispatched from the [Store](guide/store).
- Effects filter those actions based on the type of action they are interested in. This is done by using an operator.
- Effects perform tasks, which are synchronous or asynchronous and return a new action.

## Installation

Detailed installation instructions can be found on the [Installation](guide/effects/install) page.

## Comparison with component-based side effects

In a service-based application, your components interact with data through many different services that expose data through properties and methods. These services may depend on other services that manage other sets of data. Your components consume these services to perform tasks, giving your components many responsibilities.

Imagine that your application manages movies. Here is a component that fetches and displays a list of movies.

<code-example header="movies-page.component.ts">
@Component({
  template: `
    &lt;li *ngFor="let movie of movies"&gt;
      {{ movie.name }}
    &lt;/li&gt;
  `
})
export class MoviesPageComponent {
  movies: Movie[];

  constructor(private movieService: MoviesService) {}

  ngOnInit() {
    this.movieService.getAll().subscribe(movies => this.movies = movies);
  }
}
</code-example>

You also have the corresponding service that handles the fetching of movies.

<code-example header="movies.service.ts">
@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  constructor (private http: HttpClient) {}

  getAll() {
    return this.http.get('/movies');
  }
}
</code-example>

The component has multiple responsibilities:

- Managing the _state_ of the movies.
- Using the service to perform a _side effect_, reaching out to an external API to fetch the movies.
- Changing the _state_ of the movies within the component.

`Effects` when used along with `Store`, decrease the responsibility of the component. In a larger application, this becomes more important because you have multiple sources of data, with multiple services required to fetch those pieces of data, and services potentially relying on other services.

Effects handle external data and interactions, allowing your services to be less stateful and only perform tasks related to external interactions. Next, refactor the component to put the shared movie data in the `Store`. Effects handle the fetching of movie data.

<code-example header="movies-page.component.ts">
@Component({
  template: `
    &lt;div *ngFor="let movie of movies$ | async"&gt;
      {{ movie.name }}
    &lt;/div&gt;
  `
})
export class MoviesPageComponent {
  movies$: Observable&lt;Movie[]&gt; = this.store.select(state => state.movies);

  constructor(private store: Store&lt;{ movies: Movie[] }&gt;) {}

  ngOnInit() {
    this.store.dispatch({ type: '[Movies Page] Load Movies' });
  }
}
</code-example>

The movies are still fetched through the `MoviesService`, but the component is no longer concerned with how the movies are fetched and loaded. It's only responsible for declaring its _intent_ to load movies and using selectors to access movie list data. Effects are where the asynchronous activity of fetching movies happens. Your component becomes easier to test and less responsible for the data it needs.

## Writing Effects

To isolate side-effects from your component, you must create an `Effects` class to listen for events and perform tasks.

Effects are injectable service classes with distinct parts:

- An injectable `Actions` service that provides an observable stream of _all_ actions dispatched _after_ the latest state has been reduced.
- Metadata is attached to the observable streams using the `createEffect` function. The metadata is used to register the streams that are subscribed to the store. Any action returned from the effect stream is then dispatched back to the `Store`.
- Actions are filtered using a pipeable [`ofType` operator](guide/effects/operators#oftype). The `ofType` operator takes one or more action types as arguments to filter on which actions to act upon.
- Effects are subscribed to the `Store` observable.
- Services are injected into effects to interact with external APIs and handle streams.

To show how you handle loading movies from the example above, let's look at `MovieEffects`.

<code-example header="movie.effects.ts">
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { MoviesService } from './movies.service';

@Injectable()
export class MovieEffects {

  loadMovies$ = createEffect(() => this.actions$.pipe(
    ofType('[Movies Page] Load Movies'),
    mergeMap(() => this.moviesService.getAll()
      .pipe(
        map(movies => ({ type: '[Movies API] Movies Loaded Success', payload: movies })),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private moviesService: MoviesService
  ) {}
}
</code-example>

The `loadMovies$` effect is listening for all dispatched actions through the `Actions` stream, but is only interested in the `[Movies Page] Load Movies` event using the `ofType` operator. The stream of actions is then flattened and mapped into a new observable using the `mergeMap` operator. The `MoviesService#getAll()` method returns an observable that maps the movies to a new action on success, and currently returns an empty observable if an error occurs. The action is dispatched to the `Store` where it can be handled by reducers when a state change is needed. It's also important to [handle errors](#handling-errors) when dealing with observable streams so that the effects continue running.

<div class="alert is-important">

**Note:** Event streams are not limited to dispatched actions, but can be _any_ observable that produces new actions, such as observables from the Angular Router, observables created from browser events, and other observable streams.

</div>

<div class="alert is-important">

**Note:** You can also write effects using the `@Effect()` decorator, which was the previously defined way before effects creators were introduced in NgRx. If
you are looking for examples of effect decorators, visit the documentation for [versions 7.x and prior](https://v7.ngrx.io/guide/effects#writing-effects).

</div>

## Handling Errors

Effects are built on top of observable streams provided by RxJS. Effects are listeners of observable streams that continue until an error or completion occurs. In order for effects to continue running in the event of an error in the observable, or completion of the observable stream, they must be nested within a "flattening" operator, such as `mergeMap`, `concatMap`, `exhaustMap` and other flattening operators. The example below shows the `loadMovies$` effect handling errors when fetching movies.

<code-example header="movie.effects.ts">
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { MoviesService } from './movies.service';

@Injectable()
export class MovieEffects {

  loadMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[Movies Page] Load Movies'),
      mergeMap(() => this.moviesService.getAll()
        .pipe(
          map(movies => ({ type: '[Movies API] Movies Loaded Success', payload: movies })),
          catchError(() => of({ type: '[Movies API] Movies Loaded Error' }))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private moviesService: MoviesService
  ) {}
}
</code-example>

The `loadMovies$` effect returns a new observable in case an error occurs while fetching movies. The inner observable handles any errors or completions and returns a new observable so that the outer stream does not die. You still use the `catchError` operator to handle error events, but return an observable of a new action that is dispatched to the `Store`.

## Registering root effects

After you've written your Effects class, you must register it so the effects start running. To register root-level effects, add the `EffectsModule.forRoot()` method with an array of your effects to your `AppModule`.

<code-example header="app.module.ts">
import { EffectsModule } from '@ngrx/effects';
import { MovieEffects } from './effects/movie.effects';

@NgModule({
  imports: [
    EffectsModule.forRoot([MovieEffects])
  ],
})
export class AppModule {}
</code-example>

<div class="alert is-critical">

The `EffectsModule.forRoot()` method must be added to your `AppModule` imports even if you don't register any root-level effects.

</div>

Effects start running immediately after the AppModule is loaded to ensure they are listening for all relevant actions as soon as possible.

## Registering feature effects

For feature modules, register your effects by adding the `EffectsModule.forFeature()` method in the `imports` array of your `NgModule`.

<code-example header="admin.module.ts">
import { EffectsModule } from '@ngrx/effects';
import { MovieEffects } from './effects/movie.effects';

@NgModule({
  imports: [
    EffectsModule.forFeature([MovieEffects])
  ],
})
export class MovieModule {}
</code-example>

<div class="alert is-important">

**Note:** Running an effects class multiple times, either by `forRoot()` or `forFeature()`, (for example via different lazy loaded modules) will not cause Effects to run multiple times. There is no functional difference between effects loaded by `forRoot()` and `forFeature()`; the important difference between the functions is that `forRoot()` sets up the providers required for effects.

</div>

## Alternative way of registering effects

You can provide root-/feature-level effects with the provider `USER_PROVIDED_EFFECTS`.

<code-example header="movies.module.ts">
providers: [
  MovieEffects,
  {
    provide: USER_PROVIDED_EFFECTS,
    multi: true,
    useValue: [MovieEffects],
  },
]
</code-example>

<div class="alert is-critical">

The `EffectsModule.forFeature()` method must be added to the module imports even if you only provide effects over token, and don't pass them via parameters. (Same goes for `EffectsModule.forRoot()`)

</div>

## Incorporating State

If additional metadata is needed to perform an effect besides the initiating action's `type`, we should rely on passed metadata from an action creator's `props` method.

Let's look at an example of an action initiating a login request using an effect with additional passed metadata:

<code-example header="login-page.actions.ts">
import { createAction, props } from '@ngrx/store';
import { Credentials } from '../models/user';

export const login = createAction(
  '[Login Page] Login',
  props&lt;{ credentials: Credentials }&gt;()
);
</code-example>

<code-example header="auth.effects.ts">
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import {
  LoginPageActions,
  AuthApiActions,
} from '../actions';
import { Credentials } from '../models/user';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginPageActions.login),
      exhaustMap(action =>
        this.authService.login(action.credentials).pipe(
          map(user => AuthApiActions.loginSuccess({ user })),
          catchError(error => of(AuthApiActions.loginFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}
</code-example>

The `login` action has additional `credentials` metadata which is passed to a service to log the specific user into the application.

However, there may be cases when the required metadata is only accessible from state.  When state is needed, the RxJS `withLatestFrom` or the @ngrx/effects `concatLatestFrom` operators can be used to provide it.

The example below shows the `addBookToCollectionSuccess$` effect displaying a different alert depending on the number of books in the collection state.

<code-example header="collection.effects.ts">
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect, concatLatestFrom } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { CollectionApiActions } from '../actions';
import * as fromBooks from '../reducers';

@Injectable()
export class CollectionEffects {
  addBookToCollectionSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CollectionApiActions.addBookSuccess),
        concatLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)),
        tap(([action, bookCollection]) => {
          if (bookCollection.length === 1) {
            window.alert('Congrats on adding your first book!');
          } else {
            window.alert('You have added book number ' + bookCollection.length);
          }
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store&lt;fromBooks.State&gt;
  ) {}
}
</code-example>

<div class="alert is-important">

**Note:** For performance reasons, use a flattening operator like `concatLatestFrom` to prevent the selector from firing until the correct action is dispatched.

</div>

To learn about testing effects that incorporate state, see the [Effects that use State](guide/effects/testing#effect-that-uses-state) section in the testing guide.

## Using Other Observable Sources for Effects

Because effects are merely consumers of observables, they can be used without actions and the `ofType` operator. This is useful for effects that don't need to listen to some specific actions, but rather to some other observable source. 

For example, imagine we want to track click events and send that data to our monitoring server. This can be done by creating an effect that listens to the `document` `click` event and emits the event data to our server.

<code-example header="user-activity.effects.ts">  
import { Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { createEffect } from '@ngrx/effects';

import { UserActivityService } from '../services/user-activity.service';

@Injectable()
export class UserActivityEffects {
  trackUserActivity$ = createEffect(() =>
    fromEvent(document, 'click').pipe(
      concatMap(event => this.userActivityService.trackUserActivity(event)),
    ), { dispatch: false }
  );

  constructor(
    private userActivityService: UserActivityService,
  ) {}
}
</code-example>

