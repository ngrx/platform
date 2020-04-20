import { TestBed } from '@angular/core/testing';
import { INIT, Store, StoreModule } from '@ngrx/store';

import { EffectsModule } from '../src/effects_module';
import { ROOT_EFFECTS_INIT } from '../src/effects_root_module';

describe('Effects Root Module', () => {
  const foo = 'foo';
  const reducer = jasmine.createSpy('reducer').and.returnValue(foo);

  beforeEach(() => {
    reducer.calls.reset();
  });

  it('dispatches the root effects init action', () => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ reducer }, { initialState: { reducer: foo } }),
        EffectsModule.forRoot([]),
      ],
    });

    const store = TestBed.inject(Store);

    expect(reducer).toHaveBeenCalledWith(foo, {
      type: INIT,
    });
    expect(reducer).toHaveBeenCalledWith(foo, {
      type: ROOT_EFFECTS_INIT,
    });
  });

  it(`doesn't dispatch the root effects init action when EffectsModule isn't used`, () => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ reducer }, { initialState: { reducer: foo } }),
      ],
    });

    const store = TestBed.inject(Store);

    expect(reducer).toHaveBeenCalledWith(foo, {
      type: INIT,
    });
    expect(reducer).not.toHaveBeenCalledWith(foo, {
      type: ROOT_EFFECTS_INIT,
    });
  });
});
