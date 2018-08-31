import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { empty, Observable, of } from 'rxjs';
import {
  LoginPageActions,
  AuthActions,
  AuthApiActions,
} from '@example-app/auth/actions';

import { Credentials, User } from '@example-app/auth/models/user';
import { AuthService } from '@example-app/auth/services/auth.service';
import { AuthEffects } from '@example-app/auth/effects/auth.effects';

describe('AuthEffects', () => {
  let effects: AuthEffects;
  let authService: any;
  let actions$: Observable<any>;
  let routerService: any;
  let dialog: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        {
          provide: AuthService,
          useValue: { login: jest.fn() },
        },
        provideMockActions(() => actions$),
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn(),
          },
        },
      ],
    });

    effects = TestBed.get(AuthEffects);
    authService = TestBed.get(AuthService);
    actions$ = TestBed.get(Actions);
    routerService = TestBed.get(Router);
    dialog = TestBed.get(MatDialog);

    spyOn(routerService, 'navigate').and.callThrough();
  });

  describe('login$', () => {
    it('should return an auth.LoginSuccess action, with user information if login succeeds', () => {
      const credentials: Credentials = { username: 'test', password: '' };
      const user = { name: 'User' } as User;
      const action = new LoginPageActions.Login({ credentials });
      const completion = new AuthApiActions.LoginSuccess({ user });

      actions$ = hot('-a---', { a: action });
      const response = cold('-a|', { a: user });
      const expected = cold('--b', { b: completion });
      authService.login = jest.fn(() => response);

      expect(effects.login$).toBeObservable(expected);
    });

    it('should return a new auth.LoginFailure if the login service throws', () => {
      const credentials: Credentials = { username: 'someOne', password: '' };
      const action = new LoginPageActions.Login({ credentials });
      const completion = new AuthApiActions.LoginFailure({
        error: 'Invalid username or password',
      });
      const error = 'Invalid username or password';

      actions$ = hot('-a---', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--b', { b: completion });
      authService.login = jest.fn(() => response);

      expect(effects.login$).toBeObservable(expected);
    });
  });

  describe('loginSuccess$', () => {
    it('should dispatch a RouterNavigation action', (done: any) => {
      const user = { name: 'User' } as User;
      const action = new AuthApiActions.LoginSuccess({ user });

      actions$ = of(action);

      effects.loginSuccess$.subscribe(() => {
        expect(routerService.navigate).toHaveBeenCalledWith(['/']);
        done();
      });
    });
  });

  describe('loginRedirect$', () => {
    it('should dispatch a RouterNavigation action when auth.LoginRedirect is dispatched', (done: any) => {
      const action = new AuthApiActions.LoginRedirect();

      actions$ = of(action);

      effects.loginRedirect$.subscribe(() => {
        expect(routerService.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    });

    it('should dispatch a RouterNavigation action when auth.Logout is dispatched', (done: any) => {
      const action = new AuthActions.Logout();

      actions$ = of(action);

      effects.loginRedirect$.subscribe(() => {
        expect(routerService.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    });
  });

  describe('logoutConfirmation$', () => {
    it('should dispatch a Logout action if dialog closes with true result', () => {
      const action = new AuthActions.LogoutConfirmation();
      const completion = new AuthActions.Logout();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      dialog.open = () => ({
        afterClosed: jest.fn(() => of(true)),
      });

      expect(effects.logoutConfirmation$).toBeObservable(expected);
    });

    it('should dispatch a LogoutConfirmationDismiss action if dialog closes with falsy result', () => {
      const action = new AuthActions.LogoutConfirmation();
      const completion = new AuthActions.LogoutConfirmationDismiss();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      dialog.open = () => ({
        afterClosed: jest.fn(() => of(false)),
      });

      expect(effects.logoutConfirmation$).toBeObservable(expected);
    });
  });
});
