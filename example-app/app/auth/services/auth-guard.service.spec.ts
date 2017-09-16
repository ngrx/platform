import { TestBed, inject } from '@angular/core/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { AuthGuard } from './auth-guard.service';
import * as Auth from '../actions/auth';
import * as fromRoot from '../../reducers';
import * as fromAuth from '../reducers';

describe('Auth Guard', () => {
  let guard: AuthGuard;
  let store: Store<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          auth: combineReducers(fromAuth.reducers),
        }),
      ],
      providers: [AuthGuard],
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    guard = TestBed.get(AuthGuard);
  });

  it('should return false if the user state is not logged in', () => {
    const expected = cold('(a|)', { a: false });

    expect(guard.canActivate()).toBeObservable(expected);
  });

  it('should return true if the user state is logged in', () => {
    const user: any = {};
    const action = new Auth.LoginSuccess({ user });
    store.dispatch(action);

    const expected = cold('(a|)', { a: true });

    expect(guard.canActivate()).toBeObservable(expected);
  });
});
