import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { cold, hot } from 'jasmine-marbles';
import { empty, Observable } from 'rxjs';

import {
  Login,
  LoginFailure,
  LoginRedirect,
  LoginSuccess,
  Logout,
} from '../actions/auth.actions';
import { Authenticate, User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { AuthEffects } from './auth.effects';

export class TestActions extends Actions {
  constructor() {
    super(empty());
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
  let routerService: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
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
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
      ],
    });

    effects = TestBed.get(AuthEffects);
    authService = TestBed.get(AuthService);
    actions$ = TestBed.get(Actions);
    routerService = TestBed.get(Router);

    spyOn(routerService, 'navigate').and.callThrough();
  });

  describe('login$', () => {
    it('should return an auth.LoginSuccess action, with user information if login succeeds', () => {
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
      const response = cold('-#', {}, error);
      const expected = cold('--b', { b: completion });
      authService.login = jest.fn(() => response);

      expect(effects.login$).toBeObservable(expected);
    });
  });

  describe('loginSuccess$', () => {
    it('should dispatch a RouterNavigation action', () => {
      const user = { name: 'User' } as User;
      const action = new LoginSuccess({ user });

      actions$.stream = hot('-a---', { a: action });

      effects.loginSuccess$.subscribe(() => {
        expect(routerService.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });

  describe('loginRedirect$', () => {
    it('should dispatch a RouterNavigation action when auth.LoginRedirect is dispatched', () => {
      const action = new LoginRedirect();

      actions$.stream = hot('-a---', { a: action });

      effects.loginRedirect$.subscribe(() => {
        expect(routerService.navigate).toHaveBeenCalledWith(['/login']);
      });
    });

    it('should dispatch a RouterNavigation action when auth.Logout is dispatched', () => {
      const action = new Logout();

      actions$.stream = hot('-a---', { a: action });

      effects.loginRedirect$.subscribe(() => {
        expect(routerService.navigate).toHaveBeenCalledWith(['/login']);
      });
    });
  });
});
