# Testing

## Test helpers

### `provideMockActions`

An Effect subscribes to the `Actions` Observable to perform side effects.
`provideMockActions` provides a mock provider of the `Actions` Observable to subscribe to, for each test individually.

<code-example header="my.effects.spec.ts">
import { provideMockActions } from '@ngrx/effects/testing';

let actions$: Observable&lt;Action&gt;;

TestBed.configureTestingModule({
  providers: [provideMockActions(() => actions$)],
});
</code-example>

Later in the test cases, we assign the `actions$` variable to a stream of actions.

<code-example header="my.effects.spec.ts">
// by creating an Observable
actions$ = of({ type: 'ACTION ONE' });

// or by using a marble diagram
actions$ = hot('--a-', { a: { type: 'ACTION ONE' } });
</code-example>

### Effects with parameters

Creating an Effect as a function gives the opportunity to override defaults while testing the Effect.
A common use case is to use the RxJS `TestScheduler`, or to override a default time.

<code-example header="my.effects.ts">
search$ = createEffect(() => ({
  debounce = 300,
  scheduler = asyncScheduler
} = {}) =>
  this.actions$.pipe(
    ofType(BookActions.search),
    debounceTime(debounce, scheduler),
    ...
  )
);
</code-example>

<code-example header="my.effects.spec.ts">
effects.search$({
  debounce: 30,
  scheduler: getTestScheduler(),
});
</code-example>

## Testing practices

### Marble diagrams

Testing Effects via marble diagrams is particularly useful when the Effect is time sensitive or when the Effect has a lot of behavior.

<div class="alert is-helpful">

For a detailed look on the marble syntax, see [Writing marble tests](https://rxjs.dev/guide/testing/marble-testing).

The `hot`, `cold`, and `toBeObservable` functions are imported from [`jasmine-marbles`](https://www.npmjs.com/package/jasmine-marbles).

</div>

<code-example header="my.effects.spec.ts">
// create an actions stream to represent a user that is typing
actions$ = hot('-a-b-', {
  a: { type: 'SEARCH CUSTOMERS', name: 'J' },
  b: { type: 'SEARCH CUSTOMERS', name: 'Jes' },
})

// mock the service to prevent an HTTP request to return an array of customers
customersServiceSpy.searchCustomers.and.returnValue(
  cold('--a|', { a: [...] })
);

// expect the first action to debounce and not to dispatch
// expect the second action to result in a SUCCESS action
const expected = hot('-------a', {
  a: {
    type: 'SEARCH CUSTOMERS SUCCESS',
    customers: [...],
  },
});

expect(
  effects.searchCustomers$({
    debounce: 20,
    scheduler: getTestScheduler(),
  })
).toBeObservable(expected);
</code-example>

### With Observables

To test simple Effects, it might be easier to create an Observable instead of using a marble diagram.

<code-example header="my.effects.spec.ts">
// create an actions stream and immediately dispatch a GET action
actions$ = of({ type: 'GET CUSTOMERS' });

// mock the service to prevent an HTTP request
customersServiceSpy.getAllCustomers.and.returnValue(of([...]));

// subscribe to the Effect stream and verify it dispatches a SUCCESS action
effects.getAll$.subscribe(action => {
  expect(action).toEqual({
    type: 'GET CUSTOMERS SUCCESS',
    customers: [...],
  });
});
</code-example>

### With `ReplaySubject`

As an alternative, it's also possible to use `ReplaySubject`.

<code-example header="my.effects.spec.ts">
// create a ReplaySubject
actions$ = new ReplaySubject(1);

// mock the service to prevent an HTTP request
customersServiceSpy.getAllCustomers.and.returnValue(of([...]));

// dispatch the GET action
(actions$ as ReplaySubject).next( type: 'GET CUSTOMERS' })

// subscribe to the Effect stream and verify it dispatches a SUCCESS action
effects.getAll$.subscribe(action => {
  expect(action).toEqual({
    type: 'GET CUSTOMERS SUCCESS',
    customers: [...],
  });
});
</code-example>

## Examples

### A non-dispatching Effect

Until now, we only saw Effects that dispatch an Action and we verified the dispatched action.
With an Effect that does not dispatch an action, we can't verify the Effects stream.
What we can do, is verify the side-effect has been called.

An example of this is to verify we navigate to the correct page.

<code-example header="my.effects.spec.ts">
it('should navigate to the customers detail page', () => {
  actions$ = of({ type: 'SELECT CUSTOMER', name: 'Bob' });
  
  // create a spy to verify the navigation will be called
  spyOn(router, 'navigateByUrl');

  // subscribe to execute the Effect
  effects.selectCustomer$.subscribe();

  // verify the navigation has been called
  expect(router.navigateByUrl).toHaveBeenCalledWith('customers/bob');
});
</code-example>

### Effect that uses state

Leverage [`MockStore`](/guide/store/testing#using-a-mock-store) and [`MockSelectors`](/guide/store/testing#using-mock-selectors) to test Effects that are selecting slices of the state.

An example of this is to not fetch an entity (customer in this case) when it's already in the store state.

<code-example header="my.effects.spec.ts">
let actions$: Observable&lt;Action&gt;;

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

effects = TestBed.get&lt;CustomersEffects&gt;(CustomersEffects);

it('should not fetch if the user is already in the store', () => {
  actions$ = hot('-a--', {
    a: { type: 'GET CUSTOMER BY NAME', name: 'Bob' },
  });

  // there is no output, because Bob is already in the Store state
  const expected = hot('----');

  expect(effects.getByName$).toBeObservable(expected);
});
</code-example>

### Setup without `TestBed`

Instead of using the Angular `TestBed`, we can instantiate the Effect class.

<code-example header="my.effects.spec.ts">
it('should get customers', () => {
  // instead of using `provideMockActions`,
  // define the actions stream by creating a new `Actions` instance
  const actions = new Actions(
    hot('-a--', {
      a: { type: 'GET CUSTOMERS' },
    })
  );

  // create the effect
  const effects = new CustomersEffects(actions, customersServiceSpy);

  // expect remains the same
  effects.getAll$.subscribe(action => {
    expect(action).toEqual({
      type: 'GET CUSTOMERS SUCCESS',
      customers: [...],
    });
  });
})
</code-example>

For an Effect with store interaction, it's possible to create an Observable `Store`.

<code-example header="my.effects.spec.ts">
it('should get customers', () => {
  // create the store, this can be just an Observable
  const store = of({}) as Store&lt;Action&gt;;

  // instead of using `provideMockActions`,
  // define the actions stream by creating a new `Actions` instance
  const actions = new Actions(
    hot('-a--', {
      a: { type: 'GET CUSTOMER BY NAME', name: 'Bob' },
    })
  );

  // mock the selector
  selectCustomers.setResult({
    Bob: { name: 'Bob' },
  });

  // create the effect
  const effects = new CustomersEffects(store, actions, customersServiceSpy);

  // there is no output, because Bob is already in the Store state
  const expected = hot('----');

  expect(effects.getByName$).toBeObservable(expected);
});
</code-example>
