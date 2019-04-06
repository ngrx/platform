import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MatCardModule } from '@angular/material';

import { ViewBookPageComponent } from '@example-app/books/containers/view-book-page.component';
import { ViewBookPageActions } from '@example-app/books/actions';
import * as fromBooks from '@example-app/books/reducers';
import { SelectedBookPageComponent } from '@example-app/books/containers/selected-book-page.component';
import { BookDetailComponent } from '@example-app/books/components/book-detail.component';
import { BookAuthorsComponent } from '@example-app/books/components/book-authors.component';
import { AddCommasPipe } from '@example-app/shared/pipes/add-commas.pipe';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

describe('View Book Page', () => {
  let fixture: ComponentFixture<ViewBookPageComponent>;
  let store: MockStore<fromBooks.State>;
  let instance: ViewBookPageComponent;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: new BehaviorSubject({}) },
        },
        provideMockStore(),
      ],
      declarations: [
        ViewBookPageComponent,
        SelectedBookPageComponent,
        BookDetailComponent,
        BookAuthorsComponent,
        AddCommasPipe,
      ],
    });

    fixture = TestBed.createComponent(ViewBookPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);
    route = TestBed.get(ActivatedRoute);

    jest.spyOn(store, 'dispatch');
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a book.Select action on init', () => {
    const action = ViewBookPageActions.selectBook({ id: '2' });

    (route.params as BehaviorSubject<any>).next({ id: '2' });

    expect(store.dispatch).toHaveBeenLastCalledWith(action);
  });
});
