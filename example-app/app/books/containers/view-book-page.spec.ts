import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ViewBookPageComponent } from './view-book-page';
import * as book from '../actions/book';
import * as fromBooks from '../reducers';

describe('View Book Page', () => {
  let params = new BehaviorSubject({});
  let fixture: ComponentFixture<ViewBookPageComponent>;
  let store: Store<fromBooks.State>;
  let instance: ViewBookPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          books: combineReducers(fromBooks.reducers),
        }),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params },
        },
      ],
      declarations: [ViewBookPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ViewBookPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(
    'should dispatch a book.Select action on init',
    async(() => {
      const action = new book.Select('2');
      params.next({ id: '2' });

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(store.dispatch).toHaveBeenLastCalledWith(action);
      });
    })
  );
});
