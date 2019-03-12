import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { AuthGuard } from '@example-app/auth/services/auth-guard.service';
import * as fromRoot from '@example-app/reducers';
import * as fromAuth from '@example-app/auth/reducers';
import * as fromLoginPage from '@example-app/auth/reducers/login-page.reducer';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

describe('Auth Guard', () => {
  let guard: AuthGuard;
  let store: MockStore<fromAuth.State>;
  const initialState = {
    auth: {
      status: {
        user: null,
      },
    },
  } as fromAuth.State;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, provideMockStore({ initialState })],
    });

    store = TestBed.get(Store);
    guard = TestBed.get(AuthGuard);
  });

  it('should return false if the user state is not logged in', () => {
    const expected = cold('(a|)', { a: false });

    expect(guard.canActivate()).toBeObservable(expected);
  });

  it('should return true if the user state is logged in', () => {
    store.setState({
      ...initialState,
      auth: {
        loginPage: {} as fromLoginPage.State,
        status: {
          user: {
            name: 'John',
          },
        },
      },
    });

    const expected = cold('(a|)', { a: true });

    expect(guard.canActivate()).toBeObservable(expected);
  });
});
