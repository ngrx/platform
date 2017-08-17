# Testing

### Providing Store for testing
Use the `StoreModule.forRoot` in your `TestBed` configuration when testing components or services that inject `Store`.

* Reducing state is synchronous, so mocking out the `Store` isn't required.
* Use the `combineReducers` method with the map of feature reducers to compose the `State` for the test.
* Dispatch actions to load data into the `Store`.

my-component.ts
```ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as Data from '../actions/data';

@Component({
  selector: 'my-component',
  template: `
    <div *ngFor="let item of items$ | async">{{ item }}</div>

    <button (click)="onRefresh()">Refresh Items</button>
  `,
})
export class MyComponent implements OnInit {
  items$ = this.store.select(fromFeature.selectFeatureItems);

  constructor(private store: Store<fromFeature.State>) {}

  ngOnInit() {
    this.store.dispatch(new Data.LoadData());
  }

  onRefresh() {
    this.store.dispatch(new Data.RefreshItems());
  }
}
```

my-component.spec.ts
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { MyComponent } from './my.component';
import * as fromRoot from '../reducers';
import * as fromFeature from './reducers';
import * as Data from '../actions/data';

describe('My Component', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;
  let store: Store<fromFeature.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          'feature': combineReducers(fromFeature.reducers)
        }),
        // other imports
      ],
      declarations: [
        MyComponent,
        // other declarations
      ],
      providers: [
        // other providers
      ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch an action to load data when created', () => {
    const action = new Data.LoadData();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an action to refreshing data', () => {
    const action = new Data.RefreshData();

    component.onRefresh();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should display a list of items after the data is loaded', () => {
    const items = [1, 2, 3];
    const action = new Data.LoadDataSuccess({ items });

    store.dispatch(action);

    component.items$.subscribe(data => {
      expect(data.length).toBe(items.length);
    });
  });  
});
```
