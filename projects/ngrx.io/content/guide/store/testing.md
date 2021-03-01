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

<code-example header="src/app/state/books.selectors.ts" path="testing-store/src/app/state/books.selectors.ts"></code-example>

<code-example header="src/app/app.component.spec.ts (Using Mock Selectors) " path="store-walkthrough/src/app/tests/app.component.1.spec.ts" region="mockSelector"></code-example>

In this example based on the [walkthrough](guide/store/walkthrough), we mock the `selectBooks` selector by using `overrideSelector`, passing in the `selectBooks` selector with a default mocked return value of an array of books. Similarly, we mock the `selectBookCollection` selector and pass the selector together with another array. In the test, we use `setResult()` to update the mock selectors to return new array values, then we use `MockStore.refreshState()` to trigger an emission from the `selectBooks` and `selectBookCollection` selectors.

<div class="alert is-helpful">

**Note:** `MockStore` will reset all of the mocked selectors after each test (in the `afterEach()` hook) by calling the `MockStore.resetSelectors()` method.

</div>

Try the <live-example name="testing-store"></live-example>.

### Integration Testing

An integration test should verify that the `Store` coherently works together with our components and services that inject `Store`. An integration test will not mock the store or individual selectors, as unit tests do, but will instead integrate a `Store` by using `StoreModule.forRoot` in your `TestBed` configuration. Here is part of an integration test for the `AppComponent` introduced in the [walkthrough](guide/store/walkthrough).

<code-example header="src/app/tests/integration.spec.ts (Integrate Store)" path="store-walkthrough/src/app/tests/integration.spec.ts" region="integrate">
</code-example>

The integration test sets up the dependent `Store` by importing the `StoreModule`. In this part of the example, we assert that clicking the `add` button dispatches the corresponding action and is correctly emitted by the `collection` selector.

<code-example header="src/app/tests/integration.spec.ts (addButton Test)" path="store-walkthrough/src/app/tests/integration.spec.ts" region="addTest">
</code-example>

### Testing selectors

You can use the projector function used by the selector by accessing the `.projector` property. The following example tests the `books` selector from the [walkthrough](guide/store/walkthrough).

<code-example header="src/app/state/books.selectors.spec.ts" path="testing-store/src/app/state/books.selectors.spec.ts">
</code-example>

### Testing reducers

The following example tests the `booksReducer` from the [walkthrough](guide/store/walkthrough). In the first test we check that the state returns the same reference when the reducer is not supposed to handle the action (unknown action). The second test checks that `retrievedBookList` action updates the state and returns the new instance of it.

<code-example header="src/app/state/books.reducer.spec.ts" path="testing-store/src/app/state/books.reducer.spec.ts"></code-example>

### Testing without `TestBed`

The `provideMockStore()` function can be also used with `Injector.create`:

<code-example header="books.component.spec.ts">
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Injector } from '@angular/core';

describe('Books Component', () => {
  let store: MockStore;
  const initialState = { books: ['Book 1', 'Book 2', 'Book 3'] };

  beforeEach(() => {
    const injector = Injector.create({
      providers: [
        provideMockStore({ initialState }),
      ],
    });
    
    store = injector.get(MockStore);
  });
});
</code-example>

Another option to create the `MockStore` without `TestBed` is by calling the `getMockStore()` function:

<code-example header="books.component.spec.ts">
import { MockStore, getMockStore } from '@ngrx/store/testing';

describe('Books Component', () => {
  let store: MockStore;
  const initialState = { books: ['Book 1', 'Book 2', 'Book 3'] };

  beforeEach(() => {    
    store = getMockStore({ initialState });
  });
});
</code-example>
