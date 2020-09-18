import { MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppState } from './state/app.state';
import { AppComponent } from './app.component';
import {
  addBook ,
  removeBook,
  retrievedBookList,
} from './state/books.actions';
import { BookListComponent } from './book-list/book-list.component';
import { BookCollectionComponent } from './book-collection/book-collection.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  selectBooks,
  selectCollectionIds,
  selectBookCollection,
} from './state/books.selectors';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let store: MockStore<AppState>;
  let mockBookCollectionSelector;
  let mockBooksSelector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
      imports: [HttpClientTestingModule],
      declarations: [BookListComponent, BookCollectionComponent, AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    mockBooksSelector = store.overrideSelector(selectBooks, [
      {
        id: 'firstId',
        volumeInfo: {
          title: 'First Title',
          authors: ['First Author'],
        },
      },
      {
        id: 'secondId',
        volumeInfo: {
          title: 'Second Title',
          authors: ['Second Author'],
        },
      },
      {
        id: 'thirdId',
        volumeInfo: {
          title: 'Third Title',
          authors: ['Third Author'],
        },
      },
      {
        id: 'fourthId',
        volumeInfo: {
          title: 'Fourth Title',
          authors: ['Fourth Author'],
        },
      },
    ]);

    mockBookCollectionSelector = store.overrideSelector(selectBookCollection, [
      {
        id: 'thirdId',
        volumeInfo: {
          title: 'Third Title',
          authors: ['Third Author'],
        },
      },
    ]);

    fixture.detectChanges();

    spyOn(store, 'dispatch').and.callFake(() => {});
  });

  it('add method should dispatch add action', () => {
    component.onAdd('firstId');
    expect(store.dispatch).toHaveBeenCalledWith(
      addBook({ bookId: 'firstId' })
    );
  });

  it('remove method should dispatch remove action', () => {
    component.onRemove('thirdId');
    expect(store.dispatch).toHaveBeenCalledWith(
      removeBook({ bookId: 'thirdId' })
    );
  });

  it('should render a book list and a book collection', () => {
    expect(
      fixture.debugElement.queryAll(By.css('.book-list .book-item')).length
    ).toBe(4);
    expect(
      fixture.debugElement.queryAll(By.css('.book-collection .book-item'))
        .length
    ).toBe(1);
  });

  it('should update the UI when the store changes', () => {
    mockBooksSelector.setResult([
      {
        id: 'stringA',
        volumeInfo: {
          title: 'Title A',
          authors: ['Author A'],
        },
      },
      {
        id: 'stringB',
        volumeInfo: {
          title: 'Title B',
          authors: ['Author B'],
        },
      },
      {
        id: 'stringC',
        volumeInfo: {
          title: 'Title C',
          authors: ['Author C'],
        },
      },
    ]);

    mockBookCollectionSelector.setResult([
      {
        id: 'stringA',
        volumeInfo: {
          title: 'Title A',
          authors: ['Author A'],
        },
      },
      {
        id: 'stringB',
        volumeInfo: {
          title: 'Title B',
          authors: ['Author B'],
        },
      },
    ]);

    store.refreshState();
    fixture.detectChanges();

    expect(
      fixture.debugElement.queryAll(By.css('.book-list .book-item')).length
    ).toBe(3);

    expect(
      fixture.debugElement.queryAll(By.css('.book-collection .book-item'))
        .length
    ).toBe(2);
  });
});
