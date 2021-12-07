import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { FindBookPageActions } from '@example-app/books/actions';
import {
  BookAuthorsComponent,
  BookPreviewComponent,
  BookPreviewListComponent,
  BookSearchComponent,
} from '@example-app/books/components';
import { FindBookPageComponent } from '@example-app/books/containers';
import * as fromBooks from '@example-app/books/reducers';
import { AddCommasPipe } from '@example-app/shared/pipes/add-commas.pipe';
import { EllipsisPipe } from '@example-app/shared/pipes/ellipsis.pipe';
import { MaterialModule } from '@example-app/material';

describe('Find Book Page', () => {
  let fixture: ComponentFixture<FindBookPageComponent>;
  let store: MockStore;
  let instance: FindBookPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      declarations: [
        FindBookPageComponent,
        BookSearchComponent,
        BookPreviewComponent,
        BookPreviewListComponent,
        BookAuthorsComponent,
        AddCommasPipe,
        EllipsisPipe,
      ],
      providers: [
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
