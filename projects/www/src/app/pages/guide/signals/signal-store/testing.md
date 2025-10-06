# Testing

A SignalStore is a straightforward Angular service, and the same testing techniques applied to other services also apply to SignalStore. This guide provides examples for common testing scenarios.

One of the challenges in testing is managing asynchronous tasks and mocking dependencies. Although the examples use Jest, the same principles are applicable to other testing frameworks.

There are two primary scenarios for testing:

1. Testing the SignalStore itself.
2. Testing a component or service that utilizes the SignalStore.

In the first scenario, the dependencies of the SignalStore should be mocked, while in the second scenario, the SignalStore itself needs to be mocked.

---

When testing the SignalStore, interaction should occur through its public API, as any component or service would.

A key concern in testing is maintainability. The more tests are coupled to internal implementations, the more frequently they are likely to break. Public APIs are generally more stable and less prone to change.

For example, when testing the store in a loading state, avoid directly setting the loading property. Instead, trigger a loading method and assert against an exposed computed property or slice. This approach reduces dependency on internal implementations, such as properties set during the loading state.

From this perspective, private properties or methods of the SignalStore should not be accessed.

---

The SignalStore is a function that returns a class, allowing tests to instantiate the class and test it without using `TestBed`.

However, in practice, `TestBed` is typically used due to its numerous advantages, such as the ability to mock dependencies and trigger the execution of effects.

Additionally, key features of the SignalStore do not function properly if they do not run in an injection context. Examples include `rxMethod`, the use of `inject` within `withMethods()`, and `withHooks()`.

<ngrx-docs-alert type="help">

