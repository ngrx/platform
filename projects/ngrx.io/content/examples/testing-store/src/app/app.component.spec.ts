import { MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { AppState } from './state/state';
import { AppComponent } from './app.component';
import { addBook as addAction, removeBook as removeAction, retrievedBookList } from './state/allBooks.actions';
import { BookListComponent } from './book-list/book-list.component';
import { BookCollectionComponent } from './book-collection/book-collection.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { selectBooks, selectCollectionIds, selectBookCollection } from './state/allBooks.selectors';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let store: MockStore<AppState>;
  let mockBookCollectionSelector;
  let mockBooksSelector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
      imports : [HttpClientModule],
      declarations: [BookListComponent, BookCollectionComponent, AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    
    mockBooksSelector = store.overrideSelector(selectBooks, [
      {
        id: 'string1',
        volumeInfo: {
          title: 'First title',
          authors: ['First Author']
        }
      },
      {
        id: 'string2',
        volumeInfo: {
          title: 'Second title',
          authors: ['Second Author']
        }
      },
      {
        id: 'string3',
        volumeInfo: {
          title: 'Third title',
            authors: ['Third Author']
        }
      },
      {
        id: 'string4',
        volumeInfo: {
          title: 'Fourth title',
          authors: ['Fourth Author']
        }
      }
    ])

    mockBookCollectionSelector = store.overrideSelector(selectBookCollection, [{
      id: 'string3',
      volumeInfo: {
        title: 'Third title',
        authors: ['Third Author']
      }
    }]);

    fixture.detectChanges();

    spyOn(store, 'dispatch').and.callFake(() => {});
  });

  it('add method should dispatch add action', () => {
    component.add('string1');
    expect(store.dispatch).toHaveBeenCalledWith(
      addAction({ bookId: 'string1' })
    );
  });

  it('remove method should dispatch remove action', () => {
    component.remove('string3');
    expect(store.dispatch).toHaveBeenCalledWith(
      removeAction({ bookId: 'string3' })
    );
  });

  it('should render a book list and a book collection', () => {
    expect(fixture.debugElement.queryAll(By.css('.book-list .book-item')).length).toBe(4);
    expect(fixture.debugElement.queryAll(By.css('.book-collection .book-item')).length).toBe(1);
  });

  it('should update the UI when the store changes', () => {
    mockBooksSelector.setResult(
      [
        {
          id: 'stringA',
          volumeInfo: {
            title: 'Title A',
            authors: ['Author A']
          }
        },
        {
          id: 'stringB',
          volumeInfo: {
            title: 'Title B',
            authors: ['Author B']
          }
        },
        {
          id: 'stringC',
          volumeInfo: {
            title: 'Title C',
            authors: ['Author C']
          }
        },
      ]
    );

    mockBookCollectionSelector.setResult(
      [
        {
          id: 'stringA',
          volumeInfo: {
            title: 'Title A',
            authors: ['Author A']
          }
        },
        {
          id: 'stringB',
          volumeInfo: {
            title: 'Title B',
            authors: ['Author B']
          }
        },
      ]
    );

    store.refreshState();
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('.book-list .book-item')).length).toBe(3);

    expect(fixture.debugElement.queryAll(By.css('.book-collection .book-item')).length).toBe(2);
  });
});