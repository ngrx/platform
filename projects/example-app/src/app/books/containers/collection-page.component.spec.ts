import { CollectionPageComponent } from './collection-page.component';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule, MatInputModule } from '@angular/material';
import { BookPreviewListComponent } from '../components/book-preview-list.component';
import { BookPreviewComponent } from '../components/book-preview.component';
import * as CollectionActions from '../actions/collection.actions';
import * as fromBooks from '../reducers';
import { EllipsisPipe } from '../../shared/pipes/ellipsis.pipe';
import { AddCommasPipe } from '../../shared/pipes/add-commas.pipe';
import { BookAuthorsComponent } from '../components/book-authors.component';

describe('Collection Page', () => {
  let fixture: ComponentFixture<CollectionPageComponent>;
  let store: Store<fromBooks.State>;
  let instance: CollectionPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        StoreModule.forRoot({
          books: combineReducers(fromBooks.reducers),
        }),
        MatCardModule,
        MatInputModule,
        RouterTestingModule,
      ],
      declarations: [
        CollectionPageComponent,
        BookPreviewListComponent,
        BookPreviewComponent,
        BookAuthorsComponent,
        AddCommasPipe,
        EllipsisPipe,
      ],
    });

    fixture = TestBed.createComponent(CollectionPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a collection.Load on init', () => {
    const action = new CollectionActions.Load();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
