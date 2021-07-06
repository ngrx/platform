import { TestBed } from '@angular/core/testing';
import { createReducer, ReducerManager, StoreModule } from '@ngrx/store';

describe(ReducerManager.name, () => {
  it('should provide reducers being registered in store', () => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          'feature-1': createReducer(0),
        }),
      ],
    });

    const reducerManager = TestBed.inject(ReducerManager);

    expect(Object.keys(reducerManager.currentReducers)).toContain('feature-1');
  });

  it('should provide reducers being registered at runtime', () => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          'feature-1': createReducer(0),
        }),
      ],
    });

    const reducerManager = TestBed.inject(ReducerManager);

    reducerManager.addReducer('feature-2', createReducer(0));

    expect(Object.keys(reducerManager.currentReducers)).toContain('feature-1');
    expect(Object.keys(reducerManager.currentReducers)).toContain('feature-2');
  });
});
