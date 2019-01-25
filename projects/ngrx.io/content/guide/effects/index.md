# Effects

Effects are an RxJS powered side effect model for [Store](guide/store). Effects use streams to provide [new sources](https://martinfowler.com/eaaDev/EventSourcing.html) of actions to reduce state based on external interactions such as network requests, web socket messages and time-based events.

## Introduction

In a service-based Angular application, components are responsible for interacting with external resources directly through services. Instead, effects provide a way to interact with those services and isolate them from the components. Effects are where you handle tasks such as fetching data, long-running tasks that produce multiple events, and other external interactions where your components don't need explicit knowledge of these interactions.

## Key Concepts

- Effects isolate side effects from components, allowing for more _pure_ components that select state and dispatch actions.
- Effects are long-running services that listen to an observable of _every_ action dispatched from the [Store](guide/store).
- Effects filter those actions based on the type of action they are interested in. This is done by using an operator.
- Effects perform tasks, which are synchronous or asynchronous and return a new action.

## Installation

```sh
npm install @ngrx/effects --save
```

```sh
yarn add @ngrx/effects
```

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
- Using the service to perform a _side effect_, reaching out to an external API to fetch the movies
- Changing the _state_ of the movies within the component.

`Effects` when used along with `Store`, decrease the responsibility of the component.  In a larger application, this becomes more important because you have multiple sources of data, with multiple services required to fetch those pieces of data, and services potentially relying on other services.

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
  movies$: Observable<Movie[]> = this.store.select(state => state.movies);

  constructor(private store: Store&lt;{ movies: Movie[] &gt;}) {}

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
- Observable streams are decorated with metadata using the `Effect` decorator. The metadata is used to register the streams that are subscribed to the store. Any action returned from the effect stream is then dispatched back to the `Store`.
- Actions are filtered using a pipeable `ofType` operator. The `ofType` operator takes one more action types as arguments to filter on which actions to act upon.
- Effects are subscribed to the `Store` observable. 
- Services are injected into effects to interact with external APIs and handle streams.

To show how you handle loading movies from the example above, let's look at `MovieEffects`.

<code-example header="movie.effects.ts">
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class MovieEffects {

  @Effect()
  loadMovies$ = this.actions$
    .pipe(
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

The `loadMovies$` effect is listening for all dispatched actions through the `Actions` stream, but is only interested in the `[Movies Page] Load Movies` event using the `ofType` operator. The stream of actions is then flattened and mapped into a new observable using the `mergeMap` operator. The `MoviesService#getAll()` method returns an observable that maps the movies to a new action on success, and currently returns an empty observable if an error occurs. The action is dispatched to the `Store` where it can be handled by reducers when a state change is needed. Its also important to [handle errors](#handling-errors) when dealing with observable streams so that the effects continue running.

<div class="alert is-important">

Event streams are not limited to dispatched actions, but can be _any_ observable that produces new actions, such as observables from the Angular Router, observables created from browser events, and other observable streams.

</div>

## Handling Errors

Effects are built on top of observable streams provided by RxJS. Effects are listeners of observable streams that continue until an error or completion occurs. In order for effects to continue running in the event of an error in the observable, or completion of the observable stream, they must be nested within a "flattening" operator, such as `mergeMap`, `concatMap`, `exhaustMap` and other flattening operators. The example below shows the `loadMovies$` effect handling errors when fetching movies.

<code-example header="movie.effects.ts">
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class MovieEffects {

  @Effect()
  loadMovies$ = this.actions$
    .pipe(
      ofType('[Movies Page] Load Movies'),
      mergeMap(() => this.moviesService.getAll()
        .pipe(
          map(movies => ({ type: '[Movies API] Movies Loaded Success', payload: movies })),
          catchError(() => of({ type: '[Movies API] Movies Loaded Error' }))
        ))
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

After you've have written your Effects class, you must register it so the effects start running. To register root-level effects, add the `EffectsModule.forRoot()` method with an array of your effects to your `AppModule`.

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
