import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectedBookPageComponent } from '@example-app/books/containers/selected-book-page.component';
import { Store } from '@ngrx/store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material';

import { SelectedBookPageActions } from '@example-app/books/actions';
import * as fromBooks from '@example-app/books/reducers';
import { BookDetailComponent } from '@example-app/books/components/book-detail.component';
import { Book, generateMockBook } from '@example-app/books/models/book';
import { BookAuthorsComponent } from '@example-app/books/components/book-authors.component';
import { AddCommasPipe } from '@example-app/shared/pipes/add-commas.pipe';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

describe('Selected Book Page', () => {
  let fixture: ComponentFixture<SelectedBookPageComponent>;
  let store: MockStore<fromBooks.State>;
  let instance: SelectedBookPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatCardModule],
      declarations: [
        SelectedBookPageComponent,
        BookDetailComponent,
        BookAuthorsComponent,
        AddCommasPipe,
      ],
      providers: [provideMockStore()],
    });

    fixture = TestBed.createComponent(SelectedBookPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch');
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a collection.AddBook action when addToCollection is called', () => {
    const $event: Book = generateMockBook();
    const action = SelectedBookPageActions.addBook({ book: $event });

    instance.addToCollection($event);

    expect(store.dispatch).toHaveBeenLastCalledWith(action);
  });

  it('should dispatch a collection.RemoveBook action on removeFromCollection', () => {
    const $event: Book = generateMockBook();
    const action = SelectedBookPageActions.removeBook({ book: $event });

    instance.removeFromCollection($event);

    expect(store.dispatch).toHaveBeenLastCalledWith(action);
  });
});