**Note:** Using the `TestBed` is also the recommendation of the [Angular team](https://github.com/angular/angular/issues/54438#issuecomment-1971813177).

</ngrx-docs-alert>

## Testing the SignalStore

The following example demonstrates the testing of a SignalStore:

### Globally provided

<ngrx-code-example header="movies.store.ts">

```ts
import { signalStore, withState } from '@ngrx/signals';

type Movie = {
  id: number;
  name: string;
};

type State = { movies: Movie[] };

export const MoviesStore = signalStore(
  { providedIn: 'root' },
  withState<State>({
    movies: [
      { id: 1, name: 'A New Hope' },
      { id: 2, name: 'Into Darkness' },
      { id: 3, name: 'The Lord of the Rings' },
    ],
  })
);
```

</ngrx-code-example>

The `TestBed` instantiates the `MoviesStore`, enabling immediate testing.

<ngrx-code-example header="movies.store.spec.ts">

```ts
import { MoviesStore } from './movies-store';
import { TestBed } from '@angular/core/testing';

describe('MoviesStore', () => {
  it('should verify that three movies are available', () => {
    const store = TestBed.inject(MoviesStore);

    expect(store.movies()).toHaveLength(3);
  });
});
```

</ngrx-code-example>

### Locally Provided

This is possible due to the `MoviesStore` being provided globally. For locally provided stores, some adjustments to the test are required.

<ngrx-code-example header="movies.store.ts">

```ts
export const MoviesStore = signalStore(
  withState({
    movies: [
      // ... entries
    ],
  })
);
```

</ngrx-code-example>

The required addition is that the internal `TestingModule` must provide the `MoviesStore`.

<ngrx-code-example header="movies.store.spec.ts">

```ts
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

</ngrx-code-example>

### `unprotected`

The `unprotected` function from the `@ngrx/signals/testing` plugin is used to update the protected state of a SignalStore for testing purposes.
This utility bypasses state encapsulation, making it possible to test state changes and their impacts.

```ts
// counter.store.ts
const CounterStore = signalStore(
  { providedIn: 'root' },
  withState({ count: 1 }),
  withComputed(({ count }) => ({
    doubleCount: computed(() => count() * 2),
  }))
);

// counter.store.spec.ts
import { TestBed } from '@angular/core/testing';
import { unprotected } from '@ngrx/signals/testing';

describe('CounterStore', () => {
  it('recomputes doubleCount on count changes', () => {
    const counterStore = TestBed.inject(CounterStore);

    patchState(unprotected(counterStore), { count: 10 });
    expect(counterStore.doubleCount()).toBe(20);
  });
});
```

### `withComputed`

Testing derived values of `withComputed` is also straightforward.

<ngrx-code-example header="movies.store.ts">

```ts
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

</ngrx-code-example>

<ngrx-code-example header="movies.store.spec.ts">

```ts
import { MoviesStore } from './movies.store';

describe('MoviesStore', () => {
  it('should verify that three movies are available', () => {
    const store = TestBed.inject(MoviesStore);

    expect(store.moviesCount()).toBe(3);
  });
});
```

</ngrx-code-example>

### `withMethods`, Dependency Injection, and Asynchronous Tasks

A loading method asynchronously retrieves movies by studio in this scenario.

<ngrx-code-example header="movies.store.ts">

```ts
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

</ngrx-code-example>

The `MoviesService` is mocked in the test, with the implementation returning the result as a `Promise`.

<ngrx-code-example header="movies.store.spec.ts">

```ts
describe('MoviesStore', () => {
  it('should load movies of Warner Bros', fakeAsync(() => {
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

    tick();

    expect(store.moviesCount()).toBe(2);
    expect(store.loading()).toBe(false);
  }));
});
```

</ngrx-code-example>

<ngrx-docs-alert type="help">

**Note:** Manually mocking dependencies is not required. Libraries such as ng-mocks, @testing-library/angular, and [jest|jasmine]-auto-spies can be used for this purpose.

</ngrx-docs-alert>

### `rxMethod`

The `load` method is created using `rxMethod` to accommodate a component that provides an input field for the studio and initiates loading as soon as a user types in a name.

In this scenario, the `MovieService` returns an `Observable<Movie[]>` instead of a `Promise<Movie[]>`.

<ngrx-code-example header="movies.store.ts">

```ts
export const MoviesStore = signalStore(
  // ... code omitted
  withMethods((store, moviesService = inject(MoviesService)) => ({
    load: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((studio) =>
          moviesService.load(studio).pipe(
            tapResponse({
              next: (movies) =>
                patchState(store, { movies, loading: false }),
              error: console.error,
            })
          )
        )
      )
    ),
  }))
);
```

</ngrx-code-example>

Since `rxMethod` accepts a string as a parameter, the previous test remains valid.

An additional focus in testing is ensuring proper handling of race conditions, which is why `switchMap` is used.

The parameter's type can also be `Signal<number>` or `Observable<number>`, in addition to `number`.

#### With Observables

The goal is to test whether the `load` method properly handles the scenario where a new studio name is entered before or after the previous request has completed.

<ngrx-code-example header="movies.store.spec.ts">

```ts
describe('MoviesStore', () => {
  // ... beforeEach and afterEach omitted

  const setup = () => {
    const moviesService = {
      load: jest.fn((studio: string) =>
        of([
          studio === 'Warner Bros'
            ? { id: 1, name: 'Harry Potter' }
            : { id: 2, name: 'Jurassic Park' },
        ]).pipe(delay(100))
      ),
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

  it('should load two times', fakeAsync(() => {
    const store = setup();

    const studio$ = new Subject<string>();
    store.load(studio$);
    studio$.next('Warner Bros');

    tick(100);
    expect(store.movies()).toEqual([{ id: 1, name: 'Harry Potter' }]);

    studio$.next('Universal');
    tick(100);
    expect(store.movies()).toEqual([
      { id: 2, name: 'Jurassic Park' },
    ]);
  }));

  it('should cancel a running request when a new one is made', fakeAsync(() => {
    const store = setup();

    const studio$ = new Subject<string>();
    store.load(studio$);
    studio$.next('Warner Bros');

    tick(50);
    studio$.next('Universal');

    tick(50);
    expect(store.movies()).toEqual([]);
    expect(store.loading()).toBe(true);

    tick(50);
    expect(store.movies()).toEqual([
      { id: 2, name: 'Jurassic Park' },
    ]);
    expect(store.loading()).toBe(false);
  }));
});
```

</ngrx-code-example>

By utilizing the testing framework's function to manage time, both scenarios can be verified.

The test also employs a setup function to prevent code duplication, a common pattern in testing and an alternative to the `beforeEach` function. In this case, each test can choose whether to use the setup function or not.

#### With Signals

Testing both scenarios with a `Signal` type as input is similar to testing with Observables.

This similarity arises primarily due to the asynchronous tasks involved.

<ngrx-code-example header="movies.store.spec.ts">

```ts
describe('MoviesStore', () => {
  // ... setup omitted

  it('should test two sequential loads with a Signal', fakeAsync(() => {
    const store = setup();
    const studio = signal('Warner Bros');
    store.load(studio);

    tick(100);
    expect(store.movies()).toEqual([{ id: 1, name: 'Harry Potter' }]);

    studio.set('Universal');
    tick(100);
    expect(store.movies()).toEqual([
      { id: 2, name: 'Jurassic Park' },
    ]);
  }));

  it('should cancel a running request when a new one is made via a Signal', fakeAsync(() => {
    const store = setup();
    const studio = signal('Warner Bros');

    effect(() => {
      console.log(studio());
    });
    store.load(studio);

    tick(50);

    studio.set('Universal');
    tick(50);
    expect(store.movies()).toEqual([]);
    expect(store.loading()).toBe(true);

    tick(50);
    expect(store.movies()).toEqual([
      { id: 2, name: 'Jurassic Park' },
    ]);
    expect(store.loading()).toBe(false);
  }));
});
```

</ngrx-code-example>

It is important to account for the glitch-free effect when using Signals. The `rxMethod` relies on `effect`, which may need to be triggered manually through `TestBed.tick()`.

If the mocked `MovieService` operates synchronously, the following test fails unless `TestBed.tick()` is called.

<ngrx-code-example header="movies.store.spec.ts">

```ts
describe('MoviesStore', () => {
  // ... beforeEach, and afterEach omitted

  it('should depend on flushEffects because of synchronous execution', () => {
    const moviesService = {
      load: jest.fn((studio: string) =>
        of([
          studio === 'Warner Bros'
            ? { id: 1, name: 'Harry Potter' }
            : { id: 2, name: 'Jurassic Park' },
        ])
      ),
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
    TestBed.tick(); // required
    expect(store.movies()).toEqual([{ id: 1, name: 'Harry Potter' }]);

    studio.set('Universal');
    TestBed.tick(); // required
    expect(store.movies()).toEqual([
      { id: 2, name: 'Jurassic Park' },
    ]);
  });
});
```

</ngrx-code-example>

## Mocking the SignalStore

What applies to testing the SignalStore also applies to mocking it. The SignalStore functions like any other service, meaning it can be mocked using the same tools and techniques applied to other services.

The `MovieComponent` utilizes the `MoviesStore` to display movies:

<ngrx-code-example header="movies.component.ts">

```ts
@Component({
  selector: 'app-movies',
  template: `
    <input
      type="text"
      [(ngModel)]="studio"
      [disabled]="store.loading()"
      placeholder="Name of Studio"
    />

    <ul>
      @for (movie of store.movies(); track movie.id) {
        <p>{{ movie.id }}: {{ movie.name }}</p>
      }
    </ul>
  `,
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

</ngrx-code-example>

### Native Mocking

<ngrx-code-example header="movies.component.spec.ts">

```ts
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
  const input: HTMLInputElement = fixture.debugElement.query(
    By.css('input')
  ).nativeElement;

  expect(studio()).toBe('');

  input.value = 'Warner Bros';
  input.dispatchEvent(new Event('input'));
  expect(studio()).toBe('Warner Bros');

  moviesStore.movies.set([
    { id: 1, name: 'Harry Potter' },
    { id: 2, name: 'The Dark Knight' },
  ]);
  fixture.detectChanges();

  const movieNames = fixture.debugElement
    .queryAll(By.css('p'))
    .map((el) => el.nativeElement.textContent);
  expect(movieNames).toEqual([
    '1: Harry Potter',
    '2: The Dark Knight',
  ]);
});
```

</ngrx-code-example>

The test mocks only the properties and methods used by the component in the specific test. Even if a SignalStore contains additional methods, it is not necessary to mock all of them.

### "Partial Mocking" via Spies

Partial mocking can be used to mock only the `load` method. This approach allows computed properties to function correctly without requiring them to be mocked.

<ngrx-code-example header="movies.component.spec.ts">

```ts
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
    movies: [
      { id: 1, name: 'Harry Potter' },
      { id: 2, name: 'The Dark Knight' },
    ],
  });

  fixture.detectChanges();

  const movies = fixture.debugElement
    .queryAll(By.css('p'))
    .map((el) => el.nativeElement.textContent);
  expect(movies).toEqual(['1: Harry Potter', '2: The Dark Knight']);
});
```

</ngrx-code-example>

This version requires the `MoviesStore` state to be unprotected.

## Integration Tests

Services attached to a component are often simple, and writing unit tests for them may not always be necessary, particularly when considering the returned value and maintenance costs. In such cases, it is more effective to test the services together with the component as a whole. This type of testing is commonly referred to as integration testing.

The same applies to the SignalStore. If the SignalStore, such as the `MoviesStore`, is relatively simple, a single test can cover both the `MoviesComponent` and the `MoviesStore`. However, the `HttpClient` must still be replaced with a test double.

<ngrx-code-example header="movies.spec.ts">

```ts
it('should show movies with MoviesStore', async () => {
  const fixture = TestBed.configureTestingModule({
    imports: [MoviesComponent],
    providers: [provideHttpClient(), provideHttpClientTesting()],
  }).createComponent(MoviesComponent);

  const ctrl = TestBed.inject(HttpTestingController);

  fixture.autoDetectChanges(true);

  const input: HTMLInputElement = fixture.debugElement.query(
    By.css('input')
  ).nativeElement;
  input.value = 'Warner Bros';
  input.dispatchEvent(new Event('input'));

  ctrl
    .expectOne('https://movies.com/studios?query=Warner%20Bros')
    .flush([
      { id: 1, name: 'Harry Potter' },
      { id: 2, name: 'The Dark Knight' },
    ]);
  await fixture.whenStable();

  const movies = fixture.debugElement
    .queryAll(By.css('p'))
    .map((el) => el.nativeElement.textContent);
  expect(movies).toEqual(['1: Harry Potter', '2: The Dark Knight']);
  ctrl.verify();
});
```

</ngrx-code-example>

This test assumes that the `MoviesService` sends a request.

## Testing Custom Extensions

An extension is responsible for playing a movie and tracking the duration of viewership. The extension provides `play` and `stop` methods, along with a Signal containing the movie's ID and the time spent watching it.

<ngrx-code-example header="with-play-tracking.ts">

```ts
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
        const alreadySpent =
          store.trackedData()[store._currentId()] ?? 0;
        patchState(store, (state) => ({
          _currentId: 0,
          _status: 'stopped' as const,
          trackedData: {
            ...state.trackedData,
            [state._currentId]: alreadySpent + timeSpent,
          },
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

</ngrx-code-example>

There are two options for testing this extension: in combination with the `MoviesStore` or in isolation.

When tested with the `MoviesStore`, the same approach as in previous examples is followed.

To test the extension in isolation, an artificial "Wrapper" SignalStore is created. The test process remains straightforward.

<ngrx-code-example header="with-play-tracking.spec.ts">

```ts
describe('withTrackedPlay', () => {
  const TrackedPlayStore = signalStore(
    { providedIn: 'root' },
    withPlayTracking()
  );

  it('should track movies', fakeAsync(() => {
    const store = TestBed.inject(TrackedPlayStore);

    store.play(1);
    tick(1000);

    store.stop();
    store.play(2);
    tick(1000);

    store.play(3);
    tick(1000);

    store.play(1);
    tick(1000);
    store.stop();

    expect(store.trackedData()).toEqual({
      1: 2000,
      2: 1000,
      3: 1000,
    });
  }));
});
```

</ngrx-code-example>
