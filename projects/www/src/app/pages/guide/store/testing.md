# Testing

### Using a Mock Store

The `provideMockStore()` function registers providers that allow you to mock out the `Store` for testing functionality that has a dependency on `Store` without setting up reducers.
You can write tests validating behaviors corresponding to the specific state snapshot easily.

<ngrx-docs-alert type="help">

**Note:** All dispatched actions don't affect the state, but you can see them in the `scannedActions$` stream.

</ngrx-docs-alert>

Usage:

<ngrx-code-example header="auth.guard.spec.ts">

```ts
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
```

</ngrx-code-example>

### Using Mock Selectors

`MockStore` also provides the ability to mock individual selectors to return a passed value using the `overrideSelector()` method. When the selector is invoked by the `select` method, the returned value is overridden by the passed value, regardless of the current state in the store.

`overrideSelector()` returns a `MemoizedSelector`. To update the mock selector to return a different value, use the `MemoizedSelector`'s `setResult()` method. Updating a selector's mock value will not cause it to emit automatically. To trigger an emission from all selectors, use the `MockStore.refreshState()` method after updating the desired selectors.

`overrideSelector()` supports mocking the `select` method (used in RxJS pipe) and the `Store` `select` instance method using a string or selector.

Usage:

<ngrx-code-example header="src/app/state/books.selectors.ts" path="testing-store/src/app/state/books.selectors.ts">

```ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Book } from '../book-list/books.model';

export const selectBooks =
  createFeatureSelector<ReadonlyArray<Book>>('books');

export const selectCollectionState =
  createFeatureSelector<ReadonlyArray<string>>('collection');

export const selectBookCollection = createSelector(
  selectBooks,
  selectCollectionState,
  (books, collection) => {
    return collection.map(
      (id) => books.find((book) => book.id === id)!
    );
  }
);
```

</ngrx-code-example>

<ngrx-code-example header="src/app/app.component.spec.ts (Using Mock Selectors) " path="store-walkthrough/src/app/tests/app.component.1.spec.ts" region="mockSelector">

```ts
mockBooksSelector = store.overrideSelector(selectBooks, [
  {
    id: 'firstId',
    volumeInfo: {
      title: 'First Title',
      authors: ['First Author'],
    },
  },
]);

mockBookCollectionSelector = store.overrideSelector(
  selectBookCollection,
  []
);

fixture.detectChanges();
spyOn(store, 'dispatch').and.callFake(() => {});

it('should update the UI when the store changes', () => {
  mockBooksSelector.setResult([
    {
      id: 'firstId',
      volumeInfo: {
        title: 'First Title',
        authors: ['First Author'],
      },
    },
    {
      id: 'secondId',
      volumeInfo: {
        title: 'Second Title',
        authors: ['Second Author'],
      },
    },
  ]);

  mockBookCollectionSelector.setResult([
    {
      id: 'firstId',
      volumeInfo: {
        title: 'First Title',
        authors: ['First Author'],
      },
    },
  ]);

  store.refreshState();
  fixture.detectChanges();

  expect(
    fixture.debugElement.queryAll(By.css('.book-list .book-item'))
      .length
  ).toBe(2);

  expect(
    fixture.debugElement.queryAll(
      By.css('.book-collection .book-item')
    ).length
  ).toBe(1);
});
```

</ngrx-code-example>

In this example based on the [walkthrough](guide/store/walkthrough), we mock the `selectBooks` selector by using `overrideSelector`, passing in the `selectBooks` selector with a default mocked return value of an array of books. Similarly, we mock the `selectBookCollection` selector and pass the selector together with another array. In the test, we use `setResult()` to update the mock selectors to return new array values, then we use `MockStore.refreshState()` to trigger an emission from the `selectBooks` and `selectBookCollection` selectors.

You can reset selectors by calling the `MockStore.resetSelectors()` method in the `afterEach()` hook.

<ngrx-code-example header="src/app/app.component.spec.ts (Reset Mock Selector) " path="store-walkthrough/src/app/tests/app.component.1.spec.ts" region="resetMockSelector">

```ts
describe('AppComponent reset selectors', () => {
  let store: MockStore;

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should return the mocked value', (done: any) => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectBooks,
              value: [
                {
                  id: 'mockedId',
                  volumeInfo: {
                    title: 'Mocked Title',
                    authors: ['Mocked Author'],
                  },
                },
              ],
            },
          ],
        }),
      ],
    });

    store = TestBed.inject(MockStore);

    store.select(selectBooks).subscribe((mockBooks) => {
      expect(mockBooks).toEqual([
        {
          id: 'mockedId',
          volumeInfo: {
            title: 'Mocked Title',
            authors: ['Mocked Author'],
          },
        },
      ]);
      done();
    });
  });
});
```

</ngrx-code-example>

Try the <live-example name="testing-store"></live-example>.

### Integration Testing

An integration test should verify that the `Store` coherently works together with our components and services that inject `Store`. An integration test will not mock the store or individual selectors, as unit tests do, but will instead integrate a `Store` by using `StoreModule.forRoot` in your `TestBed` configuration. Here is part of an integration test for the `AppComponent` introduced in the [walkthrough](guide/store/walkthrough).

