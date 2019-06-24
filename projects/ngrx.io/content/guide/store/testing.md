# Testing

### Using a Mock Store

The `provideMockStore()` function registers providers that allow you to mock out the `Store` for testing functionality that has a dependency on `Store` without setting up reducers. 
You can write tests validating behaviors corresponding to the specific state snapshot easily.

<div class="alert is-helpful">

**Note:** All dispatched actions don't affect to the state, but you can see them in the `Actions` stream.

</div>

Usage: 

<code-example header="auth.guard.spec.ts">
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';

import { AuthGuard } from '../guards/auth.guard';

describe('Auth Guard', () => {
  let guard: AuthGuard;
  let store: MockStore&lt;{ loggedIn: boolean }&gt;;
  const initialState = { loggedIn: false };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // any modules needed
      ],
      providers: [
        AuthGuard,
        provideMockStore({ initialState }),
        // other providers
      ],
    });

    store = TestBed.get&lt;Store&gt(Store);
    guard = TestBed.get&lt;AuthGuard&gt;(AuthGuard);
  });

  it('should return false if the user state is not logged in', () => {
    const expected = cold('(a|)', { a: false });

    expect(guard.canActivate()).toBeObservable(expected);
  });

  it('should return true if the user state is logged in', () => {
    store.setState({ loggedIn: true });

    const expected = cold('(a|)', { a: true });

    expect(guard.canActivate()).toBeObservable(expected);
  });
});
</code-example>

### Using Mock Selectors

`MockStore` also provides the ability to mock individual selectors to return a passed value using the `overrideSelector()` method. When the selector is invoked by the `select` method, the returned value is overridden by the passed value, regardless of the current state in the store. 

`overrideSelector()` returns a `MemoizedSelector`. To update the mock selector to return a different value, use the `MemoizedSelector`'s `setResult()` method.

`overrideSelector()` supports mocking the `select` method (used in RxJS pipe) and the `Store` `select` instance method using a string or selector.

Usage:

<code-example header="auth-guard.service.ts" path="testing-store/src/app/auth-guard.service.ts"></code-example>

<code-example header="auth-guard.service.spec.ts" path="testing-store/src/app/auth-guard.service.spec.ts"></code-example>

In this example, we mock the `getLoggedIn` selector by using `overrideSelector`, passing in the `getLoggedIn` selector with a default mocked return value of `false`.  In the second test, we use `setResult()` to update the mock selector to return `true`.

Try the <live-example name="testing-store"></live-example>.

### Using Store for Integration Testing

Use the `StoreModule.forRoot` in your `TestBed` configuration when testing components or services that inject `Store`.

- Reducing state is synchronous, so mocking out the `Store` isn't required.
- Use the `combineReducers` method with the map of feature reducers to compose the `State` for the test.
- Dispatch actions to load data into the `Store`.

<code-example header="my.component.ts">
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as DataActions from '../actions/data';

@Component({
  selector: 'my-component',
  template: `
    &lt;div *ngFor="let item of items$ | async"&gt;{{ item }}&lt;/div&gt;

    &lt;button (click)="onRefresh()"&gt;Refresh Items&lt;/button&gt;
  `,
})
export class MyComponent implements OnInit {
  items$ = this.store.pipe(select(fromFeature.selectFeatureItems));

  constructor(private store: Store&lt;fromFeature.State&gt;) {}

  ngOnInit() {
    this.store.dispatch(DataActions.loadData());
  }

  onRefresh() {
    this.store.dispatch(DataActions.refreshItems());
  }
}
</code-example>

<code-example header="my.component.spec.ts">
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { MyComponent } from './my.component';
import * as fromRoot from '../reducers';
import * as fromFeature from '../feature/reducers';
import * as DataActions from '../actions/data';

describe('My Component', () => {
  let component: MyComponent;
  let fixture: ComponentFixture&lt;MyComponent&gt;
  let store: Store&lt;fromFeature.State&gt;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          feature: combineReducers(fromFeature.reducers),
        }),
        // other imports
      ],
      declarations: [
        MyComponent,
        // other declarations
      ],
      providers: [
        // other providers
      ],
    });

    store = TestBed.get&lt;Store&gt(Store);

    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch an action to load data when created', () => {
    const action = DataActions.loadData();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an action to refreshing data', () => {
    const action = DataActions.refreshData();

    component.onRefresh();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should display a list of items after the data is loaded', () => {
    const items = [1, 2, 3];
    const action = DataActions.loadDataSuccess({ items });

    store.dispatch(action);

    component.items$.subscribe(data => {
      expect(data.length).toBe(items.length);
    });
  });
});
</code-example>

### Testing selectors

You can use the projector function used by the selector by accessing the `.projector` property.

<code-example header="my.reducer.ts">
export interface State {
  evenNums: number[];
  oddNums: number[];
}

export const selectSumEvenNums = createSelector(
  (state: State) => state.evenNums,
  evenNums => evenNums.reduce((prev, curr) => prev + curr)
);
export const selectSumOddNums = createSelector(
  (state: State) => state.oddNums,
  oddNums => oddNums.reduce((prev, curr) => prev + curr)
);
export const selectTotal = createSelector(
  selectSumEvenNums,
  selectSumOddNums,
  (evenSum, oddSum) => evenSum + oddSum
);
</code-example>

<code-example header="my.reducer.spec.ts">
import * as fromMyReducers from './my-reducers';

describe('My Selectors', () => {
  it('should calc selectTotal', () => {
    expect(fromMyReducers.selectTotal.projector(2, 3)).toBe(5);
  });
});
</code-example>
