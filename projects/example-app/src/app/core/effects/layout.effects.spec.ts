import { TestBed } from '@angular/core/testing';
import { AuthActions } from '@example-app/auth/actions';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { LayoutActions } from '../actions';
import { LayoutEffects } from './layout.effects';

describe('LayoutEffects', () => {
  let effects: LayoutEffects;
  let actions$: Observable<Action>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayoutEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.get(LayoutEffects);
    actions$ = TestBed.get(Actions);
  });

  describe('layoutConfirmation$', () => {
    it('should dispatch closeSidenav on layoutConfirmation', () => {
      const expected = LayoutActions.closeSidenav();
      actions$ = of(AuthActions.logoutConfirmation());

      effects.logoutConfirmation$.pipe(take(1)).subscribe(actual => {
        expect(actual).toEqual(expected);
      });
    });
  });
});
