import { createActionGroup, emptyProps, props } from '@ngrx/store';

describe('createActionGroup', () => {
  const authApiActions = createActionGroup({
    source: 'Auth API',
    events: {
      'Login Success': props<{ userId: number; token: string }>(),
      'Login Failure': props<{ error: string }>(),
      'Logout Success': emptyProps(),
      'Logout Failure': (error: Error) => ({ error }),
    },
  });
  const booksApiActions = createActionGroup({
    source: 'Books API',
    events: {
      ' Load BOOKS  suCCess  ': emptyProps(),
      loadBooksFailure: emptyProps(),
    },
  });

  it('should create action name by camel casing the event name', () => {
    expect(booksApiActions.loadBOOKSSuCCess).toBeDefined();
    expect(booksApiActions.loadBooksFailure).toBeDefined();
  });

  it('should create action type using the "[Source] Event" pattern', () => {
    expect(booksApiActions.loadBOOKSSuCCess().type).toBe(
      '[Books API]  Load BOOKS  suCCess  '
    );
    expect(booksApiActions.loadBooksFailure().type).toBe(
      '[Books API] loadBooksFailure'
    );
  });

  it('should create action with props', () => {
    const loginSuccess = authApiActions.loginSuccess({
      userId: 10,
      token: 'ngrx',
    });
    expect(loginSuccess).toEqual({
      type: '[Auth API] Login Success',
      userId: 10,
      token: 'ngrx',
    });

    const loginFailure = authApiActions.loginFailure({
      error: 'Login Failure!',
    });
    expect(loginFailure).toEqual({
      type: '[Auth API] Login Failure',
      error: 'Login Failure!',
    });
  });

  it('should create action without props', () => {
    const logoutSuccess = authApiActions.logoutSuccess();
    expect(logoutSuccess).toEqual({ type: '[Auth API] Logout Success' });
  });

  it('should create action with props factory', () => {
    const error = new Error('Logout Failure!');
    const logoutFailure = authApiActions.logoutFailure(error);
    expect(logoutFailure).toEqual({
      type: '[Auth API] Logout Failure',
      error,
    });
  });
});
