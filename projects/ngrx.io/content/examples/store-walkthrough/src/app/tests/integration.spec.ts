import {
  TestBed,
  async,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { StoreModule } from '@ngrx/store';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { BookListComponent } from './book-list/book-list.component';
import { GoogleBooksService } from './book-list/books.service';
import { BookCollectionComponent } from './book-collection/book-collection.component';
import { AppComponent } from './app.component';
import { collectionReducer } from './state/collection.reducer';
import { booksReducer } from './state/books.reducer';

describe('AppComponent Integration Test', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let booksService: GoogleBooksService;
  let httpMock: HttpTestingController;

  beforeEach(async((done: any) => {
    //#docregion integrate
    TestBed.configureTestingModule({
      declarations: [AppComponent, BookListComponent, BookCollectionComponent],
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({
          books: booksReducer,
          collection: collectionReducer,
        }),
      ],
      providers: [GoogleBooksService],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;

    fixture.detectChanges();
    //#enddocregion integrate

    booksService = TestBed.get(GoogleBooksService);
    httpMock = TestBed.get(HttpTestingController);

    const req = httpMock.expectOne(
      'https://www.googleapis.com/books/v1/volumes?maxResults=5&orderBy=relevance&q=oliver%20sacks'
    );
    req.flush({
      items: [
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
      ],
    });

    fixture.detectChanges();
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  //#docregion addTest
  describe('buttons should work as expected', () => {
    it('should add to collection when add button is clicked and remove from collection when remove button is clicked', () => {
      const addButton = getBookList()[1].query(
        By.css('[data-test=add-button]')
      );

      click(addButton);
      expect(getBookTitle(getCollection()[0])).toBe('Second Title');

      const removeButton = getCollection()[0].query(
        By.css('[data-test=remove-button]')
      );
      click(removeButton);

      expect(getCollection().length).toBe(0);
    });
  });

  //functions used in the above test
  function getCollection() {
    return fixture.debugElement.queryAll(By.css('.book-collection .book-item'));
  }

  function getBookList() {
    return fixture.debugElement.queryAll(By.css('.book-list .book-item'));
  }

  function getBookTitle(element) {
    return element.query(By.css('p')).nativeElement.textContent;
  }

  function click(element) {
    const el: HTMLElement = element.nativeElement;
    el.click();
    fixture.detectChanges();
  }
  //#enddocregion addTest
});
