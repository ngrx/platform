import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import {
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { Store } from '@ngrx/store';
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

describe('Find Book Page', () => {
  let fixture: ComponentFixture<FindBookPageComponent>;
  let store: MockStore<fromBooks.State>;
  let instance: FindBookPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        MatInputModule,
        MatCardModule,
        MatProgressSpinnerModule,
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
            { selector: fromBooks.getSearchQuery, value: '' },
            { selector: fromBooks.getSearchResults, value: [] },
            { selector: fromBooks.getSearchLoading, value: false },
            { selector: fromBooks.getSearchError, value: '' },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(FindBookPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch');
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