<ngrx-code-example header="src/app/tests/integration.spec.ts (Integrate Store)" path="store-walkthrough/src/app/tests/integration.spec.ts" region="integrate">

```ts
TestBed.configureTestingModule({
  declarations: [
    AppComponent,
    BookListComponent,
    BookCollectionComponent,
  ],
  imports: [
    HttpClientTestingModule,
    StoreModule.forRoot({
      books: booksReducer,
      collection: collectionReducer,
    }),
  ],
  providers: [GoogleBooksService],
}).compileComponents();

fixture = TestBed.createComponent(AppComponent);
component = fixture.debugElement.componentInstance;

fixture.detectChanges();
```

</ngrx-code-example>

The integration test sets up the dependent `Store` by importing the `StoreModule`. In this part of the example, we assert that clicking the `add` button dispatches the corresponding action and is correctly emitted by the `collection` selector.

<ngrx-code-example header="src/app/tests/integration.spec.ts (addButton Test)" path="store-walkthrough/src/app/tests/integration.spec.ts" region="addTest">

```ts
describe('buttons should work as expected', () => {
  it('should add to collection when add button is clicked and remove from collection when remove button is clicked', () => {
    const addButton = getBookList()[1].query(
      By.css('[data-test=add-button]')
    );

    click(addButton);
    expect(getBookTitle(getCollection()[0])).toBe('Second Title');

    const removeButton = getCollection()[0].query(
      By.css('[data-test=remove-button]')
    );
    click(removeButton);

    expect(getCollection().length).toBe(0);
  });
});

//functions used in the above test
function getCollection() {
  return fixture.debugElement.queryAll(
    By.css('.book-collection .book-item')
  );
}

function getBookList() {
  return fixture.debugElement.queryAll(
    By.css('.book-list .book-item')
  );
}

function getBookTitle(element) {
  return element.query(By.css('p')).nativeElement.textContent;
}

function click(element) {
  const el: HTMLElement = element.nativeElement;
  el.click();
  fixture.detectChanges();
}
```

</ngrx-code-example>

### Testing selectors

You can use the projector function used by the selector by accessing the `.projector` property. The following example tests the `books` selector from the [walkthrough](guide/store/walkthrough).

<ngrx-code-example header="src/app/state/books.selectors.spec.ts" path="testing-store/src/app/state/books.selectors.spec.ts">

```ts
import { selectBooks, selectBookCollection } from './books.selectors';
import { AppState } from './app.state';

describe('Selectors', () => {
  const initialState: AppState = {
    books: [
      {
        id: 'firstId',
        volumeInfo: {
          title: 'First Title',
          authors: ['First Author'],
        },
      },
      {
        id: 'secondId',
        volumeInfo: {
          title: 'Second Title',
          authors: ['Second Author'],
        },
      },
    ],
    collection: ['firstId'],
  };

  it('should select the book list', () => {
    const result = selectBooks.projector(initialState.books);
    expect(result.length).toEqual(2);
    expect(result[1].id).toEqual('secondId');
  });

  it('should select the book collection', () => {
    const result = selectBookCollection.projector(
      initialState.books,
      initialState.collection
    );
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('firstId');
  });
});
```

</ngrx-code-example>

### Testing reducers

The following example tests the `booksReducer` from the [walkthrough](guide/store/walkthrough). In the first test we check that the state returns the same reference when the reducer is not supposed to handle the action (unknown action). The second test checks that `retrievedBookList` action updates the state and returns the new instance of it.

<ngrx-code-example header="src/app/state/books.reducer.spec.ts" path="testing-store/src/app/state/books.reducer.spec.ts">

```ts
import * as fromReducer from './books.reducer';
import { retrievedBookList } from './books.actions';
import { Book } from '../book-list/books.model';

describe('BooksReducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const { initialState } = fromReducer;
      const action = {
        type: 'Unknown',
      };
      const state = fromReducer.booksReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('retrievedBookList action', () => {
    it('should retrieve all books and update the state in an immutable way', () => {
      const { initialState } = fromReducer;
      const newState: Array<Book> = [
        {
          id: 'firstId',
          volumeInfo: {
            title: 'First Title',
            authors: ['First Author'],
          },
        },
      ];
      const action = retrievedBookList({ Book: newState });
      const state = fromReducer.booksReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });
});
```

</ngrx-code-example>

### Testing without `TestBed`

The `provideMockStore()` function can be also used with `Injector.create`:

<ngrx-code-example header="books.component.spec.ts">

```ts
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Injector } from '@angular/core';

describe('Books Component', () => {
  let store: MockStore;
  const initialState = { books: ['Book 1', 'Book 2', 'Book 3'] };

  beforeEach(() => {
    const injector = Injector.create({
      providers: [provideMockStore({ initialState })],
    });

    store = injector.get(MockStore);
  });
});
```

</ngrx-code-example>

Another option to create the `MockStore` without `TestBed` is by calling the `createMockStore()` function:

<ngrx-code-example header="books.component.spec.ts">

```ts
import { MockStore, createMockStore } from '@ngrx/store/testing';

describe('Books Component', () => {
  let store: MockStore;
  const initialState = { books: ['Book 1', 'Book 2', 'Book 3'] };

  beforeEach(() => {
    store = createMockStore({ initialState });
  });
});
```

</ngrx-code-example>
