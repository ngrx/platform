# Testing

## Test helpers

### `provideMockActions`

An Effect subscribes to the `Actions` Observable to perform side effects.
`provideMockActions` provides a mock provider of the `Actions` Observable to subscribe to, for each test individually.

<ngrx-code-example header="my.effects.spec.ts">

```ts
import { provideMockActions } from '@ngrx/effects/testing';

let actions$ = new Observable<Action>();

TestBed.configureTestingModule({
  providers: [provideMockActions(() => actions$)],
});
```

</ngrx-code-example>

Later in the test cases, we assign the `actions$` variable to a stream of actions.

<ngrx-code-example header="my.effects.spec.ts">

```ts
// by creating an Observable
actions$ = of({ type: 'Action One' });

// or by using a marble diagram
actions$ = hot('--a-', { a: { type: 'Action One' } });
```

</ngrx-code-example>

### Effects with parameters

For time dependant effects, for example `debounceTime`, we must be able override the default RxJS scheduler with the `TestScheduler` during our test.
That's why we create the effect as a function with parameters. By doing this we can assign default parameter values for the effect, and override these values later in the test cases.

This practice also allows us to hide the implementation details of the effect.
In the `debounceTime` test case, we can set the debounce time to a controlled value.

<ngrx-code-example header="my.effects.ts">

```ts
search$ = createEffect(() => ({
  // assign default values
  debounce = 300,
  scheduler = asyncScheduler
} = {}) =>
  this.actions$.pipe(
    ofType(BookActions.search),
    debounceTime(debounce, scheduler),
    ...
  )
);
```

</ngrx-code-example>

<ngrx-code-example header="my.effects.spec.ts">

```ts
// override the default values
effects.search$({
  debounce: 30,
  scheduler: getTestScheduler(),
});
```

</ngrx-code-example>

## Testing practices

### Marble diagrams

Testing Effects via marble diagrams is particularly useful when the Effect is time sensitive or when the Effect has a lot of behavior.

<ngrx-docs-alert type="help">

