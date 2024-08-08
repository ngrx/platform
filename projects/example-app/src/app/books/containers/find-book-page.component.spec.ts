import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { FindBookPageActions } from '@example-app/books/actions/find-book-page.actions';
import { FindBookPageComponent } from '@example-app/books/containers';
import * as fromBooks from '@example-app/books/reducers';

describe('Find Book Page', () => {
  let fixture: ComponentFixture<FindBookPageComponent>;
  let store: MockStore;
  let instance: FindBookPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FindBookPageComponent],
      providers: [
        provideNoopAnimations(),
        provideMockStore({
          selectors: [
            { selector: fromBooks.selectSearchQuery, value: '' },
            { selector: fromBooks.selectSearchResults, value: [] },
            { selector: fromBooks.selectSearchLoading, value: false },
            { selector: fromBooks.selectSearchError, value: '' },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(FindBookPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    jest.spyOn(store, 'dispatch');
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a book.Search action on search', () => {
    const $event = 'book name';
    const action = FindBookPageActions.searchBooks({ query: $event });

    instance.search($event);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
