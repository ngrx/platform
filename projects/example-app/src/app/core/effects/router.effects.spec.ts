import { Title } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { Actions } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { provideMockStore } from '@ngrx/store/testing';

import { RouterEffects } from '@example-app/core/effects';
import * as fromRoot from '@example-app/reducers';

describe('RouterEffects', () => {
  let effects: RouterEffects;
  let titleService: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RouterEffects,
        {
          provide: Actions,
          useValue: of(routerNavigatedAction),
        },
        provideMockStore({
          selectors: [
            { selector: fromRoot.selectRouteData, value: { title: 'Search' } },
          ],
        }),
        { provide: Title, useValue: { setTitle: jest.fn() } },
      ],
    });

    effects = TestBed.inject(RouterEffects);
    titleService = TestBed.inject(Title);
  });

  describe('updateTitle$', () => {
    it('should update the title on router navigation', () => {
      effects.updateTitle$.subscribe();
      expect(titleService.setTitle).toHaveBeenCalledWith(
        'Book Collection - Search'
      );
    });
  });
});
