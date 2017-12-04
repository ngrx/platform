import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatCardModule } from '@angular/material';

import { ViewBookPageComponent } from './view-book-page';
import * as book from '../actions/book';
import * as fromBooks from '../reducers';
import { SelectedBookPageComponent } from './selected-book-page';
import { BookDetailComponent } from '../components/book-detail';
import { BookAuthorsComponent } from '../components/book-authors';
import { AddCommasPipe } from '../../shared/pipes/add-commas';

describe('View Book Page', () => {
  let params = new BehaviorSubject({});
  let fixture: ComponentFixture<ViewBookPageComponent>;
  let store: Store<fromBooks.State>;
  let instance: ViewBookPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params },
        },
        {
          provide: Store,
          useValue: {
            select: jest.fn(),
            next: jest.fn(),
          },
        },
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
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a book.Select action on init', () => {
    const action = new book.Select('2');
    params.next({ id: '2' });

    fixture.detectChanges();

    expect(store.next).toHaveBeenLastCalledWith(action);
  });
});
