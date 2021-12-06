import { MemoizedSelector } from '@ngrx/store';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppState } from '../state/app.state';
import { AppComponent } from '../app.component';
import {
  addBook as addAction,
  removeBook as removeAction,
  retrievedBookList,
} from '../state/books.actions';
import { BookListComponent } from '../book-list/book-list.component';
import { BookCollectionComponent } from '../book-collection/book-collection.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  selectBooks,
  selectCollectionIds,
  selectBookCollection,
} from '../state/books.selectors';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let store: MockStore<AppState>;
  let mockBookCollectionSelector;
  let mockBooksSelector;

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
  ]);

  mockBookCollectionSelector = store.overrideSelector(selectBookCollection, []);

  fixture.detectChanges();
  spyOn(store, 'dispatch').and.callFake(() => {});

  it('should update the UI when the store changes', () => {
    //#docregion mockSelector
    mockBooksSelector.setResult([
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
    ]);

    mockBookCollectionSelector.setResult([
      {
        id: 'firstId',
        volumeInfo: {
          title: 'First Title',
          authors: ['First Author'],
        },
      },
    ]);

    store.refreshState();
    fixture.detectChanges();

    expect(
      fixture.debugElement.queryAll(By.css('.book-list .book-item')).length
    ).toBe(2);

    expect(
      fixture.debugElement.queryAll(By.css('.book-collection .book-item'))
        .length
    ).toBe(1);
    //#enddocregion mockSelector
  });
});

//#docregion resetMockSelector
describe('AppComponent reset selectors', () => {
  let store: MockStore;

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should return the mocked value', (done: any) => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectBooks,
              value: [
                {
                  id: 'mockedId',
                  volumeInfo: {
                    title: 'Mocked Title',
                    authors: ['Mocked Author'],
                  },
                },
              ],
            },
          ],
        }),
      ],
    });

    store = TestBed.inject(MockStore);

    store.select(selectBooks).subscribe((mockBooks) => {
      expect(mockBooks).toEqual([
        {
          id: 'mockedId',
          volumeInfo: {
            title: 'Mocked Title',
            authors: ['Mocked Author'],
          },
        },
      ]);
      done();
    });
  });
});
//#enddocregion resetMockSelector
