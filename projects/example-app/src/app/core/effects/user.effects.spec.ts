import { Action, provideStore } from '@ngrx/store';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserEffects } from '@example-app/core/effects';
import { UserActions } from '@example-app/core/actions/user.actions';
import { Actions, provideEffects } from '@ngrx/effects';

describe('UserEffects', () => {
  let effects: UserEffects;
  let actions$: Actions;
  const eventsMap: { [key: string]: any } = {};

  beforeAll(() => {
    document.addEventListener = jest.fn((event, cb) => {
      eventsMap[event] = cb;
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore(), provideEffects(UserEffects)],
    });

    effects = TestBed.inject(UserEffects);
    actions$ = TestBed.inject(Actions);
  });

  describe('idle$', () => {
    it('should trigger idleTimeout action after 5 minutes', fakeAsync(() => {
      let action: Action | undefined;
      actions$.subscribe((res) => (action = res));

      // Initial action to trigger the effect
      eventsMap['click']();

      tick(2 * 60 * 1000);
      expect(action).toBeUndefined();

      tick(3 * 60 * 1000);
      expect(action).toBeDefined();
      expect(action?.type).toBe(UserActions.idleTimeout.type);
    }));

    it('should reset timeout on user activity', fakeAsync(() => {
      let action: Action | undefined;
      actions$.subscribe((res) => (action = res));

      // Initial action to trigger the effect
      eventsMap['keydown']();

      tick(4 * 60 * 1000);
      eventsMap['mousemove']();

      tick(4 * 60 * 1000);
      expect(action).toBeUndefined();

      tick(1 * 60 * 1000);
      expect(action).toBeDefined();
      expect(action?.type).toBe(UserActions.idleTimeout.type);
    }));
  });
});
