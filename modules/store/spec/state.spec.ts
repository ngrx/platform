import { TestBed } from '@angular/core/testing';
import { INIT, Store, StoreModule } from '@ngrx/store';

describe('ngRx State', () => {
  const initialState = 123;
  const reducer = jasmine.createSpy('reducer').and.returnValue(initialState);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          { key: reducer },
          { initialState: { key: initialState } }
        ),
      ],
    });
  });

  it('should call the reducer to scan over the dispatcher', function() {
    TestBed.get(Store);

    expect(reducer).toHaveBeenCalledWith(initialState, {
      type: INIT,
    });
  });
});
