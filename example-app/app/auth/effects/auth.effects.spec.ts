import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';

import { AuthEffects } from './auth.effects';
import { AuthService } from '../services/auth.service';
import { Login, LoginFailure, LoginSuccess } from '../actions/auth';
import { Authenticate, User } from '../models/user';

export class TestActions extends Actions {
  constructor() {
    super(Observable.empty());
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('AuthEffects', () => {
  let effects: AuthEffects;
  let authService: any;
  let actions$: TestActions;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthEffects,
        {
          provide: AuthService,
          useValue: { login: jest.fn() },
        },
        {
          provide: Actions,
          useFactory: getActions,
        },
      ],
    });

    effects = TestBed.get(AuthEffects);
    authService = TestBed.get(AuthService);
    actions$ = TestBed.get(Actions);
  });

  describe('login$', () => {
    it('should return a new auth.LoginSuccess, with user information', () => {
      const credentials: Authenticate = { username: 'test', password: '' };
      const user = { name: 'User' } as User;
      const action = new Login(credentials);
      const completion = new LoginSuccess({ user });

      actions$.stream = hot('-a---', { a: action });
      const response = cold('-a|', { a: user });
      const expected = cold('--b', { b: completion });
      authService.login = jest.fn(() => response);

      expect(effects.login$).toBeObservable(expected);
    });

    it('should return a new auth.LoginFailure if the login service throws', () => {
      const credentials: Authenticate = { username: 'someOne', password: '' };
      const action = new Login(credentials);
      const completion = new LoginFailure('Invalid username or password');
      const error = 'Invalid username or password';

      actions$.stream = hot('-a---', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: completion });
      authService.login = jest.fn(() => response);

      expect(effects.login$).toBeObservable(expected);
    });
  });
});
