<!-- TOC -->
  * [Introduction](#introduction)
    * [On Testing in general](#on-testing-in-general)
    * [What to test](#what-to-test)
    * [TestBed or not?](#testbed-or-not)
  * [Testing the Signal Store](#testing-the-signal-store)
    * [Globally provided](#globally-provided)
    * [Locally provided](#locally-provided)
    * [`withComputed`](#withcomputed)
    * [`withMethods`, DI, and asynchronous tasks](#withmethods-di-and-asynchronous-tasks)
    * [`rxMethod`](#rxmethod)
      * [with Observables](#with-observables)
      * [with Signals](#with-signals)
    * [Custom extensions](#custom-extensions)
  * [Mocking the Signal Store](#mocking-the-signal-store)
    * [Native Mocking](#native-mocking)
    * [ng-mocks](#ng-mocks)
    * [Further thoughts](#further-thoughts)
<!-- TOC -->

This is still a draft. Once we see that the content is ready, we will replace markdown with `<code>`

The examples used in this guide are available at https://github.com/rainerhahnekamp/ngrx-signal-store-testing

## Introduction

### On Testing in general

A Signal Store is a simple Angular Service. So the same testing techniques you use for services apply to Signal Stores as well. Because of that, this testing guide will focus on providing examples for common testing scenarios.

A challenging part of testing is to know how to handle asynchronous tasks and mocking. The examples are using the Jest (v29.5), but the same principles apply to other testing frameworks.

There are two scenarios when it comes to testing:

1. Testing the `signalStore` itself,
2. Testing a component/service which uses the Signal Store.

Whereas in the first scenario, mocking will happen for dependencies of the Signal Store, scenario 2 requires to mock the Signal Store itself.

### What to test

We are testing the SignalStore and are therefore communicating with it as any component or service: Via its public API.

One of the main concerns of testing is their maintenance. The more tests are coupled to the internal implementation, the more likely the more often they will break. Public APIs are more stable and therefore less likely going to change.

For example, if we want to test our store in a loading state, we shouldn't set the loading property directly. Instead, we should trigger the a loading method and assert against an exposed computed or slice. Why? Because we don't want to depend on the internal implementation, e.g. what properties are set when the loading state is triggered.

Looking at testing from this perspective it is clear that we don't want in any way access any private properties or methods of the Signal Store. We also don't run `patchState`, if the state is protected.

### TestBed or not?

The Signal Store is a function that returns a class. That means a test can instantiate the class and test it without the TestBed.

In practice, though, you will use the `TestBed` because among many advantages, it allows you to mock dependencies and triggers the execution of `effects`.

Furthermore, crucial features of the SignalStore will not work, if they don't run in an injection context. Examples are the hooks `rxMethod` and `inject` in `withMethods()`.

<div class="alert is-helpful">

**Note:**: Using the TestBed is also the recommendation of the [Angular team](https://github.com/angular/angular/issues/54438#issuecomment-1971813177).

</div>

## Testing the Signal Store

Let's assume, we want to test the following Signal Store:

### Globally provided

_movies.store.ts_

```typescript
import { signalStore, withState } from '@ngrx/signals';

type Movie = {
  id: number;
  name: string;
};

type State = { movies: Movie[] };

export const MoviesStore = signalStore(
  withState<State>({
    movies: [
      { id: 1, name: 'A New Hope' },
      { id: 2, name: 'Into Darkness' },
      { id: 3, name: 'The Lord of the Rings' },
    ],
  })
);
```

The `TestBed` will instantiate the `MoviesStore` and can then test it right away.

_movies.store.spec.ts_

```typescript
import { MoviesStore } from './movies-store';
import { TestBed } from '@angular/core/testing';

describe('MoviesStore', () => {
  it('should verify that three movies are available', () => {
    const store = TestBed.inject(MoviesStore);

    expect(store.movies()).toHaveLength(3);
  });
});
```

### Locally provided

This was possible because the `MoviesStore` is provided globally. For local providers, we have to tweak the test a bit.

_movies.store.ts_

```typescript
export const MoviesStore = signalStore(
  withState({
    movies: [
      // ... entries
    ],
  })
);
```

The required addition is that the internal `TestingModule` must provide the `MoviesStore`.

_movies.store.spec.ts_

```typescript
import { MoviesStore } from './movies.store';

describe('MoviesStore', () => {
  it('should verify that three movies are available', () => {
    TestBed.configureTestingModule({
      providers: [MoviesStore],
    });

    const store = TestBed.inject(MoviesStore);

    expect(store.movies()).toHaveLength(3);
  });
});
```

### `withComputed`

Testing derived values `withComputed` is also straightforward.

_movies.store.ts_

```typescript
export const MoviesStore = signalStore(
  withState({
    movies: [
      // ... entries
    ],
  }),
  withComputed((state) => ({
    moviesCount: computed(() => state.movies().length),
  }))
);
```

_movies.store.spec.ts_

```typescript
import { MoviesStore } from './movies.store';

describe('MoviesStore', () => {
  it('should verify that three movies are available', () => {
    const store = TestBed.inject(MoviesStore);

    expect(store.moviesCount()).toBe(3);
  });
});
```

### `withMethods`, DI, and asynchronous tasks

Let's say we have a loading method which asynchronously loads movies by studio.

```typescript
import { signalStore, withState } from '@ngrx/signals';

type State = { studio: string; movies: Movie[]; loading: boolean };

export const MoviesStore = signalStore(
  withState<State>({
    studio: '',
    movies: [],
    loading: false,
  }),
  withMethods((store) => {
    const moviesService = store.inject(MoviesService);

    return {
      async load(studio: string) {
        this.patchState({ loading: true });
        const movies = await moviesService.loadMovies(studio);
        this.patchState(store, { studio, movies, loading: false });
      },
    };
  })
);
```

We will mock the `MoviesService` in our test and let the implementation return the result as a `Promise`.

```typescript
describe('MoviesStore', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(async () => {
    await jest.runOnlyPendingTimersAsync();
    jest.useRealTimers();
  });

  it('should load movies of Warner Bros', async () => {
    const moviesService = {
      load: () =>
        Promise.resolve([
          { id: 1, name: 'Harry Potter' },
          { id: 2, name: 'The Dark Knight' },
        ]),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: MoviesService,
          useValue: moviesService,
        },
      ],
    });

    const store = TestBed.inject(MoviesStore);
    store.load('Warner Bros');
    expect(store.loading()).toBe(true);
    await jest.runOnlyPendingTimersAsync();
    expect(store.moviesCount()).toBe(2);
    expect(store.loading()).toBe(false);
  });
});
```

<div class="alert is-helpful">

**Note:**: You don't have to manually mock your dependencies. You can choose among libraries like ng-mocks, @testing-library/angular, [jest|jasmine]-auto-spies, etc.

</div>

We use the tools of Jest to manage asynchronous tasks. We don't use `fakeAsync` or `waitForAsync` because they both depend on zone.js and don't work for zoneless applications. The "Angular way" of testing asynchronous code is to use the `ComponentFixture.whenStable` method, which is not available in this context.

### `rxMethod`

Let's say, we created the `load` method with `rxMethod`. That is because a component provides an input field for the studio and wants to start loading as soon as the user types in a name.

In this example, the `MovieService` returns an `Observable<Movie[]>` instead of a `Promise<Movie[]>`.

```typescript
export const MoviesStore = signalStore(
  // ... code ommitted
  withMethods((store, moviesService = inject(MoviesService)) => ({
    load: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((studio) => moviesService.load(studio)),
        tapResponse({
          next: (movies) =>
            patchState(store, {
              movies,
              loading: false,
            }),
          error: console.error,
        })
      )
    ),
  }))
);
```

Since `rxMethod` accepts a string as a parameter, the test from before is still valid.

What we want to test in addition is the proper handling of race conditions. That's why we actually use `switchMap` in the first place.

Next to `number`, the parameter's type can be `Signal<number>` or `Observable<number>`.

#### with Observables

We want to test, if the `load` method properly handles the case when the user types in a new studio name after and before the previous request has finished.

```typescript
describe('MoviesStore', () => {
  // ... beforeEach and afterEach omitted

  const setup = () => {
    const moviesService = {
      load: jest.fn((studio: string) => of([studio === 'Warner Bros' ? { id: 1, name: 'Harry Potter' } : { id: 2, name: 'Jurassic Park' }]).pipe(delay(100))),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: MoviesService,
          useValue: moviesService,
        },
      ],
    });

    return TestBed.inject(MoviesStore);
  };

  it('should load two times', async () => {
    const store = setup();

    const studio$ = new Subject<string>();
    store.load(studio$);
    studio$.next('Warner Bros');

    await jest.advanceTimersByTimeAsync(100);
    expect(store.movies()).toEqual([{ id: 1, name: 'Harry Potter' }]);

    studio$.next('Universal');
    await jest.advanceTimersByTimeAsync(100);
    expect(store.movies()).toEqual([{ id: 2, name: 'Jurassic Park' }]);
  });

  it('should cancel a running request when a new one is made', async () => {
    const store = setup();

    const studio$ = new Subject<string>();
    store.load(studio$);
    studio$.next('Warner Bros');

    await jest.advanceTimersByTimeAsync(50);
    studio$.next('Universal');

    await jest.advanceTimersByTimeAsync(50);
    expect(store.movies()).toEqual([]);
    expect(store.loading()).toBe(true);

    await jest.advanceTimersByTimeAsync(50);
    expect(store.movies()).toEqual([{ id: 2, name: 'Jurassic Park' }]);
    expect(store.loading()).toBe(false);
  });
});
```

By making use of the testing framework's function to manage time, we can verify both scenarios.

This test also uses a setup function to avoid code duplication. This is a common pattern in testing and an alternative to the `beforeEach` function. In our case, every test can decide if it wants to use the setup function or not.

#### with Signals

Testing both scenarios with a type of `Signal` as an input is similar to Observables.

This is mainly due because of the asynchronous tasks we use here.

```typescript
describe('MoviesStore', () => {
  // ... beforeEach, afterEach, and setup omitted

  it('should test two sequential loads with a Signal', async () => {
    const store = setup();
    const studio = signal('Warner Bros');
    store.load(studio);

    await jest.advanceTimersByTimeAsync(100);
    expect(store.movies()).toEqual([{ id: 1, name: 'Harry Potter' }]);

    studio.set('Universal');
    await jest.advanceTimersByTimeAsync(100);
    expect(store.movies()).toEqual([{ id: 2, name: 'Jurassic Park' }]);
  });

  it('should cancel a running request when a new one is made via a Signal', async () => {
    const store = setup();
    const studio = signal('Warner Bros');

    effect(() => {
      console.log(studio());
    });
    store.load(studio);

    await jest.advanceTimersByTimeAsync(50);

    studio.set('Universal');
    await jest.advanceTimersByTimeAsync(50);
    expect(store.movies()).toEqual([]);
    expect(store.loading()).toBe(true);

    await jest.advanceTimersByTimeAsync(50);
    expect(store.movies()).toEqual([{ id: 2, name: 'Jurassic Park' }]);
    expect(store.loading()).toBe(false);
  });
});
```

Be aware of the glitch-free effect when of Signal's. `rxMethod` relies on `effect` which might be required to be triggered manually via `TestBed.flushEffects()`.

If the mocked `MovieService` would work in a synchronous way, the following test would fail without `TestBed.flushEffects()`.

```typescript
describe('MoviesStore', () => {
  // ... beforeEach, and afterEach omitted

  it('should depend on flushEffects because of synchronous execution', () => {
    const moviesService = {
      load: jest.fn((studio: string) => of([studio === 'Warner Bros' ? { id: 1, name: 'Harry Potter' } : { id: 2, name: 'Jurassic Park' }])),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: MoviesService,
          useValue: moviesService,
        },
      ],
    });

    const store = TestBed.inject(MoviesStore);
    const studio = signal('Warner Bros');
    store.load(studio);
    TestBed.flushEffects(); // required
    expect(store.movies()).toEqual([{ id: 1, name: 'Harry Potter' }]);

    studio.set('Universal');
    TestBed.flushEffects(); // required
    expect(store.movies()).toEqual([{ id: 2, name: 'Jurassic Park' }]);
  });
});
```

### Custom extensions

Let's say we have an extension that plays the movie and tracks how long the user watched it. It exposes a `play` and `stop` method and a Signal which contains the id of the movies and the time spent watching it.

```typescript
type PlayTrackingState = {
  _currentId: number;
  _status: 'playing' | 'stopped';
  _startedAt: Date | undefined;
  trackedData: Record<number, number>;
};

const initialState: PlayTrackingState = {
  _currentId: 0,
  _status: 'stopped',
  _startedAt: undefined,
  trackedData: {},
};

export const withPlayTracking = () =>
  signalStoreFeature(
    withState(initialState),
    withMethods((store) => {
      const stop = () => {
        const startedAt = store._startedAt();
        if (!startedAt || store._status() === 'stopped') {
          return;
        }

        const timeSpent = new Date().getTime() - startedAt.getTime();
        const alreadySpent = store.trackedData()[store._currentId()] ?? 0;
        patchState(store, (state) => ({
          _currentId: 0,
          _status: 'stopped' as const,
          trackedData: { ...state.trackedData, [state._currentId]: alreadySpent + timeSpent },
        }));
      };

      return {
        play(id: number) {
          stop();
          patchState(store, {
            _currentId: id,
            _status: 'playing',
            _startedAt: new Date(),
          });
        },
        stop,
      };
    })
  );
```

There are two options to test this extension. In combination with the `MoviesStore` or in isolation.

If it is tested with the `MoviesStore`, it would be a test in the same way as the previous examples.

To test only the extension, we need to create an artificial "Wrapper" Signal Store. The test itself is then also straightforward.

```typescript
describe('withTrackedPlay', () => {
  const TrackedPlayStore = signalStore({providedIn: 'root'}, withPlayTracking();

  afterEach(async () => {
    await jest.runOnlyPendingTimersAsync()
    jest.useRealTimers();
  })

  it('should track movies', () => {
    useFakeTimers()
    const store = TestBed.inject(TrackedPlayStore)

    store.play(1);
    jest.advanceTimersByTime(1000);

    store.stop();
    store.play(2)
    jest.advanceTimersByTime(1000);

    store.play(3);
    jest.advanceTimersByTime(1000);

    store.play(1)
    jest.advanceTimersByTime(1000);
    store.stop()

    expect(store.trackedData()).toEqual({1: 2000, 2: 1000, 3: 1000});
  })
});
```

## Mocking the Signal Store

What was valid for testing the Signal Store itself is also valid for mocking the Signal Store. The Signal Store presents itself as a Service which can be mocked in the same way as any other service and by using the same tools.

A `MovieComponent` uses the `MoviesStore` to display the movies:

```typescript
@Component({
  selector: 'app-movies',
  template: ` <input type="text" [(ngModel)]="studio" [disabled]="store.loading()" placeholder="Name of Studio" />
    <ul>
      @for (movie of store.movies(); track movie.id) {
      <p>{{ movie.id }}: {{ movie.name }}</p>
      }
    </ul>`,
  standalone: true,
  imports: [FormsModule],
})
export class MoviesComponent {
  protected studio = signal('');
  protected readonly store = inject(MoviesStore);

  constructor() {
    this.store.load(this.studio);
  }
}
```

### Native Mocking

```typescript
it('should show movies (native Jest)', () => {
  const load = jest.fn<void, [Signal<string>]>();

  const moviesStore = {
    movies: signal(new Array<Movie>()),
    loading: signal(false),
    load,
  };

  TestBed.configureTestingModule({
    imports: [MoviesComponent],
    providers: [
      {
        provide: MoviesStore,
        useValue: moviesStore,
      },
    ],
  });

  const fixture = TestBed.createComponent(MoviesComponent);
  fixture.autoDetectChanges(true);

  const studio = load.mock.calls[0][0];
  const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;

  expect(studio()).toBe('');

  input.value = 'Warner Bros';
  input.dispatchEvent(new Event('input'));
  expect(studio()).toBe('Warner Bros');

  moviesStore.movies.set([
    { id: 1, name: 'Harry Potter' },
    { id: 2, name: 'The Dark Knight' },
  ]);
  fixture.detectChanges();

  const movieNames = fixture.debugElement.queryAll(By.css('p')).map((el) => el.nativeElement.textContent);
  expect(movieNames).toEqual(['1: Harry Potter', '2: The Dark Knight']);
});
```

The test mocks only those properties/methods which are used by the component in that particular test. Even if a Signal Store might have more methods, it is not the case that all of them have to be mocked.

### ng-mocks

ng-mocks is a popular library and can be used to mock the Signal Store as well.

```typescript
it('should show movies (ng-mocks)', () => {
  const movies = signal(new Array<Movie>());
  const loading = signal(false);
  const moviesStore = MockService(MoviesStore, {
    movies,
    loading,
    load: jest.fn<void, [Signal<string>]>(),
  });

  TestBed.configureTestingModule({
    imports: [MoviesComponent],
    providers: [{ provide: MoviesStore, useValue: moviesStore }],
  });

  // ...rest as in the previous example
});
```

### Further thoughts

It might be necessary not to mock everything. For example, computed value should be the original ones. If that is the case, one propably also needs to set the initial inner state or change it during the test. Even when the Signal Store runs with protected state.

We are currently looking into ways on how this can be done without introducing mocking features which are already available in other libraries.
