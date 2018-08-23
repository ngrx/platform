import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { empty, Observable, of } from 'rxjs';
import {
  Login,
  LoginFailure,
  LoginRedirect,
  LoginSuccess,
  Logout,
  LogoutConfirmation,
} from '../actions/auth.actions';
import { Authenticate, User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { AuthEffects } from './auth.effects';
import { MatButtonModule, MatDialog, MatDialogModule } from '@angular/material';

describe('AuthEffects', () => {
  let effects: AuthEffects;
  let authService: any;
  let actions$: Observable<any>;
  let routerService: any;
  let dialog: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatButtonModule, MatDialogModule],
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
      const credentials: Authenticate = { username: 'test', password: '' };
      const user = { name: 'User' } as User;
      const action = new Login(credentials);
      const completion = new LoginSuccess({ user });

      actions$ = hot('-a---', { a: action });
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

      actions$ = hot('-a---', { a: action });
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

      actions$ = hot('-a---', { a: action });

      effects.loginSuccess$.subscribe(() => {
        expect(routerService.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });

  describe('loginRedirect$', () => {
    it('should dispatch a RouterNavigation action when auth.LoginRedirect is dispatched', () => {
      const action = new LoginRedirect();

      actions$ = hot('-a---', { a: action });

      effects.loginRedirect$.subscribe(() => {
        expect(routerService.navigate).toHaveBeenCalledWith(['/login']);
      });
    });

    it('should dispatch a RouterNavigation action when auth.Logout is dispatched', () => {
      const action = new Logout();

      actions$ = hot('-a---', { a: action });

      effects.loginRedirect$.subscribe(() => {
        expect(routerService.navigate).toHaveBeenCalledWith(['/login']);
      });
    });
  });

  describe('logoutConfirmation$', () => {
    it('should dispatch a Logout action if dialog closes with "OK" result', () => {
      const action = new LogoutConfirmation();
      const completion = new Logout();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      dialog.open = () => ({
        afterClosed: jest.fn(() => of('OK')),
      });

      expect(effects.logoutConfirmation$).toBeObservable(expected);
    });

    it('should dispatch no action if dialog closes without "OK" result', () => {
      const action = new LogoutConfirmation();

      actions$ = hot('-a', { a: action });
      const expected = cold('--');

      dialog.open = () => ({
        afterClosed: jest.fn(() => of()),
      });

      expect(effects.logoutConfirmation$).toBeObservable(expected);
    });
  });
});
