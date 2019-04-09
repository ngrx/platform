# Testing

### provideMockActions

Provides a mock test provider of the `Actions` Observable for testing effects. This works well with writing
marble tests and tests using the `subscribe` method on an Observable. The mock Actions will deliver a new Observable to subscribe to for each test.

Details on marble tests and their syntax, as shown in the `hot` and `cold` methods, can be found in [Writing Marble Tests](https://github.com/ReactiveX/rxjs/blob/master/doc/writing-marble-tests.md).

Usage:

<code-example header="my.effects.spec.ts">
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { MyEffects } from './my-effects';
import * as MyActions from '../actions/my-actions';

describe('My Effects', () => {
  let effects: MyEffects;
  let actions: Observable&lt;any&gt;;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // any modules needed
      ],
      providers: [
        MyEffects,
        provideMockActions(() => actions),
        // other providers
      ],
    });

    effects = TestBed.get(MyEffects);
  });

  it('should work', () => {
    const action = MyActions.exampleAction();
    const completion = MyActions.exampleActionSuccess();

    // Refer to 'Writing Marble Tests' for details on '--a-' syntax
    actions = hot('--a-', { a: action });
    const expected = cold('--b', { b: completion });

    expect(effects.someSource$).toBeObservable(expected);
  });
});
</code-example>

It is also possible to use `ReplaySubject` as an alternative for marble tests:

<code-example header="my.effects.spec.ts">
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';

import { MyEffects } from './my-effects';
import * as MyActions from '../actions/my-actions';

describe('My Effects', () => {
  let effects: MyEffects;
  let actions: ReplaySubject&lt;any&gt;;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // any modules needed
      ],
      providers: [
        MyEffects,
        provideMockActions(() => actions),
        // other providers
      ],
    });

    effects = TestBed.get(MyEffects);
  });

  it('should work', () => {
    actions = new ReplaySubject(1);
    actions.next(MyActions.exampleAction());

    effects.someSource$.subscribe(result => {
      expect(result).toEqual(MyActions.exampleActionSuccess());
    });
  });
});
</code-example>

### getEffectsMetadata

Returns decorator configuration for all effects in a class instance.
Use this function to ensure that effects have been properly decorated.

Usage:

<code-example header="my.effects.spec.ts">
import { TestBed } from '@angular/core/testing';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { MyEffects } from './my-effects';

describe('My Effects', () => {
  let effects: MyEffects;
  let metadata: EffectsMetadata&lt;MyEffects&gt;;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MyEffects,
        // other providers
      ],
    });

    effects = TestBed.get(MyEffects);
    metadata = getEffectsMetadata(effects);
  });

  it('should register someSource$ that dispatches an action', () => {
    expect(metadata.someSource$).toEqual({ dispatch: true });
  });

  it('should register someOtherSource$ that does not dispatch an action', () => {
    expect(metadata.someOtherSource$).toEqual({ dispatch: false });
  });

  it('should not register undecoratedSource$', () => {
    expect(metadata.undecoratedSource$).toBeUndefined();
  });
});
</code-example>

### Effects as functions

Effects can be defined as functions as well as variables. Defining an effect as a function allows you to define default values while having the option to override these variables during tests. This without breaking the functionality in the application.

The following example effect debounces the user input into from a search action.

<code-example header="my.effects.spec.ts">
@Effect()
search$ = this.actions$.pipe(
  ofType(BookActionTypes.Search),
  debounceTime(300, asyncScheduler),
  switchMap(...)
)
</code-example>

The same effect but now defined as a function, would look as follows:

<code-example header="my.effects.spec.ts">
@Effect()
// refactor as input properties and provide default values
search$ = ({
  debounce = 300,
  scheduler = asyncScheduler
} = {}) => this.actions$.pipe(
  ofType(BookActionTypes.Search),
  debounceTime(debounce, scheduler),
  switchMap(...)
)
</code-example>

Within our tests we can now override the default properties:

<code-example header="my.effects.spec.ts">
const actual = effects.search$({
  debounce: 30,
  scheduler: getTestScheduler(),
});
expect(actual).toBeObservable(expected);
</code-example>

Doing this has the extra benefit of hiding implementation details, making your tests less prone to break due to implementation details changes. Meaning that if you would change the `debounceTime` inside the effect your tests wouldn't have to be changed,these tests would still pass.

### Effects that use State

The mock store can simplify testing Effects that inject State using the RxJs `withLatestFrom` operator.  The example below shows the `addBookToCollectionSuccess$` effect displaying a different alert depending on the number of books in the collection state.

<code-example header="collection.effects.ts">
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map, withLatestFrom } from 'rxjs/operators';
import { CollectionApiActions } from '@example-app/books/actions';
import * as fromBooks from '@example-app/books/reducers';

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
    private store: Store&lt;fromBooks.State&gt;
  ) {}
}
</code-example>

In the test, you can use the mock store to adjust the number of books in the collection.  You provide the `MockStore` an initial state containing one book. When testing the effect when two or more books are in the collection, you provide a different state using `setState()`.

<code-example header="collection.effects.spec.ts">
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { CollectionEffects } from '@example-app/books/effects';
import { CollectionApiActions } from '@example-app/books/actions';
import { Book } from '@example-app/books/models/book';
import * as fromBooks from '@example-app/books/reducers';

describe('CollectionEffects', () => {
  let effects: CollectionEffects;
  let actions$: Observable&lt;any&gt;;
  let store: MockStore&lt;fromBooks.State&gt;;
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

    it('should alert number of books after adding the second book', () => {
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
