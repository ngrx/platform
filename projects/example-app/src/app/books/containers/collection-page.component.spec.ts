import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { MatCardModule, MatInputModule } from '@angular/material';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { CollectionPageActions } from '@example-app/books/actions';
import {
  BookAuthorsComponent,
  BookPreviewComponent,
  BookPreviewListComponent,
} from '@example-app/books/components';
import { CollectionPageComponent } from '@example-app/books/containers';
import * as fromBooks from '@example-app/books/reducers';
import { AddCommasPipe } from '@example-app/shared/pipes/add-commas.pipe';
import { EllipsisPipe } from '@example-app/shared/pipes/ellipsis.pipe';

describe('Collection Page', () => {
  let fixture: ComponentFixture<CollectionPageComponent>;
  let store: MockStore<fromBooks.State>;
  let instance: CollectionPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
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
      providers: [
        provideMockStore({
          selectors: [{ selector: fromBooks.selectBookCollection, value: [] }],
        }),
      ],
    });

    fixture = TestBed.createComponent(CollectionPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch');
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a collection.Load on init', () => {
    const action = CollectionPageActions.loadCollection();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
