import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { INIT, Store, StoreModule, Action } from '@ngrx/store';

describe('ngRx State', () => {
  it('should call the reducer to scan over the dispatcher', () => {
    const initialState = 123;
    const reducer = jasmine.createSpy('reducer').and.returnValue(initialState);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          { key: reducer },
          { initialState: { key: initialState } }
        ),
      ],
    });

    TestBed.get(Store);

    expect(reducer).toHaveBeenCalledWith(initialState, {
      type: INIT,
    });
  });

  it(
    'should fail synchronously',
    fakeAsync(() => {
      function reducer(state: any, action: Action) {
        if (action.type === 'THROW_ERROR') {
          throw new Error('(╯°□°）╯︵ ┻━┻');
        }

        return state;
      }

      TestBed.configureTestingModule({
        imports: [StoreModule.forRoot({ reducer })],
      });

      const store = TestBed.get(Store) as Store<any>;
      expect(() => {
        store.dispatch({ type: 'THROW_ERROR' });
        flush();
      }).toThrow();
    })
  );
});
