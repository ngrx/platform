import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectedBookPageComponent } from './selected-book-page.component';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material';

import * as CollectionActions from '../actions/collection.actions';
import * as fromBooks from '../reducers';
import { BookDetailComponent } from '../components/book-detail.component';
import { Book, generateMockBook } from '../models/book';
import { BookAuthorsComponent } from '../components/book-authors.component';
import { AddCommasPipe } from '../../shared/pipes/add-commas.pipe';

describe('Selected Book Page', () => {
  let fixture: ComponentFixture<SelectedBookPageComponent>;
  let store: Store<fromBooks.State>;
  let instance: SelectedBookPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        StoreModule.forRoot({
          books: combineReducers(fromBooks.reducers),
        }),
        MatCardModule,
      ],
      declarations: [
        SelectedBookPageComponent,
        BookDetailComponent,
        BookAuthorsComponent,
        AddCommasPipe,
      ],
    });

    fixture = TestBed.createComponent(SelectedBookPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a collection.AddBook action when addToCollection is called', () => {
    const $event: Book = generateMockBook();
    const action = new CollectionActions.AddBook($event);

    instance.addToCollection($event);

    expect(store.dispatch).toHaveBeenLastCalledWith(action);
  });

  it('should dispatch a collection.RemoveBook action on removeFromCollection', () => {
    const $event: Book = generateMockBook();
    const action = new CollectionActions.RemoveBook($event);

    instance.removeFromCollection($event);

    expect(store.dispatch).toHaveBeenLastCalledWith(action);
  });
});
