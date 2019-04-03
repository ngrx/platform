import { TestBed } from '@angular/core/testing';
import { Store, MemoizedSelector } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { AuthGuard } from '@example-app/auth/services/auth-guard.service';
import * as fromAuth from '@example-app/auth/reducers';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

describe('Auth Guard', () => {
  let guard: AuthGuard;
  let store: MockStore<fromAuth.State>;
  let loggedIn: MemoizedSelector<fromAuth.State, boolean>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, provideMockStore()],
    });

    store = TestBed.get(Store);
    guard = TestBed.get(AuthGuard);

    loggedIn = store.overrideSelector(fromAuth.getLoggedIn, false);
  });

  it('should return false if the user state is not logged in', () => {
    const expected = cold('(a|)', { a: false });

    expect(guard.canActivate()).toBeObservable(expected);
  });

  it('should return true if the user state is logged in', () => {
    const expected = cold('(a|)', { a: true });

    loggedIn.setResult(true);

    expect(guard.canActivate()).toBeObservable(expected);
  });
});
