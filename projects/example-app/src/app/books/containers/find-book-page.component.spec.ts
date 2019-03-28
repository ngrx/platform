import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BookSearchComponent } from '@example-app/books/components/book-search.component';
import { BookPreviewComponent } from '@example-app/books/components/book-preview.component';
import { BookPreviewListComponent } from '@example-app/books/components/book-preview-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { EllipsisPipe } from '@example-app/shared/pipes/ellipsis.pipe';
import { BookAuthorsComponent } from '@example-app/books/components/book-authors.component';
import { AddCommasPipe } from '@example-app/shared/pipes/add-commas.pipe';
import { FindBookPageComponent } from '@example-app/books/containers/find-book-page.component';
import { FindBookPageActions } from '@example-app/books/actions';
import * as fromBooks from '@example-app/books/reducers';

describe('Find Book Page', () => {
  let fixture: ComponentFixture<FindBookPageComponent>;
  let store: Store<fromBooks.State>;
  let instance: FindBookPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        StoreModule.forRoot({
          books: combineReducers(fromBooks.reducers),
        }),
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
    });

    fixture = TestBed.createComponent(FindBookPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
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