For a detailed look on the marble syntax, see [Writing marble tests](https://rxjs.dev/guide/testing/marble-testing).

The `hot`, `cold`, and `toBeObservable` methods are imported from [`jasmine-marbles`](https://www.npmjs.com/package/jasmine-marbles).

</ngrx-docs-alert>

<ngrx-code-example header="my.effects.spec.ts">

```ts
// create an actions stream to represent a user that is typing
actions$ = hot('-a-b-', {
  a: { type: '[Customers Page] Search Customers', name: 'J' },
  b: { type: '[Customers Page] Search Customers', name: 'Jes' },
})

// mock the service to prevent an HTTP request to return an array of customers
customersServiceSpy.searchCustomers.and.returnValue(
  cold('--a|', { a: [...] })
);

// expect the first action to debounce and not to dispatch
// expect the second action to result in a SUCCESS action
const expected = hot('-------a', {
  a: {
    type: '[Customers API] Search Customers Success',
    customers: [...],
  },
});

expect(
  effects.searchCustomers$({
    debounce: 20,
    scheduler: getTestScheduler(),
  })
).toBeObservable(expected);
```

</ngrx-code-example>

### With `TestScheduler`

Instead of using `jasmine-marbles`, we can also run tests with the [RxJS `TestScheduler`](https://rxjs.dev/guide/testing/marble-testing).

To use the `TestScheduler` we first have to instantiate it,
this can be done in the test case or within a `beforeEach` block.

<ngrx-code-example header="my.effects.spec.ts">

```ts
import { TestScheduler } from 'rxjs/testing';

let testScheduler: TestScheduler;

beforeEach(() => {
  testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
});
```

</ngrx-code-example>

The `TestScheduler` provides a `run` method which expects a callback, it's here where we write the test for an effect.
The callback method provides helper methods to mock Observable streams, and also assertion helper methods to verify the output of a stream.

<ngrx-code-example header="my.effects.spec.ts">

```ts
// more info about the API can be found at https://rxjs.dev/guide/testing/marble-testing#api
testScheduler.run(({ cold, hot, expectObservable }) => {
  // use the `hot` and `cold` helper methods to create the action and service streams
  actions$ = hot('-a', { a : { type: '[Customers Page] Get Customers' }});
  customersServiceSpy.getAllCustomers.and.returnValue(cold('--a|', { a: [...] }));

  // use the `expectObservable` helper method to assert if the output matches the expected output
  expectObservable(effects.getAll$).toBe('---c', {
    c: {
      type: '[Customers API] Get Customers Success',
      customers: [...],
    }
  });
});
```

</ngrx-code-example>

By using the `TestScheduler` we can also test effects dependent on a scheduler.
Instead of creating an effect as a method to override properties in test cases, as shown in [`Effects with parameters`](#effects-with-parameters), we can rewrite the test case by using the `TestScheduler`.

<ngrx-code-example header="my.effects.spec.ts">

```ts
testScheduler.run(({ cold, hot, expectObservable }) => {
  // create an actions stream to represent a user that is typing
  actions$ = hot('-a-b-', {
    a: { type: '[Customers Page] Search Customers', name: 'J' },
    b: { type: '[Customers Page] Search Customers', name: 'Jes' },
  })

  // mock the service to prevent an HTTP request to return an array of customers
  customersServiceSpy.searchCustomers.and.returnValue(
    cold('--a|', { a: [...] })
  );

  // the `300ms` is the set debounce time
  // the `5ms` represents the time for the actions stream and the service to return a value
  expectObservable(effects.searchCustomers).toBe('300ms 5ms c', {
    c: {
      type: '[Customers API] Search Customers Success',
      customers: [...],
    },
  });
});
```

</ngrx-code-example>

### With Observables

To test simple Effects, it might be easier to create an Observable instead of using a marble diagram.

<ngrx-code-example header="my.effects.spec.ts">

```ts
// create an actions stream and immediately dispatch a GET action
actions$ = of({ type: '[Customers Page] Get Customers' });

// mock the service to prevent an HTTP request
customersServiceSpy.getAllCustomers.and.returnValue(of([...]));

// subscribe to the Effect stream and verify it dispatches a SUCCESS action
effects.getAll$.subscribe(action => {
  expect(action).toEqual({
    type: '[Customers API] Get Customers Success',
    customers: [...],
  });
  done();
});
```

</ngrx-code-example>

### With `ReplaySubject`

As an alternative, it's also possible to use `ReplaySubject`.

<ngrx-code-example header="my.effects.spec.ts">

```ts
// create a ReplaySubject
actions$ = new ReplaySubject(1);

// mock the service to prevent an HTTP request
customersServiceSpy.getAllCustomers.and.returnValue(of([...]));

// dispatch the GET action
(actions$ as ReplaySubject).next({ type: '[Customers Page] Get Customers' })

// subscribe to the Effect stream and verify it dispatches a SUCCESS action
effects.getAll$.subscribe(action => {
  expect(action).toEqual({
    type: '[Customers API] Get Customers Success',
    customers: [...],
  });
  done();
});
```

</ngrx-code-example>

## Examples

### A non-dispatching Effect

Until now, we only saw Effects that dispatch an Action and we verified the dispatched action.
With an Effect that does not dispatch an action, we can't verify the Effects stream.
What we can do, is verify the side-effect has been called.

An example of this is to verify we navigate to the correct page.

<ngrx-code-example header="my.effects.spec.ts">

```ts
it('should navigate to the customers detail page', () => {
  actions$ = of({
    type: '[Customers Page] Customer Selected',
    name: 'Bob',
  });

  // create a spy to verify the navigation will be called
  spyOn(router, 'navigateByUrl');

  // subscribe to execute the Effect
  effects.selectCustomer$.subscribe();

  // verify the navigation has been called
  expect(router.navigateByUrl).toHaveBeenCalledWith('customers/bob');
});
```

</ngrx-code-example>

### Effect that uses state

Leverage [`MockStore`](/guide/store/testing#using-a-mock-store) and [`MockSelectors`](/guide/store/testing#using-mock-selectors) to test Effects that are selecting slices of the state.

An example of this is to not fetch an entity (customer in this case) when it's already in the store state.

<ngrx-code-example header="my.effects.spec.ts">

```ts
let actions$: Observable<Action>;

TestBed.configureTestingModule({
  providers: [
    CustomersEffects,
    provideMockActions(() => actions$),
    // mock the Store and the selectors that are used within the Effect
    provideMockStore({
      selectors: [
        {
          selector: selectCustomers,
          value: {
            Bob: { name: 'Bob' },
          },
        },
      ],
    }),
  ],
});

effects = TestBed.inject<CustomersEffects>(CustomersEffects);

it('should not fetch if the user is already in the store', () => {
  actions$ = hot('-a--', {
    a: { type: '[Customers Page] Search Customers', name: 'Bob' },
  });

  // there is no output, because Bob is already in the Store state
  const expected = hot('----');

  expect(effects.getByName$).toBeObservable(expected);
});
```

</ngrx-code-example>

### Setup without `TestBed`

Instead of using the Angular `TestBed`, we can instantiate the Effect class.

<ngrx-code-example header="my.effects.spec.ts">

```ts
it('should get customers', () => {
  // instead of using `provideMockActions`,
  // define the actions stream by creating a new `Actions` instance
  const actions = new Actions(
    hot('-a--', {
      a: { type: '[Customers Page] Get Customers' },
    })
  );

  // create the effect
  const effects = new CustomersEffects(actions, customersServiceSpy);

  const expected = hot('-a--', {
    a: {
      type: '[Customers API] Get Customers Success',
      customers: [...],
    }
  });

  // expect remains the same
  expect(effects.getAll$).toBeObservable(expected);
})
```

</ngrx-code-example>

For an Effect with store interaction, use `createMockStore` to create a new instance of `MockStore`.

<ngrx-code-example header="my.effects.spec.ts">

```ts
it('should get customers', () => {
  // create the store, and provide selectors.
  const store = createMockStore({
    selectors: [
      { selector: selectCustomers, value: { Bob: { name: 'Bob' } } },
    ],
  });

  // instead of using `provideMockActions`,
  // define the actions stream by creating a new `Actions` instance
  const actions = new Actions(
    hot('-a--', {
      a: {
        type: '[Search Customers Page] Get Customer',
        name: 'Bob',
      },
    })
  );

  // create the effect
  const effects = new CustomersEffects(
    store as Store,
    actions,
    customersServiceSpy
  );

  // there is no output, because Bob is already in the Store state
  const expected = hot('----');

  expect(effects.getByName$).toBeObservable(expected);
});
```

</ngrx-code-example>

### Functional Effects

Functional effects can be tested like any other function. If we inject all dependencies as effect function arguments, `TestBed` is not required to mock dependencies. Instead, we can pass fake instances as input arguments to the functional effect.

<ngrx-code-example header="actors.effects.spec.ts">

```ts
import { of } from 'rxjs';

import { loadActors } from './actors.effects';
import { ActorsService } from './actors.service';
import { actorsMock } from './actors.mock';
import { ActorsPageActions } from './actors-page.actions';
import { ActorsApiActions } from './actors-api.actions';

it('loads actors successfully', (done) => {
  const actorsServiceMock = {
    getAll: () => of(actorsMock),
  } as ActorsService;
  const actionsMock$ = of(ActorsPageActions.opened());

  loadActors(actionsMock$, actorsServiceMock).subscribe((action) => {
    expect(action).toEqual(
      ActorsApiActions.actorsLoadedSuccess({ actors: actorsMock })
    );
    done();
  });
});
```

</ngrx-code-example>

<ngrx-docs-alert type="help">

You can check the `loadActors` effect implementation [here](guide/effects#functional-effects).

</ngrx-docs-alert>
