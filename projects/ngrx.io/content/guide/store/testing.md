# Testing

### Using a Mock Store

The `provideMockStore()` function registers providers that allow you to mock out the `Store` for testing functionality that has a dependency on `Store` without setting up reducers.
You can write tests validating behaviors corresponding to the specific state snapshot easily.

<div class="alert is-helpful">

**Note:** All dispatched actions don't affect the state, but you can see them in the `Actions` stream.

</div>

Usage:

<code-example header="auth.guard.spec.ts">
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';

import { AuthGuard } from '../guards/auth.guard';

describe('Auth Guard', () => {
  let guard: AuthGuard;
  let store: MockStore;
  const initialState = { loggedIn: false };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // any modules needed
      ],
      providers: [
        AuthGuard,
        provideMockStore({ initialState }),
        // other providers
      ],
    });

    store = TestBed.inject(MockStore);
    guard = TestBed.inject(AuthGuard);
  });

  it('should return false if the user state is not logged in', () => {
    const expected = cold('(a|)', { a: false });

    expect(guard.canActivate()).toBeObservable(expected);
  });

  it('should return true if the user state is logged in', () => {
    store.setState({ loggedIn: true });

    const expected = cold('(a|)', { a: true });

    expect(guard.canActivate()).toBeObservable(expected);
  });
});
</code-example>

### Using Mock Selectors

`MockStore` also provides the ability to mock individual selectors to return a passed value using the `overrideSelector()` method. When the selector is invoked by the `select` method, the returned value is overridden by the passed value, regardless of the current state in the store.

`overrideSelector()` returns a `MemoizedSelector`. To update the mock selector to return a different value, use the `MemoizedSelector`'s `setResult()` method. Updating a selector's mock value will not cause it to emit automatically. To trigger an emission from all selectors, use the `MockStore.refreshState()` method after updating the desired selectors.

`overrideSelector()` supports mocking the `select` method (used in RxJS pipe) and the `Store` `select` instance method using a string or selector.

Usage:

<code-example header="user-greeting.component.ts" path="testing-store/src/app/user-greeting.component.ts"></code-example>

<code-example header="user-greeting.component.spec.ts" path="testing-store/src/app/user-greeting.component.spec.ts"></code-example>

In this example, we mock the `getUsername` selector by using `overrideSelector`, passing in the `getUsername` selector with a default mocked return value of `'John'`. In the second test, we use `setResult()` to update the mock selector to return `'Brandon'`, then we use `MockStore.refreshState()` to trigger an emission from the `getUsername` selector.

<div class="alert is-helpful">

**Note:** `MockStore` will reset all of the mocked selectors after each test (in the `afterEach()` hook) by calling the `MockStore.resetSelectors()` method.

</div>

Try the <live-example name="testing-store"></live-example>.

### Integration Testing

An integration test should verify that the `Store` coherently works together with our components and services that inject `Store`. An integration test will not mock the store or individual selectors, as unit tests do, but will instead integrate a `Store` by using `StoreModule.forRoot` in your `TestBed` configuration. Here is an example of an integration test for the `MyCounterComponent` introduced in the [getting started tutorial](guide/store#tutorial).

<code-example header="src/app/tests/integration.spec.ts" path="store/src/app/tests/integration.spec.ts">
</code-example>

The integration test sets up the dependent `Store` by importing the `StoreModule`. In this example, we assert that clicking a button dispatches an action that causes the state to be updated with an incremented, decremented, or reset counter value, which is correctly emitted by the selector.

### Testing selectors

You can use the projector function used by the selector by accessing the `.projector` property.

<code-example header="my.reducer.ts">
export interface State {
  evenNums: number[];
  oddNums: number[];
}

export const selectSumEvenNums = createSelector(
  (state: State) => state.evenNums,
  evenNums => evenNums.reduce((prev, curr) => prev + curr)
);
export const selectSumOddNums = createSelector(
  (state: State) => state.oddNums,
  oddNums => oddNums.reduce((prev, curr) => prev + curr)
);
export const selectTotal = createSelector(
  selectSumEvenNums,
  selectSumOddNums,
  (evenSum, oddSum) => evenSum + oddSum
);
</code-example>

<code-example header="my.reducer.spec.ts">
import * as fromMyReducers from './my-reducers';

describe('My Selectors', () => {
  it('should calc selectTotal', () => {
    expect(fromMyReducers.selectTotal.projector(2, 3)).toBe(5);
  });
});
</code-example>
