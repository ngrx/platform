import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReflectiveInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, INIT } from '@ngrx/store';

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
