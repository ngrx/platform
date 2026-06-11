import { Action } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';

import { UserEffects } from '@example-app/core/effects';
import { UserActions } from '@example-app/core/actions/user.actions';

describe('UserEffects', () => {
  let effects: UserEffects;
  const eventsMap: { [key: string]: any } = {};

  beforeAll(() => {
    document.addEventListener = vi.fn((event, cb) => {
      eventsMap[event] = cb;
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserEffects],
    });

    effects = TestBed.inject(UserEffects);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('idle$', () => {
    it('should trigger idleTimeout action after 5 minutes', () => {
      let action: Action | undefined;
      effects.idle$.subscribe((res) => (action = res));

      // Initial action to trigger the effect
      eventsMap['click']();

      vi.advanceTimersByTime(2 * 60 * 1000);
      expect(action).toBeUndefined();

      vi.advanceTimersByTime(3 * 60 * 1000);
      expect(action).toBeDefined();
      expect(action?.type).toBe(UserActions.idleTimeout.type);
    });

    it('should reset timeout on user activity', () => {
      let action: Action | undefined;
      effects.idle$.subscribe((res) => (action = res));

      // Initial action to trigger the effect
      eventsMap['keydown']();

      vi.advanceTimersByTime(4 * 60 * 1000);
      eventsMap['mousemove']();

      vi.advanceTimersByTime(4 * 60 * 1000);
      expect(action).toBeUndefined();

      vi.advanceTimersByTime(1 * 60 * 1000);
      expect(action).toBeDefined();
      expect(action?.type).toBe(UserActions.idleTimeout.type);
    });
  });
});
