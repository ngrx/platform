import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BookSearchComponent } from '../components/book-search';
import { BookPreviewComponent } from '../components/book-preview';
import { BookPreviewListComponent } from '../components/book-preview-list';
import { RouterTestingModule } from '@angular/router/testing';
import { EllipsisPipe } from '../../shared/pipes/ellipsis';
import { BookAuthorsComponent } from '../components/book-authors';
import { AddCommasPipe } from '../../shared/pipes/add-commas';
import { FindBookPageComponent } from './find-book-page';
import * as BookActions from '../actions/book';
import * as fromBooks from '../reducers';

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
    const $event: string = 'book name';
    const action = new BookActions.Search($event);

    instance.search($event);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
