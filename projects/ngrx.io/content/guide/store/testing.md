# Testing

## Using a Mock Store

The `provideMockStore()` function registers providers that allow you to mock out the `Store` for testing functionality that has a dependency on `Store` without setting up reducers. 
You can write tests validating behaviors corresponding to the specific state snapshot easily.

<div class="alert is-helpful">

**Note:** All dispatched actions don't affect to the state, but you can see them in the `Actions` stream.

</div>

### Example: Auth Guard

Usage: 

<code-example header="auth.guard.spec.ts">
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';

import { AuthGuard } from '../guards/auth.guard';
import * as AuthActions from '../actions/auth-actions';

describe('Auth Guard', () => {
  let guard: AuthGuard;
  let store: MockStore&lt;{ loggedIn: boolean }&gt;;
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

    guard = TestBed.get(AuthGuard);
    store = TestBed.get(Store);
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

### Example: Effect injecting state

The mock store can simplify testing Effects that inject State using the RxJs `withLatestFrom` operator.  The example below shows the `addBookToCollectionSuccess$` effect displaying a different alert depending on the number of books in the collection state.

<code-example header="collection.effects.ts">
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { map, withLatestFrom } from 'rxjs/operators';
import { CollectionApiActions } from '@example-app/books/actions';
import * as fromBooks from '@example-app/books/reducers';
import { Store, select } from '@ngrx/store';

@Injectable()
export class CollectionEffects {
  addBookToCollectionSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CollectionApiActions.addBookSuccess),
        withLatestFrom(this.store.pipe(select(fromBooks.getCollectionBookIds))),
        map(([action, bookCollection]) => {
          if (bookCollection.length === 1) {
            window.alert('Congrats on adding your first book!');
          } else {
            window.alert('You have added book number ' + bookCollection.length);
          }
          return action;
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromBooks.State>
  ) {}
}
</code-example>

In our test, we can use the mock store to adjust the number of books in the collection.  We provide the `MockStore` an initial state containing one book. When testing the effect when two or more books are in the collection, we provide a different state using `setState()`.

<code-example header="collection.effects.spec.ts">
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { CollectionApiActions } from '@example-app/books/actions';
import { Book } from '@example-app/books/models/book';
import { CollectionEffects } from '@example-app/books/effects/collection.effects';
import * as fromBooks from '@example-app/books/reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

describe('CollectionEffects', () => {
  let effects: CollectionEffects;
  let actions$: Observable<any>;
  let store: MockStore<fromBooks.State>;
  const initialState = {
    books: {
      collection: {
        loaded: true,
        loading: false,
        ids: ['1'],
      },
    },
  } as fromBooks.State;

  const book1 = { id: '111', volumeInfo: {} } as Book;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CollectionEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
      ],
    });

    effects = TestBed.get(CollectionEffects);
    actions$ = TestBed.get(Actions);
    store = TestBed.get(Store);
  });

  describe('addBookToCollectionSuccess$', () => {
    beforeEach(() => {
      spyOn(window, 'alert');
    });

    it('should alert congratulatory message when adding the first book on success', () => {
      const action = CollectionApiActions.addBookSuccess({ book: book1 });
      const expected = cold('-c', { c: action });
      actions$ = hot('-a', { a: action });
      expect(effects.addBookToCollectionSuccess$).toBeObservable(expected);
      expect(window.alert).toHaveBeenCalledWith(
        'Congrats on adding your first book!'
      );
    });

    it('should alert number of books aftering adding the second book', () => {
      store.setState({
        books: {
          collection: {
            loaded: true,
            loading: false,
            ids: ['1', '2'],
          },
        },
      } as fromBooks.State);

      const action = CollectionApiActions.addBookSuccess({ book: book1 });
      const expected = cold('-c', { c: action });
      actions$ = hot('-a', { a: action });
      expect(effects.addBookToCollectionSuccess$).toBeObservable(expected);
      expect(window.alert).toHaveBeenCalledWith('You have added book number 2');
    });
  });
});
</code-example>

## Using Store for Integration Testing

Use the `StoreModule.forRoot` in your `TestBed` configuration when testing components or services that inject `Store`.

- Reducing state is synchronous, so mocking out the `Store` isn't required.
- Use the `combineReducers` method with the map of feature reducers to compose the `State` for the test.
- Dispatch actions to load data into the `Store`.

<code-example header="my.component.ts">
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as DataActions from '../actions/data';

@Component({
  selector: 'my-component',
  template: `
    &lt;div *ngFor="let item of items$ | async"&gt;{{ item }}&lt;/div&gt;

    &lt;button (click)="onRefresh()"&gt;Refresh Items&lt;/button&gt;
  `,
})
export class MyComponent implements OnInit {
  items$ = this.store.pipe(select(fromFeature.selectFeatureItems));

  constructor(private store: Store&lt;fromFeature.State&gt;) {}

  ngOnInit() {
    this.store.dispatch(new DataActions.LoadData());
  }

  onRefresh() {
    this.store.dispatch(new DataActions.RefreshItems());
  }
}
</code-example>

<code-example header="my.component.spec.ts">
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { MyComponent } from './my.component';
import * as fromRoot from '../reducers';
import * as fromFeature from '../feature/reducers';
import * as DataActions from '../actions/data';

describe('My Component', () => {
  let component: MyComponent;
  let fixture: ComponentFixture&lt;MyComponent&gt;
  let store: Store&lt;fromFeature.State&gt;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          feature: combineReducers(fromFeature.reducers),
        }),
        // other imports
      ],
      declarations: [
        MyComponent,
        // other declarations
      ],
      providers: [
        // other providers
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch an action to load data when created', () => {
    const action = new DataActions.LoadData();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an action to refreshing data', () => {
    const action = new DataActions.RefreshData();

    component.onRefresh();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should display a list of items after the data is loaded', () => {
    const items = [1, 2, 3];
    const action = new DataActions.LoadDataSuccess({ items });

    store.dispatch(action);

    component.items$.subscribe(data => {
      expect(data.length).toBe(items.length);
    });
  });
});
</code-example>

## Testing selectors

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
