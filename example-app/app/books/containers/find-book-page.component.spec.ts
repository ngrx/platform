import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BookSearchComponent } from '../components/book-search.component';
import { BookPreviewComponent } from '../components/book-preview.component';
import { BookPreviewListComponent } from '../components/book-preview-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { EllipsisPipe } from '../../shared/pipes/ellipsis.pipe';
import { BookAuthorsComponent } from '../components/book-authors.component';
import { AddCommasPipe } from '../../shared/pipes/add-commas.pipe';
import { FindBookPageComponent } from './find-book-page.component';
import * as BookActions from '../actions/book.actions';
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
