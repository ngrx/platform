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
    * [Partial Mocking via Spies](#partial-mocking-via-spies)
<!-- TOC -->

This is still a draft. Markdown is used for better readability. The rendered version of this guide is available at https://github.com/rainerhahnekamp/ngrx/blob/docs/signals/testing/projects/ngrx.io/content/guide/signals/signal-store/testing.md.

Once the content is finalized, we will replace markdown with `<code>` tags.

The examples used in this guide are available at https://github.com/rainerhahnekamp/ngrx-signal-store-testing

## Introduction

### On Testing in General

A Signal Store is a simple Angular Service, so the same testing techniques you use for services apply to Signal Stores as well. This guide focuses on providing examples for common testing scenarios.

A challenging part of testing is knowing how to handle asynchronous tasks and mocking. The examples use Jest (v29.5), but the same principles apply to other testing frameworks.

There are two main scenarios for testing:

1. Testing the `signalStore` itself,
2. Testing a component or service that uses the Signal Store.

In the first scenario, you’ll mock the dependencies of the Signal Store, while in the second scenario, you’ll mock the Signal Store itself.

### What to test

When testing the Signal Store, you should interact with it as any component or service would: through its public API.

One of the main concerns of testing is maintainability. The more tests are coupled to the internal implementation, the more likely they are to break frequently. Public APIs are more stable and less likely to change.

For example, if you want to test your store in a loading state, you shouldn’t set the loading property directly. Instead, trigger a loading method and assert against an exposed computed property or slice. This approach avoids dependency on the internal implementation, such as specific properties set during the loading state.

From this perspective, it’s clear that you shouldn’t access any private properties or methods of the Signal Store. Additionally, avoid running `patchState` if the state is protected.

### TestBed or not?

The Signal Store is a function that returns a class, allowing a test to instantiate the class and test it without the `TestBed`.

However, in practice, you’ll use the `TestBed because it offers many advantages, such as mocking dependencies and triggering the execution of effects.

Furthermore, crucial features of the SignalStore will not work, if they don't run in an injection context. Examples include the `rxMethod`, `inject` in `withMethods()`, and `withHooks()`.

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

The `TestBed` will instantiate the `MoviesStore`, allowing you to test it immediately.

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

Testing derived values of `withComputed` is also straightforward.

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

We use Jest's tools to manage asynchronous tasks. We avoid using `fakeAsync` or `waitForAsync` as they depend on zone.js and are incompatible with zoneless applications.

The "Angular way" of testing asynchronous code is to use the `ComponentFixture.whenStable` method, which is not available in this context.

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

What we want to test in addition is the proper handling of race conditions. That's why we use `switchMap`.

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

Be aware of the glitch-free effect when using Signals. The `rxMethod` relies on `effect`, which might need to be triggered manually via `TestBed.flushEffects()`.

If the mocked `MovieService` operates synchronously, the following test would fail without calling `TestBed.flushEffects()`.

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

Suppose we have an extension that plays a movie and tracks how long the user watches it. This extension provides a `play` and `stop` method, as well as a Signal that contains the movie’s ID and the time spent watching it.

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

There are two options for testing this extension: in combination with the `MoviesStore` or in isolation.

When tested with the `MoviesStore`, it follows the same approach as the previous examples.

To test the extension in isolation, we need to create an artificial “Wrapper” Signal Store. The test itself is then straightforward.

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

What applies to testing the Signal Store itself also applies to mocking it. The Signal Store behaves like any other service, meaning it can be mocked using the same tools and techniques used for other services.

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

The test mocks only the properties and methods that are used by the component in that particular test. Even if a Signal Store has additional methods, it is not necessary to mock all of them.

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

### "Partial Mocking" via Spies

We can also use partial mocking to mock only the `load` method. This approach has the advantage of allowing computeds to function correctly without needing to mock them.

```typescript
it('should show movies (spy)', () => {
  TestBed.configureTestingModule({
    imports: [MoviesComponent],
    providers: [
      {
        provide: MoviesService,
        useValue: {},
      },
    ],
  });

  const moviesStore = TestBed.inject(MoviesStore);
  const loadSpy = jest.spyOn(moviesStore, 'load');
  const fixture = TestBed.createComponent(MoviesComponent);

  fixture.autoDetectChanges(true);

  const studio = loadSpy.mock.calls[0][0];
  if (studio instanceof Observable || typeof studio === 'string') {
    throw new Error('Expected signal');
  }

  const input: HTMLInputElement = fixture.debugElement.query(
    By.css('input')
  ).nativeElement;

  expect(studio()).toBe('');

  input.value = 'Warner Bros';
  input.dispatchEvent(new Event('input'));
  expect(studio()).toBe('Warner Bros');

  patchState(moviesStore, {
      movies:
        [
          {id: 1, name: 'Harry Potter'},
          {id: 2, name: 'The Dark Knight'},
        ]
    }
  );

  fixture.detectChanges();

  const movies = fixture.debugElement.queryAll(By.css('p')).map((el) => el.nativeElement.textContent);
  expect(movies).toEqual(['1: Harry Potter', '2: The Dark Knight']);
})
```

This version requires that the test can modify the state, even if it is protected.

We are currently evaluating options for test helpers that allow state modification for protected states without introducing new mocking features that are already covered by existing testing frameworks.

Additionally, there is a community project by Gergely Szerovay that provides a comprehensive mocking library for Signal Stores. You can find more details here: https://www.angularaddicts.com/p/how-to-mock-ngrx-signal-stores
